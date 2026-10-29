const TEMPLATES={
wonderware:{label:'Wonderware ArchestrA / InTouch Spec',code:'WW',body:`# Wonderware System Platform Specification
## 1. Galaxy Overview
| Item | Value |
|---|---|
| Galaxy Name | GALAXY_PLANT01 |
| Galaxy Repository Node | GR-NODE01 |
| System Platform Version | 2023 R2 |
| Historian | Wonderware Historian / SQL Server |
## 2. Node Topology
| Node | Role | Engines | IP Address |
|---|---|---|---|
| GR-NODE01 | Galaxy Repository | AppEngine_01 | 10.0.0.10 |
| IOS-NODE01 | I/O Server | OI Gateway / DAServer | 10.0.0.11 |
| OPS-NODE01 | InTouch HMI | ViewEngine | 10.0.0.20 |
## 3. Scan Groups
| Scan Group | Rate (ms) | Description |
|---|---|---|
| Fast | 250 | Critical interlocks |
| Normal | 1000 | Process values |
| Slow | 5000 | Totalizers, diagnostics |
## 4. Script Types
| Type | Trigger | Object | Purpose |
|---|---|---|---|
| Condition | $Pump_Run == 1 | Pump_001 | Start sequence |
| Data Change | Tank.Level | Tank_001 | Alarm limiter |
| Key | F5 | HMI | Navigate to overview |
| Application | On Startup | InTouch | Init tags |
## 5. Historian Connection
- Connection string: \`Server=HIST01;Database=Runtime;Integrated Security=SSPI\`
- Retention: 3 years, storage rate 1000 ms
`},
iomap:{label:'Telemetry & IO Register Map',code:'IO',body:`# IO / Register Map
| Address | Tag Name | Data Type | Eng Units | Deadband | PLC Rack/Slot | Modbus Area | Description |
|---|---|---|---|---|---|---|---|
| 40001 | TK101_LEVEL | INT16 | % | 0.5 | R0/S2 | 4x Holding | Tank 101 level |
| 30001 | P101_CURRENT | INT16 | A | 0.1 | R0/S3 | 3x Input | Pump 101 current |
| 00001 | P101_RUN_CMD | BOOL | - | - | R0/S4 | 0x Coil | Pump 101 run command |
| 10001 | P101_RUN_FB | BOOL | - | - | R0/S5 | 1x Discrete | Pump 101 run feedback |
`},
fat:{label:'FAT / SAT Acceptance Checklist',code:'FAT',body:`# FAT / SAT Acceptance Test Checklist
Project: ____ Site: ____ Date: ____
## 1. Communications
| Step | Test | Expected | Result (Pass/Fail) | Tester | Sign-off |
|---|---|---|---|---|---|
| 1.1 | PLC to SCADA link | Quality GOOD | | | |
| 1.2 | Historian write | Values stored | | | |
## 2. I/O Loop Checks
| Step | Tag | Test | Expected | Result (Pass/Fail) | Sign-off |
|---|---|---|---|---|---|
| 2.1 | TK101_LEVEL | 0/50/100% injection | Scaled correctly | | |
| 2.2 | P101_RUN_CMD | Operator start | Pump runs, FB true | | |
## 3. Alarms &amp; Interlocks
| Step | Test | Expected | Result (Pass/Fail) | Sign-off |
|---|---|---|---|---|
| 3.1 | High-high level | Alarm + pump trip | | |
Client: ______ Contractor: ______
`},
sop:{label:'SOP / Operator User Manual',code:'SOP',body:`# Standard Operating Procedure
## 1. Purpose and Scope
Describe the system and who this manual is for.
## 2. Safety Precautions
[!] DANGER: Follow site LOTO and QHSE procedures before touching any field equipment.
[i] INTERLOCK: Never bypass an interlock without an approved ECO.
[*] OPERATOR NOTE: Acknowledge all outstanding alarms before starting equipment.
## 3. Startup Procedure
1. Verify all HMI nodes show **Comms OK**.
2. Acknowledge outstanding alarms.
3. Start equipment from the overview screen.
## 4. Troubleshooting
| Symptom | Probable Cause | Action |
|---|---|---|
| Tag quality BAD | Driver/PLC offline | Check OPC server and network |
## 5. Contacts
| Role | Name | Phone |
|---|---|---|
| SCADA Engineer | | |
`}};