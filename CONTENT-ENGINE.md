# Nieuwsland.be — Content Engine Architectuur

## Discord Server
- **Server:** Annie-TM's News Server (ID: 1476328047803240472)
- **Bot:** Annie Redactie (ID: 1476329931519557765)
- **Credentials:** `credentials/discord-nieuwsland.json`

## Kanalen (aangemaakt 25/02/2026)
### 📰 REDACTIE
| Kanaal | ID | Functie |
|--------|----|---------|
| #review-queue | 1476332912147173450 | Artikelen ter goedkeuring |
| #belgium | 1476332915674714188 | Belgisch nieuws |
| #world | 1476332919793389772 | Internationaal |
| #politics | 1476332924075769886 | Politiek |
| #economy | 1476332928261947392 | Economie |
| #sport | 1476332932615377101 | Sport |
| #tech | 1476332937174712340 | Tech & AI |
| #culture | 1476332943046742120 | Cultuur |
| #science | 1476332947115348018 | Wetenschap |
| #opinion | 1476332951594860656 | Opinie |
| #regional | 1476332956225372326 | Lokaal nieuws |
| #breaking | 1476332959819628695 | Breaking alerts |

### 🎨 MEDIA
| Kanaal | ID |
|--------|----|
| #images | 1476332964357996782 |
| #video-shorts | 1476332968426606724 |
| #cartoons | 1476332972427837512 |
| #infographics | 1476332977066741791 |

### 📢 PROMO
| Kanaal | ID |
|--------|----|
| #social-media | 1476332981172961290 |
| #seo | 1476332985124130969 |
| #newsletter | 1476332989981130772 |
| #ads-partnerships | 1476332999476908083 |

### ⚙️ SYSTEEM
| Kanaal | ID |
|--------|----|
| #logs | 1476333004380180553 |
| #config | 1476333008964550860 |
| #dashboard | 1476333013288747018 |

---

## Architectuur: Brains vs. Muscles

### The Brain — Hoofdredacteur (Annie / Opus)
- Monitort alle categorie-kanalen
- Pikt drafts op → verplaatst naar #review-queue als thread
- Presenteert artikel aan Dennis voor ✅ of ❌
- Bij ❌: leert van feedback, slaat op in soul/knowledge files
- Bij hoge confidence score → autonomous publishing via WP REST API
- **Model:** Claude Opus (duur maar slim)

### The Muscles — Categorie-agents (Gemini Flash / Haiku)
- Elk kanaal heeft een eigen "schrijver-agent"
- Triggert via cronjob of RSS alert
- Scant bronnen, schrijft eerste draft, fact-check
- Dropt draft in eigen kanaal
- **Model:** Goedkoop (Gemini Flash, Haiku, of OpenRouter budget models)

---

## Workflow: Van Bron naar Publicatie

```
1. TRIGGER (cron/RSS/alert)
   ↓
2. MUSCLE AGENT scant bronnen voor categorie
   → Schrijft draft in #categorie kanaal
   ↓
3. BRAIN (Eindredacteur) pikt draft op
   → Verplaatst naar thread in #review-queue
   → Voegt metadata toe (categorie, tags, urgentie)
   ↓
4. HUMAN-IN-THE-LOOP (Dennis)
   → ✅ Goedgekeurd → door naar stap 5
   → ❌ Afgekeurd + feedback → agent leert, retry
   ↓
5. MEDIA AGENT getriggerd
   → #images: genereert/zoekt header afbeelding
   → #infographics: als data-artikel
   ↓
6. SEO AGENT
   → Meta description, tags, interne links
   → Schema markup
   ↓
7. PUBLICATIE
   → WP REST API → nieuwsland.be
   → Next.js ISR hervalidatie
   ↓
8. PROMO AGENT
   → #social-media: post naar FB, X, IG, LinkedIn
   → #newsletter: voegt toe aan dagelijkse digest
   ↓
9. LOGGING
   → #logs: publicatie bevestiging
   → #dashboard: stats update
```

---

## Bronnen per Categorie

### 🇧🇪 #belgium
- VRT NWS RSS: https://www.vrt.be/vrtnws/nl.rss.articles.xml
- De Morgen RSS
- HLN RSS
- De Standaard RSS
- Belga (als beschikbaar)

### 🌍 #world
- Reuters RSS: https://www.reutersagency.com/feed/
- BBC World: http://feeds.bbci.co.uk/news/world/rss.xml
- Al Jazeera: https://www.aljazeera.com/xml/rss/all.xml
- AP News RSS

### 🏛️ #politics
- Kamer.be nieuwsfeed
- EU Observer RSS
- Politico EU RSS
- De Tijd Politiek RSS

### 💰 #economy
- De Tijd RSS
- Financial Times (beperkt)
- Bloomberg (beperkt)
- ECB persberichten

### ⚽ #sport
- Sporza RSS: https://sporza.be/nl.rss.xml
- WielerFlits RSS
- Transfermarkt nieuws
- ESPN RSS

### 💻 #tech
- The Verge RSS: https://www.theverge.com/rss/index.xml
- Ars Technica: https://feeds.arstechnica.com/arstechnica/index
- Tweakers: https://tweakers.net/feeds/mixed.xml
- TechCrunch RSS

### 🎭 #culture
- Knack Focus RSS
- De Standaard Cultuur
- YouTube kanalen (muziek, film, kunst)

### 🔬 #science
- Nature RSS: https://www.nature.com/nature.rss
- New Scientist RSS
- EOS Wetenschap RSS
- NASA RSS

### ✍️ #opinion
- Trending topics van andere kanalen → AI genereert standpunt
- Reactie op grote nieuwsitems

### 📍 #regional
- Google Alerts per stad (Gent, Antwerpen, Brussel, Brugge, Leuven)
- Lokale nieuwssites RSS
- Gemeentelijke persberichten

---

## Stapsgewijze Opbouw (Fase Plan)

### Fase 1: Eerste Lego-steen (#tech)
- [ ] RSS monitor voor #tech bronnen (The Verge, Tweakers, Ars Technica)
- [ ] Muscle agent: scant RSS, schrijft draft, dropt in #tech
- [ ] Brain agent: pikt op, maakt thread in #review-queue
- [ ] Dennis reageert met ✅/❌
- [ ] Bij ✅: publiceer naar WP REST API
- [ ] Log alles in #logs

### Fase 2: Uitbreiden naar 3 kanalen
- [ ] #belgium + #world toevoegen (zelfde workflow)
- [ ] Media agent: auto header image bij elk artikel
- [ ] SEO agent: meta descriptions

### Fase 3: Volledig redactieteam
- [ ] Alle 12 categorie-kanalen actief
- [ ] Promo agent: auto social media posting
- [ ] Newsletter agent: dagelijkse digest
- [ ] Dashboard in #dashboard

### Fase 4: Autonomous Publishing
- [ ] Confidence scoring systeem
- [ ] Auto-publish bij hoge score
- [ ] Dennis review alleen bij twijfel/controversieel
- [ ] Full loop: bron → publicatie → promo (0 menselijke interventie)

---

## Security & Regels
- Server is STRIKT PRIVÉ — geen andere mensen
- Agents slaan lessen/stijl op in persistente files (niet alleen in geheugen)
- Geen externe skills installeren (zelf bouwen)
- Content wordt HERSCHREVEN, nooit 1-op-1 gekopieerd
- Bronvermelding altijd meegeven
- Fact-checking stap verplicht bij controversiële onderwerpen
