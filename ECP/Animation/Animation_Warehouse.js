Animation.prototype.InitializeVariablesAndSnapObjects = function() {
    // TODO Kommentar für David: Die SVG muss eindeutig die ID "SVGAnimation" haben.
    // Somit kann in der Animation.js in Zeile 154 die SVG in das komplette Feld eingepasst werden.
    // Ich habe den Code jetzt erstmal wieder auskommentiert.
    // Somit können die Leute, die aktuell die NFC-Sensoren an Modell anbringen auch mit der ECP arbeiten.


	// this.canvas = Snap('#Warehouse');
	// this.options = {
	// 	width: this.canvas.getBBox().width,
	// 	height: this.canvas.getBBox().height,
    // };
    //
    // this.packageTmpl = Snap('#package01');
    // this.packageTmpl.toDefs();
    // let packageDef = this.canvas.select('#package01');
    // let p1 = packageDef.use();
    // this.canvas.append(p1);

    //Initialize Moveable Elements
    // this.Snap_XAxis = Snap('#xaxis');

    //Initialize Sensor Elements
    // this.Snap_XSensorRight = Snap('#sensor_x_right');

    //Pixel-Data for translation of Snap objects
    // this.XMax = 340;

    //Initialize User Variables
    // this.UserSwitchSliderState = false;
};

// Initializes SVG objects that glow when actuator is active
Animation.prototype.InitializeActuatorSVGObjects = function() {
};

// Initializes SVG objects that blink when user hovers over actuator in ECP
Animation.prototype.InitializeBlinkingActuatorSVGObjects = function() {
};

// Initializes SVG objects that glow when sensor is active
Animation.prototype.InitializeSensorSVGObjects = function() {
};

// Initializes SVG objects that blink when user hovers over sensors in ECP
Animation.prototype.InitializeBlinkingSensorSVGObjects = function() {
};

Animation.prototype.Refresh = function() {
    // Colorize Sensors when active oder inactive
};
