function Animation(EventHandler, SettingsParameter, CallBack) 
{
    var Sensors = new Array(128);
    var Actuators = new Array(128);
    var Timer = undefined;
    var SVG = undefined;
    var ElevatorCagePositionFloor1 = 0;
    var ElevatorCagePositionFloor2 = -162;
    var ElevatorCagePositionFloor3 = -322;
    var ElevatorCagePositionFloor4 = -482;
    var ElevatorCagePositionAboveFloor1 = -62;
    var ElevatorCagePositionBelowFloor2 = -122;
    var ElevatorCagePositionAboveFloor2 = -212;
    var ElevatorCagePositionBelowFloor3 = -272;
    var ElevatorCagePositionAboveFloor3 = -372;
    var ElevatorCagePositionBelowFloor4 = -432;
    var ElevatorCagePosition = 0;
    var DoorFloor1PositionLeft = 0;
    var DoorFloor2PositionLeft = 0;
    var DoorFloor3PositionLeft = 0;
    var DoorFloor4PositionLeft = 0;
    var DoorFloor1PositionRight = 0;
    var DoorFloor2PositionRight = 0;
    var DoorFloor3PositionRight = 0;
    var DoorFloor4PositionRight = 0; 
    var DoorOpenPositionLeft = 60;
    var DoorClosedPositionLeft = 95.094;
    var DoorMiddlePositionLeft = 77.5;
    var DoorOpenPositionRight = 168;
    var DoorClosedPositionRight = 133.094;
    var DoorMiddlePositionRight = 150.694;
    var Door1Right = undefined;
    var Door2Right = undefined;
    var Door3Right = undefined;
    var Door4Right = undefined;
    var Door1Left  = undefined;
    var Door2Left  = undefined;
    var Door3Left  = undefined;
    var Door4Left  = undefined;
	var EC_ButtonFloor1 = undefined;
	var EC_ButtonFloor2 = undefined;
	var EC_ButtonFloor3 = undefined;
	var EC_ButtonFloor4 = undefined;
	var EC_ButtonAlert = undefined;
	var EC_ButtonEmergencyStop = undefined;
    var IndicatorDisplayFloor1 = undefined;
    var IndicatorDisplayFloor2 = undefined;
    var IndicatorDisplayFloor3 = undefined;
    var IndicatorDisplayFloor4 = undefined;
	var EC_LED_Floor1 = undefined;
	var EC_LED_Floor2 = undefined;
	var EC_LED_Floor3 = undefined;
	var EC_LED_Floor4 = undefined;
	var EC_LED_Overload = undefined;
	var EC_LED_Alert = undefined;
	var EC_LED_EmergencyStop = undefined;
    
    // Colors of elevator control panel
    
    var EC_LED_Floor1_Color = undefined;
    var EC_LED_Floor2_Color = undefined;
    var EC_LED_Floor3_Color = undefined;
    var EC_LED_Floor4_Color = undefined;
    var EC_LED_Overload_Color = undefined;
	var EC_LED_Alert_Color = undefined;
	var EC_LED_EmergencyStop_Color = undefined;
	
	var SVGOffSetY = 775.582;
	
	// Sizes
	
	var ElevatorSize = [];
	var ArrowUpFloor1Size = [];
	var ArrowUpFloor2Size = [];
	var ArrowUpFloor3Size = [];
	var ArrowDownFloor2Size = [];
	var ArrowDownFloor3Size = [];
	var ArrowDownFloor4Size = [];
	var ArrowUpTopSize = [];
	var ArrowDownTopSize = [];
	var ButtonOverloadSize = [];
	var Door1RightSize = [];
	var Door2RightSize = [];
	var Door3RightSize = [];
	var Door4RightSize = [];
	var Door1LeftSize = [];
	var Door2LeftSize = [];
	var Door3LeftSize = [];
	var Door4LeftSize = [];
	var EC_ButtonFloor1Size = [];
	var EC_ButtonFloor2Size = [];
	var EC_ButtonFloor3Size = [];
	var EC_ButtonFloor4Size = [];
	var EC_ButtonAlertSize = [];
	var EC_ButtonEmergencyStopSize = [];
	var EC_LED_Floor1Size = [];
	var EC_LED_Floor2Size = [];
	var EC_LED_Floor3Size = [];
	var EC_LED_Floor4Size = [];
	var EC_LED_OverloadSize = [];
	var EC_LED_AlertSize = [];
	var EC_LED_EmergencyStopSize = [];
    var IndicatorDisplayFloor1Size = [];
    var IndicatorDisplayFloor2Size = [];
    var IndicatorDisplayFloor3Size = [];
    var IndicatorDisplayFloor4Size = [];
	
	// Variables for blinking engine
	
	var BlinkingUnit = undefined;
    var BlinkingType = undefined;
	var BlinkingInterval = 600;
	var BlinkingActive = false;
	var BlinkingRect = undefined;
	var HoverSelectedParts = [];
	var BlinkingOpactiy = 0.6;
    
    var SVGCanvas = undefined;
    var Elevator = undefined;
	var Snap_Elevator = undefined;


    Animation.prototype.onCommand = function (Command) 
    {

    };

    Animation.prototype.onServerInterfaceInfo = function (Info) 
    {
        if (Info.getInfoType() == EnumServerInterfaceInfo.Connect)
		{
            SendInitialUserVariables();
        }
    };
    
    Animation.prototype.onHoverEvent = function(HoverData)
    {
        SetUnitBlinking(HoverData.getType(), HoverData.getUnit());
    };

    Animation.prototype.onData = function (Data) {
        if(Data.getSensors()[0] != undefined) Sensors = Data.getSensors();
        if(Data.getActuators()[0] != undefined) Actuators = Data.getActuators();
    };
    
    function SendInitialUserVariables()
    {
        SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor1, "0");
        SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor2Up, "0");
        SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor2Down, "0");
        SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor3Down, "0");
        SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor3Up, "0");
        SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor4, "0");
        SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.SimulationOverload, "0");
        
        // low-active light barriers
        SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor1, "1");
        SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor2, "1");
        SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor3, "1");
        SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.LightBarrierFloor4, "1");
    }

    //this.initialize = initialize;
    function initialize() 
    {
        for (var i = 0; i < 128; i++)
        {
            Actuators[i] = false;
            Sensors[i] = false;
        }

		$("#" + SettingsParameter.AnimationDIVName).load('ECP/Animation/Images/Image_Elevator4Floors.svg', function ()
        {
            SVG = $('#SVGAnimation');
			
			SVGCanvas = Snap('#SVGAnimation');

            Elevator = Snap('#Elevator');
			ElevatorSize['height'] = Snap('#Elevator').getBBox().height;
			ElevatorSize['x'] = Snap('#Elevator').getBBox().x;
			
			Snap_Elevator = Snap('#Elevator');

            Wall = Snap('#wall');

            Wall.attr("fill-opacity", "0.3");

            Door1Right = Snap('#door1right');
			Door1RightSize['x'] = Snap('#door1right').getBBox().x;
			Door1RightSize['y'] = Snap('#door1right').getBBox().y;
			
            Door2Right = Snap('#door2right');
			Door2RightSize['x'] = Snap('#door2right').getBBox().x;
			Door2RightSize['y'] = Snap('#door2right').getBBox().y;
			
            Door3Right = Snap('#door3right');
			Door3RightSize['x'] = Snap('#door3right').getBBox().x;
			Door3RightSize['y'] = Snap('#door3right').getBBox().y;
			
            Door4Right = Snap('#door4right');
			Door4RightSize['x'] = Snap('#door4right').getBBox().x;
			Door4RightSize['y'] = Snap('#door4right').getBBox().y;
			
            Door1Left = Snap('#door1left');
			Door1LeftSize['x'] = Snap('#door1left').getBBox().x;
			Door1LeftSize['y'] = Snap('#door1left').getBBox().y;
			
            Door2Left = Snap('#door2left');
			Door2LeftSize['x'] = Snap('#door2left').getBBox().x;
			Door2LeftSize['y'] = Snap('#door2left').getBBox().y;
			
            Door3Left = Snap('#door3left');
			Door3LeftSize['x'] = Snap('#door3left').getBBox().x;
			Door3LeftSize['y'] = Snap('#door3left').getBBox().y;
			
            Door4Left = Snap('#door4left');
			Door4LeftSize['x'] = Snap('#door4left').getBBox().x;
			Door4LeftSize['y'] = Snap('#door4left').getBBox().y;

            ArrowUpFloor1   = Snap('#arrowupfloor1');
			ArrowUpFloor1Size['x'] = Snap('#arrowupfloor1').getBBox().x;
			ArrowUpFloor1Size['y'] = Snap('#arrowupfloor1').getBBox().y;
			
            ArrowUpFloor2   = Snap('#arrowupfloor2');
			ArrowUpFloor2Size['x'] = Snap('#arrowupfloor2').getBBox().x;
			ArrowUpFloor2Size['y'] = Snap('#arrowupfloor2').getBBox().y;
			
            ArrowDownFloor2 = Snap('#arrowdownfloor2');
			ArrowDownFloor2Size['x'] = Snap('#arrowdownfloor2').getBBox().x;
			ArrowDownFloor2Size['y'] = Snap('#arrowdownfloor2').getBBox().y;
			
            ArrowDownFloor3 = Snap('#arrowdownfloor3');
			ArrowDownFloor3Size['x'] = Snap('#arrowdownfloor3').getBBox().x;
			ArrowDownFloor3Size['y'] = Snap('#arrowdownfloor3').getBBox().y;
			
            ArrowUpFloor3 = Snap('#arrowupfloor3');
			ArrowUpFloor3Size['x'] = Snap('#arrowupfloor3').getBBox().x;
			ArrowUpFloor3Size['y'] = Snap('#arrowupfloor3').getBBox().y;
			
            ArrowDownFloor4 = Snap('#arrowdownfloor4');
			ArrowDownFloor4Size['x'] = Snap('#arrowdownfloor4').getBBox().x;
			ArrowDownFloor4Size['y'] = Snap('#arrowdownfloor4').getBBox().y;
            
            ArrowUpTop      = Snap('#arrowuptop');
			ArrowUpTopSize['x'] = Snap('#arrowuptop').getBBox().x;
			ArrowUpTopSize['y'] = Snap('#arrowuptop').getBBox().y;
			
            ArrowDownTop    = Snap('#arrowdowntop');
			ArrowDownTopSize['x'] = Snap('#arrowdowntop').getBBox().x;
			ArrowDownTopSize['y'] = Snap('#arrowdowntop').getBBox().y;
			
            EC_ButtonFloor1 = Snap('#buttongroundfloor');
			EC_ButtonFloor1Size['x'] = Snap('#buttongroundfloor').getBBox().x;
			EC_ButtonFloor1Size['y'] = Snap('#buttongroundfloor').getBBox().y;
			
            EC_ButtonFloor2 = Snap('#buttonfirstfloor');
			EC_ButtonFloor2Size['x'] = Snap('#buttonfirstfloor').getBBox().x;
			EC_ButtonFloor2Size['y'] = Snap('#buttonfirstfloor').getBBox().y;
			
            EC_ButtonFloor3 = Snap('#buttonsecondfloor');
			EC_ButtonFloor3Size['x'] = Snap('#buttonsecondfloor').getBBox().x;
			EC_ButtonFloor3Size['y'] = Snap('#buttonsecondfloor').getBBox().y;
			
            EC_ButtonFloor4 = Snap('#buttonthirdfloor');
			EC_ButtonFloor4Size['x'] = Snap('#buttonthirdfloor').getBBox().x;
			EC_ButtonFloor4Size['y'] = Snap('#buttonthirdfloor').getBBox().y;
			
            ButtonOverload = Snap('#buttonoverload');
			ButtonOverloadSize['x'] = Snap('#buttonoverload').getBBox().x;
			ButtonOverloadSize['y'] = Snap('#buttonoverload').getBBox().y;
			
			EC_ButtonAlert = Snap('#buttonalarm');
			EC_ButtonAlertSize['x'] = Snap('#buttonalarm').getBBox().x;
			EC_ButtonAlertSize['y'] = Snap('#buttonalarm').getBBox().y;
			
			EC_ButtonEmergencyStop = Snap('#buttonemergencystop');
			EC_ButtonEmergencyStopSize['x'] = Snap('#buttonemergencystop').getBBox().x;
			EC_ButtonEmergencyStopSize['y'] = Snap('#buttonemergencystop').getBBox().y;
			
			EC_LED_Floor1 = Snap('#ledgroundfloor');
            EC_LED_Floor1Size['x'] = Snap('#ledgroundfloor').getBBox().x;
			EC_LED_Floor1Size['y'] = Snap('#ledgroundfloor').getBBox().y;
            
            EC_LED_Floor1_Color = Snap('#ledgroundfloorcolor');
            
			EC_LED_Floor2 = Snap('#ledfirstfloor');
            EC_LED_Floor2Size['x'] = Snap('#ledfirstfloor').getBBox().x;
			EC_LED_Floor2Size['y'] = Snap('#ledfirstfloor').getBBox().y;
            
            EC_LED_Floor2_Color = Snap('#ledfirstfloorcolor');
            
			EC_LED_Floor3 = Snap('#ledsecondfloor');
            EC_LED_Floor3Size['x'] = Snap('#ledsecondfloor').getBBox().x;
			EC_LED_Floor3Size['y'] = Snap('#ledsecondfloor').getBBox().y;
            
            EC_LED_Floor3_Color = Snap('#ledsecondfloorcolor');
            
			EC_LED_Floor4 = Snap('#ledthirdfloor');
            EC_LED_Floor4Size['x'] = Snap('#ledthirdfloor').getBBox().x;
			EC_LED_Floor4Size['y'] = Snap('#ledthirdfloor').getBBox().y;
            
            EC_LED_Floor4_Color = Snap('#ledsecondfloorcolor_1_');
            
			EC_LED_Overload = Snap('#ledoverload_1_');
            EC_LED_OverloadSize['x'] = Snap('#ledoverload_1_').getBBox().x;
			EC_LED_OverloadSize['y'] = Snap('#ledoverload_1_').getBBox().y;
            
            EC_LED_Overload_Color = Snap('#ledoverloadcolor');
            
			EC_LED_Alert = Snap('#ledalarm');
            EC_LED_AlertSize['x'] = Snap('#ledalarm').getBBox().x;
			EC_LED_AlertSize['y'] = Snap('#ledalarm').getBBox().y;
            
            EC_LED_Alert_Color = Snap('#ledalarmcolor');
            
			EC_LED_EmergencyStop = Snap('#ledemergencystop');
            EC_LED_EmergencyStopSize['x'] = Snap('#ledemergencystop').getBBox().x;
			EC_LED_EmergencyStopSize['y'] = Snap('#ledemergencystop').getBBox().y;
            
            EC_LED_EmergencyStop_Color = Snap('#ledemercenystopcolor');
            
            IndicatorDisplayFloor1 = Snap('#buttonfloor1');
			IndicatorDisplayFloor1Size['x'] = Snap('#buttonfloor1').getBBox().x;
			IndicatorDisplayFloor1Size['y'] = Snap('#buttonfloor1').getBBox().y;
			
            IndicatorDisplayFloor2 = Snap('#buttonfloor2');
			IndicatorDisplayFloor2Size['x'] = Snap('#buttonfloor2').getBBox().x;
			IndicatorDisplayFloor2Size['y'] = Snap('#buttonfloor2').getBBox().y;
			
            IndicatorDisplayFloor3 = Snap('#buttonfloor3');
			IndicatorDisplayFloor3Size['x'] = Snap('#buttonfloor3').getBBox().x;
			IndicatorDisplayFloor3Size['y'] = Snap('#buttonfloor3').getBBox().y;
			
            IndicatorDisplayFloor4 = Snap('#buttonfloor4');
			IndicatorDisplayFloor4Size['x'] = Snap('#buttonfloor4').getBBox().x;
			IndicatorDisplayFloor4Size['y'] = Snap('#buttonfloor4').getBBox().y;

            var arrowupfloor1 = $('#arrowupfloor1');
            arrowupfloor1.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor1, "1");
            });
            arrowupfloor1.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor1, "0");
            });

            var arrowupfloor2 = $('#arrowupfloor2');
            arrowupfloor2.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor2Up, "1");
            });
            arrowupfloor2.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor2Up, "0");
            });

            var arrowdownfloor2 = $('#arrowdownfloor2');
            arrowdownfloor2.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor2Down, "1");
            });
            arrowdownfloor2.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor2Down, "0");
            });

            var arrowdownfloor3 = $('#arrowdownfloor3');
            arrowdownfloor3.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor3Down, "1");
            });
            arrowdownfloor3.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor3Down, "0");
            });

            var arrowupfloor3 = $('#arrowupfloor3');
            arrowupfloor3.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor3Up, "1");
            });
            arrowupfloor3.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor3Up, "0");
            });

            var arrowdownfloor4 = $('#arrowdownfloor4');
            arrowdownfloor4.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor4, "1");
            });
            arrowdownfloor4.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.CallButtonFloor4, "0");
            });

            var buttonoverload = $('#buttonoverload');
            buttonoverload.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.SimulationOverload, "1");
            });
            buttonoverload.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.SimulationOverload, "0");
            });

            var buttongroundfloor = $('#buttongroundfloor');
            buttongroundfloor.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlFloor1, "1");
            });
            buttongroundfloor.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlFloor1, "0");
            });

            var buttonfirstfloor = $('#buttonfirstfloor');
            buttonfirstfloor.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlFloor2, "1");
            });
            buttonfirstfloor.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlFloor2, "0");
            });

            var buttonsecondfloor = $('#buttonsecondfloor');
            buttonsecondfloor.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlFloor3, "1");
            });
            buttonsecondfloor.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlFloor3, "0");
            });

            var buttonthirdfloor = $('#buttonthirdfloor');
            buttonthirdfloor.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlFloor4, "1");
            });
            buttonthirdfloor.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlFloor4, "0");
            });

            var buttonalarm = $('#buttonalarm');
            buttonalarm.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlAlert, "1");
            });
            buttonalarm.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlAlert, "0");
            });

            var buttonemergencystop = $('#buttonemergencystop');
            buttonemergencystop.bind("mousedown", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlEmStop, "1");
            });
            buttonemergencystop.bind("mouseleave mouseup", function () {
                SendEnvironmentVariableCommand(EnumElevatorEnvironmentVariables.ElevatorControlEmStop, "0");
            });
            SVG.attr("width", "100%");
            SVG.attr("height", "100%");
            Timer = setInterval(Refresh, 100);
			
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
						HoverSelectedParts.push([Elevator, ElevatorSize['x'], ElevatorCagePositionFloor1 + SVGOffSetY - ElevatorSize['height'], true]);
						break;  
					case "1":
						HoverSelectedParts.push([Elevator, ElevatorSize['x'], ElevatorCagePositionFloor2 + SVGOffSetY - ElevatorSize['height'], true]);
						break;  
					case "2":
						HoverSelectedParts.push([Elevator, ElevatorSize['x'], ElevatorCagePositionFloor3 + SVGOffSetY - ElevatorSize['height'], true]);
						break;  
					case "3":
						HoverSelectedParts.push([Elevator, ElevatorSize['x'], ElevatorCagePositionAboveFloor1 + SVGOffSetY - ElevatorSize['height'], true]);
						break;  
					case "4":
						HoverSelectedParts.push([Elevator, ElevatorSize['x'], ElevatorCagePositionBelowFloor2 + SVGOffSetY - ElevatorSize['height'], true]);
						break;  
					case "5":
						HoverSelectedParts.push([Elevator, ElevatorSize['x'], ElevatorCagePositionAboveFloor2 + SVGOffSetY - ElevatorSize['height'], true]);
						break;  
					case "6":
						HoverSelectedParts.push([Elevator, ElevatorSize['x'], ElevatorCagePositionBelowFloor3 + SVGOffSetY - ElevatorSize['height'], true]);
						break;  
					case "7":
						HoverSelectedParts.push([Door1Left,DoorOpenPositionLeft,Door1LeftSize['y']]);
						HoverSelectedParts.push([Door1Right,DoorOpenPositionRight,Door1RightSize['y']]);
						break;  
					case "8":
						HoverSelectedParts.push([Door1Left,DoorClosedPositionLeft,Door1LeftSize['y']]);
						HoverSelectedParts.push([Door1Right,DoorClosedPositionRight,Door1RightSize['y']]);
						break;
					case "9":
						HoverSelectedParts.push([Door2Left,DoorOpenPositionLeft,Door2LeftSize['y']]);
						HoverSelectedParts.push([Door2Right,DoorOpenPositionRight,Door2RightSize['y']]);
						break;
					case "10":
						HoverSelectedParts.push([Door2Left,DoorClosedPositionLeft,Door2LeftSize['y']]);
						HoverSelectedParts.push([Door2Right,DoorClosedPositionRight,Door2RightSize['y']]);
						break;		
					case "11":
						HoverSelectedParts.push([Door3Left,DoorOpenPositionLeft,Door3LeftSize['y']]);
						HoverSelectedParts.push([Door3Right,DoorOpenPositionRight,Door3RightSize['y']]);
						break;
					case "12":
						HoverSelectedParts.push([Door3Left,DoorClosedPositionLeft,Door3LeftSize['y']]);
						HoverSelectedParts.push([Door3Right,DoorClosedPositionRight,Door3RightSize['y']]);
						break;
					case "13":	
						break;
					case "14":	
						break;
					case "15":	
						break;
					case "16":
						HoverSelectedParts.push([ArrowUpFloor1, ArrowUpFloor1Size['x'], ArrowUpFloor1Size['y']]);
						break;
					case "17":
						HoverSelectedParts.push([ArrowUpFloor2, ArrowUpFloor2Size['x'], ArrowUpFloor2Size['y']]);	
						break;
					case "18":
						HoverSelectedParts.push([ArrowDownFloor2,ArrowDownFloor2Size['x'], ArrowDownFloor2Size['y']]);	
						break;	
					case "19":
						HoverSelectedParts.push([ArrowDownFloor3,ArrowDownFloor3Size['x'], ArrowDownFloor3Size['y']]);	
						break;
                    case "20":
                        HoverSelectedParts.push([EC_ButtonFloor1, EC_ButtonFloor1Size['x'], EC_ButtonFloor1Size['y']]);	
                        break;
                    case "21":
                        HoverSelectedParts.push([EC_ButtonFloor2, EC_ButtonFloor2Size['x'], EC_ButtonFloor2Size['y']]);	
                        break;
                    case "22":
                        HoverSelectedParts.push([EC_ButtonFloor3, EC_ButtonFloor3Size['x'], EC_ButtonFloor3Size['y']]);	
                        break;
                    case "23":
                        HoverSelectedParts.push([EC_ButtonAlert, EC_ButtonAlertSize['x'], EC_ButtonAlertSize['y']]);	
                        break;
                    case "24":
                        HoverSelectedParts.push([EC_ButtonEmergencyStop, EC_ButtonEmergencyStopSize['x'], EC_ButtonEmergencyStopSize['y']]);	
                        break;        
					case "25":
						HoverSelectedParts.push([ButtonOverload,ButtonOverloadSize['x'], ButtonOverloadSize['y']]);		
						break;	
					case "26":
						HoverSelectedParts.push([Elevator, ElevatorSize['x'], ElevatorCagePositionFloor4 + SVGOffSetY - ElevatorSize['height'], true]);
						break; 	
					case "27":
						HoverSelectedParts.push([Elevator, ElevatorSize['x'], ElevatorCagePositionAboveFloor3 + SVGOffSetY - ElevatorSize['height'], true]);
						break; 	
					case "28":
						HoverSelectedParts.push([Elevator, ElevatorSize['x'], ElevatorCagePositionBelowFloor4 + SVGOffSetY - ElevatorSize['height'], true]);
						break; 		
					case "29":
						HoverSelectedParts.push([Door4Left,DoorOpenPositionLeft,Door4LeftSize['y']]);
						HoverSelectedParts.push([Door4Right,DoorOpenPositionRight,Door4RightSize['y']]);
						break; 
					case "30":
						HoverSelectedParts.push([Door4Left,DoorClosedPositionLeft,Door4LeftSize['y']]);
						HoverSelectedParts.push([Door4Right,DoorClosedPositionRight,Door4RightSize['y']]);
						break;	
                    case "31":
                        break;
					case "32":
						HoverSelectedParts.push([ArrowUpFloor3,ArrowUpFloor3Size['x'], ArrowUpFloor3Size['y']]);
						break;		
					case "33":
						HoverSelectedParts.push([ArrowDownFloor4,ArrowDownFloor4Size['x'], ArrowDownFloor4Size['y']]);
						break;	
                    case "34":
						HoverSelectedParts.push([EC_ButtonFloor4, EC_ButtonFloor4Size['x'], EC_ButtonFloor4Size['y']]);	
						break;       
				}
			}
			else if(BlinkingType = "Actuator")
			{
				switch(BlinkingUnit)
				{
					case "0":
						break;  
					case "1":
						break;  
					case "2":
						break;  
					case "3":
						HoverSelectedParts.push([Door1Left,DoorOpenPositionLeft,Door1LeftSize['y']]);
						HoverSelectedParts.push([Door1Right,DoorOpenPositionRight,Door1RightSize['y']]);
						break;  
					case "4":
						HoverSelectedParts.push([Door1Left,DoorClosedPositionLeft,Door1LeftSize['y']]);
						HoverSelectedParts.push([Door1Right,DoorClosedPositionRight,Door1RightSize['y']]);
						break;  
					case "5":
						HoverSelectedParts.push([Door2Left,DoorOpenPositionLeft,Door2LeftSize['y']]);
						HoverSelectedParts.push([Door2Right,DoorOpenPositionRight,Door2RightSize['y']]);
						break;  
					case "6":
						HoverSelectedParts.push([Door2Left,DoorClosedPositionLeft,Door2LeftSize['y']]);
						HoverSelectedParts.push([Door2Right,DoorClosedPositionRight,Door2RightSize['y']]);
						break;  
					case "7":
						HoverSelectedParts.push([Door3Left,DoorOpenPositionLeft,Door3LeftSize['y']]);
						HoverSelectedParts.push([Door3Right,DoorOpenPositionRight,Door3RightSize['y']]);
						break;  
					case "8":
						HoverSelectedParts.push([Door3Left,DoorClosedPositionLeft,Door3LeftSize['y']]);
						HoverSelectedParts.push([Door3Right,DoorClosedPositionRight,Door3RightSize['y']]);
						break;
					case "9":
                        HoverSelectedParts.push([ArrowUpFloor1, ArrowUpFloor1Size['x'], ArrowUpFloor1Size['y']]);	
						break;
					case "10":
						HoverSelectedParts.push([ArrowUpFloor2, ArrowUpFloor2Size['x'], ArrowUpFloor2Size['y']]);	
						break;		
					case "11":
						HoverSelectedParts.push([ArrowDownFloor2, ArrowDownFloor2Size['x'], ArrowDownFloor2Size['y']]);	
						break;
					case "12":
						HoverSelectedParts.push([ArrowDownFloor3, ArrowDownFloor3Size['x'], ArrowDownFloor3Size['y']]);	
						break;
					case "13":	
						HoverSelectedParts.push([IndicatorDisplayFloor1, IndicatorDisplayFloor1Size['x'], IndicatorDisplayFloor1Size['y']]);	
						break;
					case "14":	
						HoverSelectedParts.push([IndicatorDisplayFloor2, IndicatorDisplayFloor2Size['x'], IndicatorDisplayFloor2Size['y']]);	
						break;
					case "15":	
						HoverSelectedParts.push([IndicatorDisplayFloor3, IndicatorDisplayFloor3Size['x'], IndicatorDisplayFloor3Size['y']]);	
						break;
					case "16":
						HoverSelectedParts.push([ArrowDownTop, ArrowDownTopSize['x'], ArrowDownTopSize['y']]);	
						break;
					case "17":
						HoverSelectedParts.push([ArrowUpTop, ArrowUpTopSize['x'], ArrowUpTopSize['y']]);	
						break;
					case "18":
						HoverSelectedParts.push([EC_LED_Floor1, EC_LED_Floor1Size['x'], EC_LED_Floor1Size['y']]);	
						break;	
					case "19":
						HoverSelectedParts.push([EC_LED_Floor2, EC_LED_Floor2Size['x'], EC_LED_Floor2Size['y']]);	
						break;
                    case "20":
                        HoverSelectedParts.push([EC_LED_Floor3, EC_LED_Floor3Size['x'], EC_LED_Floor3Size['y']]);	
                        break;
                    case "21":
                        HoverSelectedParts.push([EC_LED_Alert, EC_LED_AlertSize['x'], EC_LED_AlertSize['y']]);		
                        break;
                    case "22":
                        HoverSelectedParts.push([EC_LED_EmergencyStop, EC_LED_EmergencyStopSize['x'], EC_LED_EmergencyStopSize['y']]);	
                        break;
                    case "23":
                        HoverSelectedParts.push([EC_LED_Overload, EC_LED_OverloadSize['x'], EC_LED_OverloadSize['y']]);	
                        break;
                    case "24":
                        HoverSelectedParts.push([Door4Left,DoorOpenPositionLeft,Door4LeftSize['y']]);
						HoverSelectedParts.push([Door4Right,DoorOpenPositionRight,Door4RightSize['y']]);
                        break;        
					case "25":
						HoverSelectedParts.push([Door4Left,DoorClosedPositionLeft,Door4LeftSize['y']]);
						HoverSelectedParts.push([Door4Right,DoorClosedPositionRight,Door4RightSize['y']]);	
						break;	
					case "26":
						HoverSelectedParts.push([ArrowUpFloor3, ArrowUpFloor3Size['x'], ArrowUpFloor3Size['y']]);	
						break; 	
					case "27":
						HoverSelectedParts.push([ArrowDownFloor4, ArrowDownFloor4Size['x'], ArrowDownFloor4Size['y']]);	
						break; 	
					case "28":
						HoverSelectedParts.push([IndicatorDisplayFloor4, IndicatorDisplayFloor4Size['x'], IndicatorDisplayFloor4Size['y']]);
						break; 		
					case "29":
						HoverSelectedParts.push([EC_LED_Floor4, EC_LED_Floor4Size['x'], EC_LED_Floor4Size['y']]);
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

    function Refresh() 
    {
        // Sensors
        
        // Cage position
        if (Sensors[0]) 
        {
            ElevatorCagePosition = ElevatorCagePositionFloor1;
        }
        else if(Sensors[1])
        {
            ElevatorCagePosition = ElevatorCagePositionFloor2;
        }
        else if(Sensors[2])
        {
            ElevatorCagePosition = ElevatorCagePositionFloor3;
        }
        else if(Sensors[26])
        {
            ElevatorCagePosition = ElevatorCagePositionFloor4;
        }
        else if(Sensors[3])
        {
            ElevatorCagePosition = ElevatorCagePositionAboveFloor1;
        }
        else if(Sensors[4])
        {
            ElevatorCagePosition = ElevatorCagePositionBelowFloor2;
        }
        else if(Sensors[5])
        {
            ElevatorCagePosition = ElevatorCagePositionAboveFloor2;
        }
        else if(Sensors[6])
        {
            ElevatorCagePosition = ElevatorCagePositionBelowFloor3;
        }
        else if(Sensors[27])
        {
            ElevatorCagePosition = ElevatorCagePositionAboveFloor3;
        }
        else if(Sensors[28])
        {
            ElevatorCagePosition = ElevatorCagePositionBelowFloor4;
        }
        
        // Door floor 1
        if(!Sensors[7])
        {
            if(!Sensors[8])
            {
                DoorFloor1PositionRight = DoorMiddlePositionRight;
                DoorFloor1PositionLeft = DoorMiddlePositionLeft;
            }    
            else
            {
                DoorFloor1PositionRight = DoorClosedPositionRight;
                DoorFloor1PositionLeft = DoorClosedPositionLeft;
            }    
        }
        else
        {
            DoorFloor1PositionRight = DoorOpenPositionRight;
            DoorFloor1PositionLeft = DoorOpenPositionLeft;
        }
        
        // Door floor 2
        if(!Sensors[9])
        {
            if(!Sensors[10])
            {
                DoorFloor2PositionRight = DoorMiddlePositionRight;
                DoorFloor2PositionLeft = DoorMiddlePositionLeft;
            }    
            else
            {
                DoorFloor2PositionRight = DoorClosedPositionRight;
                DoorFloor2PositionLeft = DoorClosedPositionLeft;
            }    
        }
        else
        {
            DoorFloor2PositionRight = DoorOpenPositionRight;
            DoorFloor2PositionLeft = DoorOpenPositionLeft;
        }
        
        // Door floor 3
        if(!Sensors[11])
        {
            if(!Sensors[12])
            {
                DoorFloor3PositionRight = DoorMiddlePositionRight;
                DoorFloor3PositionLeft = DoorMiddlePositionLeft;
            }    
            else
            {
                DoorFloor3PositionRight = DoorClosedPositionRight;
                DoorFloor3PositionLeft = DoorClosedPositionLeft;
            }    
        }
        else
        {
            DoorFloor3PositionRight = DoorOpenPositionRight;
            DoorFloor3PositionLeft = DoorOpenPositionLeft;
        }
        
        // Door floor 4
        if(!Sensors[29])
        {
            if(!Sensors[30])
            {
                DoorFloor4PositionRight = DoorMiddlePositionRight;
                DoorFloor4PositionLeft = DoorMiddlePositionLeft;
            }    
            else
            {
                DoorFloor4PositionRight = DoorClosedPositionRight;
                DoorFloor4PositionLeft = DoorClosedPositionLeft;
            }    
        }
        else
        {
            DoorFloor4PositionRight = DoorOpenPositionRight;
            DoorFloor4PositionLeft = DoorOpenPositionLeft;
        }
        
        // Actuators

        if (Actuators[9]) ArrowUpFloor1.attr("fill", "#ffff00");
        else ArrowUpFloor1.attr("fill", "#7f7f00");

        if (Actuators[10]) ArrowUpFloor2.attr("fill", "#ffff00");
        else ArrowUpFloor2.attr("fill", "#7f7f00");

        if (Actuators[11]) ArrowDownFloor2.attr("fill", "#ffff00");
        else ArrowDownFloor2.attr("fill", "#7f7f00");

        if (Actuators[12]) ArrowDownFloor3.attr("fill", "#ffff00");
        else ArrowDownFloor3.attr("fill", "#7f7f00");
        
        if (Actuators[13]) IndicatorDisplayFloor1.attr("fill", "#ffff00");
        else IndicatorDisplayFloor1.attr("fill", "#7f7f00");
        
        if (Actuators[14]) IndicatorDisplayFloor2.attr("fill", "#ffff00");
        else IndicatorDisplayFloor2.attr("fill", "#7f7f00");

        if (Actuators[15]) IndicatorDisplayFloor3.attr("fill", "#ffff00");
        else IndicatorDisplayFloor3.attr("fill", "#7f7f00");
        
        if (Actuators[16]) ArrowDownTop.attr("fill", "#ffff00");
        else ArrowDownTop.attr("fill", "#7f7f00");

        if (Actuators[17]) ArrowUpTop.attr("fill", "#ffff00");
        else ArrowUpTop.attr("fill", "#7f7f00");
        
        if (Actuators[18]) EC_LED_Floor1_Color.attr("fill", "#cfcf00");
        else EC_LED_Floor1_Color.attr("fill", "#006837");
        
        if (Actuators[19]) EC_LED_Floor2_Color.attr("fill", "#cfcf00");
        else EC_LED_Floor2_Color.attr("fill", "#006837");
        
        if (Actuators[20]) EC_LED_Floor3_Color.attr("fill", "#cfcf00");// EC_LED_Floor3_Color.attr("fill", "#17DF81");
        else EC_LED_Floor3_Color.attr("fill", "#006837");

        if (Actuators[21]) EC_LED_Alert_Color.attr("fill", "#cfcf00");//"#F12C2C");
        else EC_LED_Alert_Color.attr("fill", "#A01717");
        
        if (Actuators[22]) EC_LED_EmergencyStop_Color.attr("fill", "#cfcf00");//"#F12C2C");
        else EC_LED_EmergencyStop_Color.attr("fill", "#A01717");
        
        if (Actuators[23]) EC_LED_Overload_Color.attr("fill", "#cfcf00");//"#F12C2C");
        else EC_LED_Overload_Color.attr("fill", "#A01717");
        
        if (Actuators[26]) ArrowUpFloor3.attr("fill", "#ffff00");
        else ArrowUpFloor3.attr("fill", "#7f7f00");
        
        if (Actuators[27]) ArrowDownFloor4.attr("fill", "#ffff00");
        else ArrowDownFloor4.attr("fill", "#7f7f00");

        if (Actuators[28]) IndicatorDisplayFloor4.attr("fill", "#ffff00");
        else IndicatorDisplayFloor4.attr("fill", "#7f7f00");
        
        if (Actuators[29]) EC_LED_Floor4_Color.attr("fill", "#cfcf00");//"#17DF81");
        else EC_LED_Floor4_Color.attr("fill", "#006837");
        
		Snap_Elevator.transform("translate(0," + ElevatorCagePosition + ")");
        Door4Left.attr("x", DoorFloor4PositionLeft);
        Door4Right.attr("x", DoorFloor4PositionRight);
        Door1Left.attr("x", DoorFloor1PositionLeft);
        Door1Right.attr("x", DoorFloor1PositionRight);
        Door2Left.attr("x", DoorFloor2PositionLeft);
        Door2Right.attr("x", DoorFloor2PositionRight);
        Door3Left.attr("x", DoorFloor3PositionLeft);
        Door3Right.attr("x", DoorFloor3PositionRight);
    }

    initialize();
}    