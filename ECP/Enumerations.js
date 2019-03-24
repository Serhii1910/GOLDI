//***************************************
//*
//* Global enumerations
//*
//* Can be used globally
//*
//***************************************

// Command codes (Server <-> ECP)
EnumCommand =
{
    NoOperation                     :    0,
    Acknowledge                     :    1,
    Nacknowledge                    :    2,
    PSPURun                         :    3,
    PSPUStop                        :    4,
    PSPUSingleStepActuator          :    5,
    PSPUSingleStepSensor            :    6,
    Initialize                      :    7,
    LoadDesign                      :    8,
    LoadDesignProgress              :    9,
    PSPUErrorCode                   :   10,
    LightOn                         :   11,
    LightOff                        :   12,
    FileTransferComplete            :   13,
    FileFlashComplete               :   14,
    SetUserVariable                 :   15,
    AddBreakpoint                   :   16,
    RemoveAllBreakpoints            :   17,
    LoadBPUExample                  :   18,
    BPUReset                        :   19,
    BreakpointEnable                :   20,
    BreakpointDisable               :   21,
    PSPUFinishedInit                :   22,
    PSPUReachedSingleStepActuator   :   23,
    PSPUReachedSingleStepSensor     :   24,
    PSPUReachedBreakpoint           :   25,
    GotoVisitorMode                 :   26,
    ProgrammingError                :   27
};

// TEST TODO

EnumServerInterfaceInfo =
{
    Connect                         :   0,
    SendFile                        :   1,
    Initialize                      :   2,
    Start                           :   3,
    Pause                           :   4,
    Disconnect                      :   5,
    ChangeLanguage                  :   6
};


EnumSenderType =
{
    Server: 0,
    ECP: 1
};


// Environment variables

// 3AxisPortal
Enum3AxisPortalEnvironmentVariables =
{
    UserSwitch                      :   0
};

// Elevator4Floors also used for Elevator3Floors
EnumElevatorEnvironmentVariables =
{
    LightBarrierFloor1              :    0,
    LightBarrierFloor2              :    1,
    LightBarrierFloor3              :    2,
    CallButtonFloor1                :    3,
    CallButtonFloor2Up              :    4,
    CallButtonFloor2Down            :    5,
    CallButtonFloor3Down            :    6,
    ElevatorControlFloor1           :    7,
    ElevatorControlFloor2           :    8,
    ElevatorControlFloor3           :    9,
    ElevatorControlAlert            :   10,
    ElevatorControlEmStop           :   11,
    SimulationOverload              :   12,
    LightBarrierFloor4              :   13,
    CallButtonFloor3Up              :   14,
    CallButtonFloor4                :   15,
    ElevatorControlFloor4           :   16
};

// ProductionCell
EnumProductionCellEnvironmentVariables =
{
    UserSwitch                      :   0
};

// DigitalDemoBoard
EnumDigitalDemoBoardEnvironmentVariables =
{
    Switch0                         :   0,
    Switch1                         :   1,
    Switch2                         :   2,
    Switch3                         :   3,
    Switch4                         :   4,
    Switch5                         :   5,
    Switch6                         :   6,
    Switch7                         :   7,
    Button0                         :   8,
    Button1                         :   9,
    Button2                         :   10,
    Button3                         :   11,
    Button4                         :   12,
    Button5                         :   13,
    Button6                         :   14,
    Button7                         :   15,
    HexEncoder0                     :   16,
    HexEncoder1                     :   17,
    IncrementalEncoderA             :   24,
    IncrementalEncoderB             :   25
};

// Pump
PumpEnvironmentVariables =
{
    Drain                     :   0
};