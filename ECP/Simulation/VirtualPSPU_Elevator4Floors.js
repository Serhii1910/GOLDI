VirtualPSPU.prototype.SetSensorFromUserVariable = function(UserVariable, Value){
    if      (UserVariable == 0)     this.Sensors[13] = ('0' != Value);
    else if (UserVariable == 1)     this.Sensors[14] = ('0' != Value);
    else if (UserVariable == 2)     this.Sensors[15] = ('0' != Value);
    else if (UserVariable == 3)     this.Sensors[16] = ('0' != Value);
    else if (UserVariable == 4)     this.Sensors[17] = ('0' != Value);
    else if (UserVariable == 5)     this.Sensors[18] = ('0' != Value);
    else if (UserVariable == 6)     this.Sensors[19] = ('0' != Value);
    else if (UserVariable == 7)     this.Sensors[20] = ('0' != Value);
    else if (UserVariable == 8)     this.Sensors[21] = ('0' != Value);
    else if (UserVariable == 9)     this.Sensors[22] = ('0' != Value);
    else if (UserVariable == 10)    this.Sensors[23] = ('0' != Value);
    else if (UserVariable == 11)    this.Sensors[24] = ('0' != Value);
    else if (UserVariable == 12)    this.Sensors[25] = ('0' != Value);
    else if (UserVariable == 13)    this.Sensors[31] = ('0' != Value);
    else if (UserVariable == 14)    this.Sensors[32] = ('0' != Value);
    else if (UserVariable == 15)    this.Sensors[33] = ('0' != Value);
    else if (UserVariable == 16)    this.Sensors[34] = ('0' != Value);
};

VirtualPSPU.prototype.InsertUserVariables = function(Sensors){
    if(this.UserVariables[0] != undefined){
        Sensors[13] = (this.UserVariables[0] != '0');
        Sensors[14] = (this.UserVariables[1] != '0');
        Sensors[15] = (this.UserVariables[2] != '0');
        Sensors[16] = (this.UserVariables[3] != '0');
        Sensors[17] = (this.UserVariables[4] != '0');
        Sensors[18] = (this.UserVariables[5] != '0');
        Sensors[19] = (this.UserVariables[6] != '0');
        Sensors[20] = (this.UserVariables[7] != '0');
        Sensors[21] = (this.UserVariables[8] != '0');
        Sensors[22] = (this.UserVariables[9] != '0');
        Sensors[23] = (this.UserVariables[10] != '0');
        Sensors[24] = (this.UserVariables[11] != '0');
        Sensors[25] = (this.UserVariables[12] != '0');
        Sensors[31] = (this.UserVariables[13] != '0');
        Sensors[32] = (this.UserVariables[14] != '0');
        Sensors[33] = (this.UserVariables[15] != '0');
        Sensors[34] = (this.UserVariables[16] != '0');
    }

    return Sensors;
};

VirtualPSPU.prototype.ResetUserVariables = function(){
    this.Sensors[13] = false;
    this.Sensors[14] = false;
    this.Sensors[15] = false;
    this.Sensors[16] = false;
    this.Sensors[17] = false;
    this.Sensors[18] = false;
    this.Sensors[19] = false;
    this.Sensors[20] = false;
    this.Sensors[21] = false;
    this.Sensors[22] = false;
    this.Sensors[23] = false;
    this.Sensors[24] = false;
    this.Sensors[25] = false;
    this.Sensors[31] = false;
    this.Sensors[32] = false;
    this.Sensors[33] = false;
    this.Sensors[34] = false;

    this.UserVariables[ 0] = false;
    this.UserVariables[ 1] = false;
    this.UserVariables[ 2] = false;
    this.UserVariables[ 3] = false;
    this.UserVariables[ 4] = false;
    this.UserVariables[ 5] = false;
    this.UserVariables[ 6] = false;
    this.UserVariables[ 7] = false;
    this.UserVariables[ 8] = false;
    this.UserVariables[ 9] = false;
    this.UserVariables[10] = false;
    this.UserVariables[11] = false;
    this.UserVariables[12] = false;
    this.UserVariables[13] = false;
    this.UserVariables[14] = false;
    this.UserVariables[15] = false;
    this.UserVariables[16] = false;
};

VirtualPSPU.prototype.FSMInitialization0 = function() {
    if (this.Sensors[0] == true && this.Sensors[8] == true && this.Sensors[10] == true && this.Sensors[12] == true && this.Sensors[30] == true)
    {
        this.FinishInitialization();
    }
    else
    {
        switch(this.FSMInitialization_State)
        {
            case "Initial":
                if(!this.Sensors[30])
                {
                    this.FSMInitialization_State = "CloseDoor4"
                }
                else if(!this.Sensors[12])
                {
                    this.FSMInitialization_State = "CloseDoor3"
                }
                else if(!this.Sensors[10])
                {
                    this.FSMInitialization_State = "CloseDoor2"
                }
                else if(!this.Sensors[8])
                {
                    this.FSMInitialization_State = "CloseDoor1"
                }
                else if(!this.Sensors[0])
                {
                    this.FSMInitialization_State = "GoToFloor1"
                }
                break;
            case "CloseDoor4":
                if(!this.Sensors[30]){
                    this.FSMInitialization_State = "CloseDoor4"
                }
                else if(!this.Sensors[12])
                {
                    this.FSMInitialization_State = "CloseDoor3"
                }
                else if(!this.Sensors[10])
                {
                    this.FSMInitialization_State = "CloseDoor2"
                }
                else if(!this.Sensors[8])
                {
                    this.FSMInitialization_State = "CloseDoor1"
                }
                else if(!this.Sensors[0])
                {
                    this.FSMInitialization_State = "GoToFloor1"
                }
                break;
            case "CloseDoor3":
                if(!this.Sensors[12])
                {
                    this.FSMInitialization_State = "CloseDoor3"
                }
                else if(!this.Sensors[10])
                {
                    this.FSMInitialization_State = "CloseDoor2"
                }
                else if(!this.Sensors[8])
                {
                    this.FSMInitialization_State = "CloseDoor1"
                }
                else if(!this.Sensors[0])
                {
                    this.FSMInitialization_State = "GoToFloor1"
                }
                break;
            case "CloseDoor2":
                if(!this.Sensors[10])
                {
                    this.FSMInitialization_State = "CloseDoor2"
                }
                else if(!this.Sensors[8])
                {
                    this.FSMInitialization_State = "CloseDoor1"
                }
                else if(!this.Sensors[0])
                {
                    this.FSMInitialization_State = "GoToFloor1"
                }
                break;
            case "CloseDoor1":
                if(!this.Sensors[8])
                {
                    this.FSMInitialization_State = "CloseDoor1"
                }
                else if(!this.Sensors[0])
                {
                    this.FSMInitialization_State = "GoToFloor1"
                }
                break;
        }

        //Set outputs
        switch(this.FSMInitialization_State)
        {
            case "Initial":
                this.Actuators[1] = false;
                this.Actuators[4] = false;
                this.Actuators[6] = false;
                this.Actuators[8] = false;
                this.Actuators[25] = false;
                break;
            case "CloseDoor4":
                this.Actuators[1] = false;
                this.Actuators[4] = false;
                this.Actuators[6] = false;
                this.Actuators[8] = false;
                this.Actuators[25] = true;
                break;
            case "CloseDoor3":
                this.Actuators[1] = false;
                this.Actuators[4] = false;
                this.Actuators[6] = false;
                this.Actuators[8] = true;
                this.Actuators[25] = false;
                break;
            case "CloseDoor2":
                this.Actuators[1] = false;
                this.Actuators[4] = false;
                this.Actuators[6] = true;
                this.Actuators[8] = false;
                this.Actuators[25] = false;
                break;
            case "CloseDoor1":
                this.Actuators[1] = false;
                this.Actuators[4] = true;
                this.Actuators[6] = false;
                this.Actuators[8] = false;
                this.Actuators[25] = false;
                break;
            case "GoToFloor1":
                this.Actuators[1] = true;
                this.Actuators[4] = false;
                this.Actuators[6] = false;
                this.Actuators[8] = false;
                this.Actuators[25] = false;
                break;
        }
        this.SendActuators();
    }
};

VirtualPSPU.prototype.FSMInitialization1 = function() {
    if (this.Sensors[1] && this.Sensors[9] && this.Sensors[8] && this.Sensors[12] && this.Sensors[30])
    {
        this.FinishInitialization();
    }
    else
    {
        this.Actuators[ 0] = false; // Drive upwards
        this.Actuators[ 1] = false; // Drive downwards
        this.Actuators[ 4] = false; // Close door 1
        this.Actuators[ 6] = false; // Close door 2
        this.Actuators[ 8] = false; // Close door 3
        this.Actuators[25] = false; // Close door 4
        this.Actuators[ 5] = false; // Open door 2


        if (this.FSMInitialization_State == "Initial")
        {
            this.FSMInitialization_State = "Close door 1";
        }
        if (this.FSMInitialization_State == "Close door 1")
        {
            if (this.Sensors[8])
            {
                this.FSMInitialization_State = "Close door 2";
            }
            else
            {
                this.Actuators[ 4] = true; // Close door 1
            }
        }
        if (this.FSMInitialization_State == "Close door 2")
        {
            if (this.Sensors[10])
            {
                this.FSMInitialization_State = "Close door 3";
            }
            else
            {
                this.Actuators[ 6] = true; // Close door 2
            }
        }
        if (this.FSMInitialization_State == "Close door 3")
        {
            if (this.Sensors[12])
            {
                this.FSMInitialization_State = "Close door 4";
            }
            else
            {
                this.Actuators[ 8] = true; // Close door 3
            }
        }
        if (this.FSMInitialization_State == "Close door 4")
        {
            if (this.Sensors[30])
            {
                this.FSMInitialization_State = "Drive to 1";
            }
            else
            {
                this.Actuators[25] = true; // Close door 4
            }
        }
        if (this.FSMInitialization_State == "Drive to 1")
        {
            if (this.Sensors[0])
            {
                this.FSMInitialization_State = "Drive to 2";
            }
            else
            {
                this.Actuators[1] = true; // Drive downwards
            }
        }
        if (this.FSMInitialization_State == "Drive to 2")
        {
            if (this.Sensors[1])
            {
                this.FSMInitialization_State = "Open door 2";
            }
            else
            {
                this.Actuators[ 0] = true; // Drive upwards
            }
        }
        if (this.FSMInitialization_State == "Open door 2")
        {
            if (this.Sensors[9])
            {
                //Ready
            }
            else
            {
                this.Actuators[ 5] = true; // Open door 2
            }
        }

        this.SendActuators();
    }
};

VirtualPSPU.prototype.FSMInitialization2 = function() {};