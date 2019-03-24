Animation.prototype.InitializeVariablesAndSnapObjects = function(){
    // suppress context menu on right mouse click
    $('#SVGAnimation').on("contextmenu", function(evt) {evt.preventDefault();});
    var Animation = this;

// Initialise all objects with 8 elements e.g. buttons, bottom leds, switchbuttons, top leds, bargraphs
    this.Snap_Buttons = [];
    this.Snap_BottomLeds = [];
    this.Snap_SwitchButtons = [];
    this.Snap_TopLeds = [];
    this.Snap_Bargraphs = [];

    this.SwitchUpPosition = 0;
    this.SwitchDownPosition = 22;

    this.ColorBargraphOn = "#FF040B";
    this.ColorBargraphOff = "#D1BDBE";

    this.ColorButtonPressed = "#ADADAD";
    this.ColorButtonNormal = "#181A1B";

    for(var Index = 0; Index < 8; Index++){
        // Initialize buttons
        this.Snap_Buttons[Index] = Snap('#Button'+Index);
        this.Snap_BottomLeds[Index] = Snap('#LedBottom'+Index).parent();

        // Setup mouse events for Buttons
        var ClickObjectButton = $('#Button'+Index);
        ClickObjectButton.attr("Index",Index);
        ClickObjectButton.on("mousedown", function (){
            if(!Animation.UserButtonsEnabled) return;
            var Index = $(this).attr("Index");
            Animation.Snap_Buttons[Index].attr('fill', Animation.ColorButtonPressed);
            Animation.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables["Button"+Index], '1');
        });
        ClickObjectButton.on("mouseup mouseleave", function () {
            if(!Animation.UserButtonsEnabled) return;
            var Index = $(this).attr("Index");
            Animation.Snap_Buttons[Index].attr("fill", "#" + Animation.ColorButtonNormal);
            Animation.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables["Button"+Index], '0');
        });

        // Initialize switches
        this.Snap_SwitchButtons[Index] = Snap('#Switch'+Index+'Button');
        this.Snap_TopLeds[Index] = Snap('#LedTop'+Index).parent();
        this.Snap_SwitchButtons[Index].attr("y", this.SwitchDownPosition);

        // Setup mouse events for Switches
        var ClickObjectSwitchButton = $('#Switch'+Index+'Button').parent();
        ClickObjectSwitchButton.attr("Index",Index);
        ClickObjectSwitchButton.on("click", function(){
            if(!Animation.UserButtonsEnabled) return;
            var Index = $(this).attr("Index");
            if (Animation.Sensors[Index]) {
                Animation.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables["Switch"+Index], '0');
            }else{
                Animation.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables["Switch"+Index], '1');
            }
        });

        // Initialize bargraphs
        this.Snap_Bargraphs[Index] = Snap('#Bargraph'+Index);
    }

// Initialize 7 segment displays
    this.ColorSegmentOn = "#FF040B";
    this.ColorSegmentOff = "#D1BDBE";

    this.Snap_Segments = [];
    for(var IndexNumber = 0; IndexNumber < 4; IndexNumber++) {
        this.Snap_Segments[IndexNumber] = [];
        for (var IndexSegment = 0; IndexSegment < 7; IndexSegment ++) {
            var Letter = (IndexSegment+10).toString(17).toUpperCase();
            this.Snap_Segments[IndexNumber][Letter] = Snap("#Segment"+IndexNumber+Letter);
        }
        this.Snap_Segments[IndexNumber]["Dot"] = Snap('#Segment'+IndexNumber+'Dot');
        this.Snap_Segments[IndexNumber]["Dot"].attr({fill:this.ColorSegmentOff, stroke:this.ColorSegmentOff});
    }

// Initialize hex encoders
    this.Snap_HexRotate = [];

    this.HexRotateX = [];
    this.HexRotateY = [];

    this.HexText = [];

    for(Index = 0; Index < 2; Index++){
        this.Snap_HexRotate[Index] = Snap('#Hex'+Index+'Rotate');

        this.HexRotateX[Index] = this.Snap_HexRotate[Index].getBBox().x + (this.Snap_HexRotate[Index].getBBox().w)/2;
        this.HexRotateY[Index] = this.Snap_HexRotate[Index].getBBox().y + (this.Snap_HexRotate[Index].getBBox().h)/2;

        this.HexText[Index] = this.Snap_HexRotate[Index].text(this.HexRotateX[Index], this.HexRotateY[Index] + 12, "0");
        this.HexText[Index].attr({ fontSize: '30px', opacity: 1, "text-anchor": "middle" });

        //Setup mouse events for hex rotate
        var ClickObjectHexRotate = $('#Hex'+Index+'Rotate');
        ClickObjectHexRotate.attr("Index",Index);
        ClickObjectHexRotate.on("mousewheel",           function (event) { Animation.HexRotate(this,   event.originalEvent.wheelDelta/120>0    ) });
        ClickObjectHexRotate.on("DOMMouseScroll",       function (event) { Animation.HexRotate(this,   event.originalEvent.detail<0            ) });
        ClickObjectHexRotate.on("mousedown",            function (event) { Animation.HexRotate(this,   event.button!=0                         ) });
    }

// Initialise encoder
    this.Snap_EncoderRotate = Snap('#EncoderRotate');
    this.Snap_EncoderRotateArrow = Snap('#EncoderRotateArrow');
    this.EncoderRotationPosition = 0;

    this.EncoderRotateX = this.Snap_EncoderRotate.getBBox().x + (this.Snap_EncoderRotate.getBBox().w)/2;
    this.EncoderRotateY = this.Snap_EncoderRotate.getBBox().y + (this.Snap_EncoderRotate.getBBox().h)/2;

    // Setup mouse events for encoder rotate
    var ClickObjectEncoderRotate = $('#EncoderRotate');
    ClickObjectEncoderRotate.on("mousewheel",        function (event) { Animation.EncoderRotate( event.originalEvent.wheelDelta/120>0    ) });
    ClickObjectEncoderRotate.on("DOMMouseScroll",    function (event) { Animation.EncoderRotate( event.originalEvent.detail<0            ) });
    ClickObjectEncoderRotate.on('mousedown',         function (event) { Animation.EncoderRotate( event.button!=0                         ) });

// Initilize poti
    // this.Snap_PotiRotate = Snap('#PotiRotate');

    this.Snap_Poti = Snap("#Poti");
    this.Snap_Poti.attr({opacity:0});

    // this.PotiRotationPosition = 0;

    // this.PotiRotateX = this.Snap_PotiRotate.getBBox().x + (this.Snap_PotiRotate.getBBox().w)/2;
    // this.PotiRotateY = this.Snap_PotiRotate.getBBox().y + (this.Snap_PotiRotate.getBBox().h)/2;
};

Animation.prototype.HexRotate = function(ClickObject, Condition) {
    if(!this.UserButtonsEnabled) return;

    var Index = parseInt($(ClickObject).attr("Index"));

    var SensorsBitString = "";
    for(var i = 16 + Index*4; i < 20 + Index*4; i++)
        SensorsBitString = (this.Sensors[i] ? "0" : "1") + SensorsBitString;
    var SensorValue = parseInt(SensorsBitString,2);

    if (Condition){
        SensorValue = (SensorValue + 1) % 16;
    }else{
        SensorValue = (SensorValue -1  + 16) % 16;
    }
    
    this.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables["HexEncoder"+Index], SensorValue);
};

Animation.prototype.EncoderRotate = function(Condition){
    let steps = 24;
    if(!this.UserButtonsEnabled) return;
    if (Condition) {
        this.EncoderRotationPosition += 1;//22.5;
        if(this.EncoderRotationPosition === steps)
            this.EncoderRotationPosition = 0;
    }else{
        this.EncoderRotationPosition -= 1.0;//22.5;
        if(this.EncoderRotationPosition === -1)
            this.EncoderRotationPosition = steps-1;
    }

    switch(this.EncoderRotationPosition % 4){
        case 0:
            this.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderA, "0");
            this.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderB, "0");
            break;
        case 1:
            this.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderA, "0");
            this.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderB, "1");
            break;
        case 2:
            this.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderA, "1");
            this.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderB, "1");
            break;
        case 3:
            this.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderA, "1");
            this.SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderB, "0");
            break;
    }

    this.Snap_EncoderRotateArrow.attr({"fill":"black"});
    this.Snap_EncoderRotate.animate({ transform: 'r'+ (this.EncoderRotationPosition * 360/steps) + ',' + this.EncoderRotateX + ',' + this.EncoderRotateY + '' }, 0, ()=>{
        this.Snap_EncoderRotateArrow.attr({"fill":"#ADADAD"});
    });
};

// Initializes SVG objects that glow when actuator is active
Animation.prototype.InitializeActuatorSVGObjects = function() {
    var Animation = this;

    // Initialize actuator LEDs for 7 segment displays
    for(var IndexNumber = 0; IndexNumber < 4; IndexNumber++)
        for (var IndexSegment = 0; IndexSegment < 7; IndexSegment ++) {
            var ActuatorIndex = IndexSegment + IndexNumber * 7;
            var Letter = (IndexSegment + 10).toString(17).toUpperCase();

            this.ActuatorSVGObjects[ActuatorIndex] = new SVGObject(this.Snap_Segments[IndexNumber][Letter]);
            this.ActuatorSVGObjects[ActuatorIndex].AbstractSetActive    = function(Object){ Object.attr({"fill":Animation.ColorSegmentOff});    };
            this.ActuatorSVGObjects[ActuatorIndex].AbstractSetInactive  = function(Object){ Object.attr({"fill":Animation.ColorSegmentOn});     };
        }

    // Initialise actuator LEDs for 8 bargraphs
    for(var Index = 0; Index < 8; Index++){
        this.ActuatorSVGObjects[Index + 28] = new SVGObject(this.Snap_Bargraphs[Index]);
        this.ActuatorSVGObjects[Index + 28].AbstractSetActive       = function(Object){ Object.attr({"fill":Animation.ColorBargraphOn});    };
        this.ActuatorSVGObjects[Index + 28].AbstractSetInactive     = function(Object){ Object.attr({"fill":Animation.ColorBargraphOff});   };
    }
};

// Initializes SVG objects that blink when user hovers over actuator in ECP
Animation.prototype.InitializeBlinkingActuatorSVGObjects = function() {
    for(var Index=0;Index<=35;Index++)
        this.ActuatorSVGBlinkingObjects[Index] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.ActuatorSVGObjects[Index].Objects[0]));
};

// Initializes SVG objects that glow when sensor is active
Animation.prototype.InitializeSensorSVGObjects = function() {
    // LEDs at switches
    for(var Index = 0; Index < 8; Index++)
        this.SensorSVGObjects[Index] = new SVGObject(this.Snap_TopLeds[Index]);

    // LEDs at buttons
    for(Index = 0; Index < 8; Index++)
        this.SensorSVGObjects[Index + 8] = new SVGObject(this.Snap_BottomLeds[Index]);

    // High active LEDs
    for(Index=0;Index<=11;Index++){
        this.SensorSVGObjects[Index].AbstractSetActive      = function(Object){ Object.attr({opacity:1});   };
        this.SensorSVGObjects[Index].AbstractSetInactive    = function(Object){ Object.attr({opacity:0.2}); };
    }

    // Low active LEDs
    for(Index=12;Index<=15;Index++){
        this.SensorSVGObjects[Index].AbstractSetActive      = function(Object){ Object.attr({opacity:0.2}); };
        this.SensorSVGObjects[Index].AbstractSetInactive    = function(Object){ Object.attr({opacity:1});   };
    }
};

// Initializes SVG objects that blink when user hovers over sensors in ECP
Animation.prototype.InitializeBlinkingSensorSVGObjects = function() {
    for(var Index = 0; Index < 8; Index++){
        this.SensorSVGBlinkingObjects[Index    ] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_SwitchButtons[Index]));
        this.SensorSVGBlinkingObjects[Index + 8] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Buttons[Index]));
    }

    this.SensorSVGBlinkingObjects[16] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_HexRotate[0].parent()));
    this.SensorSVGBlinkingObjects[17] = this.SensorSVGBlinkingObjects[16];
    this.SensorSVGBlinkingObjects[18] = this.SensorSVGBlinkingObjects[16];
    this.SensorSVGBlinkingObjects[19] = this.SensorSVGBlinkingObjects[16];

    this.SensorSVGBlinkingObjects[20] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_HexRotate[1].parent()));
    this.SensorSVGBlinkingObjects[21] = this.SensorSVGBlinkingObjects[20];
    this.SensorSVGBlinkingObjects[22] = this.SensorSVGBlinkingObjects[20];
    this.SensorSVGBlinkingObjects[23] = this.SensorSVGBlinkingObjects[20];

    this.SensorSVGBlinkingObjects[24] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_EncoderRotate.parent()));
    this.SensorSVGBlinkingObjects[25] = this.SensorSVGBlinkingObjects[24];
};

Animation.prototype.Refresh = function() {
    for(var Index = 0; Index < 2; Index++) {
        var SensorsBitString = "";
        for (var i = 16 + Index * 4; i < 20 + Index * 4; i++)
            SensorsBitString = (this.Sensors[i] ? "0" : "1") + SensorsBitString;
        var SensorValue = parseInt(SensorsBitString, 2);
        var HexRotationPosition = 22.5 * SensorValue;

        this.Snap_HexRotate[Index].animate({transform: 'r' + HexRotationPosition + ',' + this.HexRotateX[Index] + ',' + this.HexRotateY[Index] + ''}, 0);
        this.HexText[Index].animate({transform: 'r' + -HexRotationPosition + ',' + this.HexRotateX[Index] + ',' + this.HexRotateY[Index] + ''}, 0);
        this.HexText[Index].attr({text: SensorValue.toString(16).toUpperCase()});
    }

    for(Index = 0; Index < 8; Index++)
        this.Snap_SwitchButtons[Index].attr('y', this.Sensors[Index] ? this.SwitchUpPosition : this.SwitchDownPosition);
};