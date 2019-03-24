VirtualPSPU.prototype.SetSensorFromUserVariable = function(UserVariable, Value){
    if (UserVariable == 0) {
        var bitstring = "00000000";
        bitstring += Value.toString(2);
        bitstring = bitstring.slice(-8);

        for(i = 0; i<= 8; ++i){
            this.Sensors[12+i] = ('1' == bitstring[i]);
        }
        return this.Sensors;
    }
};

VirtualPSPU.prototype.InsertUserVariables = function(Sensors){
    var bitstring = "00000000";
    bitstring += this.UserVariables[0].toString(2);
    bitstring = bitstring.slice(-8);

    for(i = 0; i< 8; ++i){
        Sensors[12+i] = ('1' == bitstring[i]);
    }
    return Sensors
};

VirtualPSPU.prototype.ResetUserVariables = function(){
    this.SetSensorFromUserVariable(0, 0);
    this.UserVariables[0] = 0;
};

VirtualPSPU.prototype.FSMInitialization0 = function() {
    if (this.Sensors[0] && this.Sensors[1] && this.Sensors[2] && this.Sensors[3]) {
        this.FinishInitialization();
    } else {
        if (this.FSMInitialization_State == "Initial") //Состояние автомата для полного бака
        {
            if (!this.Sensors[3]) {
                this.FSMInitialization_State = "Go up";
                this.Actuators[0] = true;
                this.Actuators[1] = true;
                this.SendActuators();
            }
        }
        if (this.FSMInitialization_State == "Go up") {
            if (this.Sensors[3])
                this.FinishInitialization();
        }
    }
};

VirtualPSPU.prototype.FSMInitialization1 = function() {

    if (this.FSMInitialization_State == "Initial" && !this.Sensors[0] && !this.Sensors[1] && !this.Sensors[2] && !this.Sensors[3]) {
        this.FinishInitialization();
    } else {
        if (this.FSMInitialization_State == "Initial") // Сосотояние для пустого бака
        {
            if (this.Sensors[0]) {
                this.FSMInitialization_State = "Go down";
                this.SetSensorFromUserVariable(0, 255);
                this.UserVariables[0] = 255;

                var DataMessage_7 = new DataMessage();
                DataMessage_7.setActuators(this.Actuators);
                DataMessage_7.setSensors(this.Sensors);
                var Type = ["PSPU"];
                DataMessage_7.setParameterStringArray(Type);
                this.EventHandler.fireDataReceivedEvent(DataMessage_7);
            }
        }
        if (this.FSMInitialization_State == "Go down") {
            if (!this.Sensors[0]) {
                this.SetSensorFromUserVariable(0, 0);
                this.UserVariables[0] = 0;

                this.FinishInitialization();
            }
        }
    }
};

VirtualPSPU.prototype.FSMInitialization2 = function() {

    if (this.FSMInitialization_State == "Initial" && this.Sensors[4] && !this.Sensors[5] && !this.Sensors[6] && !this.Sensors[7] && !this.Sensors[8] && !this.Sensors[9] && !this.Sensors[10] && !this.Sensors[11]) {
        this.FinishInitialization();
    }
    else {
        if (this.FSMInitialization_State == "Initial") // Сосотояние для пустого бака
        {
            if (!(this.Sensors[11])) {

                this.ResetUserVariables();
                this.FSMInitialization_State = "Go up";
                this.Actuators[0] = true;
                this.Actuators[1] = true;
                this.SendActuators();
            }
            else
            {
                this.FSMInitialization_State = "Go down";
                this.SetSensorFromUserVariable(0, 255);
                this.UserVariables[0] = 255;

                var DataMessage_7 = new DataMessage();
                DataMessage_7.setActuators(this.Actuators);
                DataMessage_7.setSensors(this.Sensors);
                var Type = ["PSPU"];
                DataMessage_7.setParameterStringArray(Type);
                this.EventHandler.fireDataReceivedEvent(DataMessage_7);
            }
        }
        else if (this.FSMInitialization_State == "Go up")
        {
            if (this.Sensors[11])
                this.FinishInitialization();
        }
        else if (this.FSMInitialization_State == "Go down")
        {
            if (!this.Sensors[11])
                this.FinishInitialization();
        }

    }
};