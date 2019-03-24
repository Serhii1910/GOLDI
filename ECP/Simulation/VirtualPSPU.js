function Observer(SensorEnterNunmber, SensorLeaveNumber) {
    let States = {
        Inactive                    : 0,
        WaitForLeavingStableState   : 1,
        ObserverActive              : 2,
    } ;

    let SensorEnter = SensorEnterNunmber;
    let SensorLeave = SensorLeaveNumber;
    let CurrentState = States.Inactive;

    this.DoStep = function(Sensors){
        switch(CurrentState){
            case States.Inactive:
                if(Sensors[SensorEnter] == '1')
                    CurrentState = States.WaitForLeavingStableState;
                break;
            case States.WaitForLeavingStableState:
                if(Sensors[SensorEnter] == '0')
                    CurrentState = States.ObserverActive;
                break;
            case States.ObserverActive:
                if(Sensors[SensorLeave] == '1')
                    CurrentState = States.Inactive;
                break;
        }
    };

    this.SensorObserver = function(){
        return CurrentState == States.ObserverActive;
    };
}

function VirtualPSPU(EventHandler, SettingsParameter) {
    this.EventHandler = EventHandler;
    this.SettingsParameter = SettingsParameter;

    this.Actuators = new Array(128);
    this.Sensors = new Array(128);

    for (i = 0; i < 128; i++){
        this.Sensors[i] = false;
        this.Actuators[i] = false;
    }

    this.ObserverList = [];
    this.Observer = [];

    this.UserVariables = new Array(17);
    this.InitializationInProgress = false;
    this.FSMInitialization_State = "Initial";

    var ActuatorMask = new Array(128);

    var SingleStepSensorsArray = new Array(128);
    var SingleStepActuatorsArray = new Array(128);
    var SingleStepSensorsRunning = false;
    var SingleStepSensorsCaptured = false;
    var SingleStepActuatorsRunning = false;
    var SingleStepActuatorsCaptured = false;

    var BreakpointsArraySensors = [];    // true, false
    var BreakpointsArrayActuators = [];  // true, false
    var BreakpointsEnabled = false;

    var ExperimentRunning = false;
    var ProtectionTimeOut = 10000;

    var OngoingInitializationNumber = undefined;
    var Protection = "test";
    var ProtectionURL = "index.php?Function=ProtectionGetCode&PSPUType="+ this.SettingsParameter.ECPPhysicalSystemName +"&Language=JS";

    var Message;
    var Type;
    var i;

    $.get(ProtectionURL,function(data) {
        Protection = data;
    });

    this.onCommand = function (Command){
        if (Command.getSender() != "ServerInterface")
        {
            if (Command.getType() == EnumCommand.Initialize)
            {
                this.InitializeDevice(Command.getParameterStringArray()[0]);
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
                this.RemoveAllBreakpoints();
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
                this.InitializationInProgress = false;
                ExperimentRunning = false;
                this.ResetUserVariables();
                ErrorNumbersFirstTime = this.IsDeviceInErrorState(this.Actuators, this.Sensors);
                if(ErrorNumbersFirstTime.length != 0)
                {
                    for(i = 0; i < ErrorNumbersFirstTime.length; i++)
                    {
                        Message = new CommandMessage();

                        Message.setType(EnumCommand.PSPUErrorCode);
                        Message.setSender("ServerInterface");
                        Message.setParameterStringArray([(ErrorNumbersFirstTime[i]+1).toString(),"ControlException","0"]);

                        this.EventHandler.fireCommandEvent(Message);
                    }
                    this.SendPSPUStop();
                    this.StopAllActuators();
                }
                else
                {
                    SingleStepSensorsRunning = true;
                    var DataMessage_1 = new DataMessage();
                    DataMessage_1.setActuators(this.Actuators);

                    Type = ["PSPU"];
                    DataMessage_1.setParameterStringArray(Type);
                    this.EventHandler.fireDataReceivedEvent(DataMessage_1);
                }
            }
            if (Command.getType() == EnumCommand.PSPUSingleStepActuator)
            {
                this.InitializationInProgress = false;
                ExperimentRunning = false;
                this.ResetUserVariables();
                ErrorNumbersFirstTime = this.IsDeviceInErrorState(this.Actuators, this.Sensors);
                if(ErrorNumbersFirstTime.length != 0)
                {
                    for(i = 0; i < ErrorNumbersFirstTime.length; i++)
                    {
                        Message = new CommandMessage();

                        Message.setType(EnumCommand.PSPUErrorCode);
                        Message.setSender("ServerInterface");
                        Message.setParameterStringArray([(ErrorNumbersFirstTime[i]+1).toString(),"ControlException","0"]);

                        this.EventHandler.fireCommandEvent(Message);
                    }
                    this.SendPSPUStop();
                    this.StopAllActuators();
                }
                else
                {
                    SingleStepActuatorsRunning = true;
                    var DataMessage_2 = new DataMessage();
                    DataMessage_2.setActuators(this.Actuators);

                    Type = ["PSPU"];
                    DataMessage_2.setParameterStringArray(Type);
                    this.EventHandler.fireDataReceivedEvent(DataMessage_2);
                }
            }
            if (Command.getType() == EnumCommand.SetUserVariable)
            {
                var SendSensors = false;

                if(Command.getParameterStringArray()[1] != undefined)
                {
                    if(this.UserVariables[parseInt(Command.getParameterStringArray()[0])] !=  Command.getParameterStringArray()[1] || this.UserVariables[parseInt(Command.getParameterStringArray()[0])] == undefined)
                    {
                        this.SetSensorFromUserVariable([parseInt(Command.getParameterStringArray()[0])],Command.getParameterStringArray()[1]);
                        this.UserVariables[parseInt(Command.getParameterStringArray()[0])] = Command.getParameterStringArray()[1];
                        SendSensors = true;
                    }
                }
                if(SendSensors)
                {
                    var DataMessage_3 = new DataMessage();
                    Type = ["PSPU"];
                    if(!ExperimentRunning){
                        DataMessage_3.setActuators(ActuatorMask);
                    }
                    else
                    {
                        DataMessage_3.setActuators(this.Actuators);
                    }
                    DataMessage_3.setParameterStringArray(Type);
                    DataMessage_3.setSensors(this.Sensors);

                    this.EventHandler.fireDataReceivedEvent(DataMessage_3);
                    this.EventHandler.fireDataSendEvent(DataMessage_3);
                }

            }
            else if (Command.getType() == EnumCommand.PSPUStop)
            {
                ExperimentRunning = false;
                this.InitializationInProgress = false;
                SingleStepActuatorsRunning = false;
                SingleStepSensorsRunning = false;
                this.FSMInitialization_State = "Initial";
                this.StopAllActuators();
            }
            else if (Command.getType() == EnumCommand.PSPURun)
            {
                this.InitializationInProgress = false;
                this.ResetUserVariables();
                ErrorNumbersFirstTime = this.IsDeviceInErrorState(this.Actuators, this.Sensors);
                if(ErrorNumbersFirstTime.length != 0)
                {
                    for(var i = 0; i < ErrorNumbersFirstTime.length; i++)
                    {
                        var Message = new CommandMessage();

                        Message.setType(EnumCommand.PSPUErrorCode);
                        Message.setSender("ServerInterface");
                        Message.setParameterStringArray([(ErrorNumbersFirstTime[i]+1).toString(),"ControlException","0"]);

                        this.EventHandler.fireCommandEvent(Message);
                    }
                    this.SendPSPUStop();
                    this.StopAllActuators();
                }
                else
                {
                    ExperimentRunning = true;

                    var DataMessage_4 = new DataMessage();
                    DataMessage_4.setActuators(this.Actuators);
                    DataMessage_4.setSensors(this.Sensors);

                    Type = ["PSPU"];
                    DataMessage_4.setParameterStringArray(Type);
                    this.EventHandler.fireDataReceivedEvent(DataMessage_4);
                }
            }
        }
    };

    this.ControlException = [];

    this.TimeoutExceptionFirstTest;
    this.TimeoutExceptionSecondTest;

    this.TimeoutExceptionTimer;
    this.TimeoutExceptionTimerIsRunning = false;
    this.ExceptionCounter = 0;

    this.DebugTimeoutException = false;

    this.onData = function (DataArg){
        if(this.InitializationInProgress && DataArg.getParameterStringArray()[0] == "BPU") return;
        if(DataArg.getParameterStringArray()[0] == "PSPU") return;

        var Data = DataArg;

        if(Data.getSensors()[0] != undefined && DataArg.getParameterStringArray()[0] == "SIM")
        {
            this.Sensors = this.InsertUserVariables(Data.getSensors());
        }

        if(Data.getActuators()[0] != undefined)
        {
            this.Actuators = Data.getActuators();
        }

        //***********************
        if(this.DebugTimeoutException){
            this.ExceptionCounter++;
            console.log(Date.now()+": "+DataArg.getParameterStringArray()[0]+ ` (${this.ExceptionCounter})` );

            console.log("DataArg-Sensors  : "+DataArg.getSensors().map(e => e?"1":"0"));
            console.log("this.Sensors     : "+this.Sensors.map(e => e?"1":"0"));

            console.log("DataArg-Actuators: "+DataArg.getActuators().map(e => e?"1":"0"));
            console.log("this.Actuators   : "+this.Actuators.map(e => e?"1":"0"));
        }
        //***************************

        this.CheckInitialization();


        // Protection
        if(!this.InitializationInProgress && ExperimentRunning)
        {
            if(DataArg.getParameterStringArray()[0] == "BPU"){
                this.ControlException = this.IsDeviceInErrorState(DataArg.getActuators(), DataArg.getSensors());
                if(this.ControlException.length != 0) {
                    for (i = 0; i < this.ControlException.length; i++) {
                        var Message = new CommandMessage();

                        Message.setType(EnumCommand.PSPUErrorCode);
                        Message.setSender("ServerInterface");
                        Message.setParameterStringArray([(this.ControlException[i] + 1).toString(), "ControlException", "0"]);

                        this.EventHandler.fireCommandEvent(Message);
                    }

                    ExperimentRunning = false;

                    this.StopAllActuators();
                    this.SendPSPUStop();
                    console.log(Math.floor(Date.now()/1000)*1000+` :ControlException (${this.ExceptionCounter})`);
                }
            }

            if(this.ControlException.length === 0){
                this.TimeoutExceptionFirstTest = this.IsDeviceInErrorState(this.Actuators, this.Sensors);

                if(this.TimeoutExceptionFirstTest.length !== 0) {
                    console.log(Math.floor(Date.now()/1000)*1000+` :FirstTimeoutException (${this.ExceptionCounter})`);

                    // Wenn der Timer initialisiert oder erfolgreich gecancelt wurde
                    if (!this.TimeoutExceptionTimerIsRunning) {
                        this.TimeoutExceptionTimerIsRunning = true;

                        this.TimeoutExceptionTimer = setTimeout(() => {
                            this.TimeoutExceptionTimerIsRunning = false;

                            this.TimeoutExceptionSecondTest = this.IsDeviceInErrorState(this.Actuators, this.Sensors);
                            if (this.TimeoutExceptionSecondTest.length !== 0) {
                                console.log(Math.floor(Date.now()/1000)*1000+` :SecondTimeoutException (${this.ExceptionCounter})`);
                                // var UnchangedErrorOccured = false;
                                // for (var i = 0; i < TimeoutExceptionSecondTest.length; i++) {
                                //     if ($.inArray(TimeoutExceptionSecondTest[i], ErrorNumbersFirstTime) != -1) UnchangedErrorOccured = true;
                                // }
                                //
                                // if (UnchangedErrorOccured) {

                                for (i = 0; i < this.TimeoutExceptionSecondTest.length; i++) {
                                    var Message = new CommandMessage();

                                    Message.setType(EnumCommand.PSPUErrorCode);
                                    Message.setSender("ServerInterface");
                                    Message.setParameterStringArray([(this.TimeoutExceptionSecondTest[i] + 1).toString(), "TimeoutException", "0"]);

                                    this.EventHandler.fireCommandEvent(Message);
                                }

                                ExperimentRunning = false;

                                this.StopAllActuators();
                                this.SendPSPUStop();
                                // }
                            }
                        }, ProtectionTimeOut);
                    }

                } else if (this.TimeoutExceptionTimerIsRunning) {                    // Wenn ein Timer läuft
                    clearTimeout(this.TimeoutExceptionTimer);
                    this.TimeoutExceptionTimerIsRunning = false;
                }
            }
        }

        if(BreakpointsEnabled && !this.InitializationInProgress)
        {
            // Check for breakpoint combination

            var BreakpointIsReached = true;

            // Sensors
            for (var i = 0; i < BreakpointsArraySensors.length; i++)
            {
                if(BreakpointsArraySensors[i][1] != this.Sensors[BreakpointsArraySensors[i][0]])
                    BreakpointIsReached = false;
            }

            // Actuators
            for (i = 0; i < BreakpointsArrayActuators.length; i++)
            {
                if(BreakpointsArrayActuators[i][1] != this.Actuators[BreakpointsArrayActuators[i][0]])
                    BreakpointIsReached = false;
            }

            if(BreakpointIsReached)
            {
                this.StopAllActuators();
                this.SendPSPUStop();

                Message = new CommandMessage();
                Message.setType(EnumCommand.PSPUReachedBreakpoint);
                Message.setSender("ServerInterface");

                this.EventHandler.fireCommandEvent(Message);

                BreakpointIsReached = false;
                return;
            }
        }

        if(SingleStepSensorsRunning)
        {
            if(!SingleStepSensorsCaptured)
            {
                SingleStepSensorsArray = this.Sensors;
                SingleStepSensorsCaptured = true;
            }
            else if(this.SensorsHaveChangedSingleStep(this.Sensors))
            {
                this.StopAllActuators();
                this.SendPSPUStop();

                Message = new CommandMessage();
                Message.setType(EnumCommand.PSPUReachedSingleStepSensor);
                Message.setSender("ServerInterface");

                this.EventHandler.fireCommandEvent(Message);

                SingleStepSensorsRunning = false;
                SingleStepSensorsCaptured = false;
                return;
            }
        }
        else if(SingleStepActuatorsRunning)
        {
            if(!SingleStepActuatorsCaptured)
            {
                SingleStepActuatorsArray = this.Actuators;
                SingleStepActuatorsCaptured = true;
            }
            else if(this.ActuatorsHaveChangedSingleStep(this.Actuators))
            {
                this.StopAllActuators();
                this.SendPSPUStop();

                Message = new CommandMessage();
                Message.setType(EnumCommand.PSPUReachedSingleStepActuator);
                Message.setSender("ServerInterface");

                this.EventHandler.fireCommandEvent(Message);

                SingleStepActuatorsRunning = false;
                SingleStepActuatorsCaptured = false;
                return;
            }
        }

        var ParameterString = Data.getParameterStringArray()[0];
        var DataMessage_5 = new DataMessage();
        DataMessage_5.setActuators(this.Actuators);
        DataMessage_5.setSensors(this.Sensors);

        Type = ["PSPU"];
        if (ParameterString == "SIM")
        {
            DataMessage_5.setParameterStringArray(Type);
            this.EventHandler.fireDataSendEvent(DataMessage_5);
            this.EventHandler.fireDataReceivedEvent(DataMessage_5);
            return;
        }

        if(!(ExperimentRunning || SingleStepSensorsRunning || SingleStepActuatorsRunning))
        {
            DataMessage_5.setActuators(ActuatorMask);
        }
        if(this.InitializationInProgress)
        {
            return;
        }

        if(this.ControlException.length > 0){
            return;
        }

        DataMessage_5.setParameterStringArray(Type);

        this.EventHandler.fireDataReceivedEvent(DataMessage_5);
    };

    this.RemoveAllBreakpoints = function(){
        BreakpointsArrayActuators = [];
        BreakpointsArraySensors = [];
    };

    this.StopAllActuators = function(){
        for (i = 0; i < 128; i++)
            this.Actuators[i] = false;

        var DataMessage_6 = new DataMessage();
        DataMessage_6.setActuators(ActuatorMask);
        DataMessage_6.setSensors(this.Sensors);
        DataMessage_6.Parameter = null;
        var Type = ["PSPU"];
        DataMessage_6.setParameterStringArray(Type);
        this.EventHandler.fireDataReceivedEvent(DataMessage_6);
    };

    this.SendPSPUStop = function(){
        ExperimentRunning = false;
        var Message = new CommandMessage();
        Message.setType(EnumCommand.PSPUStop);
        Message.setSender("ServerInterface");

        this.EventHandler.fireCommandEvent(Message);
    };

    this.InitializeDevice = function(InitializationNumber){
        this.InitializationInProgress = true;

        for (i = 0; i < 128; i++)
            this.Actuators[i] = false;

        this.SendActuators();
        OngoingInitializationNumber = InitializationNumber;
        this.CheckInitialization();
    };

    this.CheckInitialization = function(){
        if(this.InitializationInProgress)
        {
            if(OngoingInitializationNumber == "0")
            {
                this.FSMInitialization0();
            }
            else if(OngoingInitializationNumber == "1")
            {
                this.FSMInitialization1();
            }
            else if(OngoingInitializationNumber == "2")
            {
                this.FSMInitialization2();
            }
        }
    };

    this.SendActuators = function(){
        var DataMessage_7 = new DataMessage();
        DataMessage_7.setActuators(this.Actuators);
        DataMessage_7.setSensors(this.Sensors);
        var Type = ["PSPU"];
        DataMessage_7.setParameterStringArray(Type);
        this.EventHandler.fireDataReceivedEvent(DataMessage_7);
    };

    this.IsDeviceInErrorState = function(Actuators, Sensors){
        if(Protection == undefined){
            return [];
        }
        var ErrorNumbersTemp = [];
        if(this.ObserverDoStep != undefined)
            this.ObserverDoStep();

        eval(Protection);

        return ErrorNumbersTemp;
    };

    this.SensorsHaveChangedSingleStep = function(Sensors){
        if(Sensors != undefined)
        {
            for (i = 0; i < Sensors.length; i++)
            {
                if (SingleStepSensorsArray[i] != Sensors[i])
                {
                    return true;
                }
            }
        }
        return false;
    };

    this.ActuatorsHaveChangedSingleStep = function(Actuators){
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
    };

    this.FinishInitialization = function(){
        this.FSMInitialization_State = "Initial";
        this.StopAllActuators();
        this.ResetUserVariables();

        this.InitializationInProgress = false;
        let Message = new CommandMessage();
        Message.setType(EnumCommand.PSPUFinishedInit);
        Message.setSender("ServerInterface");

        this.EventHandler.fireCommandEvent(Message);
    };

    if(this.InitializeObservers != undefined)
        this.InitializeObservers();

    this.RemoveAllBreakpoints();

    for (i = 0; i < 128; i++)
        ActuatorMask[i] = false;

    this.ResetUserVariables();
    Message = new CommandMessage();
    Message.setType(EnumCommand.Acknowledge);
    Message.setSender("ServerInterface");
    this.EventHandler.fireCommandEvent(Message);
}
