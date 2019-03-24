VirtualPSPU.prototype.SetSensorFromUserVariable = function(UserVariable, Value){
    if      (UserVariable == 0)     this.Sensors[9] = ('0' != Value);
};

VirtualPSPU.prototype.InsertUserVariables = function(Sensors){
    if(this.UserVariables[0] != undefined){
         Sensors[9] = (this.UserVariables[0] != '0');
    }   
    return Sensors;
};

VirtualPSPU.prototype.ResetUserVariables = function(){
    this.Sensors[9] = false;
};

VirtualPSPU.prototype.FSMInitialization0 = function() {
    if(this.Sensors[0] == true && this.Sensors[6] == true && this.Sensors[3] == true)
    {
        this.FinishInitialization();
    }
    else
    {
        if(this.FSMInitialization_State == "Initial")
        {
            if(this.Sensors[6] != true){
                this.FSMInitialization_State = "Drive up";
                this.Actuators[4] = true;
                this.SendActuators();
            }
            else
            {
                this.FSMInitialization_State = "Drive right";
                this.Actuators[0] = true;
                this.SendActuators();
            }
        }

        if(this.FSMInitialization_State == "Drive up")
        {
            if(this.Sensors[6] == true)
            {
                this.FSMInitialization_State = "Drive right";
                this.Actuators[4] = false;
                this.Actuators[0] = true;
                this.SendActuators();
            }
        }

        if(this.FSMInitialization_State == "Drive right")
        {
            if(this.Sensors[0] == true)
            {
                this.FSMInitialization_State = "Drive back";
                this.Actuators[0] = false;
                this.Actuators[2] = true;
                this.SendActuators();
            }
        }
        if(this.FSMInitialization_State == "Drive back")
        {
            if(this.Sensors[3] == true)
                this.FinishInitialization();
        }
    }
};

VirtualPSPU.prototype.FSMInitialization1 = function() {
    if(this.Sensors[1] == true && this.Sensors[6] == true && this.Sensors[4] == true)
    {
        this.FinishInitialization();
    }
    else
    {
        if(this.FSMInitialization_State == "Initial")
        {
            if(this.Sensors[6] != true){
                this.FSMInitialization_State = "Drive up";
                this.Actuators[4] = true;
                this.SendActuators();
            }
            else
            {
                this.FSMInitialization_State = "Drive left";
                this.Actuators[1] = true;
                this.SendActuators();
            }
        }

        if(this.FSMInitialization_State == "Drive up") {
            if (this.Sensors[6] == true) {
                this.FSMInitialization_State = "Drive left";
                this.Actuators[4] = false;
                this.Actuators[1] = true;
                this.SendActuators();
            }
        }

        if(this.FSMInitialization_State == "Drive left")
        {
            if(this.Sensors[1] == true)
            {
                this.FSMInitialization_State = "Drive front";
                this.Actuators[1] = false;
                this.Actuators[3] = true;
                this.SendActuators();
            }
        }

        if(this.FSMInitialization_State == "Drive front")
        {
            if(this.Sensors[4] == true)
                this.FinishInitialization();
        }
    }
};

VirtualPSPU.prototype.FSMInitialization2 = function() {};