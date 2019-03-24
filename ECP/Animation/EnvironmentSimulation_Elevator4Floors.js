//Initialize counter of peoples on each Floor and Cage
    ManCounterFloor1 = Array();
    ManCounterFloor2_up = Array();
    ManCounterFloor2_down = Array();
    ManCounterFloor3_down = Array();
    ManCounterFloor3_up = Array();
    ManCounterFloor4 = Array();
    ManCounterCage = 0;
    TargetFloor1 = 0;
    TargetFloor2 = 0;
    TargetFloor3 = 0;
    TargetFloor4 = 0;
    //Variables for calculation waiting time
    timeWaitMin = 0;
    timeWaitMax = 0;
    timeWaitAvg = 0;
    timeWaitCount = 0;
    Animation.ManAnimateFlag = false;

Animation.prototype.EnvironmentSimulationCommandInterface = function(Command) {
    if (Command.getType() == EnumCommand.PSPURun){
        this.TimeSlots = Animation.prototype.GetTimeSlotsObjects('1,2,4;2,3,4;3,2,1;4,4,1;5,4,2');
        this.PressButtonsSimulation(5);
        return;
    }
    let commandParams = Command.getParameterStringArray();
    let targetFloor = 0;
    if (commandParams.length > 2)
        targetFloor = commandParams[2];
    if (Command.getType() === EnumCommand.SetUserVariable && commandParams[1] === "1") {

        //Checking incoming commands and the number of people waiting in line on the floor.
        // Select the right floor and make the person visible if there is a call command
        //ManCounterFloor1-4 - This is an object containing an array and counting time since 1970
        if (commandParams[0] == EnumElevatorEnvironmentVariables.CallButtonFloor1 && ManCounterFloor1.length < 5) {
            ManCounterFloor1.push({goTo: targetFloor, timeCall: Date.now()});
            let Man = Snap.select("#ManLavel1");
            Man.transform("t50,695");
            Man.attr({opacity: 1});
            $("#PeopleAmount1").text(ManCounterFloor1.length);
            Snap.select("#PeopleAmount1").attr({opacity: 1});
            return;
        }
        if (commandParams[0] == EnumElevatorEnvironmentVariables.CallButtonFloor2Up && ManCounterFloor2_up.length < 5) {
            ManCounterFloor2_up.push({goTo: targetFloor, timeCall: Date.now()});
            let Man = Snap.select("#ManLavel2_up");
            Man.transform("t50,533");
            Man.attr({opacity: 1});
            $("#PeopleAmount2_up").text(ManCounterFloor2_up.length);
            Snap.select("#PeopleAmount2_up").attr({opacity: 1});
            return;
        }
        if (commandParams[0] == EnumElevatorEnvironmentVariables.CallButtonFloor2Down && ManCounterFloor2_down.length < 5) {
            ManCounterFloor2_down.push({goTo: targetFloor, timeCall: Date.now()});
            let Man = Snap.select("#ManLavel2_down");
            Man.transform("t0,533");
            Man.attr({opacity: 1});
            $("#PeopleAmount2_down").text(ManCounterFloor2_down.length);
            Snap.select("#PeopleAmount2_down").attr({opacity: 1});
        }
        if (commandParams[0] == EnumElevatorEnvironmentVariables.CallButtonFloor3Up && ManCounterFloor3_up.length < 5) {
            ManCounterFloor3_up.push({goTo: targetFloor, timeCall: Date.now()});
            let Man = Snap.select("#ManLavel3_up");
            Man.transform("t50,372");
            Man.attr({opacity: 1});
            $("#PeopleAmount3_up").text(ManCounterFloor3_up.length);
            Snap.select("#PeopleAmount3_up").attr({opacity: 1});
            return;
        }
        if (commandParams[0] == EnumElevatorEnvironmentVariables.CallButtonFloor3Down && ManCounterFloor3_down.length < 5) {
            ManCounterFloor3_down.push({goTo: targetFloor, timeCall: Date.now()});
            let Man = Snap.select("#ManLavel3_down");
            Man.transform("t0,372");
            Man.attr({opacity: 1});
            $("#PeopleAmount3_down").text(ManCounterFloor3_down.length);
            Snap.select("#PeopleAmount3_down").attr({opacity: 1});
        }
        if (commandParams[0] == EnumElevatorEnvironmentVariables.CallButtonFloor4 && ManCounterFloor4.length < 5) {
            ManCounterFloor4.push({goTo: targetFloor, timeCall: Date.now()});
            let Man = Snap.select("#ManLavel4");
            Man.transform("t50,210");
            Man.attr({opacity: 1});
            $("#PeopleAmount4").text(ManCounterFloor4.length);
            Snap.select("#PeopleAmount4").attr({opacity: 1});
        }
        //Processing of button presses in the elevator cage.
        // The number of people in the elevator cage can not be more than 4
        if (commandParams[0] == EnumElevatorEnvironmentVariables.ElevatorControlFloor1 && TargetFloor1 < 4) {
            TargetFloor1++;
        }
        if (commandParams[0] == EnumElevatorEnvironmentVariables.ElevatorControlFloor2 && TargetFloor2 < 4) {
            TargetFloor2++;
        }
        if (commandParams[0] == EnumElevatorEnvironmentVariables.ElevatorControlFloor3 && TargetFloor3 < 4) {
            TargetFloor3++;
        }
        if (commandParams[0] == EnumElevatorEnvironmentVariables.ElevatorControlFloor4 && TargetFloor4 < 4) {
            TargetFloor4++;
        }
    }

};

// Comment
// http://141.24.211.105/index.php?Function=ECP&Mode=a&BPUType=FSMInterpreter&PSPUType=Elevator4Floors&Location=IUT&EnvironmentSimulation

Animation.prototype.EnvironmentSimulationDataInterface = function(Data) {
    let Animation = this;

    //If the door opening sensor is triggered,
    // the function EnvironmentSimulationActionOnLevel will call
    let _sensors = Data.getSensors();
    // Door floor 1
    if ( _sensors[7]){
        Animation.EnvironmentSimulationActionOnLevel(1);
    }
    // Door floor 2
    if (_sensors[9]){
        Animation.EnvironmentSimulationActionOnLevel(2);
    }
    // Door floor 3
    if (_sensors[11]){
        Animation.EnvironmentSimulationActionOnLevel(3);
    }
    // Door floor 4
    if (_sensors[29]){
        Animation.EnvironmentSimulationActionOnLevel(4);
    }
};

Animation.prototype.EnvironmentSimulationActionOnLevel = function(LevelNumber) {
    let Animation = this;
    if (Animation.ManAnimateFlag) return;
    //This function is responsible for the entry and exit of passengers,
    // for increasing or decreasing the counters on the floor and in the elevator

    // Door floor 1
    if (this.Sensors[7] && LevelNumber == 1){

        //Exit passengers from the elevator cage
        if (ManCounterCage && TargetFloor1){
            let Man = Snap.select("#ManLavel1");
            Man.transform("t120,695");
            Man.attr({opacity: 1});
            Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor1, '1');
            Animation.ManAnimateFlag = true;
            Man.animate({'transform': 't190,695'}, 3000, mina.easeinout, function () {
                Snap.select("#ManLavel1").attr({opacity: 0});
                Animation.ManAnimateFlag = false;
                Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor1, '0');
                Animation.EnvironmentSimulationActionOnLevel(LevelNumber);
            });
            ManCounterCage--;
            TargetFloor1--;
            return;
        }

        //Passengers enter the elevator car
        if (ManCounterFloor1.length > 0 && ManCounterCage < 4) {
            let Man = Snap.select("#ManLavel1");
            Man.transform("t50,695");
            Man.attr({opacity: 1});
            Animation.ManAnimateFlag = true;
            Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor1, '1');
            Animation.TimeWaitCalculation(ManCounterFloor1[0].timeCall);
            Man.animate({'transform': 't120,695'}, 3000, mina.easeinout, function () {
                Snap.select("#ManLavel1").attr({opacity: 0});
                if (ManCounterFloor1[0].goTo){
                    Animation.SendEnvironmentVariableCommand(ManCounterFloor1[0].goTo, "1");
                    let btn = ManCounterFloor1[0].goTo;
                    setInterval(function (e) {
                        Animation.SendEnvironmentVariableCommand(e, "0");
                    }, 1000, btn);
                }
                ManCounterCage++;
                ManCounterFloor1.shift();
                $("#PeopleAmount1").text(ManCounterFloor1.length);
                if (ManCounterFloor1.length === 0)
                    Snap.select("#PeopleAmount1").attr({opacity: 0});
                Animation.ManAnimateFlag = false;
                Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor1, '0');
                Animation.EnvironmentSimulationActionOnLevel(LevelNumber);
            });
            return;
        }
    }
    //Door floor 2
    if (this.Sensors[9] && LevelNumber == 2){
        if (ManCounterCage && TargetFloor2){
            let Man = Snap.select("#ManLavel2_up");
            Man.transform("t120,533");
            Man.attr({opacity: 1});
            Animation.ManAnimateFlag = true;
            Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor2, '1');
            Man.animate({'transform': 't190,533'}, 3000, mina.easeinout, function () {
                Snap.select("#ManLavel2_up").attr({opacity: 0});
                Animation.ManAnimateFlag = false;
                Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor2, '0');
                Animation.EnvironmentSimulationActionOnLevel(LevelNumber);
            });
            ManCounterCage--;
            TargetFloor2--;
            return;
        }
        //Door floor 2 goes UP
        if (ManCounterFloor2_up.length > 0 && ManCounterCage < 4 && Animation.Actuators[10] == 0) {
            let Man = Snap.select("#ManLavel2_up");
            Man.transform("t50,533");
            Man.attr({opacity: 1});
            Animation.ManAnimateFlag = true;
            Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor2, '1');
            Animation.TimeWaitCalculation(ManCounterFloor2_up[0].timeCall);
            Man.animate({'transform': 't120,533'}, 3000, mina.easeinout, function () {
                Snap.select("#ManLavel2_up").attr({opacity: 0});
                if (ManCounterFloor2_up[0].goTo){
                    Animation.SendEnvironmentVariableCommand(ManCounterFloor2_up[0].goTo, "1");
                    let btn = ManCounterFloor2_up[0].goTo;
                    setInterval(function (e) {
                        Animation.SendEnvironmentVariableCommand(e, "0");
                    }, 1000, btn);
                }
                ManCounterCage++;
                ManCounterFloor2_up.shift();
                $("#PeopleAmount2_up").text(ManCounterFloor2_up.length);
                if (ManCounterFloor2_up.length === 0)
                    Snap.select("#PeopleAmount2_up").attr({opacity: 0});
                Animation.ManAnimateFlag = false;
                Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor2, '0');
                Animation.EnvironmentSimulationActionOnLevel(LevelNumber);
            });
            return;
        }
        //Door floor 2 goes DOWN
        if (ManCounterFloor2_down.length > 0 && ManCounterCage < 4 && Animation.Actuators[11] == 0) {
            let Man = Snap.select("#ManLavel2_down");
            Man.transform("t0,533");
            Man.attr({opacity: 1});
            Animation.ManAnimateFlag = true;
            Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor2, '1');
            Animation.TimeWaitCalculation(ManCounterFloor2_down[0].timeCall);
            Man.animate({'transform': 't120,533'}, 3000, mina.easeinout, function () {
                Snap.select("#ManLavel2_down").attr({opacity: 0});
                if (ManCounterFloor2_down[0].goTo){
                    Animation.SendEnvironmentVariableCommand(ManCounterFloor2_down[0].goTo, "1");
                    let btn = ManCounterFloor2_down[0].goTo;
                    setInterval(function (e) {
                        Animation.SendEnvironmentVariableCommand(e, "0");
                    }, 1000, btn);
                }
                ManCounterCage++;
                ManCounterFloor2_down.shift();
                $("#PeopleAmount2_down").text(ManCounterFloor2_down.length);
                if (ManCounterFloor2_down.length === 0)
                    Snap.select("#PeopleAmount2_down").attr({opacity: 0});
                Animation.ManAnimateFlag = false;
                Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor2, '0');
                Animation.EnvironmentSimulationActionOnLevel(LevelNumber);
            });
            return;
        }
    }
    //Door floor 3
    if (this.Sensors[11] && LevelNumber === 3){
        if (ManCounterCage && TargetFloor3){
            let Man = Snap.select("#ManLavel3_up");
            Man.transform("t120,372");
            Man.attr({opacity: 1});
            Animation.ManAnimateFlag = true;
            Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor3, '1');
            Man.animate({'transform': 't190,372'}, 3000, mina.easeinout, function () {
                Snap.select("#ManLavel3_up").attr({opacity: 0});
                Animation.ManAnimateFlag = false;
                Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor3, '0');
                Animation.EnvironmentSimulationActionOnLevel(LevelNumber);
            });
            ManCounterCage--;
            TargetFloor3--;
            return;
        }
        //Door floor 3 goes UP
        if (ManCounterFloor3_up.length > 0 && ManCounterCage < 4 && Animation.Actuators[26] == 0) {
            let Man = Snap.select("#ManLavel3_up");
            Man.transform("t50,372");
            Man.attr({opacity: 1});
            Animation.ManAnimateFlag = true;
            Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor3, '1');
            Animation.TimeWaitCalculation(ManCounterFloor3_up[0].timeCall);
            Man.animate({'transform': 't120,372'}, 3000, mina.easeinout, function () {
                Snap.select("#ManLavel3_up").attr({opacity: 0});
                if (ManCounterFloor3_up[0].goTo) {
                    Animation.SendEnvironmentVariableCommand(ManCounterFloor3_up[0].goTo, "1");
                    let btn = ManCounterFloor3_up[0].goTo;
                    setInterval(function (e) {
                        Animation.SendEnvironmentVariableCommand(e, "0");
                    }, 1000, btn);
                }
                ManCounterCage++;
                ManCounterFloor3_up.shift();
                $("#PeopleAmount3_up").text(ManCounterFloor3_up);
                if (ManCounterFloor3_up.length === 0)
                    Snap.select("#PeopleAmount3_up").attr({opacity: 0});
                Animation.ManAnimateFlag = false;
                Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor3, '0');
                Animation.EnvironmentSimulationActionOnLevel(LevelNumber);
            });
            return;
        }
        //Door floor 3 goes DOWN
        if (ManCounterFloor3_down.length > 0 && ManCounterCage < 4 && Animation.Actuators[12] == 0) {
            ManCounterCage++;
            let Man = Snap.select("#ManLavel3_down");
            Man.transform("t0,372");
            Man.attr({opacity: 1});
            Animation.ManAnimateFlag = true;
            Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor3, '1');
            Animation.TimeWaitCalculation(ManCounterFloor3_down[0].timeCall);
            Man.animate({'transform': 't120,372'}, 3000, mina.easeinout, function () {
                Snap.select("#ManLavel3_down").attr({opacity: 0});
                if (ManCounterFloor3_down[0].goTo) {
                    Animation.SendEnvironmentVariableCommand(ManCounterFloor3_down[0].goTo, "1");
                    let btn = ManCounterFloor3_down[0].goTo;
                    setInterval(function (e) {
                        Animation.SendEnvironmentVariableCommand(e, "0");
                    }, 1000, btn);
                }
                ManCounterCage++;
                ManCounterFloor3_down.shift();
                $("#PeopleAmount3_down").text(ManCounterFloor3_down);
                if (ManCounterFloor3_down.length === 0)
                    Snap.select("#PeopleAmount3_down").attr({opacity: 0});
                Animation.ManAnimateFlag = false;
                Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor3, '0');
                Animation.EnvironmentSimulationActionOnLevel(LevelNumber);
            });
            return;
        }
    }
    //Door floor 4
    if (this.Sensors[29] && LevelNumber === 4) {
        if (ManCounterCage && TargetFloor4) {
            let Man = Snap.select("#ManLavel4");
            Man.transform("t120,210");
            Man.attr({opacity: 1});
            Animation.ManAnimateFlag = true;
            Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor4, '1');
            Man.animate({'transform': 't190,210'}, 3000, mina.easeinout, function () {
                Snap.select("#ManLavel4").attr({opacity: 0});
                Animation.ManAnimateFlag = false;
                Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor4, '0');
                Animation.EnvironmentSimulationActionOnLevel(LevelNumber);
            });
            ManCounterCage--;
            TargetFloor4--;
            return;
        }
        if (ManCounterFloor4.length > 0 && ManCounterCage < 4) {
            let Man = Snap.select("#ManLavel4");
            Man.transform("t50,210");
            Man.attr({opacity: 1});
            Animation.ManAnimateFlag = true;
            Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor4, '1');
            Animation.TimeWaitCalculation(ManCounterFloor4[0].timeCall);
            Man.animate({'transform': 't120,210'}, 3000, mina.easeinout, function () {
                Snap.select("#ManLavel4").attr({opacity: 0});
                if (ManCounterFloor4[0].goTo) {
                    Animation.SendEnvironmentVariableCommand(ManCounterFloor4[0].goTo, "1");
                    let btn = ManCounterFloor4[0].goTo;
                    setInterval(function (e) {
                        Animation.SendEnvironmentVariableCommand(e, "0");
                    }, 1000, btn);
                }
                ManCounterCage++;
                ManCounterFloor4.shift();
                $("#PeopleAmount4").text(ManCounterFloor4.length);
                if (ManCounterFloor4.length === 0)
                    Snap.select("#PeopleAmount4").attr({opacity: 0});
                Animation.ManAnimateFlag = false;
                Animation.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor4, '0');
                Animation.EnvironmentSimulationActionOnLevel(LevelNumber);
            });
        }
    }
};

Animation.prototype.GetTimeSlotsObjects = function (orders) {

    //This function debugs a string in JSON Object
    let arr = orders.split(';');
    let TimeSlots = new Array();
    let OldTimeSlot = '';
    for (let i = 0; i < arr.length; i++) {
        let a = arr[i].split(',');
        if (a.length !== 3)
            continue;
        if (OldTimeSlot !== a[0]) {
            TimeSlots.push(new Array());
        }
        let target = 0;
        if (a[2] == 1) target = EnumElevatorEnvironmentVariables.ElevatorControlFloor1;
        if (a[2] == 2) target = EnumElevatorEnvironmentVariables.ElevatorControlFloor2;
        if (a[2] == 3) target = EnumElevatorEnvironmentVariables.ElevatorControlFloor3;
        if (a[2] == 4) target = EnumElevatorEnvironmentVariables.ElevatorControlFloor4;
        TimeSlots[TimeSlots.length - 1].push({ isIn: a[1], goTo: target });
        OldTimeSlot = a[0];
    }
    return TimeSlots;
};

Animation.prototype.PressButtonsSimulation = function(timeSlotInterval) {

    //This function checks all TimeSlots. The function checks the variables
    // and assigns the values described in the file Enumerations.js
    let Animation = this;
    if (Animation.TimeSlots.length > 0) {
        for (let i = 0; i < Animation.TimeSlots[0].length; i++) {
            let isIn = Animation.TimeSlots[0][i].isIn;
            let goTo = Animation.TimeSlots[0][i].goTo;

            let variable = "";

            if (isIn == 1)
                variable = EnumElevatorEnvironmentVariables.CallButtonFloor1;
            if (isIn == 2 && goTo > EnumElevatorEnvironmentVariables.ElevatorControlFloor2)
                variable = EnumElevatorEnvironmentVariables.CallButtonFloor2Up;
            if (isIn == 2 && goTo < EnumElevatorEnvironmentVariables.ElevatorControlFloor2)
                variable = EnumElevatorEnvironmentVariables.CallButtonFloor2Down;
            if (isIn == 3 && goTo > EnumElevatorEnvironmentVariables.ElevatorControlFloor3)
                variable = EnumElevatorEnvironmentVariables.CallButtonFloor3Up;
            if (isIn == 3 && goTo < EnumElevatorEnvironmentVariables.ElevatorControlFloor3)
                variable = EnumElevatorEnvironmentVariables.CallButtonFloor3Down;
            if (isIn == 4)
                variable = EnumElevatorEnvironmentVariables.CallButtonFloor4;

            //Sending command of press button and realise button with delay between them 1 second
            let messageBtnPressed = new CommandMessage();
            messageBtnPressed.setType(EnumCommand.SetUserVariable);
            let parameterStringArrayPressed = [variable.toString(), '1', goTo];
            messageBtnPressed.setParameterStringArray(parameterStringArrayPressed);
            EventHandler.fireCommandEvent(messageBtnPressed);

            let messageBtnRealised = new CommandMessage();
            messageBtnRealised.setType(EnumCommand.SetUserVariable);
            let parameterStringArrayRealised = [variable.toString(), '0', goTo];
            messageBtnRealised.setParameterStringArray(parameterStringArrayRealised);
            setTimeout(function (e) {
                EventHandler.fireCommandEvent(e);
            }, 1000, messageBtnRealised);
        }

        //After sending commands we delete old orders
        Animation.TimeSlots.shift();
        if (Animation.TimeSlots.length > 0) {
            setTimeout(Animation.PressButtonsSimulation.bind(Animation), timeSlotInterval * 1000, timeSlotInterval);
        }
    }
};
Animation.prototype.TimeWaitCalculation = function(timeCall){
    //This function calculates Min Max and Average waiting time
    //In connection with the fact that time has been counted since 1970,
    // it is necessary to calculate the time from the moment
    // of pressing the call button and the entrance to the cabin
    let timeWait = Date.now() - timeCall;
    if(timeWaitMin > timeWait || timeWaitMin == 0) {timeWaitMin = timeWait;}
    if(timeWaitMax < timeWait) {timeWaitMax = timeWait;}
    timeWaitAvg = (timeWaitAvg * timeWaitCount + timeWait)/(timeWaitCount + 1);
    timeWaitCount++;

    // Converting Milliseconds to format MM:SS:MS (Minutes : Seconds : Milliseconds)
    let tWMinMM = (timeWaitMin / (1000 *60)%60);
    let tWMinSS = ((timeWaitMin / 1000)%60);
    let tWMinMS = ((timeWaitMin % 1000)/100);

    let tWMaxMM = (timeWaitMax / (1000 *60)%60);
    let tWMaxSS = ((timeWaitMax / 1000)%60);
    let tWMaxMS = ((timeWaitMax % 1000)/100);

    let tWAvgMM = (timeWaitAvg / (1000 *60)%60);
    let tWAvgSS = ((timeWaitAvg / 1000)%60);
    let tWAvgMS = ((timeWaitAvg % 1000)/100);

    //Isolation integer part after conversion
    tWMinMM = Math.floor(tWMinMM);
    tWMinSS = Math.floor(tWMinSS);
    tWMinMS = Math.floor(tWMinMS);

    tWMaxMM = Math.floor(tWMaxMM);
    tWMaxSS = Math.floor(tWMaxSS);
    tWMaxMS = Math.floor(tWMaxMS);

    tWAvgMM = Math.floor(tWAvgMM);
    tWAvgSS = Math.floor(tWAvgSS);
    tWAvgMS = Math.floor(tWAvgMS);

    //Setting values to SVG
    $("#MinValueMM").text(tWMinMM);
    $("#MinValueSS").text(tWMinSS);
    $("#MinValueMS").text(tWMinMS);

    $("#MaxValueMM").text(tWMaxMM);
    $("#MaxValueSS").text(tWMaxSS);
    $("#MaxValueMS").text(tWMaxMS);

    $("#AvgValueMM").text(tWAvgMM,);
    $("#AvgValueSS").text(tWAvgSS,);
    $("#AvgValueMS").text(tWAvgMS);
};
