function Animation(EventHandler, SettingsParameter, CallBack)
{
    // Time in milliseconds the animation is being refreshed
    var RefreshTime = 100;
    var BlinkingInterval = 600;

    var Sensors = new Array(128);
    var Actuators = new Array(128);
    var AnimationTimer = undefined;
    var BlinkingTimer = undefined;
    var BlinkingUnit = undefined;
    var BlinkingType = undefined;
    var BlinkingActive = false;
    var SVG = undefined;
    // var XMax = 340;         //Right
    var XMin = -340;        //Left
    // var XMiddle = 0;        //Reference
    var YMin = 140;         //Front       
    // var YMax = -55;         //Back
    // var YMiddle = 55;       //Reference
    var ZMin = -80;         //Up
    var ZMax = 73;          //Down
    var ZMiddle = 10;
    var XPosition = 0;
    var YPosition = 0;
    var ZPosition = 0;
    var UserSwitchSliderPositionUp = 493;
    var UserSwitchSliderPositionDown = 394;
    var UserSwitchSliderColorRed = "#FF0000";
    var UserSwitchSliderColorGreen = "#00FF00";
    var XAxis = "";
    var YAxis = "";
    var ZAxis = "";
    var ArrowLeft = "";
    var ArrowRight = "";
    var ArrowUp = "";
    var ArrowDown = "";
    var ArrowTop = "";
    var ArrowBottom = "";
    var Magnet = "";
    var MagnetSize = [];
	var ArrowLeftSize = [];
	var ArrowRightSize = [];
	var ArrowUpSize = [];
	var ArrowDownSize = [];
	var ArrowTopSize = [];
	var ArrowBottomSize = [];

    var YSensorMiddle1 = "";
    var YSensorMiddle2 = "";
    var XSensorMiddle = "";
    var YSensorDown = "";
    var YSensorUp = "";
    var XSensorRight = "";
    var XSensorLeft = "";
    var ZSensorTop = "";
    var ZSensorBottom = "";
    var SensorHall1 = "";
    var SensorHall2 = "";
    var UserSwitch = "";
    var UserSwitchSlider = "";
	var XSensorRightSize = [];
	var XSensorLeftSize = [];
	var YSensorDownSize = [];
	var YSensorUpSize = [];
	var ZSensorTopSize = [];
	var ZSensorBottomSize = [];
	var YSensorMiddle1Size = [];
	var YSensorMiddle2Size = [];
	var XSensorMiddleSize = [];
	var SensorHall1Size = [];
	var SensorHall2Size = [];
	var UserSwitchSize = [];

    // Variables for blinking engine

	var BlinkingUnit = undefined;
    var BlinkingType = undefined;
	var BlinkingInterval = 600;
	var BlinkingActive = false;
	var BlinkingRect = undefined;
	var HoverSelectedParts = [];
	var BlinkingOpactiy = 0.6;

    var UserSwitchState = "Up";

    var SensorColors = [];

    var SVGCanvas = undefined;

    var State = "InitialState";

    /*
    Animation.prototype.onCommand = function (Command)
    {

    };
    */
    Animation.prototype.onServerInterfaceInfo = function (Info)
    {

    };


    Animation.prototype.onHoverEvent = function(HoverData)
    {
        SetUnitBlinking(HoverData.getType(), HoverData.getUnit());
    };

    Animation.prototype.onData = function (Data)
    {
        //Ignore all Simulation Data, only PSPU Data is relevant for the ECP
        if(Data.getParameterStringArray()[0] == "SIM" || Data.getParameterStringArray()[0] == "BPU"){
            return;
        }
        if(Data.getSensors()[0] != undefined) Sensors = Data.getSensors();
        if(Data.getActuators()[0] != undefined) Actuators = Data.getActuators();
    };

    function Value (Sensors, max, min){
        var value = [];
        for(var counter = max; counter >= min; counter--){
            if(Sensors[counter]){
                value.push(1);
            }else{
                value.push(0);
            }
        }
        value = value.toString(2);
        value = value.replace(/,/g, '');
        return parseInt(value, 2);
    }

    function currentCoordianats(){
        var x = Value(Sensors, 31, 16);
        var y = Value(Sensors, 47, 32);

        console.log("X=" + x +" Y=" + y);
        xValue_Bg.innerHTML = x;
        yValue_Bg.innerHTML = y;


    }


    //This function draws the animation in its initial state without any sensor or actor values and initializes all of the components
    function initialize()
    {
        for (var i = 0; i < 128; i++)
        {
            Actuators[i] = false;
            Sensors[i] = false;
        }

        $("#" + SettingsParameter.AnimationDIVName).load('ECP/Animation/Images/Image_3AxisPortal.svg', function ()
        {
            SVG = $('#SVGAnimation');
            SVGCanvas = Snap('#SVGAnimation');

            XAxis = $('#xaxis');
            YAxis = $('#yaxis');
            ZAxis = $('#zaxis');

            Snap_ZAxis = Snap('#zaxis');
            Snap_XAxis = Snap('#xaxis');
            Snap_YAxis = Snap('#yaxis');

            Magnet = Snap('#magnet');
			MagnetSize['x'] = Snap('#magnet').getBBox().x;
            MagnetSize['y'] = Snap('#magnet').getBBox().y;

            ArrowLeft = Snap('#arrowleft');
            SensorColors[ArrowLeft.attr('id')] = ["#ffff00","#7f7f00"];
			ArrowLeftSize['x'] = Snap('#arrowleft').getBBox().x;
            ArrowLeftSize['y'] = Snap('#arrowleft').getBBox().y;

            ArrowRight = Snap('#arrowright');
            SensorColors[ArrowRight.attr('id')] = ["#ffff00","#7f7f00"];
			ArrowRightSize['x'] = Snap('#arrowright').getBBox().x;
            ArrowRightSize['y'] = Snap('#arrowright').getBBox().y;

            UserSwitch = Snap("#switch");
			UserSwitchSize['x'] = Snap('#switch').getBBox().x;
            UserSwitchSize['y'] = Snap('#switch').getBBox().y;

            UserSwitchSlider = $("#switchchange");

            ArrowUp = Snap('#arrowup');
			ArrowUpSize['x'] = Snap('#arrowup').getBBox().x;
            ArrowUpSize['y'] = Snap('#arrowup').getBBox().y;

            ArrowDown = Snap('#arrowdown');
			ArrowDownSize['x'] = Snap('#arrowdown').getBBox().x;
            ArrowDownSize['y'] = Snap('#arrowdown').getBBox().y;

            ArrowTop = Snap('#arrowtop');
			ArrowTopSize['x'] = Snap('#arrowtop').getBBox().x;
            ArrowTopSize['y'] = Snap('#arrowtop').getBBox().y;

            ArrowBottom = Snap('#arrowbottom');
			ArrowBottomSize['x'] = Snap('#arrowbottom').getBBox().x;
            ArrowBottomSize['y'] = Snap('#arrowbottom').getBBox().y;

            YSensorMiddle1 = Snap('#sensor_y_middle1');
			YSensorMiddle1Size['x'] = Snap('#sensor_y_middle1').getBBox().x;
            YSensorMiddle1Size['y'] = Snap('#sensor_y_middle1').getBBox().y;

            YSensorMiddle2 = Snap('#sensor_y_middle2');
			YSensorMiddle2Size['x'] = Snap('#sensor_y_middle2').getBBox().x;
            YSensorMiddle2Size['y'] = Snap('#sensor_y_middle2').getBBox().y;

            XSensorMiddle = Snap('#sensor_x_middle');
			XSensorMiddleSize['x'] = Snap('#sensor_x_middle').getBBox().x;
            XSensorMiddleSize['y'] = Snap('#sensor_x_middle').getBBox().y;

            YSensorDown = Snap('#sensor_y_down');
			YSensorDownSize['x'] = Snap('#sensor_y_down').getBBox().x;
            YSensorDownSize['y'] = Snap('#sensor_y_down').getBBox().y;

            YSensorUp = Snap('#sensor_y_up');
			YSensorUpSize['x'] = Snap('#sensor_y_up').getBBox().x;
            YSensorUpSize['y'] = Snap('#sensor_y_up').getBBox().y;

            XSensorRight = Snap('#sensor_x_right');
			XSensorRightSize['x'] = Snap('#sensor_x_right').getBBox().x;
            XSensorRightSize['y'] = Snap('#sensor_x_right').getBBox().y;

            XSensorLeft = Snap('#sensor_x_left');
			XSensorLeftSize['x'] = Snap('#sensor_x_left').getBBox().x;
            XSensorLeftSize['y'] = Snap('#sensor_x_left').getBBox().y;

            ZSensorTop = Snap('#sensor_z_top');
			ZSensorTopSize['x'] = Snap('#sensor_z_top').getBBox().x;
            ZSensorTopSize['y'] = Snap('#sensor_z_top').getBBox().y;

            ZSensorBottom = Snap('#sensor_z_bottom');
			ZSensorBottomSize['x'] = Snap('#sensor_z_bottom').getBBox().x;
            ZSensorBottomSize['y'] = Snap('#sensor_z_bottom').getBBox().y;

            SensorHall1 = Snap('#Desk1');
			SensorHall1Size['x'] = Snap('#Desk1').getBBox().x;
            SensorHall1Size['y'] = Snap('#Desk1').getBBox().y;

            SensorHall2 = Snap('#Desk2');
			SensorHall2Size['x'] = Snap('#Desk2').getBBox().x;
            SensorHall2Size['y'] = Snap('#Desk2').getBBox().y;

            SensorColors[XSensorRight.attr('id')] = ["#ffff00","#7f7f00"];
			SensorColors[XSensorLeft.attr('id')] = ["#ffff00","#7f7f00"];

            SVG.attr("height", "100%");
            SVG.attr("width", "100%");

            // Environment Button

            $("#switch").on("click", function ()
            {
                if (UserSwitchStateMachine() == "Up")
                {
                    UserSwitchSlider.attr("x", UserSwitchSliderPositionUp);
                    UserSwitchSlider.attr("fill", UserSwitchSliderColorRed);
                    SendEnvironmentVariableCommand(Enum3AxisPortalEnvironmentVariables.Snap_UserSwitch, "0");
                }
                else
                {
                    UserSwitchSlider.attr("x", UserSwitchSliderPositionDown);
                    UserSwitchSlider.attr("fill", UserSwitchSliderColorGreen);
                    SendEnvironmentVariableCommand(Enum3AxisPortalEnvironmentVariables.Snap_UserSwitch, "1");
                }
            });

            XPosition = XMin;
            YPosition = YMin;
            ZPosition = ZMin;

			XAxis.attr("x", XPosition);
			YAxis.attr("y", YPosition);
			ZAxis.attr("y", ZPosition);

            AnimationTimer = setInterval(Refresh, RefreshTime);

            BlinkingTimer = setInterval(function()
            {
                LetItBlink(HoverSelectedParts, BlinkingActive);
                BlinkingActive = !BlinkingActive;

            }, BlinkingInterval);

            CallBack();
        });

    }

    function LetItBlink(Parts, Active)
        {
            if(Parts.length != 0)
            {
                if(Active)
                {
                    for(var i = 0; i < Parts.length; i++)
                    {
                        $('#BlinkingRect_' + i).css("opacity", BlinkingOpactiy.toString());
                    }
                }
                else
                {
                    for(var i = 0; i < Parts.length; i++)
                    {
                        $('#BlinkingRect_' + i).css("opacity","0");
                    }
                }
            }
	}

    function SetUnitBlinking(BlinkingType, BlinkingUnit)
    {
        if(BlinkingType == "Clear")
        {

			for(var j = 0; j < HoverSelectedParts.length; j++)
			{
                $('#BlinkingRect_' + j).remove();
			}

        }
        else
        {
			for(var j = 0; j < HoverSelectedParts.length; j++)
			{

			    $('#BlinkingRect_' + j).remove();
			}
			HoverSelectedParts = [];

			if(BlinkingType == "Sensor")
			{
				switch(BlinkingUnit)
				{
					case "0":
						HoverSelectedParts.push([XSensorRight, XSensorRightSize['x'], XSensorRightSize['y'], false]);
						break;
					case "1":
						HoverSelectedParts.push([XSensorLeft, XSensorLeftSize['x'], XSensorLeftSize['y'], false]);
						break;
					case "2":
						HoverSelectedParts.push([XSensorMiddle, XSensorMiddleSize['x'], XSensorMiddleSize['y'], false]);
						break;
					case "3":
						HoverSelectedParts.push([YSensorUp, YSensorUpSize['x'], YSensorUpSize['y'], false, "yaxis"]);
						break;
					case "4":
						HoverSelectedParts.push([YSensorDown, YSensorDownSize['x'], YSensorDownSize['y'], false, "yaxis"]);
						break;
					case "5":
						HoverSelectedParts.push([YSensorMiddle1, YSensorMiddle1Size['x'], YSensorMiddle1Size['y'], false]);
						HoverSelectedParts.push([YSensorMiddle2, YSensorMiddle2Size['x'], YSensorMiddle2Size['y'], false]);
						break;
					case "6":
						HoverSelectedParts.push([ZSensorBottom, ZSensorBottomSize['x'], ZSensorBottomSize['y'], false, "zaxis"]);
						break;
					case "7":
						HoverSelectedParts.push([ZSensorTop, ZSensorTopSize['x'], ZSensorTopSize['y'], false, "zaxis"]);
						break;
					case "8":
						HoverSelectedParts.push([SensorHall1, SensorHall1Size['x'], SensorHall1Size['y'], false]);
						HoverSelectedParts.push([SensorHall1, SensorHall2Size['x'], SensorHall2Size['y'], false]);
						break;
					case "9":
						HoverSelectedParts.push([UserSwitch, UserSwitchSize['x'], UserSwitchSize['y'], true, "SVGAnimation"]);
						break;
				}
			}
			else if(BlinkingType = "Actuator")
			{
				switch(BlinkingUnit)
				{
					case "0":
						HoverSelectedParts.push([ArrowRight,ArrowRightSize['x'],ArrowRightSize['y'], false, "xaxis"]);
						break;
					case "1":
						HoverSelectedParts.push([ArrowLeft,ArrowLeftSize['x'],ArrowLeftSize['y'], false, "xaxis"]);
						break;
					case "2":
						HoverSelectedParts.push([ArrowUp,ArrowUpSize['x'],ArrowUpSize['y'], false, "yaxis"]);
						break;
					case "3":
						HoverSelectedParts.push([ArrowDown,ArrowDownSize['x'],ArrowDownSize['y'], false, "yaxis"]);
						break;
					case "4":
						HoverSelectedParts.push([ArrowTop,ArrowTopSize['x'],ArrowTopSize['y'], false, "xaxis"]);
						break;
					case "5":
						HoverSelectedParts.push([ArrowBottom,ArrowBottomSize['x'],ArrowBottomSize['y'], false, "xaxis"]);
						break;
					case "6":
						HoverSelectedParts.push([Magnet,MagnetSize['x'],MagnetSize['y'], false, "zaxis"]);
						break;
                }
			}

            for(var i = 0; i < HoverSelectedParts.length; i++)
            {
                SnapObj = HoverSelectedParts[i][0];

                var x_coord = HoverSelectedParts[i][1];
                var y_coord = HoverSelectedParts[i][2];
                var width = SnapObj.getBBox().width;
                var height = SnapObj.getBBox().height;

                var rect = SVGCanvas.rect(x_coord, y_coord, width, height);
                rect.attr("fill","#FFFFFF");
                rect.attr("stroke","#FFFFFF");
                rect.attr("stroke-miterlimit","10");
                rect.attr("id","BlinkingRect_" + i);
                rect.attr("opacity",BlinkingOpactiy.toString());

                if(HoverSelectedParts[i][3] == true) SVGCanvas.prepend(rect);

                if(HoverSelectedParts[i][4] != undefined) Snap('#' + HoverSelectedParts[i][4]).add(rect);
            }
        }
    }

    function SendEnvironmentVariableCommand(Variable, Value)
    {
        Message = new CommandMessage();
        Message.setType(EnumCommand.SetUserVariable);

        var ParameterStringArray = [Variable.toString(), Value];

        Message.setParameterStringArray(ParameterStringArray);

        EventHandler.fireCommandEvent(Message);
    }

    function UserSwitchStateMachine()
    {
        if (UserSwitchState == "Up") UserSwitchState = "Down";
        else if (UserSwitchState == "Down") UserSwitchState = "Up";
        return UserSwitchState;
    }

    // this function draws the animation according to the values set
    function Refresh()
    {
        if (Actuators[0]) ArrowRight.attr("fill", SensorColors[ArrowRight.attr('id')][0]);
        else ArrowRight.attr("fill", SensorColors[ArrowRight.attr('id')][1]);

        if (Actuators[1]) ArrowLeft.attr("fill", SensorColors[ArrowLeft.attr('id')][0]);
        else ArrowLeft.attr("fill", SensorColors[ArrowLeft.attr('id')][1]);

        if (Actuators[2]) ArrowUp.attr("fill", "#ffff00");
        else ArrowUp.attr("fill", "#7f7f00");

        if (Actuators[3]) ArrowDown.attr("fill", "#ffff00");
        else ArrowDown.attr("fill", "#7f7f00");

        if (Actuators[4]) ArrowTop.attr("fill", "#ffff00");
        else ArrowTop.attr("fill", "#7f7f00");

        if (Actuators[5]) ArrowBottom.attr("fill", "#ffff00");
        else ArrowBottom.attr("fill", "#7f7f00");

        if (Actuators[6]) Magnet.attr("fill", "#ffff00");
        else Magnet.attr("fill", "#7f7f00");

        // Calculate XPosition by incremental encoder values

        var SensorsBitString = "";

        for(var i = 0; i < 128; i++)
        {
            if(Sensors[127 - i])
                SensorsBitString += "1";
            else
                SensorsBitString += "0";
        }
        var PositionInt = parseInt(SensorsBitString.substr(16,16), 2);
                 // (x range / resolution x axis)*x axis value - offset
        XPosition = (680/201)*PositionInt -340;

        PositionInt = parseInt(SensorsBitString.substr(0,16), 2);
                // (y range / resolution y axis)*y axis value - offset
        YPosition = -(195/56)*PositionInt +140;

		debug("XPosition: " + XPosition + " | YPosition: " + YPosition);

        if (Sensors[0])
        {
            XSensorRight.attr("fill", SensorColors[XSensorRight.attr('id')][0]);
            XPosition = +340
        }
        else
        {
            XSensorRight.attr("fill", SensorColors[XSensorRight.attr('id')][1]);
        }

        if (Sensors[1])  XSensorLeft.attr("fill", SensorColors[XSensorLeft.attr('id')][0]);
        else XSensorLeft.attr("fill", SensorColors[XSensorLeft.attr('id')][1]);

        if (Sensors[2]) XSensorMiddle.attr("fill", "#ffff00");
        else XSensorMiddle.attr("fill", "#ff0000");

        if (Sensors[4]) YSensorDown.attr("fill", "#ffff00");
        else YSensorDown.attr("fill", "#ff0000");

        if (Sensors[3]) YSensorUp.attr("fill", "#ffff00");
        else YSensorUp.attr("fill", "#ff0000");

        if (Sensors[5])
        {
            YSensorMiddle1.attr("fill", "#ffff00");
            YSensorMiddle2.attr("fill", "#ffff00");
        }
        else
        {
            YSensorMiddle1.attr("fill", "#ff0000");
            YSensorMiddle2.attr("fill", "#ff0000");
        }

        if (Sensors[6])
        {
            ZSensorBottom.attr("fill", "#ffff00");
            ZPosition = ZMin;
        }
        else ZSensorBottom.attr("fill", "#ff0000");

        if (Sensors[7])
        {
            ZSensorTop.attr("fill", "#ffff00");
            ZPosition = ZMax;
        }
        else ZSensorTop.attr("fill", "#ff0000");

        if (!Sensors[6] && !Sensors[7])
        {
            ZPosition = ZMiddle;
        }

        if (Sensors[8])
        {
            SensorHall1.attr("fill", "#ffff00");
            SensorHall2.attr("fill", "#ffff00");
        }
        else
        {
            SensorHall1.attr("fill", "#ff0000");
            SensorHall2.attr("fill", "#ff0000");
        }

        XAxis.attr("x", XPosition);
        YAxis.attr("y", YPosition);
        //ZAxis.attr("y", ZPosition);


        currentCoordianats();

        Snap_ZAxis.transform("translate(0," + ZPosition + ")");
        Snap_YAxis.transform("translate(0," + YPosition + ")");
        Snap_XAxis.transform("translate(" + XPosition + ",0)");

        // Blinking engine refresh

        /*for(var k = 0; k < HoverSelectedParts.length; k++)
		{
			SnapObj = Snap('#' + HoverSelectedParts[k][0].attr("id"));
			$('#BlinkingRect_' + k).attr("x", SnapObj.getBBox().x);
			$('#BlinkingRect_' + k).attr("y", SnapObj.getBBox().y);
			//$('#BlinkingRect_' + k).attr("x", HoverSelectedParts[k].getBBox().cx);
			//$('#BlinkingRect_' + k).attr("y", HoverSelectedParts[k].getBBox().cy);
		}*/

    }

    initialize();
}