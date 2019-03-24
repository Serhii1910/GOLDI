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


    Sensors[1] = true;
    Sensors[3] = true;
    Sensors[5] = true;
    Sensors[6] = true;
    Sensors[9] = true;
    Sensors[10] = true;
    Sensors[13] = true;
    Sensors[15] = true;

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
    var CB1_WP = 0; 		// 0 or 1 if a workpiece is on conveyorbelt 1
    var CB1_RT1 = 0;	 	// 0 to 100 for a workpiece in transition between CB1 and rotationtable1
    var RT1_WP = 0; 		// 0 or 1 if a workpiece is on RT1
    var RT1_Rotation = 100; 	// 0 to 100 with 0 beeing the direction of CB1 and 100 the direction of CB2
    var RT1_CB2 = 0; 		// 0 to 100 for a workpiece in transition between RT1 and CB2
    var CB2_WP = 0; 		// 0 or 1 if a workpiece is on CB2
    var CB2_RT2 = 0; 		// 0 to 100 for a workpiece in transition between CB2 and RT2
    var RT2_WP = 0;			// 0 or 1 if a workpiece is on RT2
    var RT2_Rotation = 100; 	// 0 to 100 with 0 beeing the direction of CB2 and 100 the direction of CB3
    var RT2_CB3 = 0; 		// 0 to 100 for a workpiece in transition between RT2 and CB3
    var CB3_WP = 1; 		// 0 or 1 if a workpiece is on CB3
    var CB3_TT = 0; 		// 0 to 100 for a workpiece in transition between CB3 and the Transporttable
    var TT_WP = 0; 			// 0 or 1 if a workpiece is on TT
    var TT_Position = 0; 	// 0 to 100 with 0 being TT at CB1 and 100 being TT at CB3
    var TT_CB1 = 0;			// 0 to 100 for a workpiece in transition between TT and CB1
    var MM_X = 0;			// 0 to 100 X-position of the milling machine
    var MM_Z = 0;			// 0 to 100 Z-position of the milling machine
    var MM_Work = 0;		// 0 or 1 if the milling head is working

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
        //Create temporary variables
        var nCB1_WP = CB1_WP;
        var nCB1_RT1 = CB1_RT1;
        var nRT1_WP = RT1_WP;
        var nRT1_Rotation = RT1_Rotation;
        var nRT1_CB2 = RT1_CB2;
        var nCB2_WP = CB2_WP;
        var nCB2_RT2 = CB2_RT2;
        var nRT2_WP = RT2_WP;
        var nRT2_Rotation = RT2_Rotation;
        var nRT2_CB3 = RT2_CB3;
        var nCB3_WP = CB3_WP;
        var nCB3_TT = CB3_TT;
        var nTT_WP = TT_WP;
        var nTT_Position = TT_Position;
        var nTT_CB1 = TT_CB1;
        var nMM_X = MM_X;
        var nMM_Z = MM_Z;
        var nMM_Work = MM_Work;


        //TT movement
        for (var i = 0; i < SettingsParameter.numOutputs; i++) {
            if (Actuators[i] == undefined) {
                //new exception(2,2, "Y"+i);
                return;
            }
        }
        if (Actuators[0] && TT_Position == 100) {
            //new exception(2,3);
        } else if (Actuators[0] && TT_Position == 0 && TT_CB1 > 0) {
            //new exception(2,4);
        } else if (Actuators[0] && Actuators[1]) {
            //new exception(2,5);
        } else if (Actuators[0] && TT_Position != 100 && TT_CB1 == 0) {
            nTT_Position += Math.round(100 / (SimulationSlowdown));
            if (nTT_Position > 100) {
                nTT_Position = 100
            }
        }
        if (Actuators[1] && TT_Position == 0) {
            //new exception(2,6);
        } else if (Actuators[1] && TT_Position == 100 && CB3_TT > 0) {
            //new exception(2,7);
        } else if (Actuators[0] && Actuators[1]) {
            //new exception(2,5);
        } else if (Actuators[1] && TT_Position != 0 && CB3_TT == 0) {
            nTT_Position -= Math.round(100 / (SimulationSlowdown));
            if (nTT_Position < 0) {
                nTT_Position = 0
            }
        }
        if (TT_Position != 0 && TT_Position != 100 && TT_WP == 1 && (Actuators[3] || Actuators[2])) {
            //new exception(2,8);
        }

        //TT->CB1
        if (Actuators[2] && TT_WP == 1 && TT_Position != 0) {
            //new exception(2,9);
        } else if (Actuators[2] && TT_WP == 1 && TT_Position == 0 && CB1_WP == 1) {
            //new exception(2,10);
        } else if (Actuators[2] && TT_WP == 1 && TT_CB1 == 0 && TT_Position == 0 && CB1_WP == 0 && nTT_Position == 0) {
            nTT_CB1 += Math.round(100 / (SimulationSlowdown));
            nTT_WP = 0;
            if (nTT_CB1 >= 100) {
                nTT_CB1 = 0;
                nCB1_WP = 1;
            }
        } else if (Actuators[2] && TT_WP == 0 && TT_CB1 > 0 && TT_CB1 < 50 && TT_Position == 0 && CB1_WP == 0) {
            nTT_CB1 += Math.round(100 / (SimulationSlowdown));
            if (nTT_CB1 >= 100) {
                nTT_CB1 = 0;
                nCB1_WP = 1;
            }
        } else if (TT_CB1 >= 50 && Actuators[4] && TT_Position == 0 && CB1_WP == 0) {
            nTT_CB1 += Math.round(100 / (SimulationSlowdown));
            if (nTT_CB1 >= 100) {
                nTT_CB1 = 0;
                nCB1_WP = 1;
            }
        }

        //CB1 -> RT1
        if (Actuators[4] && CB1_WP == 1 && RT1_Rotation != 0) {
            //new exception(2,11);
        } else if (Actuators[4] && CB1_WP == 1 && RT1_Rotation == 0 && RT1_WP == 1) {
            //new exception(2,12);
        } else if (Actuators[4] && CB1_WP == 1 && CB1_RT1 == 0 && RT1_Rotation == 0 && RT1_WP == 0) {
            nCB1_RT1 += Math.round(100 / (SimulationSlowdown));
            nCB1_WP = 0;
            if (nCB1_RT1 >= 100) {
                nCB1_RT1 = 0;
                nRT1_WP = 1;
            }
        } else if (Actuators[4] && CB1_WP == 0 && CB1_RT1 > 0 && CB1_RT1 < 50 && RT1_Rotation == 0 && RT1_WP == 0) {
            nCB1_RT1 += Math.round(100 / (SimulationSlowdown));
            if (nCB1_RT1 >= 100) {
                nCB1_RT1 = 0;
                nRT1_WP = 1;
            }
        } else if (Actuators[7] && CB1_WP == 0 && CB1_RT1 >= 50 && RT1_Rotation == 0 && RT1_WP == 0) {
            nCB1_RT1 += Math.round(100 / (SimulationSlowdown));
            if (nCB1_RT1 >= 100) {
                nCB1_RT1 = 0;
                nRT1_WP = 1;
            }
        }
        if (Actuators[7] && RT1_WP == 1 && RT1_Rotation != 100) {
            //new exception(2,13);
        }
        //RT1 Rotation
        if (Actuators[6] && CB1_RT1 > 0) {
            //new exception(2,14);
        }
        if (Actuators[6] && CB1_RT1 == 0 && RT1_Rotation != 100 && !Actuators[5]) {
            nRT1_Rotation += Math.round(100 / (SimulationSlowdown));
            if (nRT1_Rotation >= 100) {
                nRT1_Rotation = 100;
            }
        }
        if (Actuators[6] && RT1_Rotation == 100) {
            //new exception(2,15);
        }


        if (Actuators[5] && RT1_CB2 > 0) {
            //new exception(2,14);
        }
        if (Actuators[5] && RT1_CB2 == 0 && RT1_Rotation != 0 && !Actuators[6]) {
            nRT1_Rotation -= Math.round(100 / (SimulationSlowdown));
            if (nRT1_Rotation <= 0) {
                nRT1_Rotation = 0;
            }
        }
        if (Actuators[5] && RT1_Rotation == 0) {
            //new exception(2,17);
        }
        if (Actuators[5] && Actuators[6]) {
            //new exception(2,19);
        }

        //RT1 -> CB2
        if (Actuators[7] && RT1_WP == 1 && RT1_Rotation == 100 && CB2_WP == 1) {
            //new exception(2,20);
        } else if (Actuators[7] && RT1_WP == 1 && RT1_CB2 == 0 && RT1_Rotation == 100 && CB2_WP == 0) {
            nRT1_CB2 += Math.round(100 / (SimulationSlowdown));
            nRT1_WP = 0;
            if (nRT1_CB2 >= 100) {
                nRT1_CB2 = 0;
                nCB2_WP = 1;
            }
        } else if (Actuators[7] && RT1_WP == 0 && RT1_CB2 > 0 && RT1_CB2 < 50 && RT1_Rotation == 100 && CB2_WP == 0) {
            nRT1_CB2 += Math.round(100 / (SimulationSlowdown));
            if (nRT1_CB2 >= 100) {
                nRT1_CB2 = 0;
                nCB2_WP = 1;
            }
        } else if (Actuators[8] && RT1_WP == 0 && RT1_CB2 >= 50 && RT1_Rotation == 100 && CB2_WP == 0) {
            nRT1_CB2 += Math.round(100 / (SimulationSlowdown));
            if (nRT1_CB2 >= 100) {
                nRT1_CB2 = 0;
                nCB2_WP = 1;
            }
        }

        //CB2 -> RT2

        if (Actuators[8] && CB2_WP == 1 && RT2_Rotation != 0) {
            //new exception(2,21);
        } else if (Actuators[8] && CB2_WP == 1 && RT2_Rotation == 0 && RT2_WP == 1) {
            //new exception(2,22);
        } else if (Actuators[8] && CB2_WP == 1 && CB2_RT2 == 0 && RT2_Rotation == 0 && RT2_WP == 0) {
            nCB2_RT2 += Math.round(100 / (SimulationSlowdown));
            nCB2_WP = 0;
            if (nCB2_RT2 >= 100) {
                nCB2_RT2 = 0;
                nRT2_WP = 1;
            }
        } else if (Actuators[8] && CB2_WP == 0 && CB2_RT2 > 0 && CB2_RT2 < 50 && RT2_Rotation == 0 && RT2_WP == 0) {
            nCB2_RT2 += Math.round(100 / (SimulationSlowdown));
            if (nCB2_RT2 >= 100) {
                nCB2_RT2 = 0;
                nRT2_WP = 1;
            }
        } else if (Actuators[11] && CB2_WP == 0 && CB2_RT2 >= 50 && RT2_Rotation == 0 && RT2_WP == 0) {
            nCB2_RT2 += Math.round(100 / (SimulationSlowdown));
            if (nCB2_RT2 >= 100) {
                nCB2_RT2 = 0;
                nRT2_WP = 1;
            }
        }
        if (Actuators[11] && RT2_WP == 1 && RT2_Rotation != 100) {
            //new exception(2,23);
        }

        //RT2 Rotation

        if (Actuators[10] && CB2_RT2 > 0) {
            //new exception(2,24);
        }
        if (Actuators[10] && CB2_RT2 == 0 && RT2_Rotation != 100 && !Actuators[9]) {
            nRT2_Rotation += Math.round(100 / (SimulationSlowdown));
            if (nRT2_Rotation >= 100) {
                nRT2_Rotation = 100;
            }
        }
        if (Actuators[10] && RT2_Rotation == 100) {
            //new exception(2,25);
        }

        if (Actuators[9] && RT2_CB3 > 0) {
            //new exception(2,26);
        }
        if (Actuators[9] && RT2_CB3 == 0 && RT2_Rotation != 0 && !Actuators[10]) {
            nRT2_Rotation -= Math.round(100 / (SimulationSlowdown));
            if (nRT2_Rotation <= 0) {
                nRT2_Rotation = 0;
            }
        }
        if (Actuators[9] && RT2_Rotation == 0) {
            //new exception(2,27);
        }
        if (Actuators[9] && Actuators[10]) {
            //new exception(2,28);
        }

        //RT2 -> CB3

        if (Actuators[11] && RT2_WP == 1 && RT2_Rotation == 100 && CB3_WP == 1) {
            //new exception(2,29);
        } else if (Actuators[11] && RT2_WP == 1 && RT2_CB3 == 0 && RT2_Rotation == 100 && CB3_WP == 0) {
            nRT2_CB3 += Math.round(100 / (SimulationSlowdown));
            nRT2_WP = 0;
            if (nRT2_CB3 >= 100) {
                nRT2_CB3 = 0;
                nCB3_WP = 1;
            }
        } else if (Actuators[11] && RT2_WP == 0 && RT2_CB3 > 0 && RT2_CB3 < 50 && RT2_Rotation == 100 && CB3_WP == 0) {
            nRT2_CB3 += Math.round(100 / (SimulationSlowdown));
            if (nRT2_CB3 >= 100) {
                nRT2_CB3 = 0;
                nCB3_WP = 1;
            }
        } else if (Actuators[12] && RT2_WP == 0 && RT2_CB3 >= 50 && RT2_Rotation == 100 && CB3_WP == 0) {
            nRT2_CB3 += Math.round(100 / (SimulationSlowdown));
            if (nRT2_CB3 >= 100) {
                nRT2_CB3 = 0;
                nCB3_WP = 1;
            }
        }

        //CB3 -> TT
        if (Actuators[12] && CB3_WP == 1 && TT_Position != 100) {
            //new exception(2,30);
        }
        if (Actuators[12] && CB3_WP == 1 && TT_Position == 100 && TT_WP == 1) {
            //new exception(2,31);
        }
        if (Actuators[12] && CB3_WP == 1 && TT_Position == 100 && TT_WP == 0 && nTT_Position == 100) {
            nCB3_TT += Math.round(100 / (SimulationSlowdown));
            nCB3_WP = 0;
            if (nCB3_TT >= 100) {
                nCB3_TT = 0;
                nTT_WP = 1;
            }
        } else if (Actuators[12] && TT_WP == 0 && CB3_TT > 0 && CB3_TT < 50 && TT_Position == 100) {
            nCB3_TT += Math.round(100 / (SimulationSlowdown));
            if (nCB3_TT >= 100) {
                nCB3_TT = 0;
                nTT_WP = 1;
            }
        } else if (Actuators[3] && TT_WP == 0 && CB3_TT >= 50 && TT_Position == 100) {
            nCB3_TT += Math.round(100 / (SimulationSlowdown));
            if (nCB3_TT >= 100) {
                nCB3_TT = 0;
                nTT_WP = 1;
            }
        }
        //MM_X
        if (Actuators[14] && MM_X == 0) {
            //new exception(2,32);
        }
        if (Actuators[13] && Actuators[14]) {
            //new exception(2,33);
        }
        if (Actuators[14] && !Actuators[13] && MM_X > 0) {
            nMM_X -= Math.round(100 / (SimulationSlowdown));
            if (nMM_X <= 0) {
                nMM_X = 0;
            }
        }
        if (Actuators[13] && MM_X == 100) {
            //new exception(2,34);
        }
        if (Actuators[13] && !Actuators[14] && MM_X < 100) {
            nMM_X += Math.round(100 / (SimulationSlowdown));
            if (nMM_X >= 100) {
                nMM_X = 100;
            }
        }

        //MM_Z
        if (Actuators[15] && MM_Z == 0) {
            //new exception(2,35);
        }
        if (Actuators[15] && Actuators[16]) {
            //new exception(2,36);
        }
        if (Actuators[15] && !Actuators[16] && MM_Z > 0) {
            nMM_Z -= Math.round(100 / (SimulationSlowdown));
            if (nMM_Z <= 0) {
                nMM_Z = 0;
            }
        }
        if (Actuators[16] && MM_Z == 100) {
            //new exception(2,37);
        }
        if (Actuators[16] && !Actuators[15] && MM_Z < 100) {
            nMM_Z += Math.round(100 / (SimulationSlowdown));
            if (nMM_Z >= 100) {
                nMM_Z = 100;
            }
        }

        if (Actuators[17]) {
            nMM_Work = 1;
        } else {
            nMM_Work = 0;
        }

        CB1_WP = nCB1_WP;
        CB1_RT1 = nCB1_RT1;
        RT1_WP = nRT1_WP;
        RT1_Rotation = nRT1_Rotation;
        RT1_CB2 = nRT1_CB2;
        CB2_WP = nCB2_WP;
        CB2_RT2 = nCB2_RT2;
        RT2_WP = nRT2_WP;
        RT2_Rotation = nRT2_Rotation;
        RT2_CB3 = nRT2_CB3;
        CB3_WP = nCB3_WP;
        CB3_TT = nCB3_TT;
        TT_WP = nTT_WP;
        TT_Position = nTT_Position;
        TT_CB1 = nTT_CB1;
        MM_X = nMM_X;
        MM_Z = nMM_Z;
        MM_Work = nMM_Work;
        SendSensors();
    }

    function SendSensors() {
        //Calculate input variables
        var Sensors = [];
        //X0 TT at CB3	-low active-
        Sensors[0] = TT_Position == 100;
        //X1 TT at CB1	-low active-
        Sensors[1] = TT_Position == 0;
        //X2 TT has WP
        Sensors[2] = TT_WP == 1;
        //X3 CB1 has WP
        Sensors[3] = CB1_WP == 1;
        //X4 RT1 at CB1		-low active-
        Sensors[4] = RT1_Rotation == 0;
        //X5 RT1 at CB 2	-low active-
        Sensors[5] = RT1_Rotation == 100;
        //X6 RT1 has WP
        Sensors[6] = RT1_WP == 1;
        //X7 CB2 has WP
        Sensors[7] = CB2_WP == 1;
        //X8 RT2 at CB2	-low active-
        Sensors[8] = RT2_Rotation == 0;
        //X9 RT2 at CB3	-low active-
        Sensors[9] = RT2_Rotation == 100;
        //X10 RT2 has WP
        Sensors[10] = RT2_WP == 1;
        //X11 CB3 has WP
        Sensors[11] = CB3_WP == 1;
        //X12 MM away CB2 -low active-
        Sensors[13] = MM_X == 0;
        //X13 MM at CB2 -low active-
        Sensors[12] = MM_X == 100;
        //X14 MM up -low active-
        Sensors[14] = MM_Z == 0;
        //X15 MM down -low active-
        Sensors[15] = MM_Z == 100;

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

    var content = '';
    content += '<table><tr><td><span>Please select where to place the Workpieces:</span></td></tr></table><table id="SimulationInitTable"><tbody>';
    content += '<tr class="blank_row"><td colspan="2"></td></tr>';
    content += '<tr><td><span>TT:</span></td>';
    content += '<td><select id="SimulationInitTTWP"><option value="1">Yes</option><option value="0" selected>No</option></td></tr>';
    content += '<tr><td><span>FB1:</span></td>';
    content += '<td><select id="SimulationInitCB1WP"><option value="1">Yes</option><option value="0" selected>No</option></td></tr>';
    content += '<tr><td><span>DT1:</span></td>';
    content += '<td><select id="SimulationInitRT1WP"><option value="1">Yes</option><option value="0" selected>No</option></td></tr>';
    content += '<tr><td><span>FB2:</span></td>';
    content += '<td><select id="SimulationInitCB2WP"><option value="1">Yes</option><option value="0" selected>No</option></td></tr>';
    content += '<tr><td><span>DT2:</span></td>';
    content += '<td><select id="SimulationInitRT2WP"><option value="1" selected>Yes</option><option value="0">No</option></td></tr>';
    content += '<tr><td><span>FB3: </span></td>';
    content += '<td><select id="SimulationInitCB3WP"><option value="1">Yes</option><option value="0" selected>No</option></td></tr>';
    content += '</tbody></table>';
    $('#SimulationInitDialogBody').html(content);

    $("#SimulationInitDialog").modal();
    $('#SimulationInitDialog').on('hidden.bs.modal', function () {
        TT_WP = $("#SimulationInitTTWP").val();
        CB1_WP = $("#SimulationInitCB1WP").val();
        RT1_WP = $("#SimulationInitRT1WP").val();
        CB2_WP = $("#SimulationInitCB2WP").val();
        RT2_WP = $("#SimulationInitRT2WP").val();
        CB3_WP = $("#SimulationInitCB3WP").val();
        start(1);
        SendSensors(Sensors);
    });
}