Animation.prototype.InitializeVariablesAndSnapObjects = function(){

    //Initialize Cars
    this.Snap_Car1_TL = Snap('#Car1_TL');
    this.Snap_Car2_TL = Snap('#Car2_TL');
    this.Snap_Car3_TL = Snap('#Car3_TL');
    this.Snap_Car4_TL = Snap('#Car4_TL');

    //Initialize Substate Cars
    this.Snap_Car1_RJ1  = this.SnapHidden('#Car1_RJ1');
    this.Snap_Car1_RJ2  = this.SnapHidden('#Car1_RJ2');
    this.Snap_Car2_RJ2  = this.SnapHidden('#Car2_RJ2');
    this.Snap_Car2_RJ3  = this.SnapHidden('#Car2_RJ3');
    this.Snap_Car3_RJ3  = this.SnapHidden('#Car3_RJ3');
    this.Snap_Car3_RJ4  = this.SnapHidden('#Car3_RJ4');
    this.Snap_Car4_RJ4  = this.SnapHidden('#Car4_RJ4');
    this.Snap_Car4_RJ1  = this.SnapHidden('#Car4_RJ1');


    //Initialize States for Substate Cars
    this.RJ1_Car1 = false; //Substate = Car1 at road junction 1
    this.RJ1_Car4 = false; //Substate = Car4 at road junction 1
    this.RJ2_Car1 = false; //Substate = Car1 at road junction 2
    this.RJ2_Car2 = false; //Substate = Car2 at road junction 2
    this.RJ3_Car2 = false; //Substate = Car2 at road junction 3
    this.RJ3_Car3 = false; //Substate = Car3 at road junction 3
    this.RJ4_Car3 = false; //Substate = Car3 at road junction 4
    this.RJ4_Car4 = false; //Substate = Car4 at road junction 4
};


// Initializes SVG objects that glow when actuator is active
Animation.prototype.InitializeActuatorSVGObjects = function() {
    this.ActuatorSVGObjects[ 0] = new SVGObject(Snap('#TL1_red'));
    this.ActuatorSVGObjects[ 1] = new SVGObject(Snap('#TL1_yellow'));
    this.ActuatorSVGObjects[ 2] = new SVGObject(Snap('#TL1_green'));
    this.ActuatorSVGObjects[ 3] = new SVGObject(Snap('#TL2_red'));
    this.ActuatorSVGObjects[ 4] = new SVGObject(Snap('#TL2_yellow'));
    this.ActuatorSVGObjects[ 5] = new SVGObject(Snap('#TL2_green'));
    this.ActuatorSVGObjects[ 6] = new SVGObject(Snap('#TL3_red'));
    this.ActuatorSVGObjects[ 7] = new SVGObject(Snap('#TL3_yellow'));
    this.ActuatorSVGObjects[ 8] = new SVGObject(Snap('#TL3_green'));
    this.ActuatorSVGObjects[ 9] = new SVGObject(Snap('#TL4_red'));
    this.ActuatorSVGObjects[10] = new SVGObject(Snap('#TL4_yellow'));
    this.ActuatorSVGObjects[11] = new SVGObject(Snap('#TL4_green'));

    for(var i=0;i<12;i++)
        this.ActuatorSVGObjects[i].Objects[0].attr({"stroke-width":"0",rx:5.9,ry:5.9});

    for(i=0;i<12;i=i+3){
        this.ActuatorSVGObjects[i].AbstractSetActive = function (Object) {
            Object.attr({fill:"#FF0000"});
        };
        this.ActuatorSVGObjects[i].AbstractSetInactive = function (Object) {
            Object.attr({fill:"#ff8080"});
        };
    }

    for(i=1;i<12;i=i+3){
        this.ActuatorSVGObjects[i].AbstractSetActive = function (Object) {
            Object.attr({fill:"#FFFF00"});
        };
        this.ActuatorSVGObjects[i].AbstractSetInactive = function (Object) {
            Object.attr({fill:"#ffff80"});
        };
    }

    for(i=2;i<12;i=i+3){
        this.ActuatorSVGObjects[i].AbstractSetActive = function (Object) {
            Object.attr({fill:"#00FF00"});
        };
        this.ActuatorSVGObjects[i].AbstractSetInactive = function (Object) {
            Object.attr({fill:"#80ff80"});
        };
    }

};

// Initializes SVG objects that blink when user hovers over actuator in ECP
Animation.prototype.InitializeBlinkingActuatorSVGObjects = function() {
    for(var i=0;i<this.ActuatorSVGObjects.length;i++)
        this.ActuatorSVGBlinkingObjects[i] = new SVGBlinkingObject(this.ActuatorSVGObjects[i].Objects);

    for(var i=0;i<this.ActuatorSVGBlinkingObjects.length;i++){
        this.ActuatorSVGBlinkingObjects[i].AbstractSetBlinking = function(Object){
            Object.attr({"stroke-width":2, "stroke":this.DefaultBlinkingColor});
        };
        this.ActuatorSVGBlinkingObjects[i].AbstractSetUnblinking = function(Object){
            Object.attr({"stroke-width":0});
        };
    }
};

// Initializes SVG objects that glow when sensor is active
Animation.prototype.InitializeSensorSVGObjects = function() {
};

// Initializes SVG objects that blink when user hovers over sensors in ECP
Animation.prototype.InitializeBlinkingSensorSVGObjects = function() {
    this.SensorSVGBlinkingObjects[ 0] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_Car1_TL,      0,               0,              0   ));
    this.SensorSVGBlinkingObjects[ 1] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_Car1_RJ1,     0,              10,              0   ));
    this.SensorSVGBlinkingObjects[ 2] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_Car2_TL,      0,               0,              0   ));
    this.SensorSVGBlinkingObjects[ 3] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_Car2_RJ2,    10,               0,              0   ));
    this.SensorSVGBlinkingObjects[ 4] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_Car3_TL,      0,               0,              0   ));
    this.SensorSVGBlinkingObjects[ 5] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_Car3_RJ3,     0,             -10,              0   ));
    this.SensorSVGBlinkingObjects[ 6] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_Car4_TL,      0,               0,              0   ));
    this.SensorSVGBlinkingObjects[ 7] = new SVGBlinkingObject(this.CreateNewSVGRect( this.SVGCanvas, this.Snap_Car4_RJ4,   -10,               0,              0   ));

    for(var i=0;i<8;i++)
        this.SensorSVGBlinkingObjects[i].Objects[0].attr({"stroke-width":3});
};

Animation.prototype.Refresh = function() {
    //Car1
    if (this.Sensors[0]) {
        this.Snap_Car1_TL.attr("visibility", "visible");
    } else {
        this.Snap_Car1_TL.attr("visibility", "hidden");
        this.RJ1_Car1 = this.Actuators[2];
    }

    if (this.Sensors[1] && this.RJ1_Car1) {
        this.Snap_Car1_RJ1.attr("visibility", "visible");
        this.RJ2_Car1 = true;
        this.RJ1_Car1 = false;
    } else {
        this.Snap_Car1_RJ1.attr("visibility", "hidden");
    }

    if (this.Sensors[3] && this.RJ2_Car1) {
        this.Snap_Car1_RJ2.attr("visibility", "visible");
        this.RJ2_Car1 = false;
    } else {
        this.Snap_Car1_RJ2.attr("visibility", "hidden");
    }

    //Car2
    if (this.Sensors[2]) {
        this.Snap_Car2_TL.attr("visibility", "visible");
    } else {
        this.Snap_Car2_TL.attr("visibility", "hidden");
        this.RJ2_Car2 = this.Actuators[5];
    }

    if (this.Sensors[3] && this.RJ2_Car2) {
        this.Snap_Car2_RJ2.attr("visibility", "visible");
        this.RJ3_Car2 = true;
        this.RJ2_Car2 = false;
    } else {
        this.Snap_Car2_RJ2.attr("visibility", "hidden");
    }

    if (this.Sensors[5] && this.RJ3_Car2) {
        this.Snap_Car2_RJ3.attr("visibility", "visible");
        this.RJ3_Car2 = false;
    } else {
        this.Snap_Car2_RJ3.attr("visibility", "hidden");
    }

    //Car3
    if (this.Sensors[4]) {
        this.Snap_Car3_TL.attr("visibility", "visible");
    } else {
        this.Snap_Car3_TL.attr("visibility", "hidden");
        this.RJ3_Car3 = this.Actuators[8];
    }

    if (this.Sensors[5] && this.RJ3_Car3) {
        this.Snap_Car3_RJ3.attr("visibility", "visible");
        this.RJ4_Car3 = true;
        this.RJ3_Car3 = false;
    } else {
        this.Snap_Car3_RJ3.attr("visibility", "hidden");
    }

    if (this.Sensors[7] && this.RJ4_Car3) {
        this.Snap_Car3_RJ4.attr("visibility", "visible");
        this.RJ4_Car3 = false;
    } else {
        this.Snap_Car3_RJ4.attr("visibility", "hidden");
    }

    //Car4
    if (this.Sensors[6]) {
        this.Snap_Car4_TL.attr("visibility", "visible");
    } else {
        this.Snap_Car4_TL.attr("visibility", "hidden");
        this.RJ4_Car4 = this.Actuators[11];
    }

    if (this.Sensors[7] && this.RJ4_Car4) {
        this.Snap_Car4_RJ4.attr("visibility", "visible");
        this.RJ1_Car4 = true;
        this.RJ4_Car4 = false;
    } else {
        this.Snap_Car4_RJ4.attr("visibility", "hidden");
    }

    if (this.Sensors[1] && this.RJ1_Car4) {
        this.Snap_Car4_RJ1.attr("visibility", "visible");
        this.RJ1_Car4 = false;
    } else {
        this.Snap_Car4_RJ1.attr("visibility", "hidden");
    }

};

