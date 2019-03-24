function Animation(EventHandler, SettingsParameter, CallBack) {
    var Sensors = new Array(128);
    var Actuators = new Array(128);

    //Blinking Variables
    var HoverSelectedParts = [];
    var BlinkingInterval = 600;
    var BlinkingActive = false;

    for (var i = 0; i < 128; i++) {
        Sensors[i] = false;
    }
    Sensors[0] = true;
    Sensors[1] = true;
    Sensors[3] = true;
    Sensors[4] = true;
    Sensors[8] = true;
    Sensors[10] = true;
    Sensors[13] = true;
    Sensors[15] = true;

    var Timer = undefined;
    var BlinkingTimer = undefined;
    var SVG = undefined;
    var SVGCanvas = undefined;

    //Variables for all elements to be manipulated

    //Transport Table
    var Snap_TT = undefined;
    var Snap_TT_Arrow_Right = undefined;
    var Snap_TT_Arrow_Left = undefined;
    var Snap_TT_Arrow_Up = undefined;
    var Snap_TT_Arrow_Down = undefined;
    var Snap_TT_Cube = undefined;

    //Conveyor Belt 1
    var Snap_CB1 = undefined;
    var Snap_CB1_Arrow = undefined;
    var Snap_CB1_Cube = undefined;

    //Rotation Table 1
    var Snap_RT1 = undefined;
    var Snap_RT1_Arrow = undefined;
    var Snap_RT1_Arrow_Clockwise = undefined;
    var Snap_RT1_Arrow_Counterclockwise = undefined;
    var Snap_RT1_Cube = undefined;

    //Conveyor Belt 2
    var Snap_CB2 = undefined;
    var Snap_CB2_Arrow = undefined;
    var Snap_CB2_Cube = undefined;
    var Snap_CB2_Profile_Cube = undefined;

    //Rotation Table 2
    var Snap_RT2 = undefined;
    var Snap_RT2_Arrow = undefined;
    var Snap_RT2_Arrow_Clockwise = undefined;
    var Snap_RT2_Arrow_Counterclockwise = undefined;
    var Snap_RT2_Cube = undefined;

    //Conveyor Belt 3
    var Snap_CB3 = undefined;
    var Snap_CB3_Arrow = undefined;
    var Snap_CB3_Cube = undefined;

    //Milling Machine
    var Snap_MM = undefined;
    var Snap_MM_Arrow_Left = undefined;
    var Snap_MM_Arrow_Right = undefined;

    //Milling Head
    var Snap_MH = undefined;
    var Snap_MH_Arrow_Down = undefined;
    var Snap_MH_Arrow_Up = undefined;
    var Snap_MH_Active = undefined;

    //Substate Cubes
    var Snap_TT_CB1_Cube = undefined;
    var Snap_CB1_RT1_Cube = undefined;
    var Snap_RT1_CB2_Cube = undefined;
    var Snap_CB2_RT2_Cube = undefined;
    var Snap_RT2_CB3_Cube = undefined;
    var Snap_CB3_TT_Cube = undefined;

    var Cube_TT_CB1 = false; //Substate= Workpiece between TT and FB1
    var Cube_CB1_RT1 = false; //Substate= Workpiece between FB1 and DT1
    var Cube_RT1_CB2 = false; //Substate= Workpiece between DT1 and FB2
    var Cube_CB2_RT2 = false; //Substate= Workpiece between FB2 and DT1
    var Cube_RT2_CB3 = false;//Substate= Workpiece between DT2 and FB3
    var Cube_CB3_TT = false;//Substate= Workpiece between FB3 and TT

    //Animation Position Variables
    var TT_X_Max = 350;
    var TT_X_Mid = 175;
    var TT_X_Min = 0;

    var MM_X_Min = -280;
    var MM_X_Mid = -140;
    var MM_X_Max = 0;

    var MH_Y_Min = -80;
    var MH_Y_Mid = -40;
    var MH_Y_Max = 0;

    var State = "InitialState";

    Animation.prototype.onCommand = function (Command) {

    };

    Animation.prototype.onServerInterfaceInfo = function (Info) {

    };

    Animation.prototype.onData = function (Data) {
        Sensors = Data.getSensors();
        Actuators = Data.getActuators();
    };

    Animation.prototype.onHoverEvent = function (HoverData) {
        SetUnitBlinking(HoverData.getType(), HoverData.getUnit());
    };

    function initialize() {
        for (var i = 0; i < 128; i++) {
            Actuators[i] = false;
            Sensors[i] = false;
        }

        $("#" + SettingsParameter.AnimationDIVName).load('ECP/Animation/Images/ProductionCell.svg', function () {
            SVG = $('#SVGAnimation');
            SVGCanvas = Snap('#SVGAnimation');

            SVG.attr("width", "100%");
            SVG.attr("height", "100%");

            Timer = setInterval(Refresh, 100);

            //Initialize all Elements

            //Transport Table
            Snap_TT = Snap('#TT');
            Snap_TT_Arrow_Right = Snap('#TT_Arrow_Right');
            Snap_TT_Arrow_Left = Snap('#TT_Arrow_Left');

            Snap_TT_Arrow_Up = Snap('#TT_Arrow_Up');
            Snap_TT_Arrow_Down = Snap('#TT_Arrow_Down');
            Snap_TT_Cube = Snap('#TT_Cube');

            //Conveyor Belt 1
            Snap_CB1 = Snap('#CB1');
            Snap_CB1_Arrow = Snap('#CB1_Arrow');
            Snap_CB1_Cube = Snap('#CB1_Cube');

            //Rotation Table 1
            Snap_RT1 = Snap('#RT1');
            Snap_RT1_Arrow = Snap('#RT1_Arrow');
            Snap_RT1_Arrow_Clockwise = Snap('#RT1_Arrow_Clockwise');
            Snap_RT1_Arrow_Counterclockwise = Snap('#RT1_Arrow_Counterclockwise');
            Snap_RT1_Cube = Snap('#RT1_Cube');

            //Conveyor Belt 2
            Snap_CB2 = Snap('#CB2');
            Snap_CB2_Arrow = Snap('#CB2_Arrow');
            Snap_CB2_Cube = Snap('#CB2_Cube');
            Snap_CB2_Profile_Cube = Snap('#CB2_Profile_Cube');

            //Rotation Table 2
            Snap_RT2 = Snap('#RT2');
            Snap_RT2_Arrow = Snap('#RT2_Arrow');
            Snap_RT2_Arrow_Clockwise = Snap('#RT2_Arrow_Clockwise');
            Snap_RT2_Arrow_Counterclockwise = Snap('#RT2_Arrow_Counterclockwise');
            Snap_RT2_Cube = Snap('#RT2_Cube');

            //Conveyor Belt 3
            Snap_CB3 = Snap('#CB3');
            Snap_CB3_Arrow = Snap('#CB3_Arrow');
            Snap_CB3_Cube = Snap('#CB3_Cube');

            //Milling Machine
            Snap_MM = Snap('#MM');
            Snap_MM_Arrow_Left = Snap('#MM_Arrow_Left');
            Snap_MM_Arrow_Right = Snap('#MM_Arrow_Right');

            //Milling Head
            Snap_MH = Snap('#MH');
            Snap_MH_Arrow_Down = Snap('#MH_Arrow_Down');
            Snap_MH_Arrow_Up = Snap('#MH_Arrow_Up');
            Snap_MH_Active = Snap('#MH_Indicator_Active');

            //Substate Cubes
            Snap_TT_CB1_Cube = Snap('#TT_CB1_Cube');
            Snap_CB1_RT1_Cube = Snap('#CB1_RT1_Cube');
            Snap_RT1_CB2_Cube = Snap('#RT1_CB2_Cube');
            Snap_CB2_RT2_Cube = Snap('#CB2_RT2_Cube');
            Snap_RT2_CB3_Cube = Snap('#RT2_CB3_Cube');
            Snap_CB3_TT_Cube = Snap('#CB3_TT_Cube');

            Snap_TT_CB1_Cube.attr("visibility", "hidden");
            Snap_CB1_RT1_Cube.attr("visibility", "hidden");
            Snap_RT1_CB2_Cube.attr("visibility", "hidden");
            Snap_CB2_RT2_Cube.attr("visibility", "hidden");
            Snap_RT2_CB3_Cube.attr("visibility", "hidden");
            Snap_CB3_TT_Cube.attr("visibility", "hidden");

            BlinkingTimer = setInterval(function () {
                LetItBlink(HoverSelectedParts, BlinkingActive);
                BlinkingActive = !BlinkingActive;

            }, BlinkingInterval);

            CallBack();
        });
    }

    function SetObjectVisible(Object,Visibility){
        if(Visibility){
           Object.attr({"stroke-width":"5", "stroke":"#00FF00"});
        }else{
           Object.attr({"stroke-width":"2", "stroke":"#262626"});
        }
    }

    function LetItBlink(Parts, Active) {
        if (Parts.length != 0) {
            if (Active) {
                for (var i = 0; i < HoverSelectedParts.length; i++)
                    SetObjectVisible(HoverSelectedParts[i],true);
            } else {
                for (var i = 0; i < HoverSelectedParts.length; i++)
                    SetObjectVisible(HoverSelectedParts[i],false);
            }
        }
    }

    function SetUnitBlinking(BlinkingType, BlinkingUnit) {
        if (BlinkingType == "Clear") {
            for (var i = 0; i < HoverSelectedParts.length; i++)
                SetObjectVisible(HoverSelectedParts[i],false);

            HoverSelectedParts = [];
        }
        else {
            for (var i = 0; i < HoverSelectedParts.length; i++)
                SetObjectVisible(HoverSelectedParts[i],false);

            HoverSelectedParts = [];

            if (BlinkingType == "Sensor") {
                switch (BlinkingUnit) {
                    case "0":
                        HoverSelectedParts.push(Snap_TT);
                        break;
                }
            }
            else if (BlinkingType == "Actuator") {
                switch (BlinkingUnit) {
                    case "0":
                        HoverSelectedParts.push(Snap_TT_Arrow_Right);
                        break;
                    case "1":
                        HoverSelectedParts.push(Snap_TT_Arrow_Left);
                        break;
                    case "2":
                        HoverSelectedParts.push(Snap_TT_Arrow_Up);
                        break;
                    case "3":
                        HoverSelectedParts.push(Snap_TT_Arrow_Down);
                        break;
                    case "4":
                        HoverSelectedParts.push(Snap_CB1_Arrow);
                        break;
                    case "5":
                        HoverSelectedParts.push(Snap_RT1_Arrow_Counterclockwise.parent().selectAll("path")[1]);
                        break;
                    case "6":
                        HoverSelectedParts.push(Snap_RT1_Arrow_Clockwise.parent().selectAll("path")[1]);
                        break;
                    case "7":
                        HoverSelectedParts.push(Snap_RT1_Arrow);
                        break;
                    case "8":
                        HoverSelectedParts.push(Snap_CB2_Arrow);
                        break;
                    case "9":
                        HoverSelectedParts.push(Snap_RT2_Arrow_Counterclockwise.parent().selectAll("path")[1]);
                        break;
                    case "10":
                        HoverSelectedParts.push(Snap_RT2_Arrow_Clockwise.parent().selectAll("path")[1]);
                        break;
                    case "11":
                        HoverSelectedParts.push(Snap_RT2_Arrow);
                        break;
                    case "12":
                        HoverSelectedParts.push(Snap_CB3_Arrow);
                        break;
                    case "13":
                        HoverSelectedParts.push(Snap_MM_Arrow_Right);
                        break;
                    case "14":
                        HoverSelectedParts.push(Snap_MM_Arrow_Left);
                        break;
                    case "15":
                        HoverSelectedParts.push(Snap_MH_Arrow_Up);
                        break;
                    case "16":
                        HoverSelectedParts.push(Snap_MH_Arrow_Down);
                        break;
                    case "17":
                        HoverSelectedParts.push(Snap_MH_Active);
                        break;

                }
            }
        }
    }

    function Refresh() {
        //First Check all Substates
        if (Cube_TT_CB1 && Sensors[1] && !Sensors[3] && !Sensors[2]) {
            Snap_TT_CB1_Cube.attr("visibility", "visible");
        } else {
            Snap_TT_CB1_Cube.attr("visibility", "hidden");
            Cube_TT_CB1 = false;
        }

        if (Cube_CB1_RT1 && Sensors[4] && !Sensors[3] && !Sensors[6]) {
            Snap_CB1_RT1_Cube.attr("visibility", "visible");
        } else {
            Snap_CB1_RT1_Cube.attr("visibility", "hidden");
            Cube_CB1_RT1 = false;
        }

        if (Cube_RT1_CB2 && Sensors[5] && !Sensors[6] && !Sensors[7]) {
            Snap_RT1_CB2_Cube.attr("visibility", "visible");
        } else {
            Snap_RT1_CB2_Cube.attr("visibility", "hidden");
            Cube_RT1_CB2 = false;
        }

        if (Cube_CB2_RT2 && Sensors[8] && !Sensors[7] && !Sensors[10]) {
            Snap_CB2_RT2_Cube.attr("visibility", "visible");
        } else {
            Snap_CB2_RT2_Cube.attr("visibility", "hidden");
            Cube_CB2_RT2 = false;
        }

        if (Cube_RT2_CB3 && Sensors[9] && !Sensors[10] && !Sensors[11]) {
            Snap_RT2_CB3_Cube.attr("visibility", "visible");
        } else {
            Snap_RT2_CB3_Cube.attr("visibility", "hidden");
            Cube_RT2_CB3 = false;
        }

        if (Cube_CB3_TT && Sensors[0] && !Sensors[11] && !Sensors[2]) {
            Snap_CB3_TT_Cube.attr("visibility", "visible");
        } else {
            Snap_CB3_TT_Cube.attr("visibility", "hidden");
            Cube_CB3_TT = false;
        }


        if (Sensors[0]) {
            Snap_TT.transform("translate(" + TT_X_Max + ",0)");
        } else {
            if (Sensors[1]) {
                //Low active TT position at FB1
                Snap_TT.transform("translate( " + TT_X_Min + ",0)");
            } else {
                //TT is in between
                Snap_TT.transform("translate( " + TT_X_Mid + ",0)");
            }
        }
        if (Sensors[2]) {
            Snap_TT_Cube.attr("visibility", "visible");
        } else {
            Snap_TT_Cube.attr("visibility", "hidden");
        }

        if (Sensors[1] && Sensors[2]) {
            //Substate possible in next refresh
            Cube_TT_CB1 = true;
        }

        //CB1
        if (Sensors[3]) {
            Snap_CB1_Cube.attr("visibility", "visible");
        } else {
            Snap_CB1_Cube.attr("visibility", "hidden");
        }

        if (Sensors[4] && Sensors[3]) {
            //Substate possible in next refresh
            Cube_CB1_RT1 = true;
        }

        //RT1
        if (Sensors[4]) {
            Snap_RT1.transform("r-90");
        } else {
            if (Sensors[5]) {
                Snap_RT1.transform("r0")
            } else {
                Snap_RT1.transform("r-45")
            }
        }
        if (Sensors[6]) {
            Snap_RT1_Cube.attr("visibility", "visible");
        } else {
            Snap_RT1_Cube.attr("visibility", "hidden");
        }

        if (Sensors[5] && Sensors[6]) {
            //Substate possible in next refresh
            Cube_RT1_CB2 = true;
        }

        //CB2
        if (Sensors[7]) {
            Snap_CB2_Cube.attr("visibility", "visible");
            Snap_CB2_Profile_Cube.attr("visibility", "visible");
        } else {
            Snap_CB2_Cube.attr("visibility", "hidden");
            Snap_CB2_Profile_Cube.attr("visibility", "hidden");
        }

        if (Sensors[8] && Sensors[7]) {
            //Substate possible in next refresh
            Cube_CB2_RT2 = true;
        }

        //RT2
        if (Sensors[8]) {
            Snap_RT2.transform("r0")
        } else {
            if (Sensors[9]) {
                Snap_RT2.transform("r90")
            } else {
                Snap_RT2.transform("r45")
            }
        }
        if (Sensors[10]) {
            Snap_RT2_Cube.attr("visibility", "visible");
        } else {
            Snap_RT2_Cube.attr("visibility", "hidden");
        }

        if (Sensors[9] && Sensors[10]) {
            //Substate possible in next refresh
            Cube_RT2_CB3 = true;
        }

        //CB3
        if (Sensors[11]) {
            Snap_CB3_Cube.attr("visibility", "visible");
        } else {
            Snap_CB3_Cube.attr("visibility", "hidden");
        }

        if (Sensors[0] && Sensors[11]) {
            //Substate possible in next refresh
            Cube_CB3_TT = true;
        }

        //MM
        if (Sensors[12]) {
            Snap_MM.transform("translate(" + MM_X_Max + ",0)");
        } else {
            if (Sensors[13]) {
                Snap_MM.transform("translate(" + MM_X_Min + ",0)");
            } else {
                Snap_MM.transform("translate(" + MM_X_Mid + ",0)");
            }
        }
        if (Sensors[14]) {
            Snap_MH.transform("translate(0, " + MH_Y_Min + ")");
        } else {
            if (Sensors[15]) {
                Snap_MH.transform("translate(0, " + MH_Y_Max + ")");
            } else {
                Snap_MH.transform("translate(0, " + MH_Y_Mid + ")");
            }
        }
        if (Sensors[16]) {
            Stop = 1;
        } else {
            Stop = 0;
        }

        //Have we got any output values?
        if (Actuators[0] == undefined) {
            return;
        }


        //Actuators
        //TT
        if (Actuators[0]) {
            Snap_TT_Arrow_Right.attr("fill", "#ffff00");

        } else {
            Snap_TT_Arrow_Right.attr("fill", "#7f7f00");

        }
        if (Actuators[1]) {
            Snap_TT_Arrow_Left.attr("fill", "#ffff00");

        } else {
            Snap_TT_Arrow_Left.attr("fill", "#7f7f00");
        }
        if (Actuators[2]) {
            Snap_TT_Arrow_Up.attr("fill", "#ffff00");
        } else {
            Snap_TT_Arrow_Up.attr("fill", "#7f7f00");
        }
        if (Actuators[3]) {
            Snap_TT_Arrow_Down.attr("fill", "#ffff00");
        } else {
            Snap_TT_Arrow_Down.attr("fill", "#7f7f00");
        }

        //CB1
        if (Actuators[4]) {
            Snap_CB1_Arrow.attr("fill", "#ffff00");
        } else {
            Snap_CB1_Arrow.attr("fill", "#7f7f00");
        }

        //RT1
        if (Actuators[5]) {
            Snap_RT1_Arrow_Counterclockwise.attr("fill", "#ffff00");
        } else {
            Snap_RT1_Arrow_Counterclockwise.attr("fill", "#7f7f00");
        }
        if (Actuators[6]) {
            Snap_RT1_Arrow_Clockwise.attr("fill", "#ffff00");
        } else {
            Snap_RT1_Arrow_Clockwise.attr("fill", "#7f7f00");
        }
        if (Actuators[7]) {
            Snap_RT1_Arrow.attr("fill", "#ffff00");
        } else {
            Snap_RT1_Arrow.attr("fill", "#7f7f00");
        }
        //CB2
        if (Actuators[8]) {
            Snap_CB2_Arrow.attr("fill", "#ffff00");
        } else {
            Snap_CB2_Arrow.attr("fill", "#7f7f00");
        }

        //RT2
        if (Actuators[9]) {
            Snap_RT2_Arrow_Counterclockwise.attr("fill", "#ffff00");
        } else {
            Snap_RT2_Arrow_Counterclockwise.attr("fill", "#7f7f00");
        }
        if (Actuators[10]) {
            Snap_RT2_Arrow_Clockwise.attr("fill", "#ffff00");
        } else {
            Snap_RT2_Arrow_Clockwise.attr("fill", "#7f7f00");
        }
        if (Actuators[11]) {
            Snap_RT2_Arrow.attr("fill", "#ffff00");
        } else {
            Snap_RT2_Arrow.attr("fill", "#7f7f00");
        }
        //CB3
        if (Actuators[12]) {
            Snap_CB3_Arrow.attr("fill", "#ffff00");
        } else {
            Snap_CB3_Arrow.attr("fill", "#7f7f00");
        }

        //MM
        if (Actuators[13]) {
            Snap_MM_Arrow_Right.attr("fill", "#ffff00");
        } else {
            Snap_MM_Arrow_Right.attr("fill", "#7f7f00");
        }
        if (Actuators[14]) {
            Snap_MM_Arrow_Left.attr("fill", "#ffff00");
        } else {
            Snap_MM_Arrow_Left.attr("fill", "#7f7f00");
        }
        if (Actuators[15]) {
            Snap_MH_Arrow_Up.attr("fill", "#ffff00");
        } else {
            Snap_MH_Arrow_Up.attr("fill", "#7f7f00");
        }
        if (Actuators[16]) {
            Snap_MH_Arrow_Down.attr("fill", "#ffff00");
        } else {
            Snap_MH_Arrow_Down.attr("fill", "#7f7f00");
        }
        if (Actuators[17]) {
            Snap_MH_Active.attr("fill", "#ffff00");
        } else {
            Snap_MH_Active.attr("fill", "#7f7f00");
        }
    }

    initialize();
}    