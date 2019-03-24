function Animation(EventHandler, SettingsParameter, CallBack) 
{
    // Time in milliseconds the animation is being refreshed
    var RefreshTime = 101;
    var BlinkingInterval = 600;

    var Sensors = new Array(128);
    var Actuators = new Array(128);
    var AnimationTimer = undefined;
    var BlinkingTimer = undefined;
    var BlinkingUnit = undefined;
    var BlinkingType = undefined;
    var BlinkingActive = false;
    var SVG = undefined;
    var XMax = 340;         //Right
    var XMin = -340;        //Left
    var XMiddle = 0;        //Reference
    var YMin = 140;         //Front       
    var YMax = -55;         //Back
    var YMiddle = 55;       //Reference
    var ZMin = -80;         //Up
    var ZMax = 73;          //Down
    var ZMiddle = 10;
    var XPosition = 0;
    var YPosition = 0;
    var ZPosition = 0;
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
    var XValue = "";
    var YValue = "";
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
    
    var SensorColors = [];

    var State = "InitialState";
    
    /*
    Animation.prototype.onCommand = function (Command) 
    {

    };
    
    Animation.prototype.onServerInterfaceInfo = function (Info) 
    {
        
    };
    */
    
    Animation.prototype.onHoverEvent = function(HoverData)
    {
        //SetUnitBlinking(HoverData.getType(), HoverData.getUnit());
    };
    
    Animation.prototype.onData = function (Data) 
    {
        Sensors = Data.getSensors();
        Actuators = Data.getActuators();
    };

    //This function draws the animation in its initial state without any sensor or actor values and initializes all of the components
    function initialize() 
    {
        for (var i = 0; i < 128; i++)
        {
            Actuators[i] = false;
            Sensors[i] = false;
        }

        $("#" + SettingsParameter.AnimationDIVName).load('ECP/Animation/Images/Image_Warehouse.svg', function ()
        {   
            CallBack();
        });

    }
    
    function SendEnvironmentVariableCommand(Variable, Value) 
    {
        EnvironmentVariable16Bit = dec2Bin(Variable);
        EnvironmentVariable16Bit = EnvironmentVariable16Bit.padLeft(16, "0");

        Message = new CommandMessage();
        Message.setType(EnumCommand.SetEnvironmentVariable);

        var ParameterStringArray = [EnvironmentVariable16Bit, Value];

        Message.setParameterStringArray(ParameterStringArray);

        EventHandler.fireCommandEvent(Message);
    }

    // this function draws the animation according to the values set
    function Refresh() 
    {
        
    }

    initialize();
}