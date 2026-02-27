# 🗺️ Master Project Tree: hybrid_TREE

**Stato Legenda:**
- `[ ]` : Vuoto (Da iniziare)
- `[/]` : In Progress (AI al lavoro o bloccato)
- `[X]` : Finito (Codice validato e testato)
- `[!]` : Errore/Conflitto (Es. Ownership di Rust violata)

---

## 🏗️ Architettura a Blocchi (Logical Tree)
root (Hybrid Tree Orchestrator)
├── [X] Project_Initialization (Core)
│   └── [X] manifest_generator: Genera il file MASTER_PROJECT_TREE.md iniziale.
├── [X] VSCode_Integration (Interface)
│   ├── [X] command_registration: Registra i comandi VS Code nel package.json.
│   ├── [X] tree_view_provider: Implementa il parsing e la visualizzazione del manifest.
│   └── [X] state_sync_engine: Sincronizza lo stato tra manifest e UI in tempo reale.
├── [X] AI_Context_Bridge (Logic)
│   ├── [X] context_aggregator: Aggrega manifest e struttura fisica per i prompt AI.
│   ├── [X] reasoning_loop: Identifica il prossimo task e gestisce le priorità.
│   └── [X] manifest_validator: Rileva duplicati e violazioni di integrità nel manifest.
└── [ ] Multi_Language_Support (Roadmap)
    ├── [ ] Rust_Ownership_Guard: Visualizzazione del borrow checker e ownership.
    ├── [ ] CPP_Header_Mapper: Mapping .hpp/.cpp e audit memoria.
    └── [ ] Python_Import_Graph: Analisi import e suggerimenti type hinting.

---

## 📂 Struttura File & Sincronizzazione (Physical Tree)
hybrid_TREE/
├── [X] package.json (Sync: OK)
├── [X] tsconfig.json (Sync: OK)
├── [X] src/
│   ├── [X] extension.ts: Entry point dell'estensione e registrazione servizi.
│   ├── [X] bridge/
│   │   ├── [X] ContextManager.ts: Gestore degli snapshot di contesto per l'AI.
│   │   ├── [X] ReasoningLoop.ts: Motore di suggerimento task e logica decisionale.
│   │   └── [X] ManifestValidator.ts: Validazione "ironclad" contro i duplicati.
│   └── [X] provider/
│       └── [X] TreeProvider.ts: Fornisce i dati per la Project Tree View.
├── [X] README.md: Documentazione tecnica e manuale utente.
├── [X] LICENSE: Testo della licenza GNU General Public License v3.
└── [X] MASTER_PROJECT_TREE.md: Manifesto dello stato e dell'architettura.

---

## 📝 Checklist Dettagliata per Capitoli (Action Tree)

### Capitolo 1: Fondamenta
- [X] Setup del repository e README iniziale.
- [X] Reclutamento della struttura base (src/extension.ts).
- [X] Creazione del MASTER_PROJECT_TREE.md.

### Capitolo 2: Interfaccia VS Code
- [X] Implementazione del TreeView per visualizzare lo stato.
- [X] Sincronizzazione in tempo reale tramite FileSystemWatcher.
- [X] Layout dei comandi (Toggle, Refresh, Init).

### Capitolo 3: AI Bridge & Integrità
- [X] Sviluppo del Context Aggregator (Snapshot).
- [X] Sviluppo del Reasoning Loop (Task Suggestions).
- [X] Sviluppo del Manifest Validator (Duplicate Detection).

### Capitolo 4: Interfaccia di Integrazione
- [X] Export programmatico in JSON (hybrid_state_sync.json).
- [X] Supporto avanzato per le descrizioni delle foglie (Leafs).
- [X] Prioritizzazione automatica dei conflitti [!].

---

## 🤖 AI Context Instructions
1. **Priorità:** Jules, lavora sempre sul primo nodo `[/]` partendo dall'alto.
2. **Aggiornamento:** Ogni volta che completi una funzione nel progetto Target, cambia lo stato da `[/]` a `[X]` in questo file.
3. **Blocco:** Se trovi un errore di compilazione che non riesci a risolvere, segna il nodo con `[!]` e ferma l'esecuzione.
