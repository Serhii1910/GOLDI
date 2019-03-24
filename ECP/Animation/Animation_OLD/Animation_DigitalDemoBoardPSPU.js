function Animation(EventHandler, SettingsParameter, CallBack) {
    //var Sensors = new Array(128);
    var Actuators = new Array(128);
    var Timer = undefined;
    var SVG = undefined;
    var Hex0Count = 0;
    var Hex1Count = 0;
    var Hex0Rotate = undefined;
    var Hex0RotateX = undefined;
    var Hex0RotateY = undefined;
    var Hex0RotationPosition = 0;
    var Hex1Rotate = undefined;
    var Hex1RotateX = undefined;
    var Hex1RotateY = undefined;
    var Hex1RotationPosition = 0;
    var PotiRotate = undefined;
    var PotiRotateX = undefined;
    var PotiRotateY = undefined;
    var PotiRotationPosition = 0;
    var EncoderRotate = undefined;
    var EncoderRotateX = undefined;
    var EncoderRotateY = undefined;
    var EncoderRotationPosition = 0;
    var Button0 = undefined;
    var Button1 = undefined;
    var Button2 = undefined;
    var Button3 = undefined;
    var Button4 = undefined;
    var Button5 = undefined;
    var Button6 = undefined;
    var Button7 = undefined;
    var Switch0Button = undefined;
    var Switch1Button = undefined;
    var Switch2Button = undefined;
    var Switch3Button = undefined;
    var Switch4Button = undefined;
    var Switch5Button = undefined;
    var Switch6Button = undefined;
    var Switch7Button = undefined;
    var Bargraph0 = undefined;
    var Bargraph1 = undefined;
    var Bargraph2 = undefined;
    var Bargraph3 = undefined;
    var Bargraph4 = undefined;
    var Bargraph5 = undefined;
    var Bargraph6 = undefined;
    var Bargraph7 = undefined;
    var Segment0A = undefined;
    var Segment0B = undefined;
    var Segment0C = undefined;
    var Segment0D = undefined;
    var Segment0E = undefined;
    var Segment0F = undefined;
    var Segment0G = undefined;
    var Segment0Dot = undefined;
    var Segment1A = undefined;
    var Segment1B = undefined;
    var Segment1C = undefined;
    var Segment1D = undefined;
    var Segment1E = undefined;
    var Segment1F = undefined;
    var Segment1G = undefined;
    var Segment1Dot = undefined;
    var Segment2A = undefined;
    var Segment2B = undefined;
    var Segment2C = undefined;
    var Segment2D = undefined;
    var Segment2E = undefined;
    var Segment2F = undefined;
    var Segment2G = undefined;
    var Segment2Dot = undefined;
    var Segment3A = undefined;
    var Segment3B = undefined;
    var Segment3C = undefined;
    var Segment3D = undefined;
    var Segment3E = undefined;
    var Segment3F = undefined;
    var Segment3G = undefined;
    var Segment3Dot = undefined;
    var SVGCanvas = undefined;
    
    // Sizes
    
    var Button0Size = [];
    var Button1Size = [];
    var Button2Size = [];
    var Button3Size = [];
    var Button4Size = [];
    var Button5Size = [];
    var Button6Size = [];
    var Button7Size = [];
    
    var Switch0Size = [];
    var Switch1Size = [];
    var Switch2Size = [];
    var Switch3Size = [];
    var Switch4Size = [];
    var Switch5Size = [];
    var Switch6Size = [];
    var Switch7Size = [];
    
    var Hex0RotateSize = [];
    var Hex1RotateSize = [];
    var EncoderRotateSize = [];
    
    var Bargraph0Size = [];
    var Bargraph1Size = [];
    var Bargraph2Size = [];
    var Bargraph3Size = [];
    var Bargraph4Size = [];
    var Bargraph5Size = [];
    var Bargraph6Size = [];
    var Bargraph7Size = [];
    var Segment0ASize = [];
    var Segment0BSize = [];
    var Segment0CSize = [];
    var Segment0DSize = [];
    var Segment0ESize = [];
    var Segment0FSize = [];
    var Segment0GSize = [];
    var Segment0DotSize = [];
    var Segment1ASize = [];
    var Segment1BSize = [];
    var Segment1CSize = [];
    var Segment1DSize = [];
    var Segment1ESize = [];
    var Segment1FSize = [];
    var Segment1GSize = [];
    var Segment1DotSize = [];
    var Segment2ASize = [];
    var Segment2BSize = [];
    var Segment2CSize = [];
    var Segment2DSize = [];
    var Segment2ESize = [];
    var Segment2FSize = [];
    var Segment2GSize = [];
    var Segment2DotSize = [];
    var Segment3ASize = [];
    var Segment3BSize = [];
    var Segment3CSize = [];
    var Segment3DSize = [];
    var Segment3ESize = [];
    var Segment3FSize = [];
    var Segment3GSize = [];
    var Segment3DotSize = [];
    
    var SVGCanvas = undefined;

    // Colors

    var ColorBargraphOn = "FF040B";
    var ColorBargraphOff = "F7F3F0";
    var ColorSegmentOn = "FF040B";
    var ColorSegmentOff = "D1BDBE";

    var ButtonPressedColor = "ADADAD";
    var ButtonNormalColor = "181A1B";

    // Switch states

    var Switch0State = "Down";
    var Switch1State = "Down";
    var Switch2State = "Down";
    var Switch3State = "Down";
    var Switch4State = "Down";
    var Switch5State = "Down";
    var Switch6State = "Down";
    var Switch7State = "Down";

    var SwitchUpPosition = 0;
    var SwitchDownPosition = 22;

    var PressedButton = undefined;

    // Variables for blinking engine
	
	var BlinkingUnit = undefined;
    var BlinkingType = undefined;
	var BlinkingInterval = 600;
	var BlinkingActive = false;
	var BlinkingRect = undefined;
	var HoverSelectedParts = [];
	var BlinkingOpactiy = 0.6;

    Animation.prototype.onCommand = function (Command) 
    {
        SetUnitBlinking(HoverData.getType(), HoverData.getUnit());
    };

    Animation.prototype.onServerInterfaceInfo = function (Info) 
    {

    };

    Animation.prototype.onBreakpointEvent = function (Data) 
    {

    };
    
    Animation.prototype.onHoverEvent = function (HoverData) 
    {
        SetUnitBlinking(HoverData.getType(), HoverData.getUnit());
    };

    Animation.prototype.onData = function (Data) 
    {
        //if(Data.getSensors()[0] != undefined) Sensors = Data.getSensors();
        if(Data.getActuators()[0] != undefined) Actuators = Data.getActuators();
    };

    function SendEnvironmentVariableCommand(Variable, Value) 
    {
        Message = new CommandMessage();
        Message.setType(EnumCommand.SetUserVariable);

        var ParameterStringArray = [Variable.toString(), Value];

        Message.setParameterStringArray(ParameterStringArray);

        EventHandler.fireCommandEvent(Message);
    }

    function Switch0StateMachine() 
    {
        if (Switch0State == "Up") Switch0State = "Down";
        else if (Switch0State == "Down") Switch0State = "Up";
        return Switch0State;
    }

    function Switch1StateMachine() 
    {
        if (Switch1State == "Up") Switch1State = "Down";
        else if (Switch1State == "Down") Switch1State = "Up";
        return Switch1State;
    }

    function Switch2StateMachine() 
    {
        if (Switch2State == "Up") 
        {
            Switch2State = "Down";
        }
        else if (Switch2State == "Down") 
        {
            Switch2State = "Up";
        }

        return Switch2State;
    }

    function Switch3StateMachine() 
    {
        if (Switch3State == "Up") 
        {
            Switch3State = "Down";
        }
        else if (Switch3State == "Down") 
        {
            Switch3State = "Up";
        }

        return Switch3State;
    }

    function Switch4StateMachine() 
    {
        if (Switch4State == "Up") 
        {
            Switch4State = "Down";
        }
        else if (Switch4State == "Down") 
        {
            Switch4State = "Up";
        }

        return Switch4State;
    }

    function Switch5StateMachine() 
    {
        if (Switch5State == "Up") 
        {
            Switch5State = "Down";
        }
        else if (Switch5State == "Down") 
        {
            Switch5State = "Up";
        }

        return Switch5State;
    }

    function Switch6StateMachine() 
    {
        if (Switch6State == "Up") 
        {
            Switch6State = "Down";
        }
        else if (Switch6State == "Down") 
        {
            Switch6State = "Up";
        }

        return Switch6State;
    }

    function Switch7StateMachine() 
    {
        if (Switch7State == "Up") 
        {
            Switch7State = "Down";
        }
        else if (Switch7State == "Down") 
        {
            Switch7State = "Up";
        }

        return Switch7State;
    }

    this.initialize = initialize;
    function initialize() 
    {
        for (var i = 0; i < 128; i++)
        {
            Actuators[i] = false;
            //Sensors[i] = false;
        }

        $("#" + SettingsParameter.AnimationDIVName).load('ECP/Animation/Images/Image_DigitalDemoBoard.svg', function () {
            
            SVG = $('#SVGAnimation');
            SVGCanvas = Snap('#SVGAnimation');

            Button0 = Snap('#Button0');
            Button0Size['x'] = Snap('#Button0').getBBox().x;
            Button0Size['y'] = Snap('#Button0').getBBox().y;
            
            Button1 = Snap('#Button1');
            Button1Size['x'] = Snap('#Button1').getBBox().x;
            Button1Size['y'] = Snap('#Button1').getBBox().y;
            
            Button2 = Snap('#Button2');
            Button2Size['x'] = Snap('#Button2').getBBox().x;
            Button2Size['y'] = Snap('#Button2').getBBox().y;
            
            Button3 = Snap('#Button3');
            Button3Size['x'] = Snap('#Button3').getBBox().x;
            Button3Size['y'] = Snap('#Button3').getBBox().y;
            
            Button4 = Snap('#Button4');
            Button4Size['x'] = Snap('#Button4').getBBox().x;
            Button4Size['y'] = Snap('#Button4').getBBox().y;
            
            Button5 = Snap('#Button5_1_');
            Button5Size['x'] = Snap('#Button5_1_').getBBox().x;
            Button5Size['y'] = Snap('#Button5_1_').getBBox().y;
            
            Button6 = Snap('#Button6_1_');
            Button6Size['x'] = Snap('#Button6_1_').getBBox().x;
            Button6Size['y'] = Snap('#Button6_1_').getBBox().y;
            
            Button7 = Snap('#Button7_1_');
            Button7Size['x'] = Snap('#Button7_1_').getBBox().x;
            Button7Size['y'] = Snap('#Button7_1_').getBBox().y;

            Switch0Button = Snap('#Switch0Button');
            Switch1Button = Snap('#Switch1Button');
            Switch2Button = Snap('#Switch2Button');
            Switch3Button = Snap('#Switch3Button');
            Switch4Button = Snap('#Switch4Button');
            Switch5Button = Snap('#Switch5Button');
            Switch6Button = Snap('#Switch6Button');
            Switch7Button = Snap('#Switch7Button');
            
            /*Switch0 = $('#Switch0Button').parent();
            Switch0.attr('data-toggle','tooltip');
            Switch0.attr('data-animation','false');
            Switch0.attr('data-placement','top');
            Switch0.attr('data-original-title','x0');
            Switch0.tooltip();
            
            Switch0.on('mouseover', function () {
                $(this).tooltip('show');
            });*/
            
            Switch0 = Snap('#Switch0Button').parent();
            Switch0Size['x'] = Snap('#Switch0Button').parent().getBBox().x;
            Switch0Size['y'] = Snap('#Switch0Button').parent().getBBox().y;
            
            Switch1 = Snap('#Switch1Button').parent();
            Switch1Size['x'] = Snap('#Switch1Button').parent().getBBox().x;
            Switch1Size['y'] = Snap('#Switch1Button').parent().getBBox().y;
            
            Switch2 = Snap('#Switch2Button').parent();
            Switch2Size['x'] = Snap('#Switch2Button').parent().getBBox().x;
            Switch2Size['y'] = Snap('#Switch2Button').parent().getBBox().y;
            
            Switch3 = Snap('#Switch3Button').parent();
            Switch3Size['x'] = Snap('#Switch3Button').parent().getBBox().x;
            Switch3Size['y'] = Snap('#Switch3Button').parent().getBBox().y;
            
            Switch4 = Snap('#Switch4Button').parent();
            Switch4Size['x'] = Snap('#Switch4Button').parent().getBBox().x;
            Switch4Size['y'] = Snap('#Switch4Button').parent().getBBox().y;
            
            Switch5 = Snap('#Switch5Button').parent();
            Switch5Size['x'] = Snap('#Switch5Button').parent().getBBox().x;
            Switch5Size['y'] = Snap('#Switch5Button').parent().getBBox().y;
            
            Switch6 = Snap('#Switch6Button').parent();
            Switch6Size['x'] = Snap('#Switch6Button').parent().getBBox().x;
            Switch6Size['y'] = Snap('#Switch6Button').parent().getBBox().y;
            
            Switch7 = Snap('#Switch7Button').parent();
            Switch7Size['x'] = Snap('#Switch7Button').parent().getBBox().x;
            Switch7Size['y'] = Snap('#Switch7Button').parent().getBBox().y;

            Bargraph0 = Snap('#Bargraph0');
            Bargraph0Size['x'] = Snap('#Bargraph0').getBBox().x;
            Bargraph0Size['y'] = Snap('#Bargraph0').getBBox().y;
            
            Bargraph1 = Snap('#Bargraph1_1_');
            Bargraph1Size['x'] = Snap('#Bargraph1_1_').getBBox().x;
            Bargraph1Size['y'] = Snap('#Bargraph1_1_').getBBox().y;
            
            Bargraph2 = Snap('#Bargraph2_1_');
            Bargraph2Size['x'] = Snap('#Bargraph2_1_').getBBox().x;
            Bargraph2Size['y'] = Snap('#Bargraph2_1_').getBBox().y;
            
            Bargraph3 = Snap('#Bargraph3_1_');
            Bargraph3Size['x'] = Snap('#Bargraph3_1_').getBBox().x;
            Bargraph3Size['y'] = Snap('#Bargraph3_1_').getBBox().y;
            
            Bargraph4 = Snap('#Bargraph4');
            Bargraph4Size['x'] = Snap('#Bargraph4').getBBox().x;
            Bargraph4Size['y'] = Snap('#Bargraph4').getBBox().y;
            
            Bargraph5 = Snap('#Bargraph5');
            Bargraph5Size['x'] = Snap('#Bargraph5').getBBox().x;
            Bargraph5Size['y'] = Snap('#Bargraph5').getBBox().y;
            
            Bargraph6 = Snap('#Bargraph6');
            Bargraph6Size['x'] = Snap('#Bargraph6').getBBox().x;
            Bargraph6Size['y'] = Snap('#Bargraph6').getBBox().y;
            
            Bargraph7 = Snap('#Bargraph7');
            Bargraph7Size['x'] = Snap('#Bargraph7').getBBox().x;
            Bargraph7Size['y'] = Snap('#Bargraph7').getBBox().y;

            Segment0A = Snap('#Segment0A');
            Segment0ASize['x'] = Snap('#Segment0A').getBBox().x;
            Segment0ASize['y'] = Snap('#Segment0A').getBBox().y;
            
            Segment0B = Snap('#Segment0B');
            Segment0BSize['x'] = Snap('#Segment0B').getBBox().x;
            Segment0BSize['y'] = Snap('#Segment0B').getBBox().y;
            
            Segment0C = Snap('#Segment0C');
            Segment0CSize['x'] = Snap('#Segment0C').getBBox().x;
            Segment0CSize['y'] = Snap('#Segment0C').getBBox().y;
            
            Segment0D = Snap('#Segment0D');
            Segment0DSize['x'] = Snap('#Segment0D').getBBox().x;
            Segment0DSize['y'] = Snap('#Segment0D').getBBox().y;
            
            Segment0E = Snap('#Segment0E');
            Segment0ESize['x'] = Snap('#Segment0E').getBBox().x;
            Segment0ESize['y'] = Snap('#Segment0E').getBBox().y;
            
            Segment0F = Snap('#Segment0F');
            Segment0FSize['x'] = Snap('#Segment0F').getBBox().x;
            Segment0FSize['y'] = Snap('#Segment0F').getBBox().y;
            
            Segment0G = Snap('#Segment0G');
            Segment0GSize['x'] = Snap('#Segment0G').getBBox().x;
            Segment0GSize['y'] = Snap('#Segment0G').getBBox().y;
            
            Segment0Dot = Snap('#Segment0Dot');
            
            Segment3A = Snap('#Segment3A');
            Segment3ASize['x'] = Snap('#Segment3A').getBBox().x;
            Segment3ASize['y'] = Snap('#Segment3A').getBBox().y;
            
            Segment3B = Snap('#Segment3B');
            Segment3BSize['x'] = Snap('#Segment3B').getBBox().x;
            Segment3BSize['y'] = Snap('#Segment3B').getBBox().y;
            
            Segment3C = Snap('#Segment3C');
            Segment3CSize['x'] = Snap('#Segment3C').getBBox().x;
            Segment3CSize['y'] = Snap('#Segment3C').getBBox().y;
            
            Segment3D = Snap('#Segment3D');
            Segment3DSize['x'] = Snap('#Segment3D').getBBox().x;
            Segment3DSize['y'] = Snap('#Segment3D').getBBox().y;
            
            Segment3E = Snap('#Segment3E');
            Segment3ESize['x'] = Snap('#Segment3E').getBBox().x;
            Segment3ESize['y'] = Snap('#Segment3E').getBBox().y;
            
            Segment3F = Snap('#Segment3F');
            Segment3FSize['x'] = Snap('#Segment3F').getBBox().x;
            Segment3FSize['y'] = Snap('#Segment3F').getBBox().y;
            
            Segment3G = Snap('#Segment3G');
            Segment3GSize['x'] = Snap('#Segment3G').getBBox().x;
            Segment3GSize['y'] = Snap('#Segment3G').getBBox().y;
            
            Segment3Dot = Snap('#Segment3Dot');

            Segment2A = Snap('#Segment2A');
            Segment2ASize['x'] = Snap('#Segment2A').getBBox().x;
            Segment2ASize['y'] = Snap('#Segment2A').getBBox().y;
            
            Segment2B = Snap('#Segment2B');
            Segment2BSize['x'] = Snap('#Segment2B').getBBox().x;
            Segment2BSize['y'] = Snap('#Segment2B').getBBox().y;
            
            Segment2C = Snap('#Segment2C');
            Segment2CSize['x'] = Snap('#Segment2C').getBBox().x;
            Segment2CSize['y'] = Snap('#Segment2C').getBBox().y;
            
            Segment2D = Snap('#Segment2D');
            Segment2DSize['x'] = Snap('#Segment2D').getBBox().x;
            Segment2DSize['y'] = Snap('#Segment2D').getBBox().y;
            
            Segment2E = Snap('#Segment2E');
            Segment2ESize['x'] = Snap('#Segment2E').getBBox().x;
            Segment2ESize['y'] = Snap('#Segment2E').getBBox().y;
            
            Segment2F = Snap('#Segment2F');
            Segment2FSize['x'] = Snap('#Segment2F').getBBox().x;
            Segment2FSize['y'] = Snap('#Segment2F').getBBox().y;
            
            Segment2G = Snap('#Segment2G');
            Segment2GSize['x'] = Snap('#Segment2G').getBBox().x;
            Segment2GSize['y'] = Snap('#Segment2G').getBBox().y;
            
            Segment2Dot = Snap('#Segment2Dot');

            Segment1A = Snap('#Segment1A');
            Segment1ASize['x'] = Snap('#Segment1A').getBBox().x;
            Segment1ASize['y'] = Snap('#Segment1A').getBBox().y;
            
            Segment1B = Snap('#Segment1B');
            Segment1BSize['x'] = Snap('#Segment1B').getBBox().x;
            Segment1BSize['y'] = Snap('#Segment1B').getBBox().y;
            
            Segment1C = Snap('#Segment1C');
            Segment1CSize['x'] = Snap('#Segment1C').getBBox().x;
            Segment1CSize['y'] = Snap('#Segment1C').getBBox().y;
            
            Segment1D = Snap('#Segment1D');
            Segment1DSize['x'] = Snap('#Segment1D').getBBox().x;
            Segment1DSize['y'] = Snap('#Segment1D').getBBox().y;
            
            Segment1E = Snap('#Segment1E');
            Segment1ESize['x'] = Snap('#Segment1E').getBBox().x;
            Segment1ESize['y'] = Snap('#Segment1E').getBBox().y;
            
            Segment1F = Snap('#Segment1F');
            Segment1FSize['x'] = Snap('#Segment1F').getBBox().x;
            Segment1FSize['y'] = Snap('#Segment1F').getBBox().y;
            
            Segment1G = Snap('#Segment1G');
            Segment1GSize['x'] = Snap('#Segment1G').getBBox().x;
            Segment1GSize['y'] = Snap('#Segment1G').getBBox().y;
            
            Segment1Dot = Snap('#Segment1Dot');

            Segment0Dot.attr('fill', '#F7F3F0');
            Segment1Dot.attr('fill', '#F7F3F0');
            Segment2Dot.attr('fill', '#F7F3F0');
            Segment3Dot.attr('fill', '#F7F3F0');

            Segment0Dot.attr('stroke', '#F7F3F0');
            Segment1Dot.attr('stroke', '#F7F3F0');
            Segment2Dot.attr('stroke', '#F7F3F0');
            Segment3Dot.attr('stroke', '#F7F3F0');
            
            // suppress context menu on right mouse click
            $('#SVGAnimation').on("contextmenu", function(evt) {evt.preventDefault();});
            
            Hex0Rotate = SVGCanvas.select('#Hex0Rotate');
            Hex0RotateSize['x'] = Snap('#Hex0Rotate').getBBox().x;
            Hex0RotateSize['y'] = Snap('#Hex0Rotate').getBBox().y;
            
            Hex1Rotate = SVGCanvas.select('#Hex1Rotate');
            Hex1RotateSize['x'] = Snap('#Hex1Rotate').getBBox().x;
            Hex1RotateSize['y'] = Snap('#Hex1Rotate').getBBox().y;
            
            PotiRotate = SVGCanvas.select('#PotiRotate');
            EncoderRotate = SVGCanvas.select('#EncoderRotate');
            EncoderRotateSize['x'] = Snap('#EncoderRotate').getBBox().x;
            EncoderRotateSize['y'] = Snap('#EncoderRotate').getBBox().y;
            
            Hex0RotateX = Hex0Rotate.getBBox().x + (Hex0Rotate.getBBox().w)/2;
            Hex0RotateY = Hex0Rotate.getBBox().y + (Hex0Rotate.getBBox().h)/2;
            
            Hex1RotateX = Hex1Rotate.getBBox().x + (Hex1Rotate.getBBox().w)/2;
            Hex1RotateY = Hex1Rotate.getBBox().y + (Hex1Rotate.getBBox().h)/2;
            
            PotiRotateX = PotiRotate.getBBox().x + (PotiRotate.getBBox().w)/2;
            PotiRotateY = PotiRotate.getBBox().y + (PotiRotate.getBBox().h)/2;
            
            var Hex0Text = Hex0Rotate.text(Hex0RotateX, Hex0RotateY + 12, "0");
            Hex0Text.attr({ fontSize: '30px', opacity: 1, "text-anchor": "middle" });
            
            var Hex1Text = Hex1Rotate.text(Hex1RotateX, Hex1RotateY + 12, "0");
            Hex1Text.attr({ fontSize: '30px', opacity: 1, "text-anchor": "middle" });
            
            EncoderRotateX = EncoderRotate.getBBox().x + (EncoderRotate.getBBox().w)/2;
            EncoderRotateY = EncoderRotate.getBBox().y + (EncoderRotate.getBBox().h)/2;
            
            Switch0Button.attr("y", SwitchDownPosition);
            Switch1Button.attr("y", SwitchDownPosition);
            Switch2Button.attr("y", SwitchDownPosition);
            Switch3Button.attr("y", SwitchDownPosition);
            Switch4Button.attr("y", SwitchDownPosition);
            Switch5Button.attr("y", SwitchDownPosition);
            Switch6Button.attr("y", SwitchDownPosition);
            Switch7Button.attr("y", SwitchDownPosition);

            $('#Button0').on("mousedown", function () {
                $(this).attr("fill", "#" + ButtonPressedColor);
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Button0, "1");
                PressedButton = [this, EnumDigitalDemoBoardEnvironmentVariables.Button0];
            });

            $('#Button1').on("mousedown", function () {
                $(this).attr("fill", "#" + ButtonPressedColor);
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Button1, "1");
                PressedButton = [this, EnumDigitalDemoBoardEnvironmentVariables.Button1];
            });

            $('#Button2').on("mousedown", function () {
                $(this).attr("fill", "#" + ButtonPressedColor);
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Button2, "1");
                PressedButton = [this, EnumDigitalDemoBoardEnvironmentVariables.Button2];
            });

            $('#Button3').on("mousedown", function () {
                $(this).attr("fill", "#" + ButtonPressedColor);
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Button3, "1");
                PressedButton = [this, EnumDigitalDemoBoardEnvironmentVariables.Button3];
            });

            $('#Button4').on("mousedown", function () {
                $(this).attr("fill", "#" + ButtonPressedColor);
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Button4, "1");
                PressedButton = [this, EnumDigitalDemoBoardEnvironmentVariables.Button4];
            });

            $('#Button5_1_').on("mousedown", function () {
                $(this).attr("fill", "#" + ButtonPressedColor);
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Button5, "1");
                PressedButton = [this, EnumDigitalDemoBoardEnvironmentVariables.Button5];
            });

            $('#Button6_1_').on("mousedown", function () {
                $(this).attr("fill", "#" + ButtonPressedColor);
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Button6, "1");
                PressedButton = [this, EnumDigitalDemoBoardEnvironmentVariables.Button6];
            });

            $('#Button7_1_').on("mousedown", function () {
                $(this).attr("fill", "#" + ButtonPressedColor);
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Button7, "1");
                PressedButton = [this, EnumDigitalDemoBoardEnvironmentVariables.Button7];
            });

            $('#Switch0Button').parent().on("click", function () {
                if (Switch0StateMachine() == "Up") 
                {
                    Switch0Button.attr("y", SwitchUpPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch0, "1");
                }
                else 
                {
                    Switch0Button.attr("y", SwitchDownPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch0, "0");
                }
            });

            $('#Switch1Button').parent().on("click", function () {
                if (Switch1StateMachine() == "Up") 
                {
                    Switch1Button.attr("y", SwitchUpPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch1, "1");
                }
                else 
                {
                    Switch1Button.attr("y", SwitchDownPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch1, "0");
                }
            });

            $('#Switch2Button').parent().on("click", function () {
                if (Switch2StateMachine() == "Up") 
                {
                    Switch2Button.attr("y", SwitchUpPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch2, "1");
                }
                else 
                {
                    Switch2Button.attr("y", SwitchDownPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch2, "0");
                }
            });

            $('#Switch3Button').parent().on("click", function () {
                if (Switch3StateMachine() == "Up") 
                {
                    Switch3Button.attr("y", SwitchUpPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch3, "1");
                }
                else 
                {
                    Switch3Button.attr("y", SwitchDownPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch3, "0");
                }
            });

            $('#Switch4Button').parent().on("click", function () {
                if (Switch4StateMachine() == "Up") 
                {
                    Switch4Button.attr("y", SwitchUpPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch4, "1");
                }
                else 
                {
                    Switch4Button.attr("y", SwitchDownPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch4, "0");
                }
            });

            $('#Switch5Button').parent().on("click", function () {
                if (Switch5StateMachine() == "Up") 
                {
                    Switch5Button.attr("y", SwitchUpPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch5, "1");
                }
                else 
                {
                    Switch5Button.attr("y", SwitchDownPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch5, "0");
                }
            });

            $('#Switch6Button').parent().on("click", function () {
                if (Switch6StateMachine() == "Up") 
                {
                    Switch6Button.attr("y", SwitchUpPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch6, "1");
                }
                else 
                {
                    Switch6Button.attr("y", SwitchDownPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch6, "0");
                }
            });

            $('#Switch7Button').parent().on("click", function () {
                if (Switch7StateMachine() == "Up") 
                {
                    Switch7Button.attr("y", SwitchUpPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch7, "1");
                }
                else 
                {
                    Switch7Button.attr("y", SwitchDownPosition);
                    SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.Switch7, "0");
                }
            });
            
            function SendHex1Values()
            {

                switch(Hex1Count)
                {
                    case 0:
                    {
                        //0
                        Hex1Text.attr({ text: '0'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "1");
                        break;
                    }
                    case 1:
                    {
                        //1
                        Hex1Text.attr({ text: '1'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "1");
                        break;
                    }
                    case 2:
                    {
                        //2
                        Hex1Text.attr({ text: '2'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "1");
                        break;
                    }
                    case 3:
                    {
                        //3
                        Hex1Text.attr({ text: '3'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "1");
                        break;
                    }
                    case 4:
                    {
                        //4
                        Hex1Text.attr({ text: '4'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "1");
                        break;
                    }
                    case 5:
                    {
                        //5
                        Hex1Text.attr({ text: '5'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "1");
                        break;
                    }
                    case 6:
                    {
                        //6
                        Hex1Text.attr({ text: '6'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "1");
                        break;
                    }
                    case 7:
                    {
                        //7
                        Hex1Text.attr({ text: '7'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "1");
                        break;
                    } 
                    case 8:
                    {
                        //8
                        Hex1Text.attr({ text: '8'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "0");
                        break;
                    } 
                    case 9:
                    {
                        //9
                        Hex1Text.attr({ text: '9'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "0");
                        break;
                    } 
                    case 10:
                    {
                        //A
                        Hex1Text.attr({ text: 'A'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "0");
                        break;
                    } 
                    case 11:
                    {
                        //B
                        Hex1Text.attr({ text: 'B'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "0");
                        break;
                    } 
                    case 12:
                    {
                        //C
                        Hex1Text.attr({ text: 'C'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "0");
                        break;
                    } 
                    case 13:
                    {
                        //D
                        Hex1Text.attr({ text: 'D'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "0");
                        break;
                    } 
                    case 14:
                    {
                        //E
                        Hex1Text.attr({ text: 'E'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "0");
                        break;
                    } 
                    case 15:
                    {
                        //F
                        Hex1Text.attr({ text: 'F'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder1D, "0");
                        break;
                    } 
                    default:{
                        break;
                    }
                }
            }    
            
            function SendHex0Values()
            {
                switch(Hex0Count)
                {
                    case 0:
                    {
                        //0
                        Hex0Text.attr({ text: '0'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "1");
                        break;
                    }
                    case 1:
                    {
                        //1
                        Hex0Text.attr({ text: '1'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "1");
                        break;
                    }
                    case 2:
                    {
                        //2
                        Hex0Text.attr({ text: '2'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "1");
                        break;
                    }
                    case 3:
                    {
                        //3
                        Hex0Text.attr({ text: '3'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "1");
                        break;
                    }
                    case 4:
                    {
                        //4
                        Hex0Text.attr({ text: '4'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "1");
                        break;
                    }
                    case 5:
                    {
                        //5
                        Hex0Text.attr({ text: '5'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "1");
                        break;
                    }
                    case 6:
                    {
                        //6
                        Hex0Text.attr({ text: '6'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "1");
                        break;
                    }
                    case 7:
                    {
                        //7
                        Hex0Text.attr({ text: '7'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "1");
                        break;
                    } 
                    case 8:
                    {
                        //8
                        Hex0Text.attr({ text: '8'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "0");
                        break;
                    } 
                    case 9:
                    {
                        //9
                        Hex0Text.attr({ text: '9'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "0");
                        break;
                    } 
                    case 10:
                    {
                        //A
                        Hex0Text.attr({ text: 'A'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "0");
                        break;
                    } 
                    case 11:
                    {
                        //B
                        Hex0Text.attr({ text: 'B'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "0");
                        break;
                    } 
                    case 12:
                    {
                        //C
                        Hex0Text.attr({ text: 'C'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "0");
                        break;
                    } 
                    case 13:
                    {
                        //D
                        Hex0Text.attr({ text: 'D'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "0");
                        break;
                    } 
                    case 14:
                    {
                        //E
                        Hex0Text.attr({ text: 'E'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "1");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "0");
                        break;
                    } 
                    case 15:
                    {
                        //F
                        Hex0Text.attr({ text: 'F'});
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0A, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0B, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0C, "0");
                        SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.HexEncoder0D, "0");
                        break;
                    } 
                    default:{
                        break;
                    }
                }
            }    
			
			function SendEncoderValuesUp()
            {
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderA, "0");
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderB, "0");

                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderA, "1");
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderB, "1");

                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderB, "0");
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderA, "0");
			}

            function SendEncoderValuesDown()
            {
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderA, "0");
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderB, "0");

                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderB, "1");
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderA, "1");

                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderA, "0");
                SendEnvironmentVariableCommand(EnumDigitalDemoBoardEnvironmentVariables.IncrementalEncoderB, "0");
            }
			
			function SendPotiValues()
            {
				
			}

            $('#Hex0Rotate').on("mousewheel", function (event) {

                if (event.originalEvent.wheelDelta / 120 > 0)
                {
                    Hex0RotationPosition += 22.5;
                    if(Hex0Count < 15) Hex0Count++;
                    else Hex0Count = 0;
                }
                else 
                {
                    Hex0RotationPosition -= 22.5;
                    if(Hex0Count > 0) Hex0Count--;
                    else Hex0Count = 15;
                }
                Hex0Text.animate({ transform: 'r'+ -Hex0RotationPosition +',' + Hex0RotateX + ',' + Hex0RotateY + '' }, 0);
                SendHex0Values();
                Hex0Rotate.animate({ transform: 'r'+ Hex0RotationPosition +',' + Hex0RotateX + ',' + Hex0RotateY + '' }, 0);
            });
            
            $('#Hex0Rotate').on("DOMMouseScroll", function (event) {

                if(event.originalEvent.detail < 0)
                {
                    Hex0RotationPosition += 22.5;
                    if(Hex0Count < 15) Hex0Count++;
                    else Hex0Count = 0;
                }
                else 
                {
                    Hex0RotationPosition -= 22.5;
                    if(Hex0Count > 0) Hex0Count--;
                    else Hex0Count = 15;
                }
                Hex0Text.animate({ transform: 'r'+ -Hex0RotationPosition +',' + Hex0RotateX + ',' + Hex0RotateY + '' }, 0);
                SendHex0Values();
                Hex0Rotate.animate({ transform: 'r'+ Hex0RotationPosition +',' + Hex0RotateX + ',' + Hex0RotateY + '' }, 0);
            });
            
            $('#Hex0Rotate').on('mousedown',function (event) {
                if (event.button != 0)
                {
                    Hex0RotationPosition += 22.5;
                    if(Hex0Count < 15) Hex0Count++;
                    else Hex0Count = 0;
                }
                else 
                {
                    Hex0RotationPosition -= 22.5;
                    if(Hex0Count > 0) Hex0Count--;
                    else Hex0Count = 15;
                }
                Hex0Text.animate({ transform: 'r'+ -Hex0RotationPosition +',' + Hex0RotateX + ',' + Hex0RotateY + '' }, 0);
                SendHex0Values();
                Hex0Rotate.animate({ transform: 'r'+ Hex0RotationPosition +',' + Hex0RotateX + ',' + Hex0RotateY + '' }, 0);
            });
            
            $('#Hex1Rotate').on("mousewheel", function (event) {

                if (event.originalEvent.wheelDelta / 120 > 0)
                {
                    Hex1RotationPosition += 22.5;
                    if(Hex1Count < 15) Hex1Count++;
                    else Hex1Count = 0;
                }
                else 
                {
                    Hex1RotationPosition -= 22.5;
                    if(Hex1Count > 0) Hex1Count--;
                    else Hex1Count = 15;
                }
                Hex1Text.animate({ transform: 'r'+ -Hex1RotationPosition +',' + Hex1RotateX + ',' + Hex1RotateY + '' }, 0);
                SendHex1Values();
                Hex1Rotate.animate({ transform: 'r'+ Hex1RotationPosition +',' + Hex1RotateX + ',' + Hex1RotateY + '' }, 0);
            });
            
            $('#Hex1Rotate').on("DOMMouseScroll", function (event) {

                if(event.originalEvent.detail < 0)
                {
                    Hex1RotationPosition += 22.5;
                    if(Hex1Count < 15) Hex1Count++;
                    else Hex1Count = 0;
                }
                else 
                {
                    Hex1RotationPosition -= 22.5;
                    if(Hex1Count > 0) Hex1Count--;
                    else Hex1Count = 15;
                }
                Hex1Text.animate({ transform: 'r'+ -Hex1RotationPosition +',' + Hex1RotateX + ',' + Hex1RotateY + '' }, 0);
                SendHex1Values();
                Hex1Rotate.animate({ transform: 'r'+ Hex1RotationPosition +',' + Hex1RotateX + ',' + Hex1RotateY + '' }, 0);
            });
            
            $('#Hex1Rotate').on('mousedown',function (event) {
                if (event.button != 0)
                {
                    Hex1RotationPosition += 22.5;
                    if(Hex1Count < 15) Hex1Count++;
                    else Hex1Count = 0;
                }
                else 
                {
                    Hex1RotationPosition -= 22.5;
                    if(Hex1Count > 0) Hex1Count--;
                    else Hex1Count = 15;
                }
                Hex1Text.animate({ transform: 'r'+ -Hex1RotationPosition +',' + Hex1RotateX + ',' + Hex1RotateY + '' }, 0);
                SendHex1Values();
                Hex1Rotate.animate({ transform: 'r'+ Hex1RotationPosition +',' + Hex1RotateX + ',' + Hex1RotateY + '' }, 0);
            });
            
            /*$('#PotiRotate').on("mousewheel", function (event) {

                if (event.originalEvent.wheelDelta / 120 > 0) 
                {
                    PotiRotationPosition += 22.5;
                }
                else 
                {
                    PotiRotationPosition -= 22.5;
                }
				SendPotiValues();
                PotiRotate.animate({ transform: 'r'+ PotiRotationPosition +',' + PotiRotateX + ',' + PotiRotateY + '' }, 0);
            });
            
            $('#PotiRotate').on("DOMMouseScroll", function (event) {

                if(event.originalEvent.detail < 0)
                {
                    PotiRotationPosition += 22.5;
                }
                else 
                {
                    PotiRotationPosition -= 22.5;
                }
				SendPotiValues();
                PotiRotate.animate({ transform: 'r'+ PotiRotationPosition +',' + PotiRotateX + ',' + PotiRotateY + '' }, 0);
            });
            
            $('#PotiRotate').on('mousedown',function (event) {
                if (event.button != 0 )
                {
                    PotiRotationPosition += 22.5;
                }
                else 
                {
                    PotiRotationPosition -= 22.5;
                }
				SendPotiValues();
                PotiRotate.animate({ transform: 'r'+ PotiRotationPosition +',' + PotiRotateX + ',' + PotiRotateY + '' }, 0);
            });
            */

            $('#EncoderRotate').on("mousewheel", function (event) {

                if (event.originalEvent.wheelDelta / 120 > 0) 
                {
                    EncoderRotationPosition += 22.5;
                    SendEncoderValuesUp();
                }
                else 
                {
                    EncoderRotationPosition -= 22.5;
                    SendEncoderValuesDown();
                }

                EncoderRotate.animate({ transform: 'r'+ EncoderRotationPosition +',' + EncoderRotateX + ',' + EncoderRotateY + '' }, 0);
            });
            
            $('#EncoderRotate').on("DOMMouseScroll", function (event) {

                if(event.originalEvent.detail < 0)
                {
                    EncoderRotationPosition += 22.5;
                    SendEncoderValuesUp();
                }
                else
                {
                    EncoderRotationPosition -= 22.5;
                    SendEncoderValuesDown();
                }

                EncoderRotate.animate({ transform: 'r'+ EncoderRotationPosition +',' + EncoderRotateX + ',' + EncoderRotateY + '' }, 0);
            });
            
            $('#EncoderRotate').on('mousedown',function (event) {
                if (event.button != 0 )
                {
                    EncoderRotationPosition += 22.5;
                    SendEncoderValuesUp();
                }
                else
                {
                    EncoderRotationPosition -= 22.5;
                    SendEncoderValuesDown();
                }

                EncoderRotate.animate({ transform: 'r'+ EncoderRotationPosition +',' + EncoderRotateX + ',' + EncoderRotateY + '' }, 0);
            });

            $('#SVGAnimation').on("mouseup mouseleave", function () {
                if (PressedButton != undefined) {
                    $(PressedButton[0]).attr("fill", "#" + ButtonNormalColor);
                    SendEnvironmentVariableCommand(PressedButton[1], "0");
                    PressedButton = undefined;
                }
            });
            
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
						HoverSelectedParts.push([Switch0, Switch0Size['x'], Switch0Size['y'], false]);
						break; 
                    case "1":
						HoverSelectedParts.push([Switch1, Switch1Size['x'], Switch1Size['y'], false]);
						break; 
                    case "2":
						HoverSelectedParts.push([Switch2, Switch2Size['x'], Switch2Size['y'], false]);
						break; 
                    case "3":
						HoverSelectedParts.push([Switch3, Switch3Size['x'], Switch3Size['y'], false]);
						break; 
                    case "4":
						HoverSelectedParts.push([Switch4, Switch4Size['x'], Switch4Size['y'], false]);
						break; 
                    case "5":
						HoverSelectedParts.push([Switch5, Switch5Size['x'], Switch5Size['y'], false]);
						break; 
                    case "6":
						HoverSelectedParts.push([Switch6, Switch6Size['x'], Switch6Size['y'], false]);
						break; 
                    case "7":
						HoverSelectedParts.push([Switch7, Switch7Size['x'], Switch7Size['y'], false]);
						break; 
					case "8":
						HoverSelectedParts.push([Button0, Button0Size['x'], Button0Size['y'], false]);
						break; 
                    case "9":
						HoverSelectedParts.push([Button1, Button1Size['x'], Button1Size['y'], false]);
						break; 
                    case "10":
						HoverSelectedParts.push([Button2, Button2Size['x'], Button2Size['y'], false]);
						break; 
                    case "11":
						HoverSelectedParts.push([Button3, Button3Size['x'], Button3Size['y'], false]);
						break; 
                    case "12":
						HoverSelectedParts.push([Button4, Button4Size['x'], Button4Size['y'], false]);
						break; 
                    case "13":
						HoverSelectedParts.push([Button5, Button5Size['x'], Button5Size['y'], false]);
						break; 
                    case "14":
						HoverSelectedParts.push([Button6, Button6Size['x'], Button6Size['y'], false]);
						break; 
                    case "15":
						HoverSelectedParts.push([Button7, Button7Size['x'], Button7Size['y'], false]);
						break; 
                    case "16":
						HoverSelectedParts.push([Hex0Rotate, Hex0RotateSize['x'], Hex0RotateSize['y'], false]);
						break; 
                    case "17":
						HoverSelectedParts.push([Hex0Rotate, Hex0RotateSize['x'], Hex0RotateSize['y'], false]);
						break; 
                    case "18":
						HoverSelectedParts.push([Hex0Rotate, Hex0RotateSize['x'], Hex0RotateSize['y'], false]);
						break; 
                    case "19":
						HoverSelectedParts.push([Hex0Rotate, Hex0RotateSize['x'], Hex0RotateSize['y'], false]);
						break; 
                    case "20":
						HoverSelectedParts.push([Hex1Rotate, Hex1RotateSize['x'], Hex1RotateSize['y'], false]);
						break; 
                    case "21":
						HoverSelectedParts.push([Hex1Rotate, Hex1RotateSize['x'], Hex1RotateSize['y'], false]);
						break; 
                    case "22":
						HoverSelectedParts.push([Hex1Rotate, Hex1RotateSize['x'], Hex1RotateSize['y'], false]);
						break; 
                    case "23":
						HoverSelectedParts.push([Hex1Rotate, Hex1RotateSize['x'], Hex1RotateSize['y'], false]);
						break; 
                    case "24":
						HoverSelectedParts.push([EncoderRotate, EncoderRotateSize['x'], EncoderRotateSize['y'], false]);
						break; 
                    case "25":
						HoverSelectedParts.push([EncoderRotate, EncoderRotateSize['x'], EncoderRotateSize['y'], false]);
						break; 
				}
			}
			else if(BlinkingType = "Actuator")
			{
				switch(BlinkingUnit)
				{
                    case "0":
						HoverSelectedParts.push([Segment0A,Segment0ASize['x'],Segment0ASize['y'], false]);
						break; 
                    case "1":
						HoverSelectedParts.push([Segment0B,Segment0BSize['x'],Segment0BSize['y'], false]);
						break; 
                    case "2":
						HoverSelectedParts.push([Segment0C,Segment0CSize['x'],Segment0CSize['y'], false]);
						break; 
                    case "3":
						HoverSelectedParts.push([Segment0D,Segment0DSize['x'],Segment0DSize['y'], false]);
						break; 
                    case "4":
						HoverSelectedParts.push([Segment0E,Segment0ESize['x'],Segment0ESize['y'], false]);
						break; 
                    case "5":
						HoverSelectedParts.push([Segment0F,Segment0FSize['x'],Segment0FSize['y'], false]);
						break; 
                    case "6":
						HoverSelectedParts.push([Segment0G,Segment0GSize['x'],Segment0GSize['y'], false]);
						break; 
                    case "7":
						HoverSelectedParts.push([Segment1A,Segment1ASize['x'],Segment1ASize['y'], false]);
						break; 
                    case "8":
						HoverSelectedParts.push([Segment1B,Segment1BSize['x'],Segment1BSize['y'], false]);
						break; 
                    case "9":
						HoverSelectedParts.push([Segment1C,Segment1CSize['x'],Segment1CSize['y'], false]);
						break; 
                    case "10":
						HoverSelectedParts.push([Segment1D,Segment1DSize['x'],Segment1DSize['y'], false]);
						break; 
                    case "11":
						HoverSelectedParts.push([Segment1E,Segment1ESize['x'],Segment1ESize['y'], false]);
						break; 
                    case "12":
						HoverSelectedParts.push([Segment1F,Segment1FSize['x'],Segment1FSize['y'], false]);
						break; 
                    case "13":
						HoverSelectedParts.push([Segment1G,Segment1GSize['x'],Segment1GSize['y'], false]);
						break; 
                    case "14":
						HoverSelectedParts.push([Segment2A,Segment2ASize['x'],Segment2ASize['y'], false]);
						break; 
                    case "15":
						HoverSelectedParts.push([Segment2B,Segment2BSize['x'],Segment2BSize['y'], false]);
						break; 
                    case "16":
						HoverSelectedParts.push([Segment2C,Segment2CSize['x'],Segment2CSize['y'], false]);
						break; 
                    case "17":
						HoverSelectedParts.push([Segment2D,Segment2DSize['x'],Segment2DSize['y'], false]);
						break; 
                    case "18":
						HoverSelectedParts.push([Segment2E,Segment2ESize['x'],Segment2ESize['y'], false]);
						break; 
                    case "19":
						HoverSelectedParts.push([Segment2F,Segment2FSize['x'],Segment2FSize['y'], false]);
						break; 
                    case "20":
						HoverSelectedParts.push([Segment2G,Segment2GSize['x'],Segment2GSize['y'], false]);
						break; 
                    case "21":
						HoverSelectedParts.push([Segment3A,Segment3ASize['x'],Segment3ASize['y'], false]);
						break; 
                    case "22":
						HoverSelectedParts.push([Segment3B,Segment3BSize['x'],Segment3BSize['y'], false]);
						break; 
                    case "23":
						HoverSelectedParts.push([Segment3C,Segment3CSize['x'],Segment3CSize['y'], false]);
						break; 
                    case "24":
						HoverSelectedParts.push([Segment3D,Segment3DSize['x'],Segment3DSize['y'], false]);
						break; 
                    case "25":
						HoverSelectedParts.push([Segment3E,Segment3ESize['x'],Segment3ESize['y'], false]);
						break; 
                    case "26":
						HoverSelectedParts.push([Segment3F,Segment3FSize['x'],Segment3FSize['y'], false]);
						break; 
                    case "27":
						HoverSelectedParts.push([Segment3G,Segment3GSize['x'],Segment3GSize['y'], false]);
						break; 
					case "28":
						HoverSelectedParts.push([Bargraph0,Bargraph0Size['x'],Bargraph0Size['y'], false]);
						break; 
                    case "29":
						HoverSelectedParts.push([Bargraph1,Bargraph1Size['x'],Bargraph1Size['y'], false]);
						break; 
                    case "30":
						HoverSelectedParts.push([Bargraph2,Bargraph2Size['x'],Bargraph2Size['y'], false]);
						break; 
                    case "31":
						HoverSelectedParts.push([Bargraph3,Bargraph3Size['x'],Bargraph3Size['y'], false]);
						break; 
                    case "32":
						HoverSelectedParts.push([Bargraph4,Bargraph4Size['x'],Bargraph4Size['y'], false]);
						break; 
                    case "33":
						HoverSelectedParts.push([Bargraph5,Bargraph5Size['x'],Bargraph5Size['y'], false]);
						break; 
                    case "34":
						HoverSelectedParts.push([Bargraph6,Bargraph6Size['x'],Bargraph6Size['y'], false]);
						break; 
                    case "35":
						HoverSelectedParts.push([Bargraph7,Bargraph7Size['x'],Bargraph7Size['y'], false]);
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

    function Refresh() {
        //Bargraph 0-7
        if (Actuators[28]) {
            Bargraph0.attr("fill", "#" + ColorBargraphOn);
        }
        else {
            Bargraph0.attr("fill", "#" + ColorBargraphOff);
        }

        if (Actuators[29]) {
            Bargraph1.attr("fill", "#" + ColorBargraphOn);
        }
        else {
            Bargraph1.attr("fill", "#" + ColorBargraphOff);
        }

        if (Actuators[30]) {
            Bargraph2.attr("fill", "#" + ColorBargraphOn);
        }
        else {
            Bargraph2.attr("fill", "#" + ColorBargraphOff);
        }

        if (Actuators[31]) {
            Bargraph3.attr("fill", "#" + ColorBargraphOn);
        }
        else {
            Bargraph3.attr("fill", "#" + ColorBargraphOff);
        }

        if (Actuators[32]) {
            Bargraph4.attr("fill", "#" + ColorBargraphOn);
        }
        else {
            Bargraph4.attr("fill", "#" + ColorBargraphOff);
        }

        if (Actuators[33]) {
            Bargraph5.attr("fill", "#" + ColorBargraphOn);
        }
        else {
            Bargraph5.attr("fill", "#" + ColorBargraphOff);
        }

        if (Actuators[34]) {
            Bargraph6.attr("fill", "#" + ColorBargraphOn);
        }
        else {
            Bargraph6.attr("fill", "#" + ColorBargraphOff);
        }

        if (Actuators[35]) {
            Bargraph7.attr("fill", "#" + ColorBargraphOn);
        }
        else {
            Bargraph7.attr("fill", "#" + ColorBargraphOff);
        }

        //7Segment0
        if (!Actuators[0]) {
            Segment0A.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment0A.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[1]) {
            Segment0B.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment0B.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[2]) {
            Segment0C.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment0C.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[3]) {
            Segment0D.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment0D.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[4]) {
            Segment0E.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment0E.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[5]) {
            Segment0F.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment0F.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[6]) {
            Segment0G.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment0G.attr("fill", "#" + ColorSegmentOff);
        }

        //7Segment1
        if (!Actuators[7]) {
            Segment1A.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment1A.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[8]) {
            Segment1B.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment1B.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[9]) {
            Segment1C.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment1C.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[10]) {
            Segment1D.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment1D.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[11]) {
            Segment1E.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment1E.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[12]) {
            Segment1F.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment1F.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[13]) {
            Segment1G.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment1G.attr("fill", "#" + ColorSegmentOff);
        }
        
        //7Segment2
        if (!Actuators[14]) {
            Segment2A.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment2A.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[15]) {
            Segment2B.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment2B.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[16]) {
            Segment2C.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment2C.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[17]) {
            Segment2D.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment2D.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[18]) {
            Segment2E.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment2E.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[19]) {
            Segment2F.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment2F.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[20]) {
            Segment2G.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment2G.attr("fill", "#" + ColorSegmentOff);
        }
        
        //7Segment3
        if (!Actuators[21]) {
            Segment3A.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment3A.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[22]) {
            Segment3B.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment3B.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[23]) {
            Segment3C.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment3C.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[24]) {
            Segment3D.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment3D.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[25]) {
            Segment3E.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment3E.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[26]) {
            Segment3F.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment3F.attr("fill", "#" + ColorSegmentOff);
        }

        if (!Actuators[27]) {
            Segment3G.attr("fill", "#" + ColorSegmentOn);
        }
        else {
            Segment3G.attr("fill", "#" + ColorSegmentOff);
        }
    }

    initialize();
}    