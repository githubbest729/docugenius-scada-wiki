# DocuGenius Wiki (AGAC PWA)
### Automated SCADA Documentation, Configuration & Spec Vault

**DocuGenius Wiki** is an offline-first, industrial-grade Progressive Web App designed specifically for SCADA and Automation Engineers at **Al Gurg Automation and Controls (Dubai, U.A.E.)**.

The system implements **Task 24: Create and maintain documentation for configurations, specifications, and user manuals**, delivering an air-gapped vault for Wonderware Galaxy topologies, PLC/RTU memory maps, automated I/O parsers, Engineering Change Order (ECO) workflows, and PDF-ready engineering dossiers.

---

## 1. Visual Identity & Asset Mapping

The application includes a complete suite of high-resolution industrial telemetry vectors, adaptive maskable application icons, shortcuts, and metadata assets:

```text
docugenius-agac-pwa/
├── favicon.svg               # Scalable vector telemetry badge (Cyan / Industrial Slate)
├── favicon.ico               # Multi-size legacy browser tab icon
├── apple-touch-icon.png      # iOS Springboard Icon (180x180)
├── icons/
│   ├── icon-72.png           # Legacy / Android system icons
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png          # Chrome Web Store & Windows tile manifests
│   ├── icon-152.png          # iPad touch icon
│   ├── icon-192.png          # Standard Android launcher icon
│   ├── icon-384.png          # High-density splash icon
│   ├── icon-512.png          # PWA splash screen & Web App banner
│   ├── icon-maskable-192.png # Adaptive squircle/circle icon (Android 13+)
│   ├── icon-maskable-512.png # Adaptive high-res master maskable icon
│   ├── shortcut-new.png      # Quick action: "New Spec Document"
│   ├── shortcut-import.png   # Quick action: "Import Tag List / IO Map"
│   └── shortcut-audit.png    # Quick action: "Audit Trail & ECOs"
└── screenshots/
    ├── screenshot-desktop.png # 1280x720 Wide viewport for Chromium installer UI
    └── screenshot-mobile.png  # 750x1334 Narrow viewport mobile showcase

2. System Architecture
DocuGenius Wiki uses a client-side, zero-latency reactive architecture operating completely disconnected from external internet infrastructure:

+---------------------------------------------------------------------------------------+
|                                    BROWSER RUNTIME                                    |
+---------------------------------------------------------------------------------------+
|  Presentation UI (index.html)  <->  PWA Controller (pwa-controller.js)               |
|  - Window Controls Bar (WCO)        - Badging API (ECO Count)                         |
|  - Dossier / Spec View              - Screen Wake Lock Manager                        |
|  - Markdown & Script IDE            - Modbus 0x/1x/3x/4x Memory Visualizer            |
+---------------------------------------------------------------------------------------+
                                          |
                                          v
+---------------------------------------------------------------------------------------+
|                     CORE APPLICATION DISPATCHER (app.js)                              |
+---------------------------------------------------------------------------------------+
         |                                |                               |
         v                                v                               v
+------------------+            +-------------------+           +-------------------+
|  PARSER ENGINE   |            |  STORAGE ENGINE   |           |  EXPORT ENGINE    |
|  (parsers.js)    |            |  (db.js)          |           |  (export.js)      |
|------------------|            |-------------------|           |-------------------|
| - PLC/RTU CSV    |            | - IndexedDB:      |           | - Print Dossier   |
| - JSON Tag Import|            |   * articles      |           | - Markdown File   |
| - Register Calc  |            |   * configurations|           | - Air-Gapped JSON |
| - Address Checks |            |   * revisions     |           |   Backup / Restore|
+------------------+            |   * attachments   |           +-------------------+
                                +-------------------+

3. Core Capabilities (Task 24 Pillars)
I. System Configurations
Wonderware Galaxy Architecture: Node topology, redundant AppEngine pairing, scan group cycle rates, and SQL Historian archival rules.

Field Bus & Driver Specs: Modbus TCP/RTU station indexing, OPC UA server endpoints, and PLC hardware rack/slot profiles.

II. Engineering Specifications
Automated Memory Mapping: Converts raw PLC exports into standardized registers (0x Coils, 1x Discrete Inputs, 3x Input Registers, 4x Holding Registers).

Functional & Software Design Specs (FDS/SDS): Built-in industrial templates with automatic engineering title blocks.

III. User Manuals & SOPs
Operator Runbooks: Step-by-step procedures with formatted industrial callouts ([!] DANGER, [i] INTERLOCK, [*] NOTE).

FAT / SAT Acceptance Checklists: Structured sign-off verification grids with inspection status criteria.

4. Getting Started
Serve the repository root over any local static server:

# Using Node.js
npx serve .

# Or using Python
python3 -m http.server 8000

Open http://localhost:8000 in Chrome, Edge, or Safari to run and install the PWA.
