Animation.prototype.SendEnvironmentVariableCommandForSliderPercent = function(Percent){
    var DrainValue = Math.floor(Percent * 255 / 100);
    this.SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain, DrainValue);
    //console.log(DrainValue);
};

// Start normal Animation Pump
Animation.prototype.InitializeVariablesAndSnapObjects = function(){
    this.Snap_Pump1 = Snap("#pumpe1_bg");
    this.Snap_Pump2 = Snap("#pumpe2_bg");

    this.Snap_Sensor0 = Snap("#sens0");
    this.Snap_Sensor1 = Snap("#sens1");
    this.Snap_Sensor2 = Snap("#sens2");
    this.Snap_Sensor3 = Snap("#sens3");

    this.MaxWaterHeight = 377.79599;
    this.Snap_Water = Snap("#cover");
    this.Snap_Water.animate({height: this.MaxWaterHeight}, 0, mina.linear);
    // this.WaterYPosition = this.Snap_Water.getBBox().y + 63.70677478431372 - 202;
//    this.SonicHeight = 63.70677478431372 + this.Snap_Water.getBBox().y - 202;

    this.Snap_Valve = Snap("#valve_bg_1_");
    this.Snap_Valve.attr({"fill-opacity": 0.0});

    this.Snap_SliderValue = Snap("#Slider_Value");
    this.SendEnvironmentVariableCommandForSliderPercent(0);

    var Animation = this;
    var Snap_Slider = this.SVGCanvas.slider({
        sliderId: "Pump_Slider",
        capSelector: "#Slider_x5F_Vertical_1_",
        filename: "ECP/Animation/Images/Image_Slider.svg",
        x: "270",
        y: "680",
        min: "0",
        max: "297",
        type: "slider",
        onDragStartFunc: function(){
            return Animation.UserButtonsEnabled;
        },
        // onDragEndFunc: function(Slider) {
        // },
        onDragFunc: function(Slider) {
           // ObjectcenterOffsetX: undefined, centerOffsetY: undefined, fracX: 0, maxPosX: "297", minPosX: "0", onDragEndFunc: (), onDragFunc: (Slider), onDragStartFunc: (), origPosX: "0" origPosY: undefined, origTransform: "", posX: 0, posY: NaN, sliderId: "Pump_Slider", startBBox: Object
            var SliderData = Slider.data();
            var Percent = Math.round(SliderData.posX * 100 / parseInt(SliderData.maxPosX));
            Animation.Snap_Valve.attr("fill-opacity", Percent / 100);
            Animation.Snap_SliderValue.attr({text: Percent + " %"});
            Animation.SendEnvironmentVariableCommandForSliderPercent(Percent);
        }
    });
};

// Initializes SVG objects that glow when actuator is active
Animation.prototype.InitializeActuatorSVGObjects = function() {
    this.ActuatorSVGObjects[0] = new SVGObject(this.Snap_Pump1);
    this.ActuatorSVGObjects[1] = new SVGObject(this.Snap_Pump2);

    for(var i = 0;i<2;i++){
        this.ActuatorSVGObjects[i].AbstractSetActive = function (Object) {
            Object.attr({fill:"#5EC0E9"});
        };
        this.ActuatorSVGObjects[i].AbstractSetInactive = function (Object) {
            Object.attr({fill:"#FFFFFF"});
        };
    }
};

// Initializes SVG objects that blink when user hovers over actuator in ECP
Animation.prototype.InitializeBlinkingActuatorSVGObjects = function() {
    this.ActuatorSVGBlinkingObjects[0] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Pump1,-22,-202));
    this.ActuatorSVGBlinkingObjects[1] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Pump2,-22,-202));
};

// Initializes SVG objects that glow when sensor is active
Animation.prototype.InitializeSensorSVGObjects = function() {
    this.SensorSVGObjects[0] = new SVGObject(this.Snap_Sensor0);
    this.SensorSVGObjects[1] = new SVGObject(this.Snap_Sensor1);
    this.SensorSVGObjects[2] = new SVGObject(this.Snap_Sensor2);
    this.SensorSVGObjects[3] = new SVGObject(this.Snap_Sensor3);

    for(var i = 0;i<4;i++){
        this.SensorSVGObjects[i].AbstractSetActive = function (Object) {
            Object.attr({stroke:"#00FF00"});
        };
        this.SensorSVGObjects[i].AbstractSetInactive = function (Object) {
            Object.attr({stroke:"#FF0000"});
        };
    }
};

// Initializes SVG objects that blink when user hovers over sensors in ECP
Animation.prototype.InitializeBlinkingSensorSVGObjects = function() {
    this.SensorSVGBlinkingObjects[0] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Sensor0,-22,-202));
    this.SensorSVGBlinkingObjects[1] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Sensor1,-22,-202));
    this.SensorSVGBlinkingObjects[2] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Sensor2,-22,-202));
    this.SensorSVGBlinkingObjects[3] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Sensor3,-22,-202));

    this.SensorSVGBlinkingObjects[4] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Water,-22,-202));
    for(var i = 5; i < 12; i++)
        this.SensorSVGBlinkingObjects[i] = this.SensorSVGBlinkingObjects[4];

    this.SensorSVGBlinkingObjects[12] = new SVGBlinkingObject(this.CreateNewSVGRect(this.SVGCanvas,this.Snap_Valve,-22,-202));
    for(i = 13; i < 20; i++)
        this.SensorSVGBlinkingObjects[i] = this.SensorSVGBlinkingObjects[12];
};

Animation.prototype.Refresh = function() {
    var SensorsBitString = "";
    for(var i = 0; i < 128; i++)
        SensorsBitString += this.Sensors[127 - i] ? "1" : "0";

    var Sonic = parseInt(SensorsBitString.substr(-12,8), 2);
    var Waterheight = this.MaxWaterHeight - (this.MaxWaterHeight * Sonic / 255);

    this.SensorSVGBlinkingObjects[4].Objects[0].transform("translate(0,"+(Waterheight)+")");
    this.SensorSVGBlinkingObjects[4].Objects[0].animate({height: Math.max(1,this.MaxWaterHeight-Waterheight)}, 20, mina.linear);

    this.Snap_Water.animate({height: Waterheight}, 20, mina.linear);
};