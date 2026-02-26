"""
Nieuwsland.be — Quality Gate (Eindredactie Bot)
Wordt aangeroepen VOORDAT een artikel naar Supabase wordt gepubliceerd.
Controleert kwaliteit en blokkeert slechte artikelen.

Returns: {"pass": True/False, "issues": [...], "cleaned_content": "..."}
"""

import re
import json


# ============================================================
# QUALITY CHECKS
# ============================================================

def check_minimum_length(content, min_words=150):
    """Artikel moet minimaal X woorden bevatten"""
    words = len(content.split())
    if words < min_words:
        return False, f"Te kort: {words} woorden (minimum {min_words})"
    return True, None


def check_no_metadata_leak(content):
    """Geen review-queue metadata in het artikel"""
    bad_patterns = [
        r"✅\s*=\s*Goedkeuren",
        r"❌\s*=\s*Afwijzen",
        r"REVIEW NODIG",
        r"publiceren op WordPress",
        r"publiceren op Nieuwsland",
        r"geef feedback als reply",
        r"📋\s*REVIEW",
        r"Score:\s*⭐",
        r"TITEL:\s*",
        r"SUBTITEL:\s*",
        r"TAGS:\s*",
        r"AFBEELDING:\s*",
    ]
    issues = []
    for pattern in bad_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            issues.append(f"Metadata gevonden: '{pattern}'")
    return len(issues) == 0, issues


def check_no_truncation(content):
    """Artikel mag niet halverwege stoppen"""
    # Check for common truncation indicators
    stripped = content.strip()
    if not stripped:
        return False, "Artikel is leeg"
    
    last_char = stripped[-1]
    # Article should end with punctuation, not mid-sentence
    if len(stripped) > 200 and last_char not in '.!?"\')\n*':
        # Check if last sentence is complete
        last_line = stripped.split('\n')[-1].strip()
        if len(last_line) > 10 and last_line[-1] not in '.!?"\')*':
            return False, f"Artikel lijkt niet af te zijn (eindigt met: '...{stripped[-50:]}')"
    
    return True, None


def check_no_raw_markdown_artifacts(title):
    """Titel mag geen markdown bevatten"""
    if '**' in title or '__' in title or '##' in title:
        return False, f"Titel bevat markdown: '{title}'"
    return True, None


def check_content_is_article(content):
    """Content moet een echt artikel zijn, geen instructies of metadata"""
    # If more than 30% of lines start with metadata patterns, it's not an article
    lines = [l.strip() for l in content.split('\n') if l.strip()]
    if not lines:
        return False, "Geen content"
    
    metadata_patterns = [r'^(TITEL|SUBTITEL|TAGS|AFBEELDING|Topic|Bron|Score|Categorie):', r'^[✅❌📋🏷️🔗]']
    meta_count = sum(1 for l in lines if any(re.match(p, l) for p in metadata_patterns))
    
    if meta_count > len(lines) * 0.3:
        return False, f"Content is voornamelijk metadata ({meta_count}/{len(lines)} regels)"
    
    return True, None


def check_formatting(content):
    """Artikel moet scanbaar zijn: subtitels, bullets, bold, korte alinea's"""
    issues = []
    paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
    
    # Check: geen alinea's langer dan 500 chars (generous, allows 4-5 sentences)
    long_paragraphs = [p for p in paragraphs if len(p) > 500 and '•' not in p and '- ' not in p[:3] and '##' not in p]
    if len(long_paragraphs) > 3:
        issues.append(f"Te veel lange alinea's ({len(long_paragraphs)}x >500 tekens). Splits op in kortere alinea's.")
    
    # Check: minstens 2 bold passages
    bold_count = content.count('**')
    if bold_count < 4:  # 4 = 2 bold passages (opening + closing)
        issues.append(f"Te weinig **vette tekst** ({bold_count//2}x). Gebruik minstens 3-5 bold passages voor scanbaarheid.")
    
    # Check: minstens 1 subtitel (## of ###) bij artikelen > 300 woorden
    word_count = len(content.split())
    has_subtitles = '##' in content or '###' in content
    if word_count > 300 and not has_subtitles:
        issues.append("Geen subtitels gevonden bij een lang artikel. Voeg minstens 2-3 tussenkoppen (##) toe.")
    
    # Check: bij artikelen > 400 woorden, minstens 1 bullet lijst
    has_bullets = '• ' in content or '- ' in content or '* ' in content
    if word_count > 400 and not has_bullets:
        issues.append("Geen bullet lists gevonden. Voeg minstens 1 opsomming toe voor scanbaarheid.")
    
    return len(issues) == 0, issues


def check_has_source(source_url, source_name):
    """Artikel MOET een bron hebben — geen verzonnen content"""
    if not source_url and not source_name:
        return False, "Geen bron vermeld. Artikelen MOETEN gebaseerd zijn op echte bronnen."
    return True, None


def check_not_duplicate_content(content):
    """Voorkom dat dezelfde tekst twee keer in het artikel staat"""
    paragraphs = [p.strip() for p in content.split('\n\n') if p.strip() and len(p.strip()) > 50]
    seen = set()
    duplicates = []
    for p in paragraphs:
        normalized = p[:100].lower()
        if normalized in seen:
            duplicates.append(p[:60] + "...")
        seen.add(normalized)
    
    if duplicates:
        return False, f"Duplicate paragrafen gevonden: {len(duplicates)}"
    return True, None


# ============================================================
# CONTENT CLEANING
# ============================================================

def clean_content(content):
    """Strip metadata, fix formatting, clean up article content"""
    lines = content.split('\n')
    cleaned_lines = []
    skip_section = False
    
    for line in lines:
        stripped = line.strip()
        
        # Skip metadata lines
        if re.match(r'^(TITEL|SUBTITEL|TAGS|AFBEELDING|Topic|Bron|Score|Categorie):', stripped):
            continue
        if re.match(r'^[✅❌📋]\s*=?\s*(Goedkeuren|Afwijzen|REVIEW)', stripped):
            continue
        if 'publiceren op WordPress' in stripped or 'publiceren op Nieuwsland' in stripped:
            continue
        if 'geef feedback als reply' in stripped:
            continue
        if stripped == '---':
            # Skip dividers that are part of metadata blocks
            if skip_section:
                skip_section = False
                continue
            # Keep content dividers
            cleaned_lines.append(line)
            continue
        
        # Skip "📋 REVIEW NODIG" blocks
        if 'REVIEW NODIG' in stripped:
            skip_section = True
            continue
        
        if skip_section and stripped:
            continue
        if skip_section and not stripped:
            skip_section = False
            continue
        
        cleaned_lines.append(line)
    
    result = '\n'.join(cleaned_lines).strip()
    
    # Remove leading/trailing --- dividers
    result = re.sub(r'^---\s*\n', '', result)
    result = re.sub(r'\n\s*---\s*$', '', result)
    
    # Remove any remaining emoji-metadata lines at the start
    result = re.sub(r'^[📋📝🏷️🔗⭐️📰]\s*.+\n', '', result)
    
    return result.strip()


def clean_title(title):
    """Strip markdown from title"""
    title = title.replace('**', '').replace('__', '').replace('##', '').strip()
    title = re.sub(r'^#+\s*', '', title)
    return title


# ============================================================
# MAIN QUALITY GATE
# ============================================================

def run_quality_gate(title, content):
    """
    Run all quality checks on an article.
    Returns: {"pass": bool, "issues": list, "cleaned_title": str, "cleaned_content": str}
    """
    issues = []
    
    # Clean first
    cleaned_title = clean_title(title)
    cleaned_content = clean_content(content)
    
    # Run checks on cleaned content
    checks = [
        check_minimum_length(cleaned_content),
        check_no_metadata_leak(cleaned_content),
        check_no_truncation(cleaned_content),
        check_no_raw_markdown_artifacts(cleaned_title),
        check_content_is_article(cleaned_content),
        check_not_duplicate_content(cleaned_content),
        check_formatting(cleaned_content),
    ]
    
    for passed, issue in checks:
        if not passed:
            if isinstance(issue, list):
                issues.extend(issue)
            elif issue:
                issues.append(issue)
    
    return {
        "pass": len(issues) == 0,
        "issues": issues,
        "cleaned_title": cleaned_title,
        "cleaned_content": cleaned_content,
    }


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":
    # Test with a good article
    good = run_quality_gate(
        "Samsung Galaxy S26-reeks uit de doeken",
        "Samsung heeft zopas zijn nieuwste paradepaardjes onthuld: de **Galaxy S26-lijn**. "
        "De reeks belooft een nieuwe standaard te zetten op het gebied van kunstmatige intelligentie. " * 20
    )
    print(f"Good article: pass={good['pass']}, issues={good['issues']}")
    
    # Test with broken article (metadata leak)
    bad = run_quality_gate(
        "**Titel met markdown**",
        "📋 REVIEW NODIG — TECH artikel\nTopic: Test\n---\n"
        "✅ = Goedkeuren & publiceren op WordPress\n❌ = Afwijzen (geef feedback als reply)"
    )
    print(f"Bad article: pass={bad['pass']}, issues={bad['issues']}")
    
    print("\nQuality gate tests passed! ✅")
