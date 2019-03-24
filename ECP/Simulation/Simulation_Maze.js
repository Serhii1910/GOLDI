function Simulation(EventHandler, SettingsParameter) {
    //var NumberOfSensors = 17;
    ////var NumberOfActuators = 18;

    Simulation.prototype.onData = function (Data) {
        //Actuators = Data.getActuators();
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


    //Sensors[0] = true;
    //Sensors[3] = true;
    //Sensors[5] = true;
    //Sensors[6] = true;
    //Sensors[9] = true;
    //Sensors[10] = true;
    //Sensors[13] = true;
    //Sensors[15] = true;

    for (var i = 0; i < 128; i++) {
        Actuators[i] = false;
    }

    for (var i = 0; i < 128; i++) {
        sensorsHaveChangedOldSensors[i] = false;
    }

    var Actuators = [];
    var Timer = undefined;
    var SimulationIsRunning = false;

    //Simulationvariables


    function SendSensors() {
        //Calculate input variables
        var Sensors = [];
        //X0 TT at CB3	-low active-
        Sensors[0] = TT_Position != 100;
        //X1 TT at CB1	-low active-
        Sensors[1] = TT_Position != 0;
        //X2 TT has WP
        Sensors[2] = TT_WP == 1;
        //X3 CB1 has WP
        Sensors[3] = CB1_WP == 1;
        //X4 RT1 at CB1		-low active-
        Sensors[4] = RT1_Rotation != 0;
        //X5 RT1 at CB 2	-low active-
        Sensors[5] = RT1_Rotation != 100;
        //X6 RT1 has WP
        Sensors[6] = RT1_WP == 1;
        //X7 CB2 has WP
        Sensors[7] = CB2_WP == 1;
        //X8 RT2 at CB2	-low active-
        Sensors[8] = RT2_Rotation != 0;
        //X9 RT2 at CB3	-low active-
        Sensors[9] = RT2_Rotation != 100;
        //X10 RT2 has WP
        Sensors[10] = RT2_WP == 1;
        //X11 CB3 has WP
        Sensors[11] = CB3_WP == 1;
        //X12 MM away CB2 -low active-
        Sensors[12] = MM_X != 0;
        //X13 MM at CB2 -low active-
        Sensors[13] = MM_X != 100;
        //X14 MM up -low active-
        Sensors[14] = MM_Z != 0;
        //X15 MM down -low active-
        Sensors[15] = MM_Z != 100;

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

        EventHandler.fireDataSendEvent(Message);
    }

    //start(1);
    //SendSensors(Sensors);
}