# Nieuwsland.be Brand Style Guide

Dit document bevat de volledige visuele specificaties voor de identiteit van Nieuwsland.be, inclusief kleuren, typografie, UI-elementen en animaties.

---

## 1. Kleurenpalet

### Primaire Kleuren
*   **Deep Navy (Primair)**
    *   HEX: `#1E3A8A` (Tailwind `blue-900`)
    *   Gebruik: Logo icoon achtergrond, headers, belangrijke accenten.
*   **Action Orange (Accent)**
    *   HEX: `#F97316` (Tailwind `orange-500`)
    *   Gebruik: 'land' tekst in logo, decoratieve punt, actieve status, hover accenten.

### Neutrale Kleuren
*   **Ink Black**
    *   HEX: `#0F172A` (Tailwind `slate-900`)
    *   Gebruik: Hoofdtekst (Nieuws), koppen, donkere achtergronden.
*   **Slate Gray**
    *   HEX: `#64748B` (Tailwind `slate-500`)
    *   Gebruik: Secundaire tekst, body copy.
*   **Paper White**
    *   HEX: `#F8FAFC` (Tailwind `slate-50`)
    *   Gebruik: Pagina achtergrond.
*   **Pure White**
    *   HEX: `#FFFFFF`
    *   Gebruik: Kaart achtergronden, tekst op donkere vlakken.

---

## 2. Typografie

De identiteit maakt gebruik van de **Inter** font-familie (Google Fonts).

### Koppen & Logo
*   **Font:** Inter
*   **Gewicht:** Black (900)
*   **Stijl:** Uppercase, Tracking Tight (`-0.05em`)
*   **Karakter:** Krachtig, autoritair, direct scannable.

### Logo Accent ('land')
*   **Font:** Inter
*   **Gewicht:** Light (300)
*   **Stijl:** Italic, Tracking Tight (`-0.02em`)
*   **Karakter:** Menselijk, elegant, dynamisch.

### Body Tekst
*   **Font:** Inter
*   **Gewicht:** Regular (400) of Medium (500)
*   **Line Height:** 1.6 (Relaxed)

---

## 3. UI Elementen

### Tags (bijv. "AI Concepten")
*   **Achtergrond:** `rgba(255, 255, 255, 0.1)` op donker of `blue-50` op licht.
*   **Tekstkleur:** Wit op donker of `blue-700` op licht.
*   **Vorm:** Full rounded (Pill shape - `rounded-full`).
*   **Padding:** `px-3 py-1`.
*   **Typografie:** Uppercase, Bold (700), Font-size: `12px` (xs), Tracking Wider (`0.05em`).
*   **Icon:** `Sparkles` (Lucide), size `14px`.

### Knoppen (Standaard)
*   **Achtergrond:** `slate-900` (#0F172A).
*   **Tekst:** Wit, Semi-bold (600), Font-size: `14px` (sm).
*   **Vorm:** Full rounded (`rounded-full`).
*   **Padding:** `px-4 py-2`.
*   **Hover State:**
    *   Achtergrond: `slate-800`.
    *   Scale: `scale-95` (bij klik).
    *   Transition: `all 0.2s ease`.

### Knoppen (AI Generator)
*   **Achtergrond:** Wit.
*   **Tekst:** `slate-900`, Bold (700).
*   **Vorm:** Afgeronde hoeken (`rounded-2xl` - 1rem).
*   **Hover State:**
    *   Achtergrond: `orange-400` (#FB923C).
    *   Tekst: Wit.
    *   Icon: `RefreshCw` roteert 180 graden.

---

## 4. Iconografie

*   **Bibliotheek:** Lucide-react.
*   **Stijl:** Stroke width `2` (standaard) of `2.5` (voor logo).
*   **Hoofdicoon:** `Newspaper`.
*   **Accenticoon:** `Sparkles` (voor AI/Nieuw).

---

## 5. Beweging & Animaties

### Interacties
*   **Hover Scale:** Kaarten en logo's schalen subtiel naar `1.05` bij hover.
*   **Smooth Transitions:** Gebruik `transition-all duration-300` voor kleur- en schaduwveranderingen.
*   **Button Click:** Actieve staat gebruikt `active:scale-95` voor haptische feedback.

### Pagina Animaties (Motion)
*   **Entrance:** Fade-in met een lichte zoom-in (`duration-700`).
*   **Stagger:** Lijst-items of kaarten verschijnen na elkaar met een vertraging van `0.1s`.

---

## 6. Logo Gebruiksregels

1.  **Vrije Ruimte:** Behoud altijd een marge gelijk aan de hoogte van de 'N' rondom het logo.
2.  **Minimale Grootte:** Het logo mag niet kleiner zijn dan `120px` breed voor leesbaarheid van de tagline.
3.  **Achtergronden:**
    *   Gebruik het **Primair Logo** op witte of zeer lichte grijze achtergronden.
    *   Gebruik de **Witte Variatie** op donkerblauwe of zwarte achtergronden.
    *   Gebruik de **Minimalistische Versie** (zonder icoon) voor headers met beperkte ruimte.
