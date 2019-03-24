const SMPumps = {
    Idle                                : 0,
    Pump1                               : 1,
    Pump2                               : 2,
    AllPumps                            : 3,
};

ManualControl.prototype.BuildUserControlPanelContent = function() {
    this.SMPumps = SMPumps.Idle;

    this.MCObject_AllPumpsOn = new ManualControlObject(Snap("#AllPumpsOn"), "a",
        ()=>{
            this.SMPumps = SMPumps.AllPumps;
        },()=>{
            this.SMPumps = SMPumps.Idle;
        }
    );
    $("#AllPumpsOnText").css("pointer-events", "none");
    this.MCObject_AllPumpsOn.SetAttributes({class:"str0"});
    this.ControlElements.push(this.MCObject_AllPumpsOn);

    this.MCObject_Pump1 = new ManualControlObject(Snap("#Pump1"), "1",
        ()=>{
            this.SMPumps = SMPumps.Pump1;
        },()=>{
            this.SMPumps = SMPumps.Idle;
        }
    );
    $("#Pump1Text").css("pointer-events", "none");
    this.MCObject_Pump1.SetAttributes({class:"str0"});
    this.ControlElements.push(this.MCObject_Pump1);

    this.MCObject_Pump2 = new ManualControlObject(Snap("#Pump2"), "2",
        ()=>{
            this.SMPumps = SMPumps.Pump2;
        },()=>{
            this.SMPumps = SMPumps.Idle;
        }
    );
    $("#Pump2Text").css("pointer-events", "none");
    this.MCObject_Pump2.SetAttributes({class:"str0"});
    this.ControlElements.push(this.MCObject_Pump2);

    this.DisableAllControls();
};

ManualControl.prototype.RefreshSMPumps = function(){
    if(this.Sensors[3])
        this.SMPumps = SMPumps.Idle;

    switch(this.SMPumps){
        case SMPumps.Idle:
            this.MCObject_AllPumpsOn.SetEnabled();
            this.MCObject_Pump1.SetEnabled();
            this.MCObject_Pump2.SetEnabled();
            break;
        case SMPumps.Pump1:
            this.MCObject_AllPumpsOn.SetEnabled();
            this.MCObject_Pump1.SetActive();
            this.MCObject_Pump2.SetEnabled();
            break;
        case SMPumps.Pump2:
            this.MCObject_AllPumpsOn.SetEnabled();
            this.MCObject_Pump1.SetEnabled();
            this.MCObject_Pump2.SetActive();
            break;
        case SMPumps.AllPumps:
            this.MCObject_AllPumpsOn.SetActive();
            this.MCObject_Pump1.SetEnabled();
            this.MCObject_Pump2.SetEnabled();
            break;
    }
};

ManualControl.prototype.Refresh = function(){
    this.RefreshSMPumps();

    let ActuatorChanges = [];

    // SMElevatorPositionActuators
    if(this.SMPumps == SMPumps.AllPumps && (!this.Actuators[0] || !this.Actuators[1])){
        ActuatorChanges.push([0, true]);
        ActuatorChanges.push([1, true]);
    }

    if(this.SMPumps == SMPumps.Pump1 && !this.Actuators[0]){
        ActuatorChanges.push([0, true]);
    }

    if(this.SMPumps == SMPumps.Pump2 && !this.Actuators[1]){
        ActuatorChanges.push([1, true]);
    }

    if(this.SMPumps == SMPumps.Idle && (this.Actuators[0] || this.Actuators[1])){
        ActuatorChanges.push([0, false]);
        ActuatorChanges.push([1, false]);
    }

    if(ActuatorChanges.length != 0)
        this.SendActuators(ActuatorChanges);

    this.DebugStateMachineStates();
};

ManualControl.prototype.DebugStateMachineStates = function(){
    let StateMachines = [
        ["Pumps", this.SMPumps, SMPumps],
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