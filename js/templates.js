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
sop:{label:'SOP / Operator Manual (structured)',code:'SOP',body:`# Standard Operating Procedure - Start Pump P-101
## 1. Purpose and Scope
Defines how a plant operator starts pump P-101 from the HMI and what the system must do in response.
## 2. Operating Procedure
### Step 1. Start pump P-101
>> PREREQ: Pump P-101 will not start unless Suction Valve XV-101 is 100% OPEN and no trip is latched.
>> HMI: Main Menu > Pump Station 1 > Pump Overview > P-101 Popup
[!] DANGER: Rotating equipment and high voltage. Confirm LOTO is removed and guards are fitted.
[*] OPERATOR ACTION: Select AUTO, enter the speed set-point (30-100 %), click START and confirm the dialogue.
[i] INTERLOCK: Low suction pressure or motor overload trips the pump and latches FAULT.
>> EXPECT: Status tag changes from GREY (Stopped) to SOLID GREEN (Running) within 3 seconds.
## 3. Alarm Response Card
| Alarm | Priority | Operator action |
|---|---|---|
| P-101 Fault | High | Check local panel, start standby pump P-102 |
| Suction pressure low | Critical | Confirm XV-101 position, do not restart until cleared |
## 4. Failover and Disaster Recovery
1. Confirm the backup SCADA node shows GREEN on the System overview.
[*] OPERATOR ACTION: Log the failover and notify the Lead SCADA Engineer.
`}};