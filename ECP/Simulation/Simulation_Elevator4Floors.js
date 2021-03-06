function Simulation(EventHandler) 
{
    var NumberOfSensors = 32;
    var NumberOfActuators = 30;

    Simulation.prototype.onData = function (Data) {
        if(Data.getParameterStringArray()[0] == "PSPU")
        {

            if(Data.getSensors()[0] != undefined)
                Sensors = Data.getSensors();
            if(Data.getActuators()[0] != undefined)
                Actuators = Data.getActuators();
        }
    };
    Simulation.prototype.onServerInterfaceInfo = function (Data)
    {
        SendData(Sensors);
    };
    var Actuators = new Array(128);
    var Sensors = new Array(128);
    var sensorsHaveChangedOldSensors = new Array(128);

    for (var i = 0; i < 128; i++)
    {
        Sensors[i] = true;
    }

    // Initial sensor values
    Sensors[13] = false;
    Sensors[14] = false;
    Sensors[15] = false;
    Sensors[31] = false;
    
    Sensors[16] = false;
    Sensors[17] = false;
    Sensors[18] = false;
    Sensors[19] = false;
    Sensors[20] = false;
    Sensors[21] = false;
    Sensors[22] = false;
    Sensors[23] = false;
    Sensors[24] = false;
    Sensors[32] = false;
    Sensors[33] = false;
    Sensors[34] = false;
    

    for (var i = 0; i < 128; i++)
    {
        Actuators[i] = false;
    }

    for (var i = 0; i < 128; i++)
    {
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
    var lift_position = 12; //0 to 19
    var drive_slowly = 0; //0 OR 1
    var d4_pos = 0; // 0 to 2
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

    function start(pClockFrequency) 
    {
        Timer = setInterval(run, Math.round(1000 * pClockFrequency));
    }

    function stop() 
    {
        if (SimulationIsRunning) 
        {
            clearInterval(Timer);
            SimulationIsRunning = false;
        }
    }

    function run() 
    {
        //Create temporary variables
        var nlift_position = lift_position;
        var nd1_pos = d1_pos;
        var nd2_pos = d2_pos;
        var nd3_pos = d3_pos;
        var nd4_pos = d4_pos;

        if (Actuators[0]) 
        {
            if(lift_position < 18)
            {
                if (Actuators[2]) nlift_position = lift_position + 1 / 4;
                else nlift_position = lift_position + 1;
            }
        }
        if (Actuators[1]) 
        {
            if(lift_position > 0)
            {
               if (Actuators[2]) nlift_position = lift_position - 1 / 4;
               else nlift_position = lift_position - 1; 
            }
        }
        //first floor
        if (Actuators[3])
        {
            if(d1_pos < 2) nd1_pos = d1_pos + 1;
        }
        if (Actuators[4])
        {
            if(d1_pos > 0) nd1_pos = d1_pos - 1;
        }            
        //second floor
        if (Actuators[5])
        {
            if(d2_pos < 2) nd2_pos = d2_pos + 1;
        }            
        if (Actuators[6])
        {
            if(d2_pos > 0) nd2_pos = d2_pos - 1;
        }
        //third floor
        if (Actuators[7])
        {
            if(d3_pos < 2) nd3_pos = d3_pos + 1;
        }
        if (Actuators[8])
        {
            if(d3_pos > 0) nd3_pos = d3_pos - 1;
        }
        //fourth floor
        if (Actuators[24])
        {
            if(d4_pos < 2) nd4_pos = d4_pos + 1;
        }

        if (Actuators[25])
        {
            if(d4_pos > 0) nd4_pos = d4_pos - 1;
        }

        lift_position = nlift_position;
        d1_pos = nd1_pos;
        d2_pos = nd2_pos;
        d3_pos = nd3_pos;
        d4_pos = nd4_pos;
        SendSensors();
    }

    function SendSensors() {
        //Calculate input variables

        //light barriers
        Sensors[13] = false;
        Sensors[14] = false;
        Sensors[15] = false;
        Sensors[31] = false;

        Sensors[25] = overload == 1;

        Sensors[7] = Math.round(d1_pos) == 2;
        Sensors[9] = Math.round(d2_pos) == 2;
        Sensors[11] = Math.round(d3_pos) == 2;
        Sensors[29] = Math.round(d4_pos) == 2;
        Sensors[8] = Math.round(d1_pos) == 0;
        Sensors[10] = Math.round(d2_pos) == 0;
        Sensors[12] = Math.round(d3_pos) == 0;
        Sensors[30] = Math.round(d4_pos) == 0;
        Sensors[0] = Math.round(lift_position) == 0;
        Sensors[1] = Math.round(lift_position) == 6;
        Sensors[2] = Math.round(lift_position) == 12;
        Sensors[26] = Math.round(lift_position) == 18;
        Sensors[3] = Math.round(lift_position) == 1;
        Sensors[5] = Math.round(lift_position) == 7;
        Sensors[4] = Math.round(lift_position) == 5;
        Sensors[6] = Math.round(lift_position) == 11;
        Sensors[27] = Math.round(lift_position) == 13;
        Sensors[28] = Math.round(lift_position) == 17;

        if (SensorsHaveChanged(Sensors)) {
            SendData(Sensors);
        }
    }

    function SensorsHaveChanged(Sensors) 
    {
        if (sensorsHaveChangedOldSensors[0] == undefined) 
        {
            sensorsHaveChangedOldSensors = Sensors.slice();
            return true;
        }

        for (var i = 0; i < Sensors.length; i++) 
        {
            if (sensorsHaveChangedOldSensors[i] != Sensors[i]) 
            {
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