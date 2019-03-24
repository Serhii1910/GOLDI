Animation.prototype.InitializeVariablesAndSnapObjects = function(){
    //Initialize Moveable Elements
    this.Snap_XAxis = Snap('#xaxis');
    this.Snap_YAxis = Snap('#yaxis');
    this.Snap_ZAxis = Snap('#zaxis');

    //Initialize Sensor Elements
    this.Snap_XSensorRight = Snap('#sensor_x_right');
    this.Snap_XSensorLeft = Snap('#sensor_x_left');
    this.Snap_XSensorMiddle = Snap('#sensor_x_middle');
    this.Snap_YSensorUp = Snap('#sensor_y_up');
    this.Snap_YSensorDown = Snap('#sensor_y_down');
    this.Snap_YSensorMiddle1 = Snap('#sensor_y_middle1');
    this.Snap_YSensorMiddle2 = Snap('#sensor_y_middle2');
    this.Snap_ZSensorBottom = Snap('#sensor_z_bottom');
    this.Snap_ZSensorTop = Snap('#sensor_z_top');
    this.Snap_SensorHall1 = Snap('#Desk1');
    this.Snap_SensorHall2 = Snap('#Desk2');
    this.Snap_UserSwitch = Snap('#Background');

    //Pixel-Data for translation of Snap objects
    this.XMax = 340;         //Right
    this.XMin = -340;        //Left
    this.XMiddle = 0;        //Reference
    this.YMin = 140;         //Front
    this.YMax = -55;         //Back
    this.YMiddle = 55;       //Reference
    this.ZMin = -80;         //Up
    this.ZMax = 73;          //Down
    this.ZMiddle = -7;       //Between up and down

    this.IncrementalStepsX = 201;
    this.IncrementalStepsY = 56;

    //Initialize Positions of Axis
    this.XPosition = this.XMin;
    this.YPosition = this.YMin;
    this.ZPosition = this.ZMin;

    this.Snap_TextLabelXCoordinate = Snap("#xValue_Bg");
    this.Snap_TextLabelYCoordinate = Snap("#yValue_Bg");

    //Initialize User Variables
    this.Snap_UserSwitchSlider = Snap('#switchchange');
    this.UserSwitchSliderState = false;
    this.UserSwitchSliderPositionTrue = 394;
    this.UserSwitchSliderPositionFalse = 493;
    this.UserSwitchSliderColorTrue = "#00FF00";
    this.UserSwitchSliderColorFalse = "#FF0000";

    var Animation = this;
    $("#switch").on("click", function(){
        if(!Animation.UserButtonsEnabled) return;
        Animation.UserSwitchSliderState = !Animation.UserSwitchSliderState;
        if(Animation.UserSwitchSliderState){
            Animation.Snap_UserSwitchSlider.attr("x", Animation.UserSwitchSliderPositionTrue);
            Animation.Snap_UserSwitchSlider.attr("fill", Animation.UserSwitchSliderColorTrue);
            Animation.SendEnvironmentVariableCommand(Enum3AxisPortalEnvironmentVariables.UserSwitch, "1");
        }else{
            Animation.Snap_UserSwitchSlider.attr("x", Animation.UserSwitchSliderPositionFalse);
            Animation.Snap_UserSwitchSlider.attr("fill", Animation.UserSwitchSliderColorFalse);
            Animation.SendEnvironmentVariableCommand(Enum3AxisPortalEnvironmentVariables.UserSwitch, "0");
        }
    });
};

// Initializes SVG objects that glow when actuator is active
Animation.prototype.InitializeActuatorSVGObjects = function() {
    this.ActuatorSVGObjects[0] = new SVGObject(Snap('#arrowright'));
    this.ActuatorSVGObjects[1] = new SVGObject(Snap('#arrowleft'));
    this.ActuatorSVGObjects[2] = new SVGObject(Snap('#arrowup'));
    this.ActuatorSVGObjects[3] = new SVGObject(Snap('#arrowdown'));
    this.ActuatorSVGObjects[4] = new SVGObject(Snap('#arrowtop'));
    this.ActuatorSVGObjects[5] = new SVGObject(Snap('#arrowbottom'));
    this.ActuatorSVGObjects[6] = new SVGObject(Snap('#magnet'));
};

// Initializes SVG objects that blink when user hovers over actuator in ECP
Animation.prototype.InitializeBlinkingActuatorSVGObjects = function() {
    this.ActuatorSVGBlinkingObjects[0] = new SVGBlinkingObject(Snap('#arrowright'));
    this.ActuatorSVGBlinkingObjects[1] = new SVGBlinkingObject(Snap('#arrowleft'));
    this.ActuatorSVGBlinkingObjects[2] = new SVGBlinkingObject(Snap('#arrowup'));
    this.ActuatorSVGBlinkingObjects[3] = new SVGBlinkingObject(Snap('#arrowdown'));
    this.ActuatorSVGBlinkingObjects[4] = new SVGBlinkingObject(Snap('#arrowtop'));
    this.ActuatorSVGBlinkingObjects[5] = new SVGBlinkingObject(Snap('#arrowbottom'));
    this.ActuatorSVGBlinkingObjects[6] = new SVGBlinkingObject(Snap('#magnet'));

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
    this.SensorSVGObjects[0] = new SVGObject(this.Snap_XSensorRight);
    this.SensorSVGObjects[1] = new SVGObject(this.Snap_XSensorLeft);
    this.SensorSVGObjects[2] = new SVGObject(this.Snap_XSensorMiddle);
    this.SensorSVGObjects[3] = new SVGObject(this.Snap_YSensorUp);
    this.SensorSVGObjects[4] = new SVGObject(this.Snap_YSensorDown);
    this.SensorSVGObjects[5] = new SVGObject([this.Snap_YSensorMiddle1,this.Snap_YSensorMiddle2]);
    this.SensorSVGObjects[6] = new SVGObject(this.Snap_ZSensorBottom);
    this.SensorSVGObjects[7] = new SVGObject(this.Snap_ZSensorTop);
    this.SensorSVGObjects[8] = new SVGObject([this.Snap_SensorHall1,this.Snap_SensorHall2]);
    this.SensorSVGObjects[9] = new SVGObject(this.Snap_UserSwitchSlider);

    for(var i=0;i<this.SensorSVGObjects.length;i++)
        this.SensorSVGObjects[i].AbstractSetInactive = function(Object){
            Object.attr("fill", "#FF0000");
        };

    var Animation = this;
    this.SensorSVGObjects[9].AbstractSetInactive = function(Object){
        Object.attr("x", Animation.UserSwitchSliderPositionFalse);
        Object.attr("fill", Animation.UserSwitchSliderColorFalse);
    };
    this.SensorSVGObjects[9].AbstractSetActive = function(Object){
        Object.attr("x", Animation.UserSwitchSliderPositionTrue);
        Object.attr("fill", Animation.UserSwitchSliderColorTrue);
    };
};

// Initializes SVG objects that blink when user hovers over sensors in ECP
Animation.prototype.InitializeBlinkingSensorSVGObjects = function() {
    this.SensorSVGBlinkingObjects[0] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,  this.Snap_XSensorRight));
    this.SensorSVGBlinkingObjects[1] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,  this.Snap_XSensorLeft));
    this.SensorSVGBlinkingObjects[2] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,  this.Snap_XSensorMiddle));
    this.SensorSVGBlinkingObjects[3] = new SVGBlinkingObject(this.CreateNewSVGRect(this.Snap_YAxis, this.Snap_YSensorUp));
    this.SensorSVGBlinkingObjects[4] = new SVGBlinkingObject(this.CreateNewSVGRect(this.Snap_YAxis, this.Snap_YSensorDown));
    this.SensorSVGBlinkingObjects[5] = new SVGBlinkingObject([this.CreateNewSVGRect(this.SVGCanvas, this.Snap_YSensorMiddle1), this.CreateNewSVGRect(this.SVGCanvas, this.Snap_YSensorMiddle2)]);
    this.SensorSVGBlinkingObjects[6] = new SVGBlinkingObject(this.CreateNewSVGRect(this.Snap_ZAxis, this.Snap_ZSensorBottom));
    this.SensorSVGBlinkingObjects[7] = new SVGBlinkingObject(this.CreateNewSVGRect(this.Snap_ZAxis, this.Snap_ZSensorTop));
    this.SensorSVGBlinkingObjects[8] = new SVGBlinkingObject([this.CreateNewSVGRect(this.SVGCanvas, this.Snap_SensorHall1), this.CreateNewSVGRect(this.SVGCanvas, this.Snap_SensorHall2)]);
    this.SensorSVGBlinkingObjects[9] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,  this.Snap_UserSwitch));
};

Animation.prototype.Refresh = function() {
    // Calcluate X- and Y-pixel-position of the Crane
    var SensorsBitString = "";
    for(var i = 0; i < 128; i++)
        SensorsBitString += this.Sensors[127 - i] ? "1" : "0";

    var XPositionInt = parseInt(SensorsBitString.substr(-32,16), 2);
    this.XPosition = (this.XMax - this.XMin) * XPositionInt / this.IncrementalStepsX + this.XMin;
    this.Snap_TextLabelXCoordinate.attr({text:XPositionInt});

    var YPositionInt = parseInt(SensorsBitString.substr(-48,16), 2);
    this.YPosition = (this.YMax - this.YMin) * YPositionInt / this.IncrementalStepsY + this.YMin;
    this.Snap_TextLabelYCoordinate.attr({text:YPositionInt});

    if(this.Sensors[0]) this.XPosition = this.XMax;
    if(this.Sensors[1]) this.XPosition = this.XMin;
    if(this.Sensors[2]) this.XPosition = this.XMiddle;
    if(this.Sensors[3]) this.YPosition = this.YMax;
    if(this.Sensors[4]) this.YPosition = this.YMin;
    if(this.Sensors[5]) this.YPosition = this.YMiddle;
    if(this.Sensors[6]) this.ZPosition = this.ZMin;
    if(this.Sensors[7]) this.ZPosition = this.ZMax;
    if(!this.Sensors[6] && !this.Sensors[7]) this.ZPosition = this.ZMiddle;

    this.Snap_ZAxis.transform("translate(0," + this.ZPosition + ")");
    this.Snap_YAxis.transform("translate(0," + this.YPosition + ")");
    this.Snap_XAxis.transform("translate(" + this.XPosition + ",0)");
};