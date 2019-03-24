function ManualControl(EventHandler, SettingsParameter, CallBack) 
{
    var DisabledArrowColor;
    var MagnetOn = false;
    var PSPU_Running = false;
    var body;

    var SVG = undefined;
    var SVGCanvas = undefined;
    var XPlus = undefined;
    var XMinus = undefined;
    var YPlus = undefined;
    var YMinus = undefined;
    var ZPlus = undefined;
    var ZMinus = undefined;
    var ElectroMagnet = undefined;

    var XPlus_Snap = undefined;
    var XMinus_Snap = undefined;
    var YPlus_Snap = undefined;
    var YMinus_Snap = undefined;
    var ZPlus_Snap = undefined;
    var ZMinus_Snap = undefined;
    var ElectroMagnet_Snap = undefined;

    var Sensors = [];
    var Actuators = [];
    var ActiveArrowColor = "#FFE817";
    var InactiveArrowColor = "#FBD7BB";
    var InactiveMagnetColor = "#BF5459";
    var ActiveMagnetColor = "#FF0000";
    DisabledArrowColor = "#CCCCCC";
    body = $('body');
    
    for (var i = 0; i < 128; i++)
    {
       Actuators[i] = false;
    }
    
    ManualControl.prototype.onData = function (Data) 
    {
        Sensors = Data.getSensors();
    };

    ManualControl.prototype.onCommand = function (Command)
    {
        if (Command.getType() == EnumCommand.PSPURun) {
            enableControls();
            PSPU_Running = true;
        }
        if (Command.getType() == EnumCommand.PSPUStop ||
            Command.getType() == EnumCommand.PSPUErrorCode ||
            Command.getType() == EnumCommand.PSPUReachedBreakpoint ||
            Command.getType() == EnumCommand.PSPUReachedSingleStepActuator ||
            Command.getType() == EnumCommand.PSPUReachedSingleStepSensor)
        {
            SendActor([
                [0, false],
                [1, false],
                [2, false],
                [3, false],
                [4, false],
                [5, false]
            ]);
            PSPU_Running = false;
            disableControls();
        }
    };

    $("#" + SettingsParameter.RightPanelDIVName).load("ECP/Simulation/ManualControl_3AxisPortal.svg", function ()
    {
        BuildUserControlPanelContent();
        CallBack();
    });

    function colorizeArrowUp()
    {
        if(PSPU_Running)
            YPlus_Snap.attr("fill",ActiveArrowColor);
    }

    function colorizeArrowDown()
    {
        if(PSPU_Running)
            YMinus_Snap.attr("fill",ActiveArrowColor);
    }

    function colorizeArrowLeft()
    {
        if(PSPU_Running)
            XMinus_Snap.attr("fill",ActiveArrowColor);
    }

    function colorizeArrowRight()
    {
        if(PSPU_Running)
            XPlus_Snap.attr("fill",ActiveArrowColor);
    }

    function colorizeArrowPull()
    {
        if(PSPU_Running)
            ZPlus_Snap.attr("fill",ActiveArrowColor);
    }

    function colorizeArrowPush()
    {
        if(PSPU_Running)
            ZMinus_Snap.attr("fill",ActiveArrowColor);
    }

    function decolorizeArrowUp()
    {
        if(PSPU_Running)
            YPlus_Snap.attr("fill",InactiveArrowColor);
    }

    function decolorizeArrowDown()
    {
        if(PSPU_Running)
            YMinus_Snap.attr("fill",InactiveArrowColor);
    }

    function decolorizeArrowLeft()
    {
        if(PSPU_Running)
            XMinus_Snap.attr("fill",InactiveArrowColor);
    }

    function decolorizeArrowRight()
    {
        if(PSPU_Running)
            XPlus_Snap.attr("fill",InactiveArrowColor);
    }

    function decolorizeArrowPull()
    {
        if(PSPU_Running)
            ZPlus_Snap.attr("fill",InactiveArrowColor);
    }

    function decolorizeArrowPush()
    {
        if(PSPU_Running)
            ZMinus_Snap.attr("fill",InactiveArrowColor);
    }

    function colorizeMagnet()
    {
        if(PSPU_Running)
            ElectroMagnet_Snap.attr("fill",ActiveMagnetColor);
    }

    function decolorizeMagnet()
    {
        if(PSPU_Running)
            ElectroMagnet_Snap.attr("fill",InactiveMagnetColor);
    }

    function enableControls()
    {
        ElectroMagnet_Snap.attr("fill",InactiveMagnetColor);
        ZMinus_Snap.attr("fill",InactiveArrowColor);
        ZPlus_Snap.attr("fill",InactiveArrowColor);
        XPlus_Snap.attr("fill",InactiveArrowColor);
        XMinus_Snap.attr("fill",InactiveArrowColor);
        YMinus_Snap.attr("fill",InactiveArrowColor);
        YPlus_Snap.attr("fill",InactiveArrowColor);
    }

    function disableControls()
    {
        ElectroMagnet_Snap.attr("fill",DisabledArrowColor);
        ZMinus_Snap.attr("fill",DisabledArrowColor);
        ZPlus_Snap.attr("fill",DisabledArrowColor);
        XPlus_Snap.attr("fill",DisabledArrowColor);
        XMinus_Snap.attr("fill",DisabledArrowColor);
        YMinus_Snap.attr("fill",DisabledArrowColor);
        YPlus_Snap.attr("fill",DisabledArrowColor);
    }

    function SendActor(Actor, Value) 
    {
        if(!PSPU_Running)
            return;
        var FullModelActuatorsArray = new Array(128);

        if(Actor instanceof Array)
        {
            for (i = 0; i < 128; i++)
            {
               FullModelActuatorsArray[i] = Actuators[i];
            }
            
            for(i = 0; i < Actor.length; i++)
            {
               FullModelActuatorsArray[Actor[i][0]] = Actor[i][1];
               Actuators[Actor[i][0]] = Actor[i][1];
            }
        }
        else
        {
            for (i = 0; i < 128; i++)
            {
                if (i == Actor)
                {
                    FullModelActuatorsArray[i] = Value;
                    Actuators[i] = Value;
                }    
                else 
                    FullModelActuatorsArray[i] = Actuators[i];
            }
        }
        
        var Message = new DataMessage();
        
        Message.setSensors(Sensors);

        var Type = ["BPU"];
        
        Message.setParameterStringArray(Type);

        Message.setActuators(FullModelActuatorsArray);

        EventHandler.fireDataSendEvent(Message);
    }
    
    function SetMagnet()
    {
        if(!PSPU_Running)
            return;
        if (!MagnetOn) 
        {
            colorizeMagnet();
            SendActor(6, true);
            MagnetOn = true;
        }
        else 
        {
            decolorizeMagnet();
            SendActor(6, false);
            MagnetOn = false;
        }
    }

    function BuildUserControlPanelContent() 
    {
        SVG = $('#Manual_Control_3_Axis_SVG');
        SVG.attr("height", "100%");
        SVG.attr("width", "100%");
        SVGCanvas = Snap('#Manual_Control_3_Axis_SVG');

        XPlus = SVG.find('#Arrow_X_Plus');
        XPlus_Snap = Snap('#Arrow_X_Plus_Fill');
        XMinus = SVG.find('#Arrow_X_Minus');
        XMinus_Snap = Snap('#Arrow_X_Minus_Fill');
        YPlus = SVG.find('#Arrow_Y_Plus');
        YPlus_Snap = Snap('#Arrow_Y_Plus_Fill');
        YMinus = SVG.find('#Arrow_Y_Minus');
        YMinus_Snap = Snap('#Arrow_Y_Minus_Fill');
        ZPlus = SVG.find('#Arrow_Z_Plus');
        ZPlus_Snap = Snap('#Arrow_Z_Plus_Fill');
        ZMinus = SVG.find('#Arrow_Z_Minus');
        ZMinus_Snap = Snap('#Arrow_Z_Minus_Fill');
        ElectroMagnet = SVG.find('#Magnet');
        ElectroMagnet_Snap = Snap('#Magnet_Fill');
        
        XPlus.on('mousedown', function () 
        {
            colorizeArrowRight();
            SendActor(0, true);
        });
        
        XMinus.on('mousedown', function () 
        {
            colorizeArrowLeft();
            SendActor(1, true);
        });
        
        YPlus.on('mousedown', function () 
        {
            colorizeArrowUp();
            SendActor(2, true);
        });
        
        YMinus.on('mousedown', function () 
        {
            colorizeArrowDown();
            SendActor(3, true);
        });
        
        ZMinus.on('mousedown', function () 
        {
            colorizeArrowPush();
            SendActor(5, true);
        });
        
        ZPlus.on('mousedown', function () 
        {
            colorizeArrowPull();
            SendActor(4, true);
        });
        
        ElectroMagnet.on('click', function () 
        {
            SetMagnet();
        });

        body.on('mouseup mouseleave', function ()
        {
            decolorizeArrowRight();
            decolorizeArrowLeft();
            decolorizeArrowDown();
            decolorizeArrowUp();
            decolorizeArrowPull();
            decolorizeArrowPush();
            SendActor([
              [0, false],
              [1, false],
              [2, false],
              [3, false],
              [4, false],
              [5, false]
                     ]);
        });


        body.keydown(function (event)
        {
                switch (event.which) 
                {
                    case 87: // W
                        colorizeArrowUp();
                        if(!Sensors[3]){
                            SendActor(2, true);
                        }else{
                            SendActor(2, false);
                        }
                        break;
                    case 65: // A
                        colorizeArrowLeft();
                        if(!Sensors[1]){
                            SendActor(1, true);
                        }else{
                            SendActor(1, false);
                        }
                        break;
                    case 83: // S
                        colorizeArrowDown();
                        if(!Sensors[4]){
                            SendActor(3, true);
                        }else{
                            SendActor(3, false);
                        }
                        break;
                    case 68: // D
                        colorizeArrowRight();
                        if(!Sensors[0]){
                            SendActor(0, true);
                        }else{
                            SendActor(0, false);
                        }
                        break;
                    case 82: // R
                        colorizeArrowPull();
                        if(!Sensors[6]){
                            SendActor(4, true);
                        }else{
                            SendActor(4, false);
                        }
                        break;
                    case 70: // F
                        colorizeArrowPush();
                        if(!Sensors[7]){
                            SendActor(5, true);
                        }else{
                            SendActor(5, false);
                        }
                        break;
                    default:
                        break;
                }


                if (event.which == 69)  // E
                {
                    SetMagnet();
                }
        });

        body.keyup(function (event)
        {
            switch (event.which) 
            {
                case 87: // W
                    decolorizeArrowUp();
                    SendActor(2, false);
                    break;
                case 65: // A
                    decolorizeArrowLeft();
                    SendActor(1, false);
                    break;
                case 83: // S
                    decolorizeArrowDown();
                    SendActor(3, false);
                    break;
                case 68: // D
                    decolorizeArrowRight();
                    SendActor(0, false);
                    break;
                case 82: // R
                    decolorizeArrowPull();
                    SendActor(4, false);
                    break;
                case 70: // F
                    decolorizeArrowPush();
                    SendActor(5, false);
                    break;
                default:
                    break;
            }
        });

        disableControls();
    }
}