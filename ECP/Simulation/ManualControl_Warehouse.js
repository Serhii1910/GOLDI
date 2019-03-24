function ManualControl(EventHandler, SettingsParameter, CallBack) 
{
    var KeyIsPressed = false;
    var MagnetOn = false;

    var SVG = undefined;
    var XPlus = undefined;
    var XMinus = undefined;
    var YPlus = undefined;
    var YMinus = undefined;
    var ZPlus = undefined;
    var ZMinus = undefined;
    var ElectroMagnet = undefined;
    var ActiveArrowColor = "#FFE817";
    var InactiveArrowColor = "#FBD7BB";
    var Sensors = [];
    var Actuators = [];
    
    for (var i = 0; i < 128; i++)
    {
       Actuators[i] = false;
    }
    
    ManualControl.prototype.onData = function (Data) 
    {
        Sensors = Data.getSensors();
    };

    $("#" + SettingsParameter.RightPanelDIVName).load("ECP/Simulation/ManualControl_3AxisPortal.html", function ()
    {
        SVG = $('#svg2');
        SVG.attr("width", "100%");
        SVG.attr("height", "100%");
        BuildUserControlPanelContent();
        CallBack();
    });

    function colorizeArrowUp() 
    {
        YPlus.attr("fill","#ActiveArrowColor");
    }

    function colorizeArrowDown()
    {
        YMinus.attr("fill","#ActiveArrowColor");
    }

    function colorizeArrowLeft() 
    {
        XMinus.attr("fill","#ActiveArrowColor");
    }

    function colorizeArrowRight() 
    {
        XPlus.attr("fill","#ActiveArrowColor");
    }

    function colorizeArrowPull() 
    {
        ZPlus.attr("fill","#ActiveArrowColor");
    }

    function colorizeArrowPush() 
    {
        ZMinus.attr("fill","#ActiveArrowColor");
    }

    function decolorizeArrowUp() 
    {
        YPlus.attr("fill","#InactiveArrowColor");
    }

    function decolorizeArrowDown() 
    {
        YMinus.attr("fill","#InactiveArrowColor");
    }

    function decolorizeArrowLeft() 
    {
        XMinus.attr("fill","#InactiveArrowColor");
    }

    function decolorizeArrowRight()
    {
        XPlus.attr("fill","#InactiveArrowColor");
    }

    function decolorizeArrowPull() 
    {
        ZPlus.attr("fill","#InactiveArrowColor");
    }

    function decolorizeArrowPush() 
    {
        XMinus.attr("fill","#InactiveArrowColor");
    }

    function colorizeMagnet() 
    {

    }

    function SendActor(Actor, Value) 
    {
        var FullModelActuatorsArray = new Array(128);

        if(Actor instanceof Array)
        {
            for (var i = 0; i < 128; i++)
            {
               FullModelActuatorsArray[i] = Actuators[i];
            }
            
            for(var i = 0; i < Actor.length; i++)
            {
               FullModelActuatorsArray[Actor[i][0]] = Actor[i][1];
               Actuators[Actor[i][0]] = Actor[i][1];
            }
        }
        else
        {
            for (var i = 0; i < 128; i++)
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
        
        var Type = [];
        Type = ["BPU"];
        
        Message.setParameterStringArray(Type);

        Message.setActuators(FullModelActuatorsArray);

        EventHandler.fireDataSendEvent(Message);
    }

    function BuildUserControlPanelContent() 
    {
        SVG = $('#svg2');

        XPlus = SVG.find('#xplus');
        XMinus = SVG.find('#xminus');
        YPlus = SVG.find('#yplus');
        YMinus = SVG.find('#yminus');
        ZPlus = SVG.find('#zplus');
        ZMinus = SVG.find('#zminus');
        ElectroMagnet = SVG.find('#g4788');
        
        XPlus.on('mousedown', function () 
        {
            colorizeArrowRight();
            SendActor(1, true);
        });
        
        XMinus.on('mousedown', function () 
        {
            colorizeArrowLeft();
            SendActor(0, true);
        });
        
        YPlus.on('mousedown', function () 
        {
            colorizeArrowDown();
            SendActor(3, true);
        });
        
        YMinus.on('mousedown', function () 
        {
            colorizeArrowUp();
            SendActor(4, true);
        });
        
        ZMinus.on('mousedown', function () 
        {
            colorizeArrowPush();
            SendActor(5, true);
        });
        
        ZPlus.on('mousedown', function () 
        {
            colorizeArrowPull();
            SendActor(6, true);
        });
        
        $('body').on('mouseup mouseleave', function () 
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
              [5, false],                      
              [6, false],
              [7, false],
              [8, false],
              [9, false],
                     ]);
        });


        $("body").keydown(function (event) 
        {
            if (!KeyIsPressed) 
            {
                switch (event.which) 
                {
                    case 87: // W
                        colorizeArrowUp();
                        SendActor(4, true);
                        break;
                    case 65: // A
                        colorizeArrowLeft();
                        SendActor(0, true);
                        break;
                    case 83: // S
                        colorizeArrowDown();
                        SendActor(3, true);
                        break;
                    case 68: // D
                        colorizeArrowRight();
                        SendActor(1, true);
                        break;
                    case 82: // R
                        colorizeArrowPull();
                        SendActor(5, true);
                        break;
                    case 70: // F
                        colorizeArrowPush();
                        SendActor(6, true);
                        break;
                    default:
                        break;
                }

                KeyIsPressed = true;
            }
        });

        $("body").keyup(function (event) 
        {
            switch (event.which) 
            {
                case 87: // W
                    decolorizeArrowUp();
                    SendActor(4, false);
                    break;
                case 65: // A
                    decolorizeArrowLeft();
                    SendActor(0, false);
                    break;
                case 83: // S
                    decolorizeArrowDown();
                    SendActor(3, false);
                    break;
                case 68: // D
                    decolorizeArrowRight();
                    SendActor(1, false);
                    break;
                case 82: // R
                    decolorizeArrowPull();
                    SendActor(5, false);
                    break;
                case 70: // F
                    decolorizeArrowPush();
                    SendActor(6, false);
                    break;
                default:
                    break;
            }

            KeyIsPressed = false;
        });
    }
}