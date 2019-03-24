Animation.prototype.InitializeVariablesAndSnapObjects = function(){
    //Initialize Moveable Elements
    this.Snap_TT = Snap('#TT');
    this.Snap_CB1 = Snap('#CB1');
    this.Snap_RT1 = Snap('#RT1');
    this.Snap_CB2 = Snap('#CB2');
    this.Snap_RT2 = Snap('#RT2');
    this.Snap_CB3 = Snap('#CB3');
    this.Snap_MM = Snap('#MM');
    this.Snap_MH = Snap('#MH');

    //Initialize Cubes
    this.Snap_TT_Cube = Snap('#TT_Cube');
    this.Snap_CB1_Cube = Snap('#CB1_Cube');
    this.Snap_RT1_Cube = Snap('#RT1_Cube');
    this.Snap_CB2_Cube = Snap('#CB2_Cube');
    this.Snap_CB2_Profile_Cube = Snap('#CB2_Profile_Cube');
    this.Snap_RT2_Cube = Snap('#RT2_Cube');
    this.Snap_CB3_Cube = Snap('#CB3_Cube');

    //Initialize Substate Cubes
    this.Snap_TT_CB1_Cube   = this.SnapHidden('#TT_CB1_Cube');
    this.Snap_CB1_RT1_Cube  = this.SnapHidden('#CB1_RT1_Cube');
    this.Snap_RT1_CB2_Cube  = this.SnapHidden('#RT1_CB2_Cube');
    this.Snap_CB2_RT2_Cube  = this.SnapHidden('#CB2_RT2_Cube');
    this.Snap_RT2_CB3_Cube  = this.SnapHidden('#RT2_CB3_Cube');
    this.Snap_CB3_TT_Cube   = this.SnapHidden('#CB3_TT_Cube');

    //Initialiue States for Substate Cubes
    this.Cube_TT_CB1  = false; //Substate = Workpiece between TT and FB1
    this.Cube_CB1_RT1 = false; //Substate = Workpiece between FB1 and DT1
    this.Cube_RT1_CB2 = false; //Substate = Workpiece between DT1 and FB2
    this.Cube_CB2_RT2 = false; //Substate = Workpiece between FB2 and DT1
    this.Cube_RT2_CB3 = false; //Substate = Workpiece between DT2 and FB3
    this.Cube_CB3_TT  = false; //Substate = Workpiece between FB3 and TT

    //Pixel-Data for translation of Snap objects
    this.TT_X_Max = 350;
    this.TT_X_Mid = 175;
    this.TT_X_Min = 0;
    this.MM_X_Min = -280;
    this.MM_X_Mid = -140;
    this.MM_X_Max = 0;
    this.MH_Y_Min = -80;
    this.MH_Y_Mid = -40;
    this.MH_Y_Max = 0;

    this.Snap_UserSwitchSlider = Snap('#switchchange');
    this.UserSwitchSliderState = false;
    this.UserSwitchSliderPositionTrue = 82.384;
    this.UserSwitchSliderPositionFalse = 162.384;
    this.UserSwitchSliderColorTrue = "#00FF00";
    this.UserSwitchSliderColorFalse = "#FF0000";

    var Animation = this;
    $("#switch").on("click", function(){
        if(!Animation.UserButtonsEnabled) return;
        Animation.UserSwitchSliderState = !Animation.UserSwitchSliderState;
        if(Animation.UserSwitchSliderState){
            Animation.Snap_UserSwitchSlider.attr("x", Animation.UserSwitchSliderPositionTrue);
            Animation.Snap_UserSwitchSlider.attr("fill", Animation.UserSwitchSliderColorTrue);
            Animation.SendEnvironmentVariableCommand(EnumProductionCellEnvironmentVariables.UserSwitch, "1");
        }else{
            Animation.Snap_UserSwitchSlider.attr("x", Animation.UserSwitchSliderPositionFalse);
            Animation.Snap_UserSwitchSlider.attr("fill", Animation.UserSwitchSliderColorFalse);
            Animation.SendEnvironmentVariableCommand(EnumProductionCellEnvironmentVariables.UserSwitch, "0");
        }
    });

};

// Initializes SVG objects that glow when actuator is active
Animation.prototype.InitializeActuatorSVGObjects = function() {
    this.ActuatorSVGObjects[ 0] = new SVGObject(Snap('#TT_Arrow_Right'));
    this.ActuatorSVGObjects[ 1] = new SVGObject(Snap('#TT_Arrow_Left'));
    this.ActuatorSVGObjects[ 2] = new SVGObject(Snap('#TT_Arrow_Up'));
    this.ActuatorSVGObjects[ 3] = new SVGObject(Snap('#TT_Arrow_Down'));
    this.ActuatorSVGObjects[ 4] = new SVGObject(Snap('#CB1_Arrow'));
    this.ActuatorSVGObjects[ 5] = new SVGObject(Snap('#RT1_Arrow_Counterclockwise'));
    this.ActuatorSVGObjects[ 6] = new SVGObject(Snap('#RT1_Arrow_Clockwise'));
    this.ActuatorSVGObjects[ 7] = new SVGObject(Snap('#RT1_Arrow'));
    this.ActuatorSVGObjects[ 8] = new SVGObject(Snap('#CB2_Arrow'));
    this.ActuatorSVGObjects[ 9] = new SVGObject(Snap('#RT2_Arrow_Counterclockwise'));
    this.ActuatorSVGObjects[10] = new SVGObject(Snap('#RT2_Arrow_Clockwise'));
    this.ActuatorSVGObjects[11] = new SVGObject(Snap('#RT2_Arrow'));
    this.ActuatorSVGObjects[12] = new SVGObject(Snap('#CB3_Arrow'));
    this.ActuatorSVGObjects[13] = new SVGObject(Snap('#MM_Arrow_Right'));
    this.ActuatorSVGObjects[14] = new SVGObject(Snap('#MM_Arrow_Left'));
    this.ActuatorSVGObjects[15] = new SVGObject(Snap('#MH_Arrow_Up'));
    this.ActuatorSVGObjects[16] = new SVGObject(Snap('#MH_Arrow_Down'));
    this.ActuatorSVGObjects[17] = new SVGObject(Snap('#MH_Indicator_Active'));
};

// Initializes SVG objects that blink when user hovers over actuator in ECP
Animation.prototype.InitializeBlinkingActuatorSVGObjects = function() {
    this.ActuatorSVGBlinkingObjects[ 0] = new SVGBlinkingObject(Snap('#TT_Arrow_Right'),"Stroke");
    this.ActuatorSVGBlinkingObjects[ 1] = new SVGBlinkingObject(Snap('#TT_Arrow_Left'),"Stroke");
    this.ActuatorSVGBlinkingObjects[ 2] = new SVGBlinkingObject(Snap('#TT_Arrow_Up'),"Stroke");
    this.ActuatorSVGBlinkingObjects[ 3] = new SVGBlinkingObject(Snap('#TT_Arrow_Down'),"Stroke");
    this.ActuatorSVGBlinkingObjects[ 4] = new SVGBlinkingObject(Snap('#CB1_Arrow'),"Stroke");
    this.ActuatorSVGBlinkingObjects[ 5] = new SVGBlinkingObject(Snap('#RT1_Arrow_Counterclockwise'),"Stroke");
    this.ActuatorSVGBlinkingObjects[ 6] = new SVGBlinkingObject(Snap('#RT1_Arrow_Clockwise'),"Stroke");
    this.ActuatorSVGBlinkingObjects[ 7] = new SVGBlinkingObject(Snap('#RT1_Arrow'),"Stroke");
    this.ActuatorSVGBlinkingObjects[ 8] = new SVGBlinkingObject(Snap('#CB2_Arrow'),"Stroke");
    this.ActuatorSVGBlinkingObjects[ 9] = new SVGBlinkingObject(Snap('#RT2_Arrow_Counterclockwise'),"Stroke");
    this.ActuatorSVGBlinkingObjects[10] = new SVGBlinkingObject(Snap('#RT2_Arrow_Clockwise'),"Stroke");
    this.ActuatorSVGBlinkingObjects[11] = new SVGBlinkingObject(Snap('#RT2_Arrow'),"Stroke");
    this.ActuatorSVGBlinkingObjects[12] = new SVGBlinkingObject(Snap('#CB3_Arrow'),"Stroke");
    this.ActuatorSVGBlinkingObjects[13] = new SVGBlinkingObject(Snap('#MM_Arrow_Right'),"Stroke");
    this.ActuatorSVGBlinkingObjects[14] = new SVGBlinkingObject(Snap('#MM_Arrow_Left'),"Stroke");
    this.ActuatorSVGBlinkingObjects[15] = new SVGBlinkingObject(Snap('#MH_Arrow_Up'),"Stroke");
    this.ActuatorSVGBlinkingObjects[16] = new SVGBlinkingObject(Snap('#MH_Arrow_Down'),"Stroke");
    this.ActuatorSVGBlinkingObjects[17] = new SVGBlinkingObject(Snap('#MH_Indicator_Active'),"Stroke");

    for(var i=0;i<this.ActuatorSVGBlinkingObjects.length;i++){
        this.ActuatorSVGBlinkingObjects[i].AbstractSetBlinking = function(Object){
            Object.attr({"stroke-width":7, "stroke":this.DefaultBlinkingColor});
        };
        this.ActuatorSVGBlinkingObjects[i].AbstractSetUnblinking = function(Object){
            Object.attr({"stroke-width":2, "stroke":"#262626"});
        };
    }
};

// Initializes SVG objects that glow when sensor is active
Animation.prototype.InitializeSensorSVGObjects = function() {
};

// Initializes SVG objects that blink when user hovers over sensors in ECP
Animation.prototype.InitializeBlinkingSensorSVGObjects = function() {
    this.SensorSVGBlinkingObjects[ 0] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_TT,           this.TT_X_Max,   0,              0   ));
    this.SensorSVGBlinkingObjects[ 1] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_TT,           this.TT_X_Min,   0,              0   ));
    this.SensorSVGBlinkingObjects[ 2] = new SVGBlinkingObject(this.CreateNewSVGRect( this.Snap_TT,   this.Snap_TT_Cube,      0,               0,              0   ));
    this.SensorSVGBlinkingObjects[ 3] = new SVGBlinkingObject(this.CreateNewSVGRect( this.Snap_CB1,  this.Snap_CB1_Cube,     0,               0,              0   ));
    this.SensorSVGBlinkingObjects[ 4] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_RT1,          0,               0,              90  ));
    this.SensorSVGBlinkingObjects[ 5] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_RT1,          0,               0,              0   ));
    this.SensorSVGBlinkingObjects[ 6] = new SVGBlinkingObject(this.CreateNewSVGRect( this.Snap_RT1,  this.Snap_RT1_Cube,     0,               0,              0   ));
    this.SensorSVGBlinkingObjects[ 7] = new SVGBlinkingObject(this.CreateNewSVGRect( this.Snap_CB2,  this.Snap_CB2_Cube,     0,               0,              0   ));
    this.SensorSVGBlinkingObjects[ 8] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_RT2,          0,               0,              0   ));
    this.SensorSVGBlinkingObjects[ 9] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_RT2,          0,               0,              90  ));
    this.SensorSVGBlinkingObjects[10] = new SVGBlinkingObject(this.CreateNewSVGRect( this.Snap_RT2,  this.Snap_RT2_Cube,     0,               0,              0   ));
    this.SensorSVGBlinkingObjects[11] = new SVGBlinkingObject(this.CreateNewSVGRect( this.Snap_CB3,  this.Snap_CB3_Cube,     0,               0,              0   ));
    this.SensorSVGBlinkingObjects[12] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_MM,           this.MM_X_Max,   0,              0   ));
    this.SensorSVGBlinkingObjects[13] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_MM,           this.MM_X_Min,   0,              0   ));
    this.SensorSVGBlinkingObjects[14] = new SVGBlinkingObject(this.CreateNewSVGRect( this.Snap_MM,   this.Snap_MH,           0,               this.MH_Y_Min,  0   ));
    this.SensorSVGBlinkingObjects[15] = new SVGBlinkingObject(this.CreateNewSVGRect( this.Snap_MM,   this.Snap_MH,           0,               this.MH_Y_Max,  0   ));
    this.SensorSVGBlinkingObjects[16] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.SVGCanvas,         0,               0,              0   ));
};

Animation.prototype.Refresh = function() {
    //First Check all Substates
    if (this.Cube_TT_CB1 && this.Sensors[1] && !this.Sensors[3] && !this.Sensors[2]) {
        this.Snap_TT_CB1_Cube.attr("visibility", "visible");
    } else {
        this.Snap_TT_CB1_Cube.attr("visibility", "hidden");
        this.Cube_TT_CB1 = false;
    }

    if (this.Cube_CB1_RT1 && this.Sensors[4] && !this.Sensors[3] && !this.Sensors[6]) {
        this.Snap_CB1_RT1_Cube.attr("visibility", "visible");
    } else {
        this.Snap_CB1_RT1_Cube.attr("visibility", "hidden");
        this.Cube_CB1_RT1 = false;
    }

    if (this.Cube_RT1_CB2 && this.Sensors[5] && !this.Sensors[6] && !this.Sensors[7]) {
        this.Snap_RT1_CB2_Cube.attr("visibility", "visible");
    } else {
        this.Snap_RT1_CB2_Cube.attr("visibility", "hidden");
        this.Cube_RT1_CB2 = false;
    }

    if (this.Cube_CB2_RT2 && this.Sensors[8] && !this.Sensors[7] && !this.Sensors[10]) {
        this.Snap_CB2_RT2_Cube.attr("visibility", "visible");
    } else {
        this.Snap_CB2_RT2_Cube.attr("visibility", "hidden");
        this.Cube_CB2_RT2 = false;
    }

    if (this.Cube_RT2_CB3 && this.Sensors[9] && !this.Sensors[10] && !this.Sensors[11]) {
        this.Snap_RT2_CB3_Cube.attr("visibility", "visible");
    } else {
        this.Snap_RT2_CB3_Cube.attr("visibility", "hidden");
        this.Cube_RT2_CB3 = false;
    }

    if (this.Cube_CB3_TT && this.Sensors[0] && !this.Sensors[11] && !this.Sensors[2]) {
        this.Snap_CB3_TT_Cube.attr("visibility", "visible");
    } else {
        this.Snap_CB3_TT_Cube.attr("visibility", "hidden");
        this.Cube_CB3_TT = false;
    }


    if (this.Sensors[0]) {
        this.Snap_TT.transform("translate(" + this.TT_X_Max + ",0)");
    } else {
        if (this.Sensors[1]) {
            //Low active TT position at FB1
            this.Snap_TT.transform("translate( " + this.TT_X_Min + ",0)");
        } else {
            //TT is in between
            this.Snap_TT.transform("translate( " + this.TT_X_Mid + ",0)");
        }
    }
    if (this.Sensors[2]) {
        this.Snap_TT_Cube.attr("visibility", "visible");
    } else {
        this.Snap_TT_Cube.attr("visibility", "hidden");
    }

    if (this.Sensors[1] && this.Sensors[2]) {
        //Substate possible in next refresh
        this.Cube_TT_CB1 = true;
    }

    //CB1
    if (this.Sensors[3]) {
        this.Snap_CB1_Cube.attr("visibility", "visible");
    } else {
        this.Snap_CB1_Cube.attr("visibility", "hidden");
    }

    if (this.Sensors[4] && this.Sensors[3]) {
        //Substate possible in next refresh
        this.Cube_CB1_RT1 = true;
    }

    //RT1
    if (this.Sensors[4]) {
        this.Snap_RT1.transform("r-90");
    } else {
        if (this.Sensors[5]) {
            this.Snap_RT1.transform("r0")
        } else {
            this.Snap_RT1.transform("r-45")
        }
    }
    if (this.Sensors[6]) {
        this.Snap_RT1_Cube.attr("visibility", "visible");
    } else {
        this.Snap_RT1_Cube.attr("visibility", "hidden");
    }

    if (this.Sensors[5] && this.Sensors[6]) {
        //Substate possible in next refresh
        this.Cube_RT1_CB2 = true;
    }

    //CB2
    if (this.Sensors[7]) {
        this.Snap_CB2_Cube.attr("visibility", "visible");
        this.Snap_CB2_Profile_Cube.attr("visibility", "visible");
    } else {
        this.Snap_CB2_Cube.attr("visibility", "hidden");
        this.Snap_CB2_Profile_Cube.attr("visibility", "hidden");
    }

    if (this.Sensors[8] && this.Sensors[7]) {
        //Substate possible in next refresh
        this.Cube_CB2_RT2 = true;
    }

    //RT2
    if (this.Sensors[8]) {
        this.Snap_RT2.transform("r0")
    } else {
        if (this.Sensors[9]) {
            this.Snap_RT2.transform("r90")
        } else {
            this.Snap_RT2.transform("r45")
        }
    }
    if (this.Sensors[10]) {
        this.Snap_RT2_Cube.attr("visibility", "visible");
    } else {
        this.Snap_RT2_Cube.attr("visibility", "hidden");
    }

    if (this.Sensors[9] && this.Sensors[10]) {
        //Substate possible in next refresh
        this.Cube_RT2_CB3 = true;
    }

    //CB3
    if (this.Sensors[11]) {
        this.Snap_CB3_Cube.attr("visibility", "visible");
    } else {
        this.Snap_CB3_Cube.attr("visibility", "hidden");
    }

    if (this.Sensors[0] && this.Sensors[11]) {
        //Substate possible in next refresh
        this.Cube_CB3_TT = true;
    }

    //MM
    if (this.Sensors[12]) {
        this.Snap_MM.transform("translate(" + this.MM_X_Max + ",0)");
    } else {
        if (this.Sensors[13]) {
            this.Snap_MM.transform("translate(" + this.MM_X_Min + ",0)");
        } else {
            this.Snap_MM.transform("translate(" + this.MM_X_Mid + ",0)");
        }
    }
    if (this.Sensors[14]) {
        this.Snap_MH.transform("translate(0, " + this.MH_Y_Min + ")");
    } else {
        if (this.Sensors[15]) {
            this.Snap_MH.transform("translate(0, " + this.MH_Y_Max + ")");
        } else {
            this.Snap_MH.transform("translate(0, " + this.MH_Y_Mid + ")");
        }
    }

    //TODO: Bei Nothalt passiert noch nichts
    if (this.Sensors[16]) {
    }
};