function Simulation(EventHandler) 
{
    var NumberOfSensors = 10;
    var NumberOfActuators = 8;
	
	
    Simulation.prototype.onData = function (Data) 
    {

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
        //SendData(Sensors);
    };
    
    var Actuators = new Array(128);
    var Sensors = new Array(128);
    var SensorsHaveChangedOldSensors = new Array(128);

    for (var i = 0; i < 128; i++)
    {
        Sensors[i] = false;
    }

	// Initial sensor values
    Sensors[0] = true;
    Sensors[3] = true;
    Sensors[6] = true;


    for (var i = 0; i < 128; i++)
    {
        Actuators[i] = false;
    }

    for (var i = 0; i < 128; i++)
    {
        SensorsHaveChangedOldSensors[i] = false;
    }

    var clockFrequency;
    var Timer = undefined;
    var SimulationIsRunning = false;

    var XMin = 0;
    var XMax = 201;
    var YMin = 0;
    var YMax = 56;
    var ZMin = 0;
    var ZMax = 56;

    // Simulation variables

    var XPosition = XMin; 		// 0 to 201
    var YPosition = YMin; 		// 0 to 56
    var ZPosition = ZMin; 		// 0 to 56
    var EMagnet = 0;            // 0 or 1

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
        var nXPosition = XPosition; 		// 0 to 201
        var nYPosition = YPosition; 		// 0 to 56
        var nZPosition = ZPosition; 		// 0 to 56
        var nEMagnet = EMagnet;           //0 or 1

        for (var i = 0; i < NumberOfActuators; i++) 
        {
            if (Actuators[i] == undefined) 
            {
                return;
            }
        }

        if (Actuators[0]) 
        {
            if (XPosition != XMax)
                nXPosition += 1;
        }

        if (Actuators[1]) 
        {
            if (XPosition != XMin)
                nXPosition -= 1;
        }

        if (Actuators[2]) 
        {
            if (YPosition != YMax)
                nYPosition += 1;
        }

        if (Actuators[3]) 
        {
            if (YPosition != YMin)
                nYPosition -= 1;
        }

        if (Actuators[4]) 
        {
            if (ZPosition != ZMin)
                nZPosition -= 1;
        }

        if (Actuators[5]) 
        {
            if (ZPosition != ZMax)
                nZPosition += 1;
        }

        if (Actuators[6]) 
        {
            nEMagnet = 1;
        } else {
            nEMagnet = 0;
        }

        XPosition = nXPosition;
        YPosition = nYPosition;
        ZPosition = nZPosition;
        EMagnet = nEMagnet;
        SendSensors();
    }

    function SendSensors() 
    {
        //Calculate sensor variables

        //X at outermost right position	-low active-
        Sensors[0] = XPosition == XMax;
        //X at outermost left position	-low active-
        Sensors[1] = XPosition == XMin;
        //X at reference position	-low active-
        Sensors[2] = XPosition == Math.round(XMax / 2);

        Sensors[3] = YPosition == YMax;

        Sensors[4] = YPosition == YMin;

        Sensors[5] = YPosition == Math.round(YMax / 2);

        Sensors[6] = ZPosition == ZMin;

        Sensors[7] = ZPosition == ZMax;

        XPosition.toString(2).padLeft(16,"0").split("").forEach((e,i) => {
            Sensors[31-i] = e === "1";
        });

        YPosition.toString(2).padLeft(16,"0").split("").forEach((e,i) => {
            Sensors[47-i] = e === "1";
        });

        // XPositiontoString(2).padLeft(16,"0").split("").map(e => e==="1");

        // var XBitStringTemp = dec2Bin(XPosition);
        //
        // XBitStringTemp = XBitStringTemp.padLeft(16, "0");
        //
        // for (var i = 16; i < 32; i++)
        // {
        //     Sensors [i] = XBitStringTemp.charAt(31 - i) == "1";
        // }
        //
        // var YBitStringTemp = dec2Bin(YPosition);
        //
        // YBitStringTemp = YBitStringTemp.padLeft(16, "0");
        //
        // for (var i = 32; i < 48; i++)
        // {
        //     Sensors [i] = YBitStringTemp.charAt(127 - i) == "1";
        // }

        if (SensorsHaveChanged(Sensors)) 
        {
            SendData(Sensors);
        }
    }

    function SensorsHaveChanged(Sensors) 
    {

        if (SensorsHaveChangedOldSensors[0] == undefined) 
        {
            SensorsHaveChangedOldSensors = Sensors.slice();
            return true;
        }

        for (var i = 0; i < Sensors.length; i++) 
        {
            if (SensorsHaveChangedOldSensors[i] != Sensors[i]) 
            {
                SensorsHaveChangedOldSensors = Sensors.slice();
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

    start(0.05);
    SendData(Sensors);
}