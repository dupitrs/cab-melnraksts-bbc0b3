# Design — Čiekurkalna attīstības biedrība (melnraksts)

Slēgtā dizaina sistēma šai vietnei. Katra lapa pirms izmaiņām lasa šo failu.
Sistēmu paplašina šeit, nevis pārraksta katrā lapā.

## Genre
editorial (civic, laikraksta noskaņa apkaimes biedrībai)

## Struktūra (atkārto ciekurkalns.lv)
Sākums · Par Čiekurkalnu · ČAB · Paveiktais · Jaunumi · Nāc brīvprātīgajos!

## Macrostructure family
- Sākums: pilna platuma foto hero ar devīzi kā virsrakstu (kaimiņu kopbilde)
- Par Čiekurkalnu: flīžu rādītājs + bilžu galerija (masonry, gaismas kaste) + YouTube fasāde
- ČAB: Long Document (stāsts, valde, iesaiste, ziedošana, kontakti vienā lapā)
- Paveiktais: tumšais ūdenstoņa stāsts + interaktīvs 3D slaideris + arhīva rindas
- Jaunumi: ziņu rindas ar datumiem

## Theme — studied-DNA
Avots: klienta īstais logo (ģeometriskā čiekura rozete) un ciekurkalns.lv.

- `--color-paper`   oklch(96.5% 0.008 75)
- `--color-paper-2` oklch(93.5% 0.012 75)
- `--color-ink`     oklch(24% 0.02 55)
- `--color-dark`    oklch(21% 0.015 55)
- `--color-rule`    oklch(85% 0.012 75)
- `--color-accent`  oklch(58% 0.115 205)  (logo ciāns; ≤ 5 % no skata)
- `--color-band`    oklch(33% 0.06 210)   (devīzes josla)

## Typography
- Display: Roboto Slab, 600/700, vienmēr roman (klienta lapas DNS)
- Body: Roboto, 300/400/500
- Bez kursīva virsrakstos; uzsvars ar krāsu vai pasvītrojumu

## Spacing
4 pt skala tokens.css failā. Lapas lieto tikai nosauktos žetonus.

## Motion
- Easings: --ease-out / --ease-in / --ease-in-out (tokens.css)
- Primitīvi: lapas ielādes reveal, hero foto lēnā tuvināšana, scroll-rise sadaļām,
  interaktīvais 3D slaideris (paveiktais), skaitītāji (sākums),
  three.js logo fasetes tumšajā joslā (sākums)
- prefers-reduced-motion: reveal statisks, slaideris kļūst par režģi

## CTA voice
- Primārā: .btn--solid (tintes fons, nošķelti stūri no logo ģeometrijas)
- Sekundārā: .btn--line (kontūra) vai .tlink (ciāna pasvītrota saite)

## Kas lapām jākoplieto
- Masthead galvene ar logo rozeti un aktīvās lapas pasvītrojumu
- Kājene ar pilno logo
- Fasetes formas (clip-path nošķēlumi) attēliem un kartītēm
- Melnraksta josla augšā (melnraksta prasība)

## Kas lapām drīkst atšķirties
- Makrostruktūra ģimenes ietvaros
- Tumšās sadaļas lietojums (ūdenstornis, devīze)

## Melnraksta noteikumi (rast studija)
- Vietturi (klase .ph) bez izdomāta satura; kontakti "Aizpildāms"
- noindex/nofollow katrā lapā, robots.txt Disallow
- Personas dati: tikai publiski pieejamais (Vijas foto no biedrības lapas)
