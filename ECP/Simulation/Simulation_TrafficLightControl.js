function Simulation(EventHandler) {
    var NumberOfSensors = 8;
    var NumberOfActuators = 12;


    Simulation.prototype.onData = function (Data) {

        if (Data.getParameterStringArray()[0] == "PSPU") {
            if (Data.getSensors()[0] != undefined)
                Sensors = Data.getSensors();
            if (Data.getActuators()[0] != undefined)
                Actuators = Data.getActuators();
        }
    };

    Simulation.prototype.onServerInterfaceInfo = function (Data) {

    };

    var Actuators = new Array(128);
    var Sensors = new Array(128);
    var sensorsHaveChangedOldSensors = new Array(128);
    var SimulationSlowdown = 10;

    for (var i = 0; i < 128; i++) {
        Sensors[i] = false;
    }

    // Initial sensor values
    Sensors[0] = true;
    Sensors[2] = true;
    Sensors[4] = true;
    Sensors[6] = true;

    for (i = 0; i < 128; i++) {
        Actuators[i] = false;
    }

    for (i = 0; i < 128; i++) {
        sensorsHaveChangedOldSensors[i] = undefined;
    }

    var Timer = undefined;
    var SimulationIsRunning = false;

    // Simulation variables
    //traffic light 1
    var TL1_Car = 1;     // 0 or 1 if a car is at the traffic light 1
    var TL1_RJ = 0;      // 0 to 100 for transition between traffic light1 and the end of the road junction
    var RJ1_Car1 = 0;    // 0 or 1 if a car is at the road junction part 1
    var RJ2_Car1 = 0;

    //traffic light 2
    var TL2_Car = 1;    // 0 or 1 if a car is at the traffic light 2
    var TL2_RJ = 0;     // 0 to 100 for transition between traffic light 2 and the end of the road junction
    var RJ2_Car2 = 0;   // 0 or 1 if a car is at the road junction part 2
    var RJ3_Car2 = 0;   // 0 or 1 if a car is at the road junction part 3

    //traffic light 3
    var TL3_Car = 1;    // 0 or 1 if a car is at the traffic light 3
    var TL3_RJ = 0;     // 0 to 100 for transition between traffic light 3 and the end of the road junction
    var RJ3_Car3 = 0;   // 0 or 1 if a car is at the road junction part 3
    var RJ4_Car3 = 0;   // 0 or 1 if a car is at the road junction part 4

    //traffic light 4
    var TL4_Car = 1;    // 0 or 1 if a car is at the traffic light 4
    var TL4_RJ = 0;     // 0 to 100 for transition between traffic light 4 and the end of the road junction
    var RJ4_Car4 = 0;   // 0 or 1 if a car is at the road junction part 4
    var RJ1_Car4 = 0;   // 0 or 1 if a car is at the road junction part 1

    function start(pClockFrequency) {
        Timer = setInterval(run, Math.round(1000 * pClockFrequency));
    }

    this.run = run;
    function run() {

        for (var i = 0; i < NumberOfActuators; i++) {
            if (Actuators[i] == undefined) {
                //new exception(2,2, "Y"+i);
                return;
            }
        }

        //Traffic light 1
        if (Actuators[0] && Actuators[2]) {
            //new exception(2,3);
        }

        if (Actuators[1] && Actuators[2]) {
            //new exception(2,4);
        }

        if (Actuators[2] && Actuators[0]) {
            //new exception(2,3);
        } else if (Actuators[2] && Actuators[1]) {
            //new exception(2,4);
        } else if (Actuators[2] && Actuators[5]) {
            //new exception(2,5);
        } else if (Actuators[2] && Actuators[11]) {
            //new exception(2,6);
        } else if (Actuators[2] && RJ2_Car2 != 0) {
            // new exception (2,7);
        } else if (Actuators[2] && RJ1_Car4 != 0) {
            //new exception (2,8);
        } else if ((Actuators[2] && TL1_Car == 1)|| TL1_RJ > 0) {
            TL1_RJ += Math.round(100 / (SimulationSlowdown));
            if (TL1_RJ > 0 && TL1_RJ <= 50) {
                TL1_Car = 0;
                RJ1_Car1 = 1;
            } else if (TL1_RJ > 50 && TL1_RJ <= 100) {
                RJ1_Car1 = 0;
                RJ2_Car1 = 1;
            } else if (TL1_RJ > 100) {
                RJ2_Car1 = 0;
                TL1_RJ = 0;
                setTimeout(GenerateCar1,(10000*Math.random()));
            }
        }

        // traffic light 2
        if (Actuators[3] && Actuators[5]) {
            //new exception(2,9);
        }
        if (Actuators[4] && Actuators[5]) {
            //new exception(2,10);
        }
        if (Actuators[5] && Actuators[3]) {
            //new exception(2,9);
        } else if (Actuators[5] && Actuators[4]) {
            //new exception(2,10);
        } else if (Actuators[5] && Actuators[2]) {
            //new exception(2,5);
        } else if (Actuators[5] && Actuators[8]) {
            //new exception(2,11);
        } else if (Actuators[5] && RJ2_Car1 != 0) {
            //new exception(2,12);
        } else if (Actuators[5] && RJ3_Car3 != 0) {
            //new exception (2,13);
        } else if ((Actuators[5] && TL2_Car == 1) || TL2_RJ > 0) {
            TL2_RJ += Math.round(100 / (SimulationSlowdown));
            if (TL2_RJ > 0 && TL2_RJ <= 50) {
                TL2_Car = 0;
                RJ2_Car2 = 1;
            } else if (TL2_RJ > 50 && TL2_RJ <= 100) {
                RJ2_Car2 = 0;
                RJ3_Car2 = 1;
            } else if (TL2_RJ > 100) {
                RJ3_Car2 = 0;
                TL2_RJ = 0;
                setTimeout(GenerateCar2,(10000*Math.random()));
            }
        }

        // traffic light 3
        if (Actuators[6] && Actuators[8]) {
            //new exception(2,14);
        }
        if (Actuators[7] && Actuators[8]) {
            //new exception(2,15);
        }
        if (Actuators[8] && Actuators[6]) {
            //new exception(2,14);
        } else if (Actuators[8] && Actuators[7]) {
            //new exception(2,15);
        } else if (Actuators[8] && Actuators[5]) {
            //new exception(2,11);
        } else if (Actuators[8] && Actuators[11]) {
            //new exception(2,16);
        } else if (Actuators[8] && RJ3_Car2 != 0) {
            //new exception(2,17);
        } else if (Actuators[8] && RJ4_Car4 != 0) {
            //new exception(2,18);
        } else if ((Actuators[8] && TL3_Car == 1)|| TL3_RJ > 0) {
            TL3_RJ += Math.round(100 / (SimulationSlowdown));
            if (TL3_RJ > 0 && TL3_RJ <= 50) {
                TL3_Car = 0;
                RJ3_Car3 = 1;
            } else if (TL3_RJ > 50 && TL3_RJ <= 100) {
                RJ3_Car3 = 0;
                RJ4_Car3 = 1;
            } else if (TL3_RJ > 100) {
                RJ4_Car3 = 0;
                TL3_RJ = 0;
                setTimeout(GenerateCar3,(10000*Math.random()));
            }
        }

        // traffic light 4
        if (Actuators[9] && Actuators[11]) {
            //new exception(2,19);
        }
        if (Actuators[10] && Actuators[11]) {
            //new exception(2,20);
        }
        if (Actuators[11] && Actuators[9]) {
            //new exception(2,21);
        } else if (Actuators[11] && Actuators[10]) {
            //new exception(2,22);
        } else if (Actuators[11] && Actuators[2]) {
            //new exception(2,23);
        } else if (Actuators[11] && Actuators[8]) {
            //new exception(2,24);
        } else if (Actuators[11] && RJ4_Car3 != 0) {
            //new exception(2,25);
        } else if (Actuators[11] && RJ1_Car1 != 0) {
            //new exception(2,26);
        } else if ((Actuators[11] && TL4_Car == 1)|| TL4_RJ > 0) {
            TL4_RJ += Math.round(100 / (SimulationSlowdown));
            if (TL4_RJ > 0 && TL4_RJ <= 50) {
                TL4_Car = 0;
                RJ4_Car4 = 1;
            } else if (TL4_RJ > 50 && TL4_RJ <= 100) {
                RJ4_Car4 = 0;
                RJ1_Car4 = 1;
            } else if (TL4_RJ > 100) {
                RJ1_Car4 = 0;
                TL4_RJ = 0;
                setTimeout(GenerateCar4,(10000*Math.random()));
            }

        }

        SendSensors();
    }

    function GenerateCar1(){
        TL1_Car = 1;
    }

    function GenerateCar2(){
        TL2_Car = 1;
    }

    function GenerateCar3(){
        TL3_Car = 1;
    }

    function GenerateCar4() {
        TL4_Car = 1;
    }

    function SendSensors() {
        //Calculate input variables
        var Sensors = [];
        //X0 Car at TL1
        Sensors[0] = true;
        //X1 A Car is at the Road junction part 1
        Sensors[1] = false;
        //X2 Car at TL2
        Sensors[2] = true;
        //X3 A Car is at the Road junction part 2
        Sensors[3] = false;
        //X4 Car at TL3
        Sensors[4] = true;
        //X5 A Car is at the Road junction part 3
        Sensors[5] = false;
        //X6 Car at TL4
        Sensors[6] = true;
        //X7 A Car is at the Road junction part 4
        Sensors[7] = false;

        //road junction part 1
        if (RJ1_Car1 == 1 || RJ1_Car4 == 1) {
            Sensors[1] = true;
        } else {
            Sensors[1] = false;
        }

        //road junction part 2
        if (RJ2_Car1 == 1 || RJ2_Car2 == 1) {
            Sensors[3] = true;
        } else {
            Sensors[3] = false;
        }

        //road junction part 3
        if (RJ3_Car2 == 1 || RJ3_Car3 == 1) {
            Sensors[5] = true;
        } else {
            Sensors[5] = false;
        }

        //road junction part 4
        if (RJ4_Car3 == 1 || RJ4_Car4 == 1) {
            Sensors[7] = true;
        } else {
            Sensors[7] = false;
        }

        if (TL1_Car == 1) {
            Sensors[0] = true;
        } else {
            Sensors[0] = false;
        }

        if (TL2_Car == 1) {
            Sensors[2] = true;
        } else {
            Sensors[2] = false;
        }

        if (TL3_Car == 1) {
            Sensors[4] = true;
        } else {
            Sensors[4] = false;
        }

        if (TL4_Car == 1) {
            Sensors[6] = true;
        } else {
            Sensors[6] = false;
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
        Sim_Message = new DataMessage();

        Sim_Message.setSensors(Sensors);
        Sim_Message.setActuators(Actuators);

        Sim_Type = [];
        Sim_Type = ["SIM"];

        Sim_Message.setParameterStringArray(Sim_Type);

        EventHandler.fireDataSendEvent(Sim_Message);
    }

    start(0.1);
    SendData(Sensors);
}