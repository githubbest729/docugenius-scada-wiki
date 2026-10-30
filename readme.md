DocuGenius Wiki (AGAC PWA)

Automated SCADA Documentation, Configuration & Spec Vault

DocuGenius Wiki is an offline-first, industrial-grade Progressive Web App designed specifically for SCADA and Automation Engineers at Al Gurg Automation and Controls (Dubai, U.A.E.).

The system implements Task 24: Create and maintain documentation for configurations, specifications, and user manuals, delivering an air-gapped vault for Wonderware Galaxy topologies, PLC/RTU memory maps, automated I/O parsers, Engineering Change Order (ECO) workflows, and PDF-ready engineering dossiers.

1. Visual Identity & Asset Mapping

The application includes a complete suite of high-resolution industrial telemetry vectors, adaptive maskable application icons, shortcuts, and metadata assets:

docugenius-agac-pwa/
├── favicon.svg                           # Scalable vector telemetry badge (Cyan / Industrial Slate)
├── favicon.ico                           # Multi-size legacy browser tab icon
├── apple-touch-icon.png                  # iOS Springboard Icon (180x180)
├── icons/
│   ├── icon-72.png / icon-96.png         # Legacy / Android system icons
│   ├── icon-128.png / icon-144.png       # Chrome Web Store & Windows tile manifests
│   ├── icon-152.png                      # iPad touch icon
│   ├── icon-192.png                      # Standard Android launcher icon
│   ├── icon-384.png                      # High-density splash icon
│   ├── icon-512.png                      # PWA splash screen & Web App banner
│   ├── icon-maskable-192.png             # Adaptive squircle/circle icon (Android 13+)
│   ├── icon-maskable-512.png             # Adaptive high-res master maskable icon
│   ├── shortcut-new.png                  # Quick action: "New Spec Document"
│   ├── shortcut-import.png               # Quick action: "Import Tag List / IO Map"
│   └── shortcut-audit.png                # Quick action: "Audit Trail & ECOs"
└── screenshots/
    ├── screenshot-desktop.png            # 1280x720 Wide viewport for Chromium installer UI
    └── screenshot-mobile.png             # 750x1334 Narrow viewport mobile showcase


Primary Telemetry Emblem (favicon.svg)

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#0B0F19" />
  <path d="M32 12 L48 21 L48 39 L32 48 L16 39 L16 21 Z" fill="none" stroke="#00D2FF" stroke-width="3" stroke-linejoin="round" />
  <circle cx="32" cy="30" r="6" fill="#10B981" />
  <line x1="32" y1="12" x2="32" y2="24" stroke="#00D2FF" stroke-width="2.5" />
  <line x1="32" y1="36" x2="32" y2="48" stroke="#00D2FF" stroke-width="2.5" />
  <line x1="16" y1="21" x2="26" y2="27" stroke="#00D2FF" stroke-width="2.5" />
  <line x1="48" y1="39" x2="38" y2="33" stroke="#00D2FF" stroke-width="2.5" />
</svg>

2. System Architecture

DocuGenius Wiki uses a client-side, zero-latency reactive architecture operating completely disconnected from external internet infrastructure.

+---------------------------------------------------------------------------------------+
|                                    BROWSER RUNTIME                                    |
|                                                                                       |
|   +-------------------+   +-------------------------+   +-------------------------+   |
|   |  Presentation UI  |   |    PWA Controller       |   |   File & Import Engine  |   |
|   |  (index.html)     |<->|  (pwa-controller.js)    |<->|   (parsers.js)          |   |
|   |  - Title Bar WCO  |   |  - Window Controls Bar  |   |   - Modbus 0x/1x/3x/4x  |   |
|   |  - Dossier View   |   |  - Badging API (ECOs)   |   |   - PLC/RTU CSV parser  |   |
|   |  - Markdown IDE   |   |  - Screen Wake Lock     |   |   - JSON Tag Validator  |   |
|   +-------------------+   +-------------------------+   +-------------------------+   |
|             ^                          ^                             ^                |
|             |                          |                             |                |
|             v                          v                             v                |
|   +-------------------------------------------------------------------------------+   |
|   |                            CORE APPLICATION DISPATCHER                        |   |
|   |                                    (app.js)                                   |   |
|   +-------------------------------------------------------------------------------+   |
|             ^                          ^                             ^                |
|             v                          v                             v                |
|   +-------------------+   +-------------------------+   +-------------------------+   |
|   |  Template Engine  |   |    Persistent Storage   |   |   Air-Gapped Exporter   |   |
|   |  (templates.js)   |   |    Engine (db.js)       |   |   (export.js)           |   |
|   |  - Wonderware SDS |   |  IndexedDB (4 Stores):  |   |   - File System Access  |   |
|   |  - Modbus IO Map  |   |  * articles             |   |   - Print Dossier PDF   |   |
|   |  - FAT/SAT Sheet  |   |  * configurations       |   |   - USB JSON Vault Sync |   |
|   |  - SOP User Guide |   |  * revisions (ECO)      |   |   - Line Diff Analyzer  |   |
|   +-------------------+   |  * attachments          |   +-------------------------+   |
|                           +-------------------------+                                 |
+---------------------------------------------------------------------------------------+
                                         ^
                                         | Service Worker Bus (sw.js)
                                         v
+---------------------------------------------------------------------------------------+
|                             OFFLINE SERVICE WORKER CACHE                              |
|   - Pre-cached App Shell (HTML, CSS, JS, Fonts, Icons)                                |
|   - Stale-While-Revalidate Runtime Cache                                              |
|   - Offline Fallback Responder (offline.html)                                         |
|   - Background Sync Handler ('sync-docs')                                             |
+---------------------------------------------------------------------------------------+


3. Core Functional Pillars (Task 24 Scope)

Pillar A: Configuration Management

Wonderware Galaxy Architecture: Stores Galaxy Repositories (GR), Redundant Application Engines, Object Hierarchies, InTouch HMI View nodes, and scan group cycle periods.

Network & Driver Profiles: Manages OPC UA Server Endpoint URIs, Modbus TCP gateways (IP, Port 502, Unit ID), and serial RS-485 Modbus RTU configurations (baud rate, parity, stop bits).

Industrial Historian Storage Rules: Documents circular database configurations, tag retention limits (2 to 3+ years), deadbands, and real-time SQL connection strings.

Pillar B: Engineering Specifications

Automated Tag Import: Drag-and-drop CSV/JSON tag lists into parsers.js. The parser maps PLC tags directly into Modbus memory zones:

0x Coils (Discrete Output)

1x Inputs (Discrete Input)

3x Input Registers (Analog Input)

4x Holding Registers (Analog Output / Setpoint)

Functional & Software Design Specs (FDS/SDS): Structured templates standardizing equipment descriptions, software interlocks, and emergency shutdown sequences.

Pillar C: User Manuals & Operator SOPs

Control Room Walkthroughs: Formatted step-by-step Standard Operating Procedures for field technicians and operators.

FAT / SAT Protocol Sign-off: Factory Acceptance Testing (FAT) and Site Acceptance Testing (SAT) punch lists with interactive verification rows and sign-off blocks.

Industrial Callout Blocks:

[!] DANGER: Critical personnel hazard, high voltage, or explosive atmosphere warnings.

[i] INTERLOCK: Software interlock conditions and bypass caveats.

[*] OPERATOR NOTE: Standard setpoint limits and operating thresholds.

4. File Structure & Responsibilities

File Path

Description

index.html

Single-page shell hosting the WCO title bar, editor workspace, tag table parser, and dossier viewer.

manifest.webmanifest

PWA installation descriptor featuring shortcuts, window controls overlay, and theme definitions.

sw.js

Service Worker managing cache-first shell loading, dynamic routes, and offline background sync.

offline.html

Resilient offline fallback screen for cache-miss network requests.

favicon.svg / favicon.ico

SVG and legacy icons depicting the SCADA telemetry emblem.

robots.txt

Standard web spider policy file.

.well-known/assetlinks.json

Android TWA (Trusted Web Activity) digital signature descriptor.

.nojekyll

Ensures GitHub Pages serves files directly without Jekyll directory filtering.

css/styles.css

Dark industrial control room UI (Deep Slate #090D16, SCADA Cyan #00D2FF, Emerald #10B981).

css/print-dossier.css

High-contrast black-and-white print stylesheet with formal Al Gurg engineering title blocks.

js/db.js

IndexedDB abstraction layer with permanent persistence request (navigator.storage.persist()).

js/templates.js

Built-in industrial templates: Wonderware SDS, Modbus IO Map, FAT/SAT Test Sheet, and Operator SOP.

js/parsers.js

Ingests CSV/JSON PLC tag databases and computes Modbus register maps and data types.

js/export.js

Handles File System Access API direct saves, JSON vault backups, Markdown downloads, and line diffs.

js/pwa-controller.js

Orchestrates Window Controls Overlay, Badging API, Screen Wake Lock, and Install triggers.

js/app.js

Main UI event bus, keyboard shortcuts (Ctrl+K), role switcher, and view rendering.

js/seed.js

Initial mock datasets featuring Dubai Municipality SCADA specs and pumping station IO maps.

icons/*

Complete set of progressive web app icons (72px to 512px, maskable, and app shortcuts).

screenshots/*

High-resolution preview mockups for Chromium desktop and mobile installation prompts.

5. Storage Engine & 2–3 Year Data Retention

DocuGenius Wiki uses browser IndexedDB storage configured for long-term reliability:

Persistent Storage Request:
On load, db.js invokes:

if (navigator.storage && navigator.storage.persist) {
  const isPersisted = await navigator.storage.persist();
  console.log(`Storage persistence granted: ${isPersisted}`);
}


This prevents mobile WebKit and Chromium from evicting cached telemetry documents and historical configurations during device cleanups.

Quota Monitoring:
Live tracking via navigator.storage.estimate() renders storage utilization (MB used vs GB available) directly in the navigation bar.

Air-Gapped USB Vault Portability:
export.js serializes all four IndexedDB stores (articles, configurations, revisions, attachments) into a unified, version-stamped JSON payload for direct transfer via FAT/SAT USB sticks across isolated control room networks.

6. Installation & Development

Local Development Server

Because Service Workers and the Storage API require a secure origin, serve the directory via localhost or over HTTPS.

Using Node.js:

npx serve docugenius-agac-pwa


Using Python 3:

cd docugenius-agac-pwa
python3 -m http.server 8080


Open your browser at http://localhost:8080.

Desktop PWA Installation

Navigate to the local instance using Google Chrome or Microsoft Edge.

Click the Install button in the top navigation bar (or click the install icon in the browser address bar).

The application will launch as a standalone desktop window integrating with the native OS title bar via Window Controls Overlay (WCO).

7. Compliance & Standards

Company Scope: Al Gurg Automation and Controls (Dubai, U.A.E.).

Quality & Safety Compliance: Standardized audit revision boxes compatible with QHSE Annexure-SCT-HR-001 and ISO 9001 document control.

Engineering Change Order (ECO): Mandatory edit justifications logged with local role stamps (Lead SCADA Engineer, Shift Operator, QA/FAT Inspector) without cloud-dependent logins.
