function Simulation(EventHandler) {
    var NumberOfSensors = 26;
    var NumberOfActuators = 24;

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

    for (var i = 0; i < 128; i++) {
        Sensors[i] = true;
    }

    // Initial sensor values
    Sensors[13] = false;
    Sensors[14] = false;
    Sensors[15] = false;


    for (var i = 0; i < 128; i++) {
        Actuators[i] = false;
    }

    for (var i = 0; i < 128; i++) {
        sensorsHaveChangedOldSensors[i] = false;
    }

    var clockFrequency;
    var Timer = undefined;
    var SimulationRunning = false;

    //Simulationvariables
    var button_floor_3 = 0;
    var button_floor_2 = 0;
    var button_floor_1 = 0;
    var call_button_f3_up = 0;
    var call_button_f3_down = 0;
    var call_button_f2_up = 0;
    var call_button_f2_down = 0;
    var call_button_f1_up = 0;
    var e_stop = 1; // LOW-ACTIVE
    var alert_button = 1; //LOW-ACTIVE
    var overload = 0;
    var lift_position = 0; //0 to 19
    var drive_slowly = 0; //0 OR 1
    var d3_pos = 0; // 0 to 2
    var d2_pos = 0; // 0 to 2
    var d1_pos = 0; // 0 to 2
    var overload = 0; // 0 to 2

    var d1Max = 0;
    var d2Max = 0;
    var d3Max = 0;

    var d1Min = 0;
    var d2Min = 0;
    var d3Min = 0;

    var liftMax = 0;
    var liftMin = 0;

    function start(pClockFrequency) {
        Timer = setInterval(run, Math.round(1000 * pClockFrequency));
    }

    function stop() {
        if (SimulationRunning) {
            clearInterval(Timer);
            SimulationRunning = false;
        }
    }

    function run() {
        //Create temporary variables
        var nlift_position = lift_position;
        var nd1_pos = d1_pos;
        var nd2_pos = d2_pos;
        var nd3_pos = d3_pos;

        if (Actuators[0]) {
            if (lift_position >= 12) {
                ////new exception('Simulation_Exception','Fahrstuhl haette gestoppt werden muessen!');
                //new exception(2,3);
            }
            else {
                if (Actuators[2]) nlift_position = lift_position + 1 / 4;
                else nlift_position = lift_position + 1;
            }
        }
        if (Actuators[1]) {
            if (lift_position <= 0) {
                ////new exception('Simulation_Exception','Fahrstuhl haette gestoppt werden muessen!');
                //new exception(2,3);
            }
            else {
                if (Actuators[2]) nlift_position = lift_position - 1 / 4;
                else nlift_position = lift_position - 1;
            }
        }
        //first floor
        if (Actuators[3]) {
            if (Math.round(lift_position) == 0) {
                if (d1_pos >= 2) {
                    ////new exception('Simulation_Exception','Tuer haette gestoppt werden muessen!');
                    //new exception(2,4);
                }
                else {
                    nd1_pos = d1_pos + 1;
                }
            }
            //else //new exception('Simulation_Exception','Fahrstuhl befindet sich nicht auf Etage 1. Kann Tuer nicht oeffnen!');
            //else //new exception(2,5);
        }
        if (Actuators[4]) {
            if (Math.round(lift_position) == 0) {
                if (d1_pos <= 0) {
                    //new exception(2,4);
                }
                else {
                    nd1_pos = d1_pos - 1;
                }
            }
            //else //new exception(2,6);
        }
        //second floor
        if (Actuators[5]) {
            if (Math.round(lift_position) == 6) {
                if (d2_pos >= 2) {
                    //new exception(2,4);
                }
                else {
                    nd2_pos = d2_pos + 1;
                }
            }
            //else //new exception(2,5);
        }
        if (Actuators[6]) {
            if (Math.round(lift_position) == 6) {
                if (d2_pos <= 0) {
                    //new exception(2,4);
                }
                else {
                    nd2_pos = d2_pos - 1;
                }
            }
            //else //new exception(2,6);
        }
        //third floor
        if (Actuators[7]) {
            if (Math.round(lift_position) == 12) {
                if (d3_pos >= 2) {
                    //new exception(2,4);
                }
                else {
                    nd3_pos = d3_pos + 1;
                }
            }
            //else //new exception(2,5);
        }
        if (Actuators[8]) {
            if (Math.round(lift_position) == 12) {
                if (d3_pos <= 0) {
                    //new exception(2,4);
                }
                else {
                    nd3_pos = d3_pos - 1;
                }
            }
            //else //new exception(2,6);
        }

        if(lift_position < 0)
        {
            lift_position = 0;
        }

        if(lift_position > 12)
        {
            lift_position = 12;
        }

        lift_position = nlift_position;
        d1_pos = nd1_pos;
        d2_pos = nd2_pos;
        d3_pos = nd3_pos;
        SendSensors();
    }

    function SendSensors() {
        //Calculate input variables
        //var Sensors = new Array();

        //light barriers

        Sensors[13] = false;
        Sensors[14] = false;
        Sensors[15] = false;

        Sensors[25] = overload == 1;

        Sensors[7] = Math.round(d1_pos) == 2;
        Sensors[9] = Math.round(d2_pos) == 2;
        Sensors[11] = Math.round(d3_pos) == 2;
        Sensors[8] = Math.round(d1_pos) == 0;
        Sensors[10] = Math.round(d2_pos) == 0;
        Sensors[12] = Math.round(d3_pos) == 0;
        Sensors[0] = Math.round(lift_position) == 0;
        Sensors[1] = Math.round(lift_position) == 6;
        Sensors[2] = Math.round(lift_position) == 12;
        Sensors[3] = Math.round(lift_position) == 1;
        Sensors[5] = Math.round(lift_position) == 7;
        Sensors[4] = Math.round(lift_position) == 5;
        Sensors[6] = Math.round(lift_position) == 11;

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

    function SendData(Sensors)
    {
        Sim_Message = new DataMessage();

        Sim_Message.setSensors(Sensors);
        Sim_Message.setActuators(Actuators);

        Sim_Type = [];
        Sim_Type = ["SIM"];

        Sim_Message.setParameterStringArray(Sim_Type);

        EventHandler.fireDataSendEvent(Sim_Message);
    }

    start(0.5);
    SendData(Sensors);
}