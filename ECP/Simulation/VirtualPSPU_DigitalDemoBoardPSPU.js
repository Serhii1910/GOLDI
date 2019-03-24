function VirtualPSPU(EventHandler, SettingsParameter) 
{
    var Actuators = new Array(128);
    var ActuatorMask = new Array(128);
    var Sensors = new Array(128);
    var UserVariables = new Array(26);
    
    var SingleStepSensorsArray = new Array(128);
    var SingleStepActuatorsArray = new Array(128);
    var SingleStepSensorsRunning = false;
    var SingleStepSensorsCaptured = false;
    var SingleStepActuatorsRunning = false;
    var SingleStepActuatorsCaptured = false;
    
    var BreakpointsArraySensors = [];    // true, false
    var BreakpointsArrayActuators = [];  // true, false
    var BreakpointsEnabled = false;
    
    var ErrorNumbersFirstTime = [];
    var ErrorNumbersSecondTime = [];
    var InitializationInProgress = false;
    var ExperimentRunning = false;

    
    RemoveAllBreakpoints();
    
    VirtualPSPU.prototype.onCommand = function (Command) 
    {
        if (Command.getSender() != "ServerInterface") 
        {
            if (Command.getType() == EnumCommand.Initialize) 
            {
                InitializeDevice(Command.getParameterStringArray()[0]);
            }
            else if (Command.getType() == EnumCommand.AddBreakpoint)
            {
                if (Command.getParameterStringArray()[0] == "Sensor")
                {
                    if (Command.getParameterStringArray()[1] == "One" || Command.getParameterStringArray()[1] == "1")
                        BreakpointsArraySensors.push([Command.getParameterStringArray()[2], true]);
                    else if (Command.getParameterStringArray()[1] == "Zero" || Command.getParameterStringArray()[1] == "0") 
                        BreakpointsArraySensors.push([Command.getParameterStringArray()[2], false]);
                }
                else if (Command.getParameterStringArray()[0] == "Actuator")
                {
                    if (Command.getParameterStringArray()[1] == "One" || Command.getParameterStringArray()[1] == "1")
                        BreakpointsArrayActuators.push([Command.getParameterStringArray()[2], true]);
                    else if (Command.getParameterStringArray()[1] == "Zero" || Command.getParameterStringArray()[1] == "0") 
                        BreakpointsArrayActuators.push([Command.getParameterStringArray()[2], false]);
                }
            }
            else if (Command.getType() == EnumCommand.RemoveAllBreakpoints)
            {
                RemoveAllBreakpoints();
            }
            else if (Command.getType() == EnumCommand.BreakpointEnable)
            {
                BreakpointsEnabled = true;
            }
            else if (Command.getType() == EnumCommand.BreakpointDisable)
            {
                BreakpointsEnabled = false;
            }
            if (Command.getType() == EnumCommand.PSPUSingleStepSensor) 
            {
                InitializationInProgress = false;
                ExperimentRunning = false;
                ResetUserVariables();
                ErrorNumbersFirstTime = [];
                ErrorNumbersFirstTime = IsDeviceInErrorState(Actuators, Sensors);
                if(ErrorNumbersFirstTime.length != 0)
                {
                    for(var i = 0; i < ErrorNumbersFirstTime.length; i++)
                    {
                        var Message = new CommandMessage();
                        
                        Message.setType(EnumCommand.PSPUErrorCode);
                        Message.setSender("ServerInterface");
                        Message.setParameterStringArray([(ErrorNumbersFirstTime[i]+1).toString(),"ControlException","0"]);

                        EventHandler.fireCommandEvent(Message);
                    }
                    SendPSPUStop();
                    StopAllActuators();
                }
                else
                {
                    SingleStepSensorsRunning = true;
                    var DataMessage_1 = new DataMessage();
                    DataMessage_1.setActuators(Actuators);
                    var Type = [];
                    Type = ["PSPU"];
                    DataMessage_1.setParameterStringArray(Type);
                    EventHandler.fireDataReceivedEvent(DataMessage_1);
                }
            }
            if (Command.getType() == EnumCommand.PSPUSingleStepActuator) 
            {
                InitializationInProgress = false;
                ExperimentRunning = false;
                ResetUserVariables();
                ErrorNumbersFirstTime = [];
                ErrorNumbersFirstTime = IsDeviceInErrorState(Actuators, Sensors);
                if(ErrorNumbersFirstTime.length != 0)
                {
                    for(var i = 0; i < ErrorNumbersFirstTime.length; i++)
                    {
                        var Message = new CommandMessage();
                        
                        Message.setType(EnumCommand.PSPUErrorCode);
                        Message.setSender("ServerInterface");
                        Message.setParameterStringArray([(ErrorNumbersFirstTime[i]+1).toString(),"ControlException","0"]);

                        EventHandler.fireCommandEvent(Message);
                    }
                    SendPSPUStop();
                    StopAllActuators();
                }
                else
                {
                    SingleStepActuatorsRunning = true;
                    var DataMessage_2 = new DataMessage();
                    DataMessage_2.setActuators(Actuators);
                    var Type = [];
                    Type = ["PSPU"];
                    DataMessage_2.setParameterStringArray(Type);
                    EventHandler.fireDataReceivedEvent(DataMessage_2);
                }
            }
            if (Command.getType() == EnumCommand.SetUserVariable) 
            {
                var SendSensors = false;
                    if(Command.getParameterStringArray()[0] == EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0 || Command.getParameterStringArray()[0] == EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1) {

                        //Calculate new Sensor Values
                        let HexValue = Command.getParameterStringArray()[1];
                        let Bitstring = (HexValue).toString(2);
                        let Pad = "0000";
                        let PaddedBitString = Pad.substring(0, Pad.length - Bitstring.length) + Bitstring;


                        if(Command.getParameterStringArray()[0] == EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0){

                            //Set for Hex0
                            SetSensorFromUserVariable(16, PaddedBitString[3] == 1 ? false : true );
                            UserVariables[16] = PaddedBitString[3] == 1 ? false : true;

                            SetSensorFromUserVariable(17,PaddedBitString[2] == 1 ? false : true);
                            UserVariables[17] = PaddedBitString[2] == 1 ? false : true;

                            SetSensorFromUserVariable(18,PaddedBitString[1] == 1 ? false : true);
                            UserVariables[18] = PaddedBitString[1] == 1 ? false : true;

                            SetSensorFromUserVariable(19,PaddedBitString[0] == 1 ? false : true);
                            UserVariables[19] = PaddedBitString[0] == 1 ? false : true;
                        }
                        else{
                            //Set for Hex1
                            SetSensorFromUserVariable(20, PaddedBitString[3] == 1 ? false : true );
                            UserVariables[20] = PaddedBitString[3] == 1 ? false : true;

                            SetSensorFromUserVariable(21,PaddedBitString[2] == 1 ? false : true);
                            UserVariables[21] = PaddedBitString[2] == 1 ? false : true;

                            SetSensorFromUserVariable(22,PaddedBitString[1] == 1 ? false : true);
                            UserVariables[22] = PaddedBitString[1] == 1 ? false : true;

                            SetSensorFromUserVariable(23,PaddedBitString[0] == 1 ? false : true);
                            UserVariables[23] = PaddedBitString[0] == 1 ? false : true;
                        }

                        SendSensors = true;
                    }
                    else
                    {
                        if(Command.getParameterStringArray()[1] == "1")
                        {
                            if(UserVariables[parseInt(Command.getParameterStringArray()[0])] == false || UserVariables[parseInt(Command.getParameterStringArray()[0])] == undefined)
                            {
                                SetSensorFromUserVariable([parseInt(Command.getParameterStringArray()[0])],true);
                                UserVariables[parseInt(Command.getParameterStringArray()[0])] = true;
                                SendSensors = true;
                            }
                        }
                        else
                        {
                            if(UserVariables[parseInt(Command.getParameterStringArray()[0])] == true || UserVariables[parseInt(Command.getParameterStringArray()[0])] == undefined)
                            {
                                SetSensorFromUserVariable([parseInt(Command.getParameterStringArray()[0])],false);
                                UserVariables[parseInt(Command.getParameterStringArray()[0])] = false;
                                SendSensors = true;
                            }
                        }
                    }

                    if(SendSensors)
                    {
                        var DataMessage_3 = new DataMessage();
                        var Type = [];
                        Type = ["PSPU"];
                        if(!ExperimentRunning){
                            DataMessage_3.setActuators(ActuatorMask);
                        }
                        else
                        {
                            DataMessage_3.setActuators(Actuators);
                        }
                        DataMessage_3.setParameterStringArray(Type);
                        DataMessage_3.setSensors(Sensors);
                        EventHandler.fireDataReceivedEvent(DataMessage_3);
                        EventHandler.fireDataSendEvent(DataMessage_3);
                    }
            }
            else if (Command.getType() == EnumCommand.PSPUStop) 
            {
                ExperimentRunning = false;
                SingleStepActuatorsRunning = false;
                SingleStepSensorsRunning = false;
                StopAllActuators();
            }
            else if (Command.getType() == EnumCommand.PSPURun) 
            {
                ResetUserVariables();
                Sensors = InsertUserVariables(Sensors);
                ExperimentRunning = true;

                var DataMessage_4 = new DataMessage();
                DataMessage_4.setActuators(Actuators);
                DataMessage_4.setSensors(Sensors);
                var Type = [];
                Type = ["PSPU"];
                DataMessage_4.setParameterStringArray(Type);
                EventHandler.fireDataReceivedEvent(DataMessage_4);
                EventHandler.fireDataSendEvent(DataMessage_4);
            }
        }
    };
    function SetSensorFromUserVariable(UserVariable, Value)
    {
        Sensors[UserVariable] = Value;
    }

	//This function will set the User Variables in the Sensor Array to their set value by the Control Message
	function InsertUserVariables(Sensors){
		for(var i = 0; i < UserVariables.length;i++)
		{
            Sensors[i] = !!UserVariables[i];
        }

		return Sensors
	}
    
    VirtualPSPU.prototype.onData = function (DataArg) 
    {

        if(DataArg.getParameterStringArray()[0] == "PSPU") return;
            
        var Data = DataArg;
            
        if(Data.getSensors()[0] != undefined && DataArg.getParameterStringArray()[0] == "SIM")
        {
            Sensors = InsertUserVariables(Data.getSensors());
			
        }
        //else return;
        
        if(Data.getActuators()[0] != undefined)
        {
            Actuators = Data.getActuators();
        }


        
        // Protection

        
        if(BreakpointsEnabled)
        {
            // Check for breakpoint combination
            
            var BreakpointIsReached = true;
            
            // Sensors
            for (var i = 0; i < BreakpointsArraySensors.length; i++)
            {
                if(BreakpointsArraySensors[i][1] != Sensors[BreakpointsArraySensors[i][0]])
                    BreakpointIsReached = false;
            }
            
            // Actuators
            for (var i = 0; i < BreakpointsArrayActuators.length; i++)
            {
                if(BreakpointsArrayActuators[i][1] != Actuators[BreakpointsArrayActuators[i][0]])
                    BreakpointIsReached = false;
            }
            
            if(BreakpointIsReached)
            {
                StopAllActuators();
                SendPSPUStop();
                    
                var Message = new CommandMessage();
                Message.setType(EnumCommand.PSPUReachedBreakpoint);
                Message.setSender("ServerInterface");

                EventHandler.fireCommandEvent(Message);
                
                BreakpointIsReached = false;
                return;
            }
        }
        
        if(SingleStepSensorsRunning)
        {
            if(!SingleStepSensorsCaptured)
            {
                SingleStepSensorsArray = Sensors;
                SingleStepSensorsCaptured = true;
            }
            else if(SensorsHaveChangedSingleStep(Sensors))
            {
                StopAllActuators();
                SendPSPUStop();
                    
                var Message = new CommandMessage();
                Message.setType(EnumCommand.PSPUReachedSingleStepSensor);
                Message.setSender("ServerInterface");

                EventHandler.fireCommandEvent(Message);
                
                SingleStepSensorsRunning = false;
                SingleStepSensorsCaptured = false;
                return;
            }
        }
        else if(SingleStepActuatorsRunning)
        {
            if(!SingleStepActuatorsCaptured)
            {
                SingleStepActuatorsArray = Actuators;
                SingleStepActuatorsCaptured = true;
            }
            else if(ActuatorsHaveChangedSingleStep(Actuators))
            {
                StopAllActuators();
                SendPSPUStop();
                    
                var Message = new CommandMessage();
                Message.setType(EnumCommand.PSPUReachedSingleStepActuator);
                Message.setSender("ServerInterface");

                EventHandler.fireCommandEvent(Message);
                
                SingleStepActuatorsRunning = false;
                SingleStepActuatorsCaptured = false;
                return;
            }
        }


        var ParameterString = Data.getParameterStringArray()[0];
        var DataMessage_5 = new DataMessage();
        DataMessage_5.setActuators(Actuators);
        DataMessage_5.setSensors(Sensors);

        
        var Type = [];
        if (ParameterString == "BPU") Type = ["PSPU"];
        else if (ParameterString == "SIM")
        {
            Type = ["PSPU"];
            DataMessage_5.setParameterStringArray(Type);
            EventHandler.fireDataSendEvent(DataMessage_5);
            EventHandler.fireDataReceivedEvent(DataMessage_5);
            return;
        }

        if(!ExperimentRunning)
        {
            DataMessage_5.setActuators(ActuatorMask);
        }

        DataMessage_5.setParameterStringArray(Type);
        
        EventHandler.fireDataReceivedEvent(DataMessage_5);
    };
    function RemoveAllBreakpoints()
    {
        /*for (var i = 0; i < BreakpointsArraySensors.length; i++)
        {
            BreakpointsArraySensors[i] = "DC";
        }
        
        for (var i = 0; i < BreakpointsArrayActuators.length; i++)
        {
            BreakpointsArrayActuators[i] = "DC";
        }*/
        
        BreakpointsArrayActuators = [];
        BreakpointsArraySensors = [];
    }

    // Resets all user variables
    function ResetUserVariables()
    {
        for(var i = 0; i < Sensors.length; i++)
        {
            Sensors[i] = false;
        }
        Sensors[16] = true;
        Sensors[17] = true;
        Sensors[18] = true;
        Sensors[19] = true;
        Sensors[20] = true;
        Sensors[21] = true;
        Sensors[22] = true;
        Sensors[23] = true;

        for(var i = 0; i < UserVariables.length; i++)
        {
            UserVariables[i] = false;
        }
        UserVariables[16] = true;
        UserVariables[17] = true;
        UserVariables[18] = true;
        UserVariables[19] = true;
        UserVariables[20] = true;
        UserVariables[21] = true;
        UserVariables[22] = true;
        UserVariables[23] = true;
    }
    
    function StopAllActuators()
    {


            var DataMessage_6 = new DataMessage();
            DataMessage_6.setActuators(ActuatorMask);
            DataMessage_6.setSensors(Sensors);
            DataMessage_6.Parameter = null;
            var Type = [];
            Type = ["PSPU"];
            
            DataMessage_6.setParameterStringArray(Type);
            EventHandler.fireDataReceivedEvent(DataMessage_6);

    }
    
    function SendPSPUStop()
    {
        ExperimentRunning = false;
        var Message = new CommandMessage();
        Message.setType(EnumCommand.PSPUStop);
        Message.setSender("ServerInterface");

        EventHandler.fireCommandEvent(Message);
    }
    
    function SendActuators()
    {
        var DataMessage_7 = new DataMessage();
        DataMessage_7.setActuators(Actuators);
        DataMessage_7.setSensors(Sensors);
        var Type = [];
        Type = ["PSPU"];
        DataMessage_7.setParameterStringArray(Type);
        EventHandler.fireDataReceivedEvent(DataMessage_7);
    }

    function SensorsHaveChangedSingleStep(Sensors) 
    {
        if(Sensors != undefined)
        {
            for (var i = 0; i < Sensors.length; i++) 
            {
                if (SingleStepSensorsArray[i] != Sensors[i]) 
                {
                    return true;
                }
            }
        }
        return false;
    }
    
    function ActuatorsHaveChangedSingleStep(Actuators) 
    {
        if(Actuators != undefined)
        {
            for (var i = 0; i < Actuators.length; i++) 
            {
                if (SingleStepActuatorsArray[i] != Actuators[i]) 
                {
                    return true;
                }
            }
        }
        return false;
    }


    for (var i = 0; i < 128; i++)
    {
        ActuatorMask[i] = false;
    }


    var Message = new CommandMessage();
    Message.setType(EnumCommand.Acknowledge);
    Message.setSender("ServerInterface");
    EventHandler.fireCommandEvent(Message);
    ResetUserVariables();
    StopAllActuators();

}