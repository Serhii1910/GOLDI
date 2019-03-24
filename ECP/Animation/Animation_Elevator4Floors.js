Animation.prototype.InitializeVariablesAndSnapObjects = function(){
    //Init Opacity of Elevator-Overlay
    var Wall = Snap('#wall');
    Wall.attr("fill-opacity", "0.3");

    //Initialize Moveable Elements
    this.Snap_Elevator = Snap('#Elevator');
    this.Snap_Door1Left = Snap('#door1left');
    this.Snap_Door1Right = Snap('#door1right');
    this.Snap_Door2Left = Snap('#door2left');
    this.Snap_Door2Right = Snap('#door2right');
    this.Snap_Door3Left = Snap('#door3left');
    this.Snap_Door3Right = Snap('#door3right');
    this.Snap_Door4Left = Snap('#door4left');
    this.Snap_Door4Right = Snap('#door4right');

    //Initialize Actuator Elements
    this.Snap_ArrowUpFloor1 = Snap('#arrowupfloor1');
    this.Snap_ArrowUpFloor2 = Snap('#arrowupfloor2');
    this.Snap_ArrowDownFloor2 = Snap('#arrowdownfloor2');
    this.Snap_ArrowDownFloor3 = Snap('#arrowdownfloor3');
    this.Snap_ArrowUpFloor3 = Snap('#arrowupfloor3');
    this.Snap_ArrowDownFloor4 = Snap('#arrowdownfloor4');
    this.Snap_ArrowUpTop = Snap('#arrowuptop');
    this.Snap_ArrowDownTop = Snap('#arrowdowntop');
    this.Snap_IndicatorDisplayFloor1 = Snap('#buttonfloor1');
    this.Snap_IndicatorDisplayFloor2 = Snap('#buttonfloor2');
    this.Snap_IndicatorDisplayFloor3 = Snap('#buttonfloor3');
    this.Snap_IndicatorDisplayFloor4 = Snap('#buttonfloor4');
    this.Snap_EC_LED_Floor1 = Snap('#ledgroundfloor');
    this.Snap_EC_LED_Floor2 = Snap('#ledfirstfloor');
    this.Snap_EC_LED_Floor3 = Snap('#ledsecondfloor');
    this.Snap_EC_LED_Floor4 = Snap('#ledthirdfloor');
    this.Snap_EC_LED_Alert = Snap('#ledalarm');
    this.Snap_EC_LED_EmergencyStop = Snap('#ledemergencystop');
    this.Snap_EC_LED_Overload = Snap('#ledoverload');

    //Initialize Sensor Elements
    this.Snap_EC_ButtonFloor1 = Snap('#buttongroundfloor');
    this.Snap_EC_ButtonFloor2 = Snap('#buttonfirstfloor');
    this.Snap_EC_ButtonFloor3 = Snap('#buttonsecondfloor');
    this.Snap_EC_ButtonFloor4 = Snap('#buttonthirdfloor');
    this.Snap_EC_ButtonAlert = Snap('#buttonalarm');
    this.Snap_EC_ButtonEmergencyStop = Snap('#buttonemergencystop');

    this.Snap_ButtonOverload = Snap('#buttonoverload');

    //Pixel-Data for translation of Snap objects
    this.ElevatorCagePositionFloor4 = -482;
    this.ElevatorCagePositionBelowFloor4 = -432;
    this.ElevatorCagePositionAboveFloor3 = -372;
    this.ElevatorCagePositionFloor3 = -322;
    this.ElevatorCagePositionBelowFloor3 = -272;
    this.ElevatorCagePositionAboveFloor2 = -212;
    this.ElevatorCagePositionFloor2 = -162;
    this.ElevatorCagePositionBelowFloor2 = -122;
    this.ElevatorCagePositionAboveFloor1 = -62;
    this.ElevatorCagePositionFloor1 = 0;

    this.DoorClosedPositionLeft = 0;
    this.DoorMiddlePositionLeft = -16;
    this.DoorOpenPositionLeft = -32;

    this.DoorClosedPositionRight = 0;
    this.DoorMiddlePositionRight = 16;
    this.DoorOpenPositionRight = 32;

    //Initialize User Variables
    var ButtonEventAssignment = {
        "arrowupfloor1":EnumElevatorEnvironmentVariables.CallButtonFloor1,
        "arrowupfloor2":EnumElevatorEnvironmentVariables.CallButtonFloor2Up,
        "arrowupfloor3":EnumElevatorEnvironmentVariables.CallButtonFloor3Up,
        "arrowdownfloor2":EnumElevatorEnvironmentVariables.CallButtonFloor2Down,
        "arrowdownfloor3":EnumElevatorEnvironmentVariables.CallButtonFloor3Down,
        "arrowdownfloor4":EnumElevatorEnvironmentVariables.CallButtonFloor4,
        "buttonoverload":EnumElevatorEnvironmentVariables.SimulationOverload,
        "buttongroundfloor":EnumElevatorEnvironmentVariables.ElevatorControlFloor1,
        "buttonfirstfloor":EnumElevatorEnvironmentVariables.ElevatorControlFloor2,
        "buttonsecondfloor":EnumElevatorEnvironmentVariables.ElevatorControlFloor3,
        "buttonthirdfloor":EnumElevatorEnvironmentVariables.ElevatorControlFloor4,
        "buttonalarm":EnumElevatorEnvironmentVariables.ElevatorControlAlert,
        "buttonemergencystop":EnumElevatorEnvironmentVariables.ElevatorControlEmStop
    };

    var Animation = this;
    $.each(ButtonEventAssignment, function(key, value){
        var TMP = $('#'+key);
        TMP.bind("mousedown", function () {
            if(!Animation.UserButtonsEnabled) return;
            Animation.SendEnvironmentVariableCommand(value, "1");
        });
        TMP.bind("mouseleave mouseup", function () {
            if(!Animation.UserButtonsEnabled) return;
            Animation.SendEnvironmentVariableCommand(value, "0");
        });
    });
};

// Initializes SVG objects that glow when actuator is active
Animation.prototype.InitializeActuatorSVGObjects = function() {
    //Actuators 9-17 are arrow or circle objects and has standard behavior
    this.ActuatorSVGObjects[ 9] = new SVGObject(this.Snap_ArrowUpFloor1);
    this.ActuatorSVGObjects[10] = new SVGObject(this.Snap_ArrowUpFloor2);
    this.ActuatorSVGObjects[11] = new SVGObject(this.Snap_ArrowDownFloor2);
    this.ActuatorSVGObjects[12] = new SVGObject(this.Snap_ArrowDownFloor3);
    this.ActuatorSVGObjects[13] = new SVGObject(this.Snap_IndicatorDisplayFloor1);
    this.ActuatorSVGObjects[14] = new SVGObject(this.Snap_IndicatorDisplayFloor2);
    this.ActuatorSVGObjects[15] = new SVGObject(this.Snap_IndicatorDisplayFloor3);
    this.ActuatorSVGObjects[16] = new SVGObject(this.Snap_ArrowDownTop);
    this.ActuatorSVGObjects[17] = new SVGObject(this.Snap_ArrowUpTop);

    //Actuators 18-20 has darkgreen inactive color
    this.ActuatorSVGObjects[18] = new SVGObject(this.Snap_EC_LED_Floor1);
    this.ActuatorSVGObjects[19] = new SVGObject(this.Snap_EC_LED_Floor2);
    this.ActuatorSVGObjects[20] = new SVGObject(this.Snap_EC_LED_Floor3);
    for(var i=18;i<=20;i++)
        this.ActuatorSVGObjects[i].AbstractSetInactive = function(Object){
            Object.attr({"fill":"#006837"});
        }

    //Actuators 21-23 has darkred inactive color
    this.ActuatorSVGObjects[21] = new SVGObject(this.Snap_EC_LED_Alert);
    this.ActuatorSVGObjects[22] = new SVGObject(this.Snap_EC_LED_EmergencyStop);
    this.ActuatorSVGObjects[23] = new SVGObject(this.Snap_EC_LED_Overload);
    for(i=21;i<=23;i++)
        this.ActuatorSVGObjects[i].AbstractSetInactive = function (Object) {
            Object.attr({"fill": "#A01717"});
        };

    //Special for Elevator4Floors
    this.ActuatorSVGObjects[26] = new SVGObject(this.Snap_ArrowUpFloor3);
    this.ActuatorSVGObjects[27] = new SVGObject(this.Snap_ArrowDownFloor4);
    this.ActuatorSVGObjects[28] = new SVGObject(this.Snap_IndicatorDisplayFloor4);

    this.ActuatorSVGObjects[29] = new SVGObject(this.Snap_EC_LED_Floor4);
    this.ActuatorSVGObjects[29].AbstractSetInactive = function(Object){
        Object.attr({"fill":"#006837"});
    }
};

// Initializes SVG objects that blink when user hovers over actuator in ECP
Animation.prototype.InitializeBlinkingActuatorSVGObjects = function() {
    //Initialize all blinking actuators with the objects from the standard actuators and override the blinkung and unblinking method
    for(var i=0;i<this.ActuatorSVGObjects.length;i++){
        this.ActuatorSVGBlinkingObjects[i] = new SVGBlinkingObject(this.ActuatorSVGObjects[i].Objects);
        this.ActuatorSVGBlinkingObjects[i].AbstractSetBlinking = function(Object){
            Object.attr({"stroke-width":7, "stroke":this.DefaultBlinkingColor});
        };
        this.ActuatorSVGBlinkingObjects[i].AbstractSetUnblinking = function(Object){
            Object.attr({"stroke-width":1, "stroke":"#3A3A3A"});
        };
    }

    //Create copyobjects for all doors an their positions
    var Snap_Floor1DoorLeftOpen     = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door1Left,this.DoorOpenPositionLeft);
    var Snap_Floor1DoorLeftClosed   = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door1Left);
    var Snap_Floor1DoorRightOpen    = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door1Right,this.DoorOpenPositionRight);
    var Snap_Floor1DoorRightClosed  = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door1Right);

    var Snap_Floor2DoorLeftOpen     = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door2Left,this.DoorOpenPositionLeft);
    var Snap_Floor2DoorLeftClosed   = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door2Left);
    var Snap_Floor2DoorRightOpen    = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door2Right,this.DoorOpenPositionRight);
    var Snap_Floor2DoorRightClosed  = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door2Right);

    var Snap_Floor3DoorLeftOpen     = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door3Left,this.DoorOpenPositionLeft);
    var Snap_Floor3DoorLeftClosed   = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door3Left);
    var Snap_Floor3DoorRightOpen    = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door3Right,this.DoorOpenPositionRight);
    var Snap_Floor3DoorRightClosed  = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door3Right);

    //Blinking Actuators for doors override indizes 3-8
    this.ActuatorSVGBlinkingObjects[3] = new SVGBlinkingObject([Snap_Floor1DoorLeftOpen,Snap_Floor1DoorRightOpen]);
    this.ActuatorSVGBlinkingObjects[4] = new SVGBlinkingObject([Snap_Floor1DoorLeftClosed,Snap_Floor1DoorRightClosed]);
    this.ActuatorSVGBlinkingObjects[5] = new SVGBlinkingObject([Snap_Floor2DoorLeftOpen,Snap_Floor2DoorRightOpen]);
    this.ActuatorSVGBlinkingObjects[6] = new SVGBlinkingObject([Snap_Floor2DoorLeftClosed,Snap_Floor2DoorRightClosed]);
    this.ActuatorSVGBlinkingObjects[7] = new SVGBlinkingObject([Snap_Floor3DoorLeftOpen,Snap_Floor3DoorRightOpen]);
    this.ActuatorSVGBlinkingObjects[8] = new SVGBlinkingObject([Snap_Floor3DoorLeftClosed,Snap_Floor3DoorRightClosed]);

    //Special for Elevator4Floors
    var Snap_Floor4DoorLeftOpen     = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door4Left,this.DoorOpenPositionLeft);
    var Snap_Floor4DoorLeftClosed   = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door4Left);
    var Snap_Floor4DoorRightOpen    = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door4Right,this.DoorOpenPositionRight);
    var Snap_Floor4DoorRightClosed  = this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Door4Right);

    this.ActuatorSVGBlinkingObjects[24] = new SVGBlinkingObject([Snap_Floor4DoorLeftOpen,Snap_Floor4DoorRightOpen]);
    this.ActuatorSVGBlinkingObjects[25] = new SVGBlinkingObject([Snap_Floor4DoorLeftClosed,Snap_Floor4DoorRightClosed]);
};

// Initializes SVG objects that glow when sensor is active
Animation.prototype.InitializeSensorSVGObjects = function() {
    this.SensorSVGObjects[20] = new SVGObject(this.Snap_EC_ButtonFloor1);
    this.SensorSVGObjects[21] = new SVGObject(this.Snap_EC_ButtonFloor2);
    this.SensorSVGObjects[22] = new SVGObject(this.Snap_EC_ButtonFloor3);
    this.SensorSVGObjects[34] = new SVGObject(this.Snap_EC_ButtonFloor4);

    var Animation = this;
    $.each([20, 21, 22, 34], function (index, value) {
        Animation.SensorSVGObjects[value].AbstractSetActive = function (Object) {
            Object.attr({"fill": "#00FF00"});
        };
        Animation.SensorSVGObjects[value].AbstractSetInactive = function (Object) {
            Object.attr({"fill": "#006837"});
        };
    });

    this.SensorSVGObjects[23] = new SVGObject(this.Snap_EC_ButtonAlert);
    this.SensorSVGObjects[24] = new SVGObject(this.Snap_EC_ButtonEmergencyStop);

    for (var i = 23; i <= 24; i++)
        this.SensorSVGObjects[i].AbstractSetInactive = function (Object) {
            Object.attr({"fill": "#A01717"});
        };
};
// Initializes SVG objects that blink when user hovers over sensors in ECP
Animation.prototype.InitializeBlinkingSensorSVGObjects = function() {
    //Sensors 0-6 display the elevator cage on the different positions
    this.SensorSVGBlinkingObjects[0] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas, this.Snap_Elevator, 0, this.ElevatorCagePositionFloor1));
    this.SensorSVGBlinkingObjects[1] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas, this.Snap_Elevator, 0, this.ElevatorCagePositionFloor2));
    this.SensorSVGBlinkingObjects[2] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas, this.Snap_Elevator, 0, this.ElevatorCagePositionFloor3));
    this.SensorSVGBlinkingObjects[3] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas, this.Snap_Elevator, 0, this.ElevatorCagePositionAboveFloor1));
    this.SensorSVGBlinkingObjects[4] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas, this.Snap_Elevator, 0, this.ElevatorCagePositionBelowFloor2));
    this.SensorSVGBlinkingObjects[5] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas, this.Snap_Elevator, 0, this.ElevatorCagePositionAboveFloor2));
    this.SensorSVGBlinkingObjects[6] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas, this.Snap_Elevator, 0, this.ElevatorCagePositionBelowFloor3));

    //Sensors 7-12 blinking doors could be reused from actuators
    this.SensorSVGBlinkingObjects[ 7] = this.ActuatorSVGBlinkingObjects[ 3];
    this.SensorSVGBlinkingObjects[ 8] = this.ActuatorSVGBlinkingObjects[ 4];
    this.SensorSVGBlinkingObjects[ 9] = this.ActuatorSVGBlinkingObjects[ 5];
    this.SensorSVGBlinkingObjects[10] = this.ActuatorSVGBlinkingObjects[ 6];
    this.SensorSVGBlinkingObjects[11] = this.ActuatorSVGBlinkingObjects[ 7];
    this.SensorSVGBlinkingObjects[12] = this.ActuatorSVGBlinkingObjects[ 8];

    //Sensors 16-19 for blinking call buttons could be reused from actuators
    this.SensorSVGBlinkingObjects[16] = this.ActuatorSVGBlinkingObjects[ 9];
    this.SensorSVGBlinkingObjects[17] = this.ActuatorSVGBlinkingObjects[10];
    this.SensorSVGBlinkingObjects[18] = this.ActuatorSVGBlinkingObjects[11];
    this.SensorSVGBlinkingObjects[19] = this.ActuatorSVGBlinkingObjects[12];

    //Sensors 20-25 could blink with stroke 1 or 2, belongs to the object
    this.SensorSVGBlinkingObjects[20] = new SVGBlinkingObject(this.Snap_EC_ButtonFloor1);
    this.SensorSVGBlinkingObjects[21] = new SVGBlinkingObject(this.Snap_EC_ButtonFloor2);
    this.SensorSVGBlinkingObjects[22] = new SVGBlinkingObject(this.Snap_EC_ButtonFloor3);
    this.SensorSVGBlinkingObjects[23] = new SVGBlinkingObject(this.Snap_EC_ButtonAlert);
    this.SensorSVGBlinkingObjects[24] = new SVGBlinkingObject(this.Snap_EC_ButtonEmergencyStop);
    this.SensorSVGBlinkingObjects[25] = new SVGBlinkingObject(this.Snap_ButtonOverload);

    for(var i=20;i<=25;i++){
        this.SensorSVGBlinkingObjects[i].AbstractSetBlinking = function(Object){
            Object.attr({"stroke-width":7, "stroke":this.DefaultBlinkingColor});
        };
        this.SensorSVGBlinkingObjects[i].AbstractSetUnblinking = function(Object){
            Object.attr({"stroke-width":2, "stroke":"#3A3A3A"});
        };
    }

    this.SensorSVGBlinkingObjects[25].AbstractSetUnblinking = function(Object){
        Object.attr({"stroke-width":1, "stroke":"#3A3A3A"});
    };

    //Special for Elevator4Floors
    this.SensorSVGBlinkingObjects[26] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas, this.Snap_Elevator, 0, this.ElevatorCagePositionFloor4));
    this.SensorSVGBlinkingObjects[27] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas, this.Snap_Elevator, 0, this.ElevatorCagePositionAboveFloor3));
    this.SensorSVGBlinkingObjects[28] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas, this.Snap_Elevator, 0, this.ElevatorCagePositionBelowFloor4));
    this.SensorSVGBlinkingObjects[29] = this.ActuatorSVGBlinkingObjects[24];
    this.SensorSVGBlinkingObjects[30] = this.ActuatorSVGBlinkingObjects[25];
    this.SensorSVGBlinkingObjects[31] = new SVGBlinkingObject();
    this.SensorSVGBlinkingObjects[32] = this.ActuatorSVGBlinkingObjects[26];
    this.SensorSVGBlinkingObjects[33] = this.ActuatorSVGBlinkingObjects[27];
    this.SensorSVGBlinkingObjects[34] = new SVGBlinkingObject(this.Snap_EC_ButtonFloor4);

    this.SensorSVGBlinkingObjects[34].AbstractSetBlinking = function(Object){
        Object.attr({"stroke-width":7, "stroke":this.DefaultBlinkingColor});
    };
    this.SensorSVGBlinkingObjects[34].AbstractSetUnblinking = function(Object){
        Object.attr({"stroke-width":2, "stroke":"#3A3A3A"});
    };
};

Animation.prototype.Refresh = function() {
    // Cage position
    if(this.Sensors[ 0]) this.Snap_Elevator.transform("translate(0," + this.ElevatorCagePositionFloor1         + ")");
    if(this.Sensors[ 1]) this.Snap_Elevator.transform("translate(0," + this.ElevatorCagePositionFloor2         + ")");
    if(this.Sensors[ 2]) this.Snap_Elevator.transform("translate(0," + this.ElevatorCagePositionFloor3         + ")");
    if(this.Sensors[ 3]) this.Snap_Elevator.transform("translate(0," + this.ElevatorCagePositionAboveFloor1    + ")");
    if(this.Sensors[ 4]) this.Snap_Elevator.transform("translate(0," + this.ElevatorCagePositionBelowFloor2    + ")");
    if(this.Sensors[ 5]) this.Snap_Elevator.transform("translate(0," + this.ElevatorCagePositionAboveFloor2    + ")");
    if(this.Sensors[ 6]) this.Snap_Elevator.transform("translate(0," + this.ElevatorCagePositionBelowFloor3    + ")");
    if(this.Sensors[26]) this.Snap_Elevator.transform("translate(0," + this.ElevatorCagePositionFloor4         + ")");
    if(this.Sensors[27]) this.Snap_Elevator.transform("translate(0," + this.ElevatorCagePositionAboveFloor3    + ")");
    if(this.Sensors[28]) this.Snap_Elevator.transform("translate(0," + this.ElevatorCagePositionBelowFloor4    + ")");

    // Door floor 1
    if(this.Sensors[7]){
        this.Snap_Door1Left.transform("translate("+this.DoorOpenPositionLeft+",0)");
        this.Snap_Door1Right.transform("translate("+this.DoorOpenPositionRight+",0)");
    }else if(this.Sensors[8]){
        this.Snap_Door1Left.transform("translate("+this.DoorClosedPositionLeft+",0)");
        this.Snap_Door1Right.transform("translate("+this.DoorClosedPositionRight+",0)");
    }else {
        this.Snap_Door1Left.transform("translate(" + this.DoorMiddlePositionLeft + ",0)");
        this.Snap_Door1Right.transform("translate(" + this.DoorMiddlePositionRight + ",0)");
    }

    // Door floor 2
    if(this.Sensors[9]){
        this.Snap_Door2Left.transform("translate("+this.DoorOpenPositionLeft+",0)");
        this.Snap_Door2Right.transform("translate("+this.DoorOpenPositionRight+",0)");
    }else if(this.Sensors[10]){
        this.Snap_Door2Left.transform("translate("+this.DoorClosedPositionLeft+",0)");
        this.Snap_Door2Right.transform("translate("+this.DoorClosedPositionRight+",0)");
    }else{
        this.Snap_Door2Left.transform("translate("+this.DoorMiddlePositionLeft+",0)");
        this.Snap_Door2Right.transform("translate("+this.DoorMiddlePositionRight+",0)");
    }

    // Door floor 3
    if(this.Sensors[11]){
        this.Snap_Door3Left.transform("translate("+this.DoorOpenPositionLeft+",0)");
        this.Snap_Door3Right.transform("translate("+this.DoorOpenPositionRight+",0)");
    }else if(this.Sensors[12]){
        this.Snap_Door3Left.transform("translate("+this.DoorClosedPositionLeft+",0)");
        this.Snap_Door3Right.transform("translate("+this.DoorClosedPositionRight+",0)");
    }else{
        this.Snap_Door3Left.transform("translate("+this.DoorMiddlePositionLeft+",0)");
        this.Snap_Door3Right.transform("translate("+this.DoorMiddlePositionRight+",0)");
    }

    // Door floor 4
    if(this.Sensors[29]){
        this.Snap_Door4Left.transform("translate("+this.DoorOpenPositionLeft+",0)");
        this.Snap_Door4Right.transform("translate("+this.DoorOpenPositionRight+",0)");
    }else if(this.Sensors[30]){
        this.Snap_Door4Left.transform("translate("+this.DoorClosedPositionLeft+",0)");
        this.Snap_Door4Right.transform("translate("+this.DoorClosedPositionRight+",0)");
    }else{
        this.Snap_Door4Left.transform("translate("+this.DoorMiddlePositionLeft+",0)");
        this.Snap_Door4Right.transform("translate("+this.DoorMiddlePositionRight+",0)");
    }
};

Animation.prototype.SendInitialUserVariables = function ()
{
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor1       , "0");
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor2Up     , "0");
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor2Down   , "0");
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor3Down   , "0");
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor3Up     , "0");
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor4       , "0");
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.SimulationOverload     , "0");
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlEmStop  , "0");

        // low-active light barriers
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor1     , "0");
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor2     , "0");
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor3     , "0");
    this.SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor4     , "0");
};

Animation.prototype.OnStopSendUserVariables = function ()
{
    this.SendInitialUserVariables();
};
