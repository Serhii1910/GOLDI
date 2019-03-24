(function () {

    Snap.plugin(function (Snap, Element, Paper, global) {
        var startDragTarget, startDragElement, startBBox, startScreenCTM;

        // Initialise our slider with its basic transform and drag funcs

        Element.prototype.initSlider = function (params) {
            var emptyFunc = function () {
            };
            this.data('origTransform', this.transform().local);
            this.data('onDragEndFunc', params.onDragEndFunc || emptyFunc);
            this.data('onDragFunc', params.onDragFunc || emptyFunc);
            this.data('onDragStartFunc', params.onDragStartFunc || emptyFunc);
        };

        // initialise the params, and set up our max and min. Check if its a slider or knob to see how we deal

        Element.prototype.sliderAnyAngle = function (params) {
            this.initSlider(params);
            this.data("maxPosX", params.max);
            this.data("minPosX", params.min);
            this.data("centerOffsetX", params.centerOffsetX);
            this.data("centerOffsetY", params.centerOffsetY);
            this.data("posX", params.min);
            this.drag(moveDragSlider, startDrag, endDrag);
        };

        // load in the slider svg file, and transform the group element according to our params earlier.
        // Also choose which id is the cap

        Paper.prototype.slider = function (params) {
            var myPaper = this, myGroup;
            var loaded = Snap.load(params.filename, function (frag) {
                myGroup = myPaper.group().add(frag);
                myGroup.transform("t" + params.x + "," + params.y);
                var myCap = myGroup.select(params.capSelector);
                myCap.data("sliderId", params.sliderId);
                myCap.sliderAnyAngle(params);
                sliderSetAttributes(myGroup, params.attr);
                sliderSetAttributes(myCap, params.capattr);
            });
            return myGroup;
        };

        // Extra func, to pass through extra attributes passed when creating the slider

        function sliderSetAttributes(myGroup, attr, data) {
            var myObj = {};
            if (typeof attr != 'undefined') {
                for (var prop in attr) {
                    myObj[prop] = attr[prop];
                    myGroup.attr(myObj);
                    myObj = {};
                }
            }
        }

        // Our main slider startDrag, store our initial matrix settings.

        var startDrag = function (x, y, ev) {
            startDragTarget = ev.target;
            if (!( this.data("startBBox") )) {
                this.data("startBBox", this.getBBox());
                this.data("startScreenCTM", startDragTarget.getScreenCTM());
            }
            this.data('origPosX', this.data("posX"));
            this.data('origPosY', this.data("posY"));
            this.data("onDragStartFunc")();
        };


        // move the cap, our dx/dy will need to be transformed to element matrx. Test for min/max
        // set a value 'fracX' which is a fraction of amount moved 0-1 we can use later.

        function updateMovement(el, dx, dy) {
            // Below relies on parent being the file svg element, 9
            var snapInvMatrix = el.parent().transform().globalMatrix.invert();
            snapInvMatrix.e = snapInvMatrix.f = 0;
            var tdx = snapInvMatrix.x(dx, dy), tdy = snapInvMatrix.y(dx, dy);

            el.data("posX", +el.data("origPosX") + tdx);
            el.data("posY", +el.data("origPosY") + tdy);
            var posX = +el.data("posX");
            var maxPosX = +el.data("maxPosX");
            var minPosX = +el.data("minPosX");

            if (posX > maxPosX) {
                el.data("posX", maxPosX);
            }
            if (posX < minPosX) {
                el.data("posX", minPosX);
            }
            el.data("fracX", 1 / ( (maxPosX - minPosX) / el.data("posX") ));
        }

        // Call the matrix checks above, and set any transformation

        function moveDragSlider(dx, dy) {
            var posX;
            updateMovement(this, dx, dy);
            posX = this.data("posX");
            this.attr({transform: this.data("origTransform") + (posX ? "T" : "t") + [posX, 0]});
            this.attr({});
            var proc = procentCalc(posX);
            Slider_Value.innerHTML = proc + "%";
            var Bit = new Array(8);
            Bit[0] = calculateBitValue(0, proc);
            Bit[1] = calculateBitValue(1, proc);
            Bit[2] = calculateBitValue(2, proc);
            Bit[3] = calculateBitValue(3, proc);
            Bit[4] = calculateBitValue(4, proc);
            Bit[5] = calculateBitValue(5, proc);
            Bit[6] = calculateBitValue(6, proc);
            Bit[7] = calculateBitValue(7, proc);

           // console.log("Percent Value: " + proc + " Bit Value:" + Bit[7] + Bit[6] + Bit[5] + Bit[4] +Bit[3] +Bit[2] + Bit[1] + Bit[0]);
            SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit0, "" + Bit[0]);
            SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit1, "" + Bit[1]);
            SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit2, "" + Bit[2]);
            SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit3, "" + Bit[3]);
            SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit4, "" + Bit[4]);
            SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit5, "" + Bit[5]);
            SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit6, "" + Bit[6]);
            SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit7, "" + Bit[7]);
            ValveBg1 = Snap("#valve_bg_1_");
            intensityColor(ValveBg1, posX);

            this.data("onDragFunc")(this);
        }

        function endDrag() {
            this.data('onDragEndFunc')();
        }

    });

})();

var SensorsOld = new Array(128);
var ActuartorsOld = new Array(128);


var myDragEndFunc = function (el) {
};

var myDragStartFunc = function () {
};


// what we want to do when the slider changes. They could have separate funcs as the call back or just pick the right element
var myDragFunc = function (el) {
};

/*
 * This function calculate procents for Slider
 *
 * @param float posX
 *
 * @return integer
 */

function procentCalc(posX) {
    return Math.round((posX * 100) / 297);
}


/*
 * This function change color intensity of element
 *
 * @param object el
 * @param float posX
 *
 */
function intensityColor(el, posX) {
    var intens = procentCalc(posX) / 100;
    el.attr({
        "fill-opacity": intens
    });
}

function SendEnvironmentVariableCommand(Variable, Value) {
    Message = new CommandMessage();
    Message.setType(EnumCommand.SetUserVariable);

    var ParameterStringArray = [Variable.toString(), Value];

    Message.setParameterStringArray(ParameterStringArray);

    EventHandler.fireCommandEvent(Message);
}

/*
 * This function compare values of two arrays
 *
 * @param array array1
 * @param array array2
 *
 * @return bool
 */
function equalArrays(array1, array2) {
    //if (array1.length == array2.length) {
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) {
            return false;
        }
    }
    return true;
    // } else {
    //    return false;
    //}
}


function Animation(EventHandler, SettingsParameter, CallBack) {
//Snap.svg

    var Actuators = new Array(128);
    var Sensors = new Array(128);
    var SensorsOld = new Array(128);
    var ActuatorsOld = new Array(128);
    var BlinkingTimer = undefined;


    var Pumpe1Bg = "";
    var Pumpe2Bg = "";
    var Sensor0 = "";
    var Sensor1 = "";
    var Sensor2 = "";
    var Sensor3 = "";
    var ValveBg1 = "";


    var Pumpe1Size = [];
    var Pumpe2Size = [];
    var Sensor0Size = [];
    var Sensor1Size = [];
    var Sensor2Size = [];
    var Sensor3Size = [];
    var ValveBg1Size = [];


    var BlinkingUnit = undefined;
    var BlinkingType = undefined;
    var BlinkingInterval = 600;
    var BlinkingActive = false;
    var BlinkingRect = undefined;
    var HoverSelectedParts = [];
    var BlinkingOpactiy = 0.6;


    Animation.prototype.onCommand = function (Command) {

    };

    Animation.prototype.onServerInterfaceInfo = function (Info) {

    };

    Animation.prototype.onHoverEvent = function (HoverData) {
        SetUnitBlinking(HoverData.getType(), HoverData.getUnit());
    };

    Animation.prototype.onData = function (Data) {
        // Pumpe1Bg.animate({transform: "r" + 90});
        if (Data.getSensors()[0] != undefined) Sensors = Data.getSensors();
        if (Data.getActuators()[0] != undefined) Actuators = Data.getActuators();


    };
//y= 409 h =304
    function waterLevelAnimation(Sensors) {
        var digit = [];
        var sensCurNum = 11;
        for (var counter = 0; counter < 8; ++counter) {
            if (Sensors[sensCurNum--]) {
                digit.push(1);
            } else {
                digit.push(0);
            }
        }
        digit = digit.toString();
        digit = digit.replace(/,/g, '');

        var h = Math.round(376.79599 - (376.79599 * parseInt(digit, 2)) / 255);

        if (isNaN(h)) {
            //console.log(h);
        } else {
            Water.animate({height: h}, 20, mina.linear);
            //console.log(h);
        }

        // Water.animate({y: y, height: h}, 1000, mina.linear);
        //Water.animate({y: 337.285, height: 376.79599}, 5000);
        //376.79599
    }

    /*
     *This function select sensor and change its color
     *
     * @param string sensor
     * @param int num
     */
    function sensorRefresh(sensor, num) {
        if (!Sensors[num]) {
            sensor.attr({
                fill: '#ff0000',
                stroke: '#ff0000'
            });
        } else {
            sensor.attr({
                fill: '#00ff00',
                stroke: '#00ff00'
            });
        }
    }

    function initialize() {
        for (var i = 0; i < 128; i++) {
            Actuators[i] = false;
            Sensors[i] = false;
        }


        /*************TEST***************/
        /* for (i = 0; i<4; i++)
         Sensors[i] = true;*/

        /*************END*TEST**********/

        $("#" + SettingsParameter.AnimationDIVName).load('ECP/Animation/Images/Image_Pump.svg', function () {
            SVG = $('#SVGAnimation');
            SVGCanvas = Snap('#SVGAnimation');

            SVG.attr("width", "100%");
            SVG.attr("height", "100%");

            Timer = setInterval(refresh, 100);

            //Initialize all Elements

            // xmax = 495;
            // xmin = 297;


            //Elements initialisation

            var Slider = SVGCanvas.slider({
                sliderId: "Pump_Slider",
                capSelector: "#Slider_x5F_Vertical_1_",
                filename: "ECP/Animation/Images/Image_Slider.svg",
                x: "270",
                y: "680",
                min: "0",
                max: "297",
                onDragEndFunc: myDragEndFunc,
                onDragStartFunc: myDragStartFunc,
                onDragFunc: myDragFunc
            });

            Pumpe1Bg = Snap("#pumpe1_bg");
            Pumpe1Size['x'] = Snap("#pumpe1_bg").getBBox().x;
            Pumpe1Size['y'] = Snap("#pumpe1_bg").getBBox().y;

            Pumpe2Bg = Snap("#pumpe2_bg");
            Pumpe2Size['x'] = Snap("#pumpe2_bg").getBBox().x;
            Pumpe2Size['y'] = Snap("#pumpe2_bg").getBBox().y;

            ValveBg1 = Snap("#valve_bg_1_");
            ValveBg1.attr({"fill-opacity": 0.0});
            ValveBg1Size['x'] = Snap("#valve_bg_1_").getBBox().x;
            ValveBg1Size['y'] = Snap("#valve_bg_1_").getBBox().y;

            Water = Snap("#cover");
            /*WaterSize['x'] = Snap("#cover").getBBox().x; // maybe I don't need it. Now I don't know
            WaterSize['y'] = Snap("#cover").getBBox().y;*/
            Water.animate({height: 376.79599}, 0, mina.linear);
            //Water.animate({y: 670, height: 42}, 0, mina.linear);
            //Sensors lines iniialisation

            Sensor0 = Snap("#sens0");
            Sensor0Size['x'] = Snap("#sens0").getBBox().x;
            Sensor0Size['y'] = Snap("#sens0").getBBox().y;

            Sensor1 = Snap("#sens1");
            Sensor1Size['x'] = Snap("#sens1").getBBox().x;
            Sensor1Size['y'] = Snap("#sens1").getBBox().y;

            Sensor2 = Snap("#sens2");
            Sensor2Size['x'] = Snap("#sens2").getBBox().x;
            Sensor2Size['y'] = Snap("#sens2").getBBox().y;

            Sensor3 = Snap("#sens3");
            Sensor3Size['x'] = Snap("#sens3").getBBox().x;
            Sensor3Size['y'] = Snap("#sens3").getBBox().y;




        });

        SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit0, "0");
        SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit1, "0");
        SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit2, "0");
        SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit3, "0");
        SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit4, "0");
        SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit5, "0");
        SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit6, "0");
        SendEnvironmentVariableCommand(PumpEnvironmentVariables.Drain_Bit7, "0");

        BlinkingTimer = setInterval(function () {
            LetItBlink(HoverSelectedParts, BlinkingActive);
            BlinkingActive = !BlinkingActive;

        }, BlinkingInterval);

        CallBack();
    }

    function LetItBlink(Parts, Active) {
        if (Parts.length != 0) {
            if (Active) {
                for (var i = 0; i < Parts.length; i++) {
                    $('#BlinkingRect_' + i).css("opacity", BlinkingOpactiy.toString());
                }
            }
            else {
                for (var i = 0; i < Parts.length; i++) {
                    $('#BlinkingRect_' + i).css("opacity", "0");
                }
            }
        }
    }

    function SetUnitBlinking(BlinkingType, BlinkingUnit) {
        if (BlinkingType == "Clear") {

            for (var j = 0; j < HoverSelectedParts.length; j++) {
                $('#BlinkingRect_' + j).remove();
            }

        }
        else {
            for (var j = 0; j < HoverSelectedParts.length; j++) {
                $('#BlinkingRect_' + j).remove();
            }
            HoverSelectedParts = [];

            if (BlinkingType == "Sensor") {
                switch(BlinkingUnit)
                {
                    case "0": //Sensor number
                        HoverSelectedParts.push([Sensor0, Sensor0Size['x'], Sensor0Size['y'], false, "sens0gr"]);
                        break;
                    case "1":
                        HoverSelectedParts.push([Sensor1, Sensor1Size['x'], Sensor1Size['y'], false, "sens1gr"]);
                        break;
                    case "2":
                        HoverSelectedParts.push([Sensor2, Sensor2Size['x'], Sensor2Size['y'], false, "sens2gr"]);
                        break;
                    case "3":
                        HoverSelectedParts.push([Sensor3, Sensor3Size['x'], Sensor3Size['y'], false, "sens3gr"]);
                        break;
                    case "12":
                        HoverSelectedParts.push([ValveBg1, ValveBg1Size['x'], ValveBg1Size['y'], false, "Störventil"]);
                        break;
                    case "13":
                        HoverSelectedParts.push([ValveBg1, ValveBg1Size['x'], ValveBg1Size['y'], false, "Störventil"]);
                        break;
                    case "14":
                        HoverSelectedParts.push([ValveBg1, ValveBg1Size['x'], ValveBg1Size['y'], false, "Störventil"]);
                        break;
                    case "15":
                        HoverSelectedParts.push([ValveBg1, ValveBg1Size['x'], ValveBg1Size['y'], false, "Störventil"]);
                        break;
                    case "16":
                        HoverSelectedParts.push([ValveBg1, ValveBg1Size['x'], ValveBg1Size['y'], false, "Störventil"]);
                        break;
                    case "17":
                        HoverSelectedParts.push([ValveBg1, ValveBg1Size['x'], ValveBg1Size['y'], false, "Störventil"]);
                        break;
                    case "18":
                        HoverSelectedParts.push([ValveBg1, ValveBg1Size['x'], ValveBg1Size['y'], false, "Störventil"]);
                        break;
                    case "19":
                        HoverSelectedParts.push([ValveBg1, ValveBg1Size['x'], ValveBg1Size['y'], false, "Störventil"]);
                        break;
                }
            }
            else if (BlinkingType == "Actuator") {
                switch (BlinkingUnit) {
                    case "0":
                        HoverSelectedParts.push([Pumpe1Bg, Pumpe1Size['x'], Pumpe1Size['y'], true, "Pumpe1"]);
                        break;
                    case "1":
                        HoverSelectedParts.push([Pumpe2Bg,  Pumpe2Size['x'],  Pumpe2Size['y'], true, "Pumpe2"]);
                        break;
                }
            }

            for (var i = 0; i < HoverSelectedParts.length; i++) {
                SnapObj = HoverSelectedParts[i][0];

                var x_coord = HoverSelectedParts[i][1];
                var y_coord = HoverSelectedParts[i][2];
                var width = SnapObj.getBBox().width + 2;
                var height = SnapObj.getBBox().height;

                var rect = SVGCanvas.rect(x_coord, y_coord, width, height);
                rect.attr("fill", "#FFFF00");
                rect.attr("stroke", "#FFFF00");
                rect.attr("stroke-miterlimit", "10");
                rect.attr("id", "BlinkingRect_" + i);
                rect.attr("opacity", BlinkingOpactiy.toString());

                if (HoverSelectedParts[i][3] == true) SVGCanvas.prepend(rect);

                if (HoverSelectedParts[i][4] != undefined) Snap('#' + HoverSelectedParts[i][4]).add(rect);
            }
        }
    }


    function refresh() {

        if (!equalArrays(ActuartorsOld, Actuators)) {
            if (Actuators[0]) {
                Pumpe1Bg.attr({
                    fill: '#5ec0e9'
                });
            } else {
                Pumpe1Bg.attr({
                    fill: '#ffffff'
                });
            }

            if (Actuators[1]) {
                Pumpe2Bg.attr({
                    fill: '#5ec0e9'
                });

            } else {
                Pumpe2Bg.attr({
                    fill: '#ffffff'
                });
            }
        }

        var SensorsBitString = "";

        for (var i = 0; i < 128; i++) {
            if (Sensors[127 - i])
                SensorsBitString += "1";
            else
                SensorsBitString += "0";
        }

        //Sensors on refresh

        if (!equalArrays(SensorsOld, Sensors)) {
            sensorRefresh(Sensor0, 0);
            sensorRefresh(Sensor1, 1);
            sensorRefresh(Sensor2, 2);
            sensorRefresh(Sensor3, 3);

            waterLevelAnimation(Sensors)
            /*if (!Sensors[0]) {
             waterLevelAnimation(670, 42);
             }
             if (Sensors[0]) {
             waterLevelAnimation(630, 82);
             }

             if (Sensors[1]) {
             waterLevelAnimation(500, 212);
             }

             if (Sensors[2]) {
             waterLevelAnimation(430, 282);
             }

             if (Sensors[3]) {
             waterLevelAnimation(337.285, 376.7959);
             }
             */

            //sensor1  y = 500 ; h = 212;
            //sensor2 y = 430; h = 282;
            //sensor3 y = 337.285; h = 376.7959;
            //waterLevelAnimation();
        }


        SensorsOld = Sensors;
        ActuartorsOld = Actuators;

    }

    initialize();
}