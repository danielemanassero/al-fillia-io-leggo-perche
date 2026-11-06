# #ioleggoperché – Lista dei Desideri

Webapp statica (HTML/CSS/JS, nessun build necessario) per mostrare l'elenco dei
libri della "Lista dei Desideri" della scuola, far segnare ai genitori quale
libro hanno acquistato in libreria, e mostrare a tutti cosa è già stato
acquistato. L'acquisto non si gestisce online: si acquista fisicamente in
libreria, poi si segna qui.

Una volta che un libro è segnato come "acquistato", non può più tornare
"disponibile": la regola è applicata lato database (vedi `supabase/schema.sql`),
non solo nell'interfaccia.

## Stack

- Frontend: HTML + CSS + JS vanilla, nessun framework, nessuna build.
- Dati: [Supabase](https://supabase.com) (Postgres con API REST automatica).
  Il frontend chiama direttamente Supabase dal browser, non c'è un backend
  custom da ospitare.
- Hosting frontend: GitHub Pages (da attivare separatamente, non incluso in
  questo setup).

## Setup (una tantum)

1. **Crea un progetto su [supabase.com](https://supabase.com)** (piano free).
2. Apri **SQL Editor** nel progetto e incolla il contenuto di
   `supabase/schema.sql`, poi eseguilo. Questo crea la tabella `books`, la
   regola di immutabilità, i permessi (RLS) e inserisce i 44 libri iniziali.
3. Vai in **Project Settings → API** e copia:
   - **Project URL**
   - **anon public key**
4. Incollali in `config.js` al posto dei placeholder:
   ```js
   export const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
   export const SUPABASE_ANON_KEY = "eyJ....";
   ```
   Questa chiave è pensata per essere pubblica/esposta nel browser: i
   permessi veri sono imposti dalle policy RLS e dal trigger nel database,
   non dal segreto della chiave.
5. Attiva GitHub Pages sul repository (branch e cartella a scelta: i file
   statici sono già alla radice del progetto).

## File

- `index.html`, `style.css`, `app.js` — la webapp.
- `config.js` — credenziali pubbliche Supabase (da compilare, vedi sopra).
- `supabase/schema.sql` — schema del database, regole di sicurezza e dati
  iniziali, da eseguire una sola volta su un progetto Supabase nuovo.
- `supabase/migration_add_category.sql` — da eseguire una sola volta solo se
  il progetto Supabase era già stato creato prima dell'introduzione delle
  categorie (aggiunge la colonna `category` e la valorizza sui 44 libri
  iniziali). Non serve su un progetto nuovo: `schema.sql` la include già.

## Comportamento

- L'elenco si aggiorna da solo ogni 20 secondi, così chi è in libreria vede
  (quasi) in tempo reale cosa hanno già acquistato gli altri.
- I libri sono raggruppati per categoria, nello stesso ordine della lista
  originale della scuola: "Storie di Natale e d'Inverno", "Amicizia,
  Emozioni e Piccole Scoperte", "English Corner (English Books)". I libri
  aggiunti manualmente (non presenti nella lista) compaiono in coda, sotto
  "Altri libri aggiunti".
- Segnare un libro come acquistato richiede sempre una conferma esplicita,
  perché l'operazione è irreversibile.
- Se due persone provano a comprare lo stesso libro quasi in contemporanea,
  solo la prima richiesta va a buon fine; alla seconda persona viene
  mostrato un messaggio e l'elenco si aggiorna automaticamente.
- In fondo all'elenco c'è un campo per aggiungere un libro non presente in
  lista: viene inserito subito come "acquistato".
