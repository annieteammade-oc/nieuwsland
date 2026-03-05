import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from utils import supabase_publish

TITLE = "Inbraakpreventie in de Vlaamse Ardennen: zo beveilig je je woning slimmer"
EXCERPT = (
    "Hoe beveilig je je woning beter tegen inbraak? In dit interview deelt een ervaren vakman van Slotenmaker Lockplus "
    "praktische tips en een concrete checklist voor gezinnen in de Vlaamse Ardennen."
)

FEATURED_IMAGE = "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80"
INLINE_1 = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
INLINE_2 = "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=80"

CONTENT = f"""
In de Vlaamse Ardennen blijft woninginbraak een bezorgdheid, zeker tijdens vakantieperiodes en de donkere maanden. Voor dit gesprek spraken we met een ervaren vakman van [Slotenmaker Lockplus](https://lockplus.be/) over wat gezinnen vandaag zélf kunnen doen om hun woning beter te beveiligen.

## “Waar maken mensen de grootste fout?”

**Nieuwsland:** Wat zie jij het vaakst fout lopen bij woningen in onze regio?

**Ernst:** “Veel mensen denken dat een inbreker alleen via de voordeur binnenkomt, maar in de praktijk zijn achterdeuren, ramen op het gelijkvloers en zwakke cilinders veel voorkomende zwakke punten. Het is meestal niet één groot probleem, maar meerdere kleine fouten samen.”

**Ernst:** “Daarnaast onderschatten mensen hoe snel inbrekers werken. Als een deur of raam weerstand biedt en tijd kost, haken ze vaak af. Daarom draait preventie om vertragen en ontmoedigen.”

## “Welke 3 ingrepen geven het snelste resultaat?”

**Nieuwsland:** Als je maar drie dingen mag aanraden, welke zijn dat?

1. **Vervang verouderde cilinders en sloten.**
   Oude cilinders zijn gevoeliger voor manipulatie. Moderne beveiligde oplossingen maken meteen verschil. Wie advies wil, kan gericht info bekijken over [slot vervangen](https://lockplus.be/slot-vervangen/).

2. **Beveilig achterdeur en schuiframen even sterk als de voordeur.**
   Inbrekers kiezen de weg met de minste weerstand. De best beveiligde deur is zelden het echte doelwit.

3. **Combineer mechanische beveiliging met zichtbaarheid.**
   Buitenverlichting met sensor, geen donkere hoeken en een opgeruimde tuin werken sterk ontmoedigend.

![Geforceerde achterdeur als voorbeeld van inbraakschade]({INLINE_1})

## “Wat raad je specifiek aan voor Oudenaarde en de Vlaamse Ardennen?”

**Nieuwsland:** Zijn er regionale verschillen qua aanpak?

**Ernst:** “Ja. In landelijke zones zie je vaker vrijstaande woningen met minder sociale controle in de avond. Dan zijn buitenbeveiliging, slimme verlichting en degelijk hang- en sluitwerk nog belangrijker.”

**Ernst:** “Veel mensen denken dat hun slot nog goed is, maar het beslag of de montage is verouderd. Laat je deur professioneel nakijken door een [slotenmaker in Oudenaarde](https://lockplus.be/slotenmaker-oudenaarde/).”

## Praktische checklist: zo maak je je woning minder interessant voor inbrekers

### Deuren en sloten
- Is je cilinder modern en beveiligd tegen kerntrekken?
- Heb je veiligheidsbeslag op voor- én achterdeur?
- Sluiten alle buitendeuren correct zonder speling?
- Laat je geen sleutel zichtbaar in het slot?

### Ramen en zichtbaarheid
- Zijn ramen op het gelijkvloers degelijk afsluitbaar?
- Ligt er geen ladder of gereedschap vrij in de tuin?
- Heb je buitenverlichting met bewegingssensor?

### Gewoonte en gedrag
- Vermijd je duidelijke signalen van afwezigheid?
- Vraag je buren om een oogje in het zeil te houden tijdens vakantie?
- Zijn waardevolle spullen niet zichtbaar van buitenaf?

![Inbraakpreventie begint bij goed hang- en sluitwerk]({INLINE_2})

## Conclusie

Woningbeveiliging hoeft niet ingewikkeld te zijn. Met een combinatie van degelijk hang- en sluitwerk, slimme gewoontes en basismaatregelen rond zichtbaarheid maak je je woning in de Vlaamse Ardennen veel minder aantrekkelijk voor inbrekers. Kleine upgrades vandaag kunnen later een groot verschil maken.

## Actie: heb je vragen over de beveiliging van je woning?

Surf naar [lockplus.be/contact](https://lockplus.be/contact) of bel **0494/30 82 04** (Slotenmaker Lockplus).
""".strip()

result = supabase_publish(
    title=TITLE,
    content=CONTENT,
    category_slug="regionaal",
    excerpt=EXCERPT,
    image_url=FEATURED_IMAGE,
    source_name="Interview (fictief) met Slotenmaker Lockplus",
    source_url="https://lockplus.be/contact",
    status="published",
)

if result and result.get("slug"):
    print("OK")
    print(f"https://nieuwsland.be/artikel/{result['slug']}")
    print(result.get("id"))
else:
    print("FAILED")
