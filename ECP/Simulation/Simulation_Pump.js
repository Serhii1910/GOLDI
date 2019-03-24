function Simulation(EventHandler, SettingsParameter) {
    var NumberOfSensors = 17;
    var NumberOfActuators = 18;

    Simulation.prototype.onData = function (Data) {
        if(Data.getParameterStringArray()[0] == "PSPU")
        {
            if(Data.getSensors()[0] != undefined)
                Sensors = Data.getSensors();
            if(Data.getActuators()[0] != undefined)
                Actuators = Data.getActuators();
        }
    };

    Simulation.prototype.onServerInterfaceInfo = function (Data) {

    };

    var Actuators = new Array(128);
    var Sensors = new Array(128);
    var sensorsHaveChangedOldSensors = new Array(128);
    var SimulationSlowdown = 4;

    for (var i = 0; i < 128; i++) {
        Sensors[i] = false;
    }

    // Initial sensor values

    for (var i = 0; i < 128; i++) {
        Actuators[i] = false;
    }

    for (var i = 0; i < 128; i++) {
        sensorsHaveChangedOldSensors[i] = undefined;
    }

    var Actuators = [];
    var Timer = undefined;
    var SimulationIsRunning = false;


    //Simulation variables

    var tankVolume_Max = 1000;
    var tankVolume = 0;
    var pumpSpeed = 2;
    var valveSpeed = 25;

    /* This function convert binary value from sensors 12 to 19 to decimal and return valve speed
     *
     * @param array
     *
     * @return float
     */
    function convertBitmap(Sensors) {
        return parseInt(Sensors.slice(12,20).map(b=>b?"1":"0").join(""),2) / 20;
    }

    function start(pClockFrequency) {
        Timer = setInterval(run, Math.round(1000 * pClockFrequency));
    }

    function stop() {
        if (SimulationIsRunning) {
            clearInterval(Timer);
            SimulationIsRunning = false;
        }
    }

    this.run = run;
    function run() {
        //Написать эту функцию
        //Create temporary variables

        for (var i = 0; i < NumberOfActuators; i++) {
            if (Actuators[i] == undefined) {
                return;
            }
        }

        //Add water
        if (Actuators[0]) {
            if (tankVolume < tankVolume_Max) {
                tankVolume += pumpSpeed;
            } else {
                tankVolume = tankVolume_Max;
            }
        }
        if (Actuators[1]) {
            if (tankVolume < tankVolume_Max) {
                tankVolume += pumpSpeed;
            } else {
                tankVolume = tankVolume_Max;
            }
        }
        //Remove water
        tankVolume -= convertBitmap(Sensors);

        if(tankVolume < 0)
        {
            tankVolume = 0;
        }

        //console.log(tankVolume);

        var sensNr = 4;
        for (var counter = 0; counter < 8; ++counter) {
            if (calculateBitValue(counter, ((100 * tankVolume) / tankVolume_Max)) == 1) {
                Sensors[sensNr++] = true;
            }
            else {
                if (calculateBitValue(counter, ((100 * tankVolume) / tankVolume_Max)) == 0) {
                    Sensors[sensNr++] = false;
                }
                else {console.error("False state");}
            }
        }

        SendSensors();
    }

    function SendSensors() {
        //Calculate input variables
        //Написать эту фуцию
        //var Sensors = new Array();

        Sensors[0] = false;
        Sensors[1] = false;
        Sensors[2] = false;
        Sensors[3] = false;

        if (tankVolume >= 809) {
            Sensors[3] = true;
        }
        if (tankVolume >= 642) {
            Sensors[2] = true;
        }
        if (tankVolume >= 273) {
            Sensors[1] = true;
        }
        if (tankVolume >= 166) {
            Sensors[0] = true;
        }

        if (SensorsHaveChanged(Sensors)) {
            SendData(Sensors);
        }
    }

    function SensorsHaveChanged(Sensors) {

        if (sensorsHaveChangedOldSensors[0] == undefined) {
            sensorsHaveChangedOldSensors = Sensors.slice();
            return true;
        }

        for (var i = 0; i < Sensors.length; i++) {
            if (sensorsHaveChangedOldSensors[i] != Sensors[i]) {
                sensorsHaveChangedOldSensors = Sensors.slice();
                return true;
            }
        }
        return false;
    }

    function SendData(Sensors) {
        var Message = new DataMessage();
        Message.setSensors(Sensors);
        Message.setActuators(Actuators);

        Type = [];
        Type = ["SIM"];

        Message.setParameterStringArray(Type);

        EventHandler.fireDataSendEvent(Message);
    }

    start(0.1);
    SendSensors(Sensors);
}