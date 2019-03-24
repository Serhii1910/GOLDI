const SMUserInputStates = {
    Standby                             : 0,
    DriveToFloor1                       : 1,
    DriveToFloor2                       : 2,
    DriveToFloor3                       : 3,
};

const SMElevatorPositionStates = {
    PositionUnknown                     : 0,
    ElevatorOnFloor1                    : 1,
    ElevatorBetweenFloor1and2           : 2,
    ElevatorOnFloor2                    : 3,
    ElevatorBetweenFloor2and3           : 4,
    ElevatorOnFloor3                    : 5,
};

const SMDriveElevatorStates = {
    Idle                                : 0,
    DriveUpwards                        : 1,
    DriveDownwards                      : 2,
    ForceDriveUpwards                   : 3,
    ForceDriveDownwards                 : 4,
};

const SMDoorPositionStates = {
    PositionUnkown                      : 0,
    AllDoorsAreClosed                   : 1,
    OneDoorIsOpen                       : 2,
};

const SMDriveDoorStates = {
    Idle                                : 0,
    OpenDoors                           : 1,
    CloseDoors                          : 2,
};

ManualControl.prototype.BuildUserControlPanelContent = function() {
    this.SMUserInput = SMUserInputStates.Standby;
    this.SMElevatorPosition = SMElevatorPositionStates.PositionUnknown;
    this.SMDriveElevator = SMDriveElevatorStates.Idle;
    this.SMDoorPosition = SMDoorPositionStates.PositionUnkown;
    this.SMDriveDoor = SMDriveDoorStates.Idle;

    this.MCObject_ButtonFloor = [];
    this.MCObject_LEDFloor = [];
    for (let i = 1; i <= 3; i++) {
        this.MCObject_ButtonFloor[i] = new ManualControlObject(Snap("#ButtonFloor" + i), i.toString(),
            () => { // Callback-function for pressing the key or mouse on the object
                this.SMUserInput = SMUserInputStates["DriveToFloor" + i];
            }
        );
        this.MCObject_ButtonFloor[i].SetAttributes({class:"str0"});

        this.MCObject_LEDFloor[i] = new ManualControlObject(Snap("#LEDFloor" + i));
        this.MCObject_LEDFloor[i].AbstractSetEnabled = function(Object){
            Object.attr("fill", "#FFFFFF");
        };
        $("#LEDFloor" + i).css("pointer-events", "none");
        $("#TextFloor" + i).css("pointer-events", "none");
        this.ControlElements.push(this.MCObject_ButtonFloor[i]);
        this.ControlElements.push(this.MCObject_LEDFloor[i]);
    }


    this.MCObject_ArrowUp = new ManualControlObject(Snap("#ArrowUp"), "u",
        () => { // Callback-function for pressing the key or mouse on this object
            this.SMDriveElevator = SMDriveElevatorStates.ForceDriveUpwards;
            this.SMUserInput = SMUserInputStates.Standby;
        },
        () => { // Callback-function for releasing the key or mouse on the object
            this.SMDriveElevator = SMDriveElevatorStates.Idle;
            this.SMUserInput = SMUserInputStates.Standby;
        }
    );
    this.MCObject_ArrowUp.SetAttributes({class:"str0"});
    $("#ArrowUpText").css("pointer-events", "none");
    this.ControlElements.push(this.MCObject_ArrowUp);


    this.MCObject_ArrowDown = new ManualControlObject(Snap("#ArrowDown"), "d",
        () => { // Callback-function for pressing the key or mouse on this object
            this.SMDriveElevator = SMDriveElevatorStates.ForceDriveDownwards;
            this.SMUserInput = SMUserInputStates.Standby;
        },
        () => {
            this.SMDriveElevator = SMDriveElevatorStates.Idle;
            this.SMUserInput = SMUserInputStates.Standby;
        }
    );
    this.MCObject_ArrowDown.SetAttributes({class:"str0"});
    $("#ArrowDownText").css("pointer-events", "none");
    this.ControlElements.push(this.MCObject_ArrowDown);


    this.SliderIsFast = true;
    this.MCObject_Slider = new ManualControlObject(Snap("#Slider"));
    this.MCObject_SliderBackground = new ManualControlObject(Snap("#SliderBackground"), "s",
        () => { // Callback-function for pressing the key or mouse on this object
            this.SliderIsFast = !this.SliderIsFast;
            if(this.SliderIsFast){
                this.MCObject_Slider.Translate(0,0);
                this.SendActuators(2, false);
            }else{
                this.MCObject_Slider.Translate(-288,0);
                this.SendActuators(2, true);
            }
        }
    );
    this.MCObject_SliderBackground.SetAttributes({class:"str0"});
    this.ControlElements.push(this.MCObject_SliderBackground);
    $("#SliderTextFast").css("pointer-events", "none");
    $("#SliderTextSlow").css("pointer-events", "none");
    $("#Slider").css("pointer-events", "none");


    this.MCObject_OpenDoor = new ManualControlObject(
        [
            Snap("#OpenDoorBackground"),
            Snap("#OpenDoorLeftDoorArrow"),
            Snap("#OpenDoorRightDoorArrow"),
        ], "o",
        () => { // Callback-function for pressing the key or mouse on this object
            if(
                this.SMDriveElevator == SMDriveElevatorStates.Idle &&
                (
                    this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor1 ||
                    this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor2 ||
                    this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor3
                )
            ){
                this.SMDriveDoor = SMDriveDoorStates.OpenDoors;
            }else{
                this.SMDriveDoor = SMDriveDoorStates.Idle;
            }
        }
    );
    this.MCObject_OpenDoor.SetAttributes({class:"str0"});
    this.ControlElements.push(this.MCObject_OpenDoor);
    $("#OpenDoorLeftDoor").css("pointer-events", "none");
    $("#OpenDoorLeftDoorArrow").css("pointer-events", "none");
    $("#OpenDoorRightDoor").css("pointer-events", "none");
    $("#OpenDoorRightDoorArrow").css("pointer-events", "none");
    $("#OpenDoorTextOpen").css("pointer-events", "none");
    $("#OpenDoorTextDoor").css("pointer-events", "none");


    this.MCObject_CloseDoor = new ManualControlObject(
        [
            Snap("#CloseDoorBackground"),
            Snap("#CloseDoorLeftDoorArrow"),
            Snap("#CloseDoorRightDoorArrow"),
        ], "c",
        () => {
            if(
                this.SMDriveElevator == SMDriveElevatorStates.Idle &&
                (
                    this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor1 ||
                    this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor2 ||
                    this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor3
                )
            ){
                this.SMDriveDoor = SMDriveDoorStates.CloseDoors;
            }else{
                this.SMDriveDoor = SMDriveDoorStates.Idle;
            }
        }
    );
    this.MCObject_CloseDoor.SetAttributes({class:"str0"});
    this.ControlElements.push(this.MCObject_CloseDoor);
    $("#CloseDoorLeftDoor").css("pointer-events", "none");
    $("#CloseDoorLeftDoorArrow").css("pointer-events", "none");
    $("#CloseDoorRightDoor").css("pointer-events", "none");
    $("#CloseDoorRightDoorArrow").css("pointer-events", "none");
    $("#CloseDoorTextClose").css("pointer-events", "none");
    $("#CloseDoorTextDoor").css("pointer-events", "none");


    this.DisableAllControls();
};

ManualControl.prototype.RefreshSMUserInputStates = function(){
    if(
        (this.SMUserInput == SMUserInputStates.DriveToFloor1 && this.Sensors[ 0]) ||
        (this.SMUserInput == SMUserInputStates.DriveToFloor2 && this.Sensors[ 1]) ||
        (this.SMUserInput == SMUserInputStates.DriveToFloor3 && this.Sensors[ 2])
    ){
        this.SMUserInput = SMUserInputStates.Standby;
    }

    // SVG Styles
    for(let i=1;i<=3;i++)
        this.MCObject_ButtonFloor[i].SetEnabled()
    switch(this.SMUserInput){
        case SMUserInputStates.DriveToFloor1:
            this.MCObject_ButtonFloor[1].SetActive();
            break;
        case SMUserInputStates.DriveToFloor2:
            this.MCObject_ButtonFloor[2].SetActive();
            break;
        case SMUserInputStates.DriveToFloor3:
            this.MCObject_ButtonFloor[3].SetActive();
            break;
    }
};

ManualControl.prototype.RefreshSMElevatorPositionStates = function(){
    if(this.Sensors[ 0]                     ){
        this.SMElevatorPosition = SMElevatorPositionStates.ElevatorOnFloor1;
    }
    if(this.Sensors[ 3] || this.Sensors[ 4] ){
        this.SMElevatorPosition = SMElevatorPositionStates.ElevatorBetweenFloor1and2;
    }
    if(this.Sensors[ 1]                     ){
        this.SMElevatorPosition = SMElevatorPositionStates.ElevatorOnFloor2;
    }
    if(this.Sensors[ 5] || this.Sensors[ 6] ){
        this.SMElevatorPosition = SMElevatorPositionStates.ElevatorBetweenFloor2and3;
    }
    if(this.Sensors[ 2]                     ){
        this.SMElevatorPosition = SMElevatorPositionStates.ElevatorOnFloor3;
    }

    //SVG Styles
    for(let i=1;i<=3;i++)
        this.MCObject_LEDFloor[i].SetEnabled()
    switch(this.SMElevatorPosition){
        case SMElevatorPositionStates.ElevatorOnFloor1:
            this.MCObject_LEDFloor[1].SetActive();
            break;
        case SMElevatorPositionStates.ElevatorOnFloor2:
            this.MCObject_LEDFloor[2].SetActive();
            break;
        case SMElevatorPositionStates.ElevatorOnFloor3:
            this.MCObject_LEDFloor[3].SetActive();
            break;
    }
};

ManualControl.prototype.RefreshSMDoorPositionStates = function(){
    this.SMDoorPosition = SMDoorPositionStates.PositionUnkown;

    if(
        this.Sensors[ 8] &&
        this.Sensors[10] &&
        this.Sensors[12]
    ){
        this.SMDoorPosition = SMDoorPositionStates.AllDoorsAreClosed;
    }

    if(
        this.Sensors[ 7] ||
        this.Sensors[ 9] ||
        this.Sensors[11]
    ){
        this.SMDoorPosition = SMDoorPositionStates.OneDoorIsOpen;
    }

    // SVG Styles
    if(
        this.SMDriveElevator == SMDriveElevatorStates.Idle &&
        (
            (this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor1) ||
            (this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor2) ||
            (this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor3)
        )
    ){
        this.MCObject_OpenDoor.SetEnabled();
        this.MCObject_CloseDoor.SetEnabled();
    }else{
        this.MCObject_OpenDoor.SetDisabled();
        this.MCObject_CloseDoor.SetDisabled();
    }
};

ManualControl.prototype.RefreshSMDriveElevatorStates = function(){
    if(this.SMElevatorPosition == SMElevatorPositionStates.PositionUnknown){
        this.SMDriveElevator = SMDriveElevatorStates.DriveDownwards;
    }else{
        if(this.SMDoorPosition == SMDoorPositionStates.AllDoorsAreClosed) {
            switch(this.SMUserInput){
                case SMUserInputStates.DriveToFloor1:
                    if(this.SMElevatorPosition != SMElevatorPositionStates.ElevatorOnFloor1)
                        this.SMDriveElevator = SMDriveElevatorStates.DriveDownwards;
                    break;
                case SMUserInputStates.DriveToFloor2:
                    if(
                        this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor1 ||
                        this.SMElevatorPosition == SMElevatorPositionStates.ElevatorBetweenFloor1and2
                    ){
                        this.SMDriveElevator = SMDriveElevatorStates.DriveUpwards;
                    }else{
                        this.SMDriveElevator = SMDriveElevatorStates.DriveDownwards;
                    }
                    break;
                case SMUserInputStates.DriveToFloor3:
                    if(this.SMElevatorPosition != SMElevatorPositionStates.ElevatorOnFloor3){
                        this.SMDriveElevator = SMDriveElevatorStates.DriveUpwards;
                    }
                    break;
                default:
                    if(this.SMDriveElevator != SMDriveElevatorStates.ForceDriveDownwards && this.SMDriveElevator != SMDriveElevatorStates.ForceDriveUpwards)
                        this.SMDriveElevator = SMDriveElevatorStates.Idle;
            }
        }
        if(this.SMDriveElevator == SMDriveElevatorStates.ForceDriveDownwards && this.Sensors[0])
            this.SMDriveElevator = SMDriveElevatorStates.Idle;
        if(this.SMDriveElevator == SMDriveElevatorStates.ForceDriveUpwards && this.Sensors[2])
            this.SMDriveElevator = SMDriveElevatorStates.Idle;
    }

    //SVG Styles
    switch(this.SMDriveElevator){
        case SMDriveElevatorStates.DriveUpwards:
            this.MCObject_ArrowUp.SetActive();
            this.MCObject_ArrowDown.SetEnabled();
            break;
        case SMDriveElevatorStates.DriveDownwards:
            this.MCObject_ArrowUp.SetEnabled();
            this.MCObject_ArrowDown.SetActive();
            break;
        case SMDriveElevatorStates.ForceDriveUpwards:
            this.MCObject_ArrowUp.SetActive();
            this.MCObject_ArrowDown.SetEnabled();
            break;
        case SMDriveElevatorStates.ForceDriveDownwards:
            this.MCObject_ArrowUp.SetEnabled();
            this.MCObject_ArrowDown.SetActive();
            break;
        case SMDriveElevatorStates.Idle:
            this.MCObject_ArrowUp.SetEnabled();
            this.MCObject_ArrowDown.SetEnabled();
            break;
    }
};

ManualControl.prototype.RefreshSMDriveDoorStates = function(){
    switch(this.SMDriveDoor){
        case SMDriveDoorStates.OpenDoors:
            if(this.SMDoorPosition == SMDoorPositionStates.OneDoorIsOpen)
                this.SMDriveDoor = SMDriveDoorStates.Idle;
            break;
        case SMDriveDoorStates.CloseDoors:
            if(this.SMDoorPosition == SMDoorPositionStates.AllDoorsAreClosed)
                this.SMDriveDoor = SMDriveDoorStates.Idle;
            break;
    }

    // SVG Styles
    switch(this.SMDriveDoor) {
        case SMDriveDoorStates.Idle:
            if(this.SMDoorPosition == SMDoorPositionStates.OneDoorIsOpen)
                this.MCObject_OpenDoor.SetDisabled();

            if(this.SMDoorPosition == SMDoorPositionStates.AllDoorsAreClosed)
                this.MCObject_CloseDoor.SetDisabled();

            break;
        case SMDriveDoorStates.OpenDoors:
            this.MCObject_OpenDoor.SetActive();
            break;
        case SMDriveDoorStates.CloseDoors:
            this.MCObject_CloseDoor.SetActive();
            break;
    }
};

ManualControl.prototype.Refresh = function(){
    this.RefreshSMUserInputStates();
    this.RefreshSMElevatorPositionStates();
    this.RefreshSMDoorPositionStates();
    this.RefreshSMDriveElevatorStates();
    this.RefreshSMDriveDoorStates();

    let ActuatorChanges = [];

    // SMElevatorPositionActuators
    if(this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor1 && !this.Actuators[13]) {
        ActuatorChanges.push([13, true]);
        ActuatorChanges.push([14, false]);
        ActuatorChanges.push([15, false]);
    }

    if(this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor2 && !this.Actuators[14]) {
        ActuatorChanges.push([13, false]);
        ActuatorChanges.push([14, true]);
        ActuatorChanges.push([15, false]);
    }

    if(this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor3 && !this.Actuators[15]) {
        ActuatorChanges.push([13, false]);
        ActuatorChanges.push([14, false]);
        ActuatorChanges.push([15, true]);
    }

    if(this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor4 && !this.Actuators[28]) {
        ActuatorChanges.push([13, false]);
        ActuatorChanges.push([14, false]);
        ActuatorChanges.push([15, false]);
    }

    if(
        this.SMElevatorPosition != SMElevatorPositionStates.ElevatorOnFloor1 &&
        this.SMElevatorPosition != SMElevatorPositionStates.ElevatorOnFloor2 &&
        this.SMElevatorPosition != SMElevatorPositionStates.ElevatorOnFloor3 &&
        (
            this.Actuators[13] ||
            this.Actuators[14] ||
            this.Actuators[15]
        )
    ){
        ActuatorChanges.push([13, false]);
        ActuatorChanges.push([14, false]);
        ActuatorChanges.push([15, false]);
    }

    // SMDriveElevator Actuators
    if(this.SMDoorPosition == SMDoorPositionStates.AllDoorsAreClosed && (this.SMDriveElevator == SMDriveElevatorStates.DriveUpwards || this.SMDriveElevator == SMDriveElevatorStates.ForceDriveUpwards) && !this.Actuators[0]){
        ActuatorChanges.push([0, true]);
        ActuatorChanges.push([1, false]);
        ActuatorChanges.push([16, false]);
    }

    if(this.SMDoorPosition == SMDoorPositionStates.AllDoorsAreClosed && (this.SMDriveElevator == SMDriveElevatorStates.DriveDownwards || this.SMDriveElevator == SMDriveElevatorStates.ForceDriveDownwards) && !this.Actuators[1]){
        ActuatorChanges.push([0, false]);
        ActuatorChanges.push([1, true]);
        ActuatorChanges.push([16, true]);
    }

    if(this.SMDriveElevator == SMDriveElevatorStates.Idle && (this.Actuators[0] || this.Actuators[1])){
        ActuatorChanges.push([0, false]);
        ActuatorChanges.push([1, false]);
        ActuatorChanges.push([16, false]);
    }

    // SMDriveDoor Actuators
    switch(this.SMDriveDoor) {
        case SMDriveDoorStates.Idle:
            if(
                this.Actuators[ 3] ||
                this.Actuators[ 4] ||
                this.Actuators[ 5] ||
                this.Actuators[ 6] ||
                this.Actuators[ 7] ||
                this.Actuators[ 8]
            ){
                ActuatorChanges.push([ 3, false]);
                ActuatorChanges.push([ 4, false]);
                ActuatorChanges.push([ 5, false]);
                ActuatorChanges.push([ 6, false]);
                ActuatorChanges.push([ 7, false]);
                ActuatorChanges.push([ 8, false]);
            }
            break;
        case SMDriveDoorStates.OpenDoors:
            if(this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor1 && !this.Actuators[3]){
                ActuatorChanges.push([ 3, true]);
                ActuatorChanges.push([ 4, false]);
            }

            if(this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor2 && !this.Actuators[5]){
                ActuatorChanges.push([ 5, true]);
                ActuatorChanges.push([ 6, false]);
            }

            if(this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor3 && !this.Actuators[7]){
                ActuatorChanges.push([ 7, true]);
                ActuatorChanges.push([ 8, false]);
            }

            break;
        case SMDriveDoorStates.CloseDoors:
            if(this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor1 && !this.Actuators[4]){
                ActuatorChanges.push([ 3, false]);
                ActuatorChanges.push([ 4, true]);
            }

            if(this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor2 && !this.Actuators[6]){
                ActuatorChanges.push([ 5, false]);
                ActuatorChanges.push([ 6, true]);
            }

            if(this.SMElevatorPosition == SMElevatorPositionStates.ElevatorOnFloor3 && !this.Actuators[8]){
                ActuatorChanges.push([ 7, false]);
                ActuatorChanges.push([ 8, true]);
            }

            break;
    }

    if(ActuatorChanges.length != 0)
        this.SendActuators(ActuatorChanges);

    this.DebugStateMachineStates();
};

ManualControl.prototype.DebugStateMachineStates = function(){
    let StateMachines = [
        ["UserInput", this.SMUserInput, SMUserInputStates],
        ["ElevatorPosition", this.SMElevatorPosition, SMElevatorPositionStates],
        ["DoorPosition", this.SMDoorPosition, SMDoorPositionStates],
        ["DriveElevator", this.SMDriveElevator, SMDriveElevatorStates],
        ["DriveDoor", this.SMDriveDoor, SMDriveDoorStates],
    ];

    let Output = [];
    $.each(StateMachines,(Index, Values) => {
        $.each(Values[2],(Name,State) => {
            if(Values[1] == State)
                Output.push(Values[0]+" : "+Name);
        });
    });

    console.log(Output.join(" || "));
};