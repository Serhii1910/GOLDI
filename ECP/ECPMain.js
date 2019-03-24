//***************************************
//*
//* Global functions
//*
//***************************************

setInterval(function(){
    localStorage.GOLDiRunningExperiment = "running";
},1000);
window.onbeforeunload = function () {
    localStorage.GOLDiRunningExperiment = "stop";
    console.log(localStorage.GOLDiRunningExperiment);
};

String.prototype.padLeft = function (l, c)
{
    return Array(l - this.length + 1).join(c || " ") + this
};

function dec2Bin(dec) 
{
    if (dec >= 0) 
    {
        return dec.toString(2);
    }
    else 
    {
        return (~dec).toString(2);
    }
}

/*
 * This function make a bitmap from valve procent and return bit (0 or 1) value
 *
 * @param int Bitnummer
 * @param int proc
 *
 * @return int
 */
function calculateBitValue(Bitnumber, proc) {
    var bitmap = Array(8);
    var stringValue = (((255 * proc) / 100) >>> 0).toString(2);

    bitmap = stringValue.split("");
    for (var i = 0; i < bitmap.length; ++i) {
        bitmap[i] = parseInt(bitmap[i], 2);
    }
    bitmap.reverse();
    if (bitmap.length < 8) {
        var length = 8 - bitmap.length;
        for (var i = 0; i < length; ++i)
            bitmap.push(0);
    }
    return bitmap[Bitnumber];
}

//***************************************
//*
//* End of global functions
//*
//***************************************

var CommunicationMessageDebug = false;
function MyDebugCommand(Command){
    if(CommunicationMessageDebug) {
        let CommandString = Command.toString();
        console.log("Command: (" + CommandString + ")");
    }
}

function MyDebugData(Data){
    if(CommunicationMessageDebug) {
        let DataString = Data.toString();
        console.log("Data: (" + DataString + ")");
    }
}

// main function - this function is called after all subunits have been loaded by head.js
// the settingsparameter for the current session are passed
function ECPMain(SettingsParameter)
{
    // Event handler that is passed to each module to fire events
    EventHandler = new GlobalEventHandling();

    // Language object that contains all translations
    var Language_ = new Language();

    // ECP control panel - see documentation for further information
    ControlPanel_ = new ControlPanel(EventHandler, SettingsParameter, ControlPanelCallBack, GetLabel);

    // event listener for commands
    document.addEventListener('CommandArrived', function (e) {
        MyDebugCommand(e.detail);
        ControlPanel_.onCommand(e.detail);
        Animation_.onCommand(e.detail);
    }, false);
    
    // event listener for internal hover events (used for blinking engine)
    document.addEventListener('InternalHoverEventArrived', function (e) {
        Animation_.onHoverEvent(e.detail);
    }, false);

    // event listeners for data that arrived from the server
    document.addEventListener('DataArrivedFromServer', function (e) {
        MyDebugData(e.detail);
        Animation_.onData(e.detail);
        ControlPanel_.onData(e.detail);
    }, false);

    // TEST TODO
    document.addEventListener('ServerInterfaceInfoArrived', function (e) {
        Animation_.onServerInterfaceInfo(e.detail);
        ControlPanel_.onServerInterfaceInfo(e.detail);
    }, false);

    // TEST TODO
    /*
    document.addEventListener('InternalErrorArrived', function (e) {
        ControlPanel_.onInternalError(e.detail);
    }, false);
    */
    
    // this function returns a label string based on the GOLDi ECP label naming convention
    function GetLabel(Labelstring) 
    {
        var Label = Language_.languages[SettingsParameter.CurrentLanguage][Labelstring];
        if (Label == undefined || Label == "") 
        {
            debug("Label " + Labelstring + " not defined!");
            return "#MISSING#";
        }
        else return Label;
    }

    // function to load simulation module
    function LoadSimulation() 
    {
        if(SettingsParameter.SessionID !== "0") {
            Simulation_ = new Simulation(EventHandler, SettingsParameter);

            // event listeners for data that arrived from the server
            document.addEventListener('DataArrivedFromServer', function (e) {
                Simulation_.onData(e.detail);
            }, false);

            // TEST TODO
            /*document.addEventListener('ServerInterfaceInfoArrived', function (e) {
                Simulation_.onServerInterfaceInfo(e.detail);
            }, false);
            */
        }
    }

    // function to load the server interface
    function BuildServerInterface() 
    {
        if(SettingsParameter.Mode != "a")
            $("#ExperimentConnectingModal").modal();

        if(SettingsParameter.SessionID != "0" && (SettingsParameter.Mode == "a" || SettingsParameter.Mode == "d"))
        {
            BuildVirtualServerInterface();

            if(SettingsParameter.Mode == "a")
            {
                return;
            }
        }
        ServerInterface_ = new ServerInterface(EventHandler, SettingsParameter);

        // event listener for commands
        // if we're in virtual BPU mode, no need to send any examples to the server
        if(Settings.DeviceType == "FSMInterpreter"){
            document.addEventListener('CommandArrived', function (e) {
                if(e.detail.getType() == EnumCommand.LoadBPUExample)
                {
                    return;
                }
                ServerInterface_.onCommand(e.detail);
            }, false);
        }
        else
        {
            document.addEventListener('CommandArrived', function (e) {
                ServerInterface_.onCommand(e.detail);
            }, false);
        }


        // event listener for data to send
        document.addEventListener('DataArrivedToSend', function (e) {
            ServerInterface_.onData(e.detail);
        }, false);

        if (SettingsParameter.DeviceType == "ManualControl")
        {
            document.addEventListener('CommandArrived', function (e) {
                ManualControl_.onCommand(e.detail);
            }, false);

        }

    }
    
    // temporary, since the virtual pspu will run on the server
    function BuildVirtualServerInterface()
    {
        // Load Virtual server
        VirtualPSPU_ = new VirtualPSPUInterface(EventHandler, SettingsParameter);
        document.addEventListener('CommandArrived', function (e) {
            VirtualPSPU_.onCommand(e.detail);
        }, false);
        
        document.addEventListener('DataArrivedToSend', function (e) {
            VirtualPSPU_.onData(e.detail);
            Animation_.onData(e.detail);
            ControlPanel_.onData(e.detail);
        }, false);

        document.addEventListener('DataArrivedFromServer', function (e) {
            VirtualPSPU_.onData(e.detail);
        }, false);


    }

    // FSM interpreter call back - is called by the control panel
    function BEASTReadyCallBack()
    {
        BuildServerInterface();
        if (SettingsParameter.Mode == "d" || SettingsParameter.Mode == "a") LoadSimulation();

        SetWebCam();
        SetColumnsToEqualHeight();
    }

    function BuildBEASTControl()
    {
        BEAST_ = new BEAST(EventHandler, SettingsParameter, BEASTReadyCallBack, GetLabel);

        // event listeners for data that arrived from the server
        document.addEventListener('DataArrivedFromServer', function (e) {
            BEAST_.onData(e.detail);
        }, false);

        // event listener for commands
        document.addEventListener('CommandArrived', function (e) {
            BEAST_.onCommand(e.detail);
        }, false);
    }


    // function to build the FSM interpreter
    function BuildFSMInterpreter() 
    {
        if(SettingsParameter.SessionID == "0"){
            // Visitor
            FSMInterpreterReadyCallBack();
            return;
        } else{
            FSMInterpreter_ = new FSMInterpreter(EventHandler, SettingsParameter, FSMInterpreterReadyCallBack, GetLabel);
        }

        // event listeners for data that arrived from the server
        document.addEventListener('DataArrivedFromServer', function (e) {
            FSMInterpreter_.onData(e.detail);
        }, false);

        // event listener for commands
        document.addEventListener('CommandArrived', function (e) {
            FSMInterpreter_.onCommand(e.detail);
        }, false);

        // event listener for server interface info
        
        // TEST TODO
        /*
        document.addEventListener('ServerInterfaceInfoArrived', function (e) {
            FSMInterpreter_.onServerInterfaceInfo(e.detail);
        }, false);
        */
    }

    // Control panel call back function - is called by the control panel
    function ControlPanelCallBack() 
    {
        Animation_ = new AnimationInterface(EventHandler, SettingsParameter, CallBackSVGLoaded);
    }

    // FSM interpreter call back - is called by the control panel
    function FSMInterpreterReadyCallBack() 
    {
        BuildServerInterface();
        if (SettingsParameter.Mode == "d" || SettingsParameter.Mode == "a") LoadSimulation();
        
        // adjust and align the appearance of all modules
        if (SettingsParameter.DeviceType == "ManualControl")
        {
            AddManualControlEventHandlers();
        }
        SetWebCam();
        SetColumnsToEqualHeight();
    }

    // SVG call back - is called by the animation
    function CallBackSVGLoaded() 
    {
        if (SettingsParameter.Mode == "b") 
        {
            if (SettingsParameter.DeviceType == "ManualControl")
            {
                BuildManualControl();
            }
            else if (SettingsParameter.DeviceType == "BEAST")
            {
                BuildBEASTControl();
            }
            else
            {
                BuildFSMInterpreter();
            }
        }
        else if (SettingsParameter.Mode == "a") 
        {
            if (SettingsParameter.DeviceType == "ManualControl") 
            {
                BuildManualControl();
            }
            else if (SettingsParameter.DeviceType == "BEAST")
            {
                BuildBEASTControl();
            }
            else
            {
                BuildFSMInterpreter();
            }
        }
        else 
        {
            FSMInterpreterReadyCallBack()
        }

        // Set the content of the control panel to equal height
        SetColumnsToEqualHeight();
        
        // every time the window size changes - set all columns to equal height
        $(window).on('resize orientationChanged', function () {
            SetColumnsToEqualHeight();
        });

        ControlPanel_.TranslateLabelsSVG();
    }




    // function to build the manual control module
    function BuildManualControl() 
    {
        ManualControl_ = new ManualControlInterface(EventHandler, SettingsParameter, FSMInterpreterReadyCallBack);
    }

    function AddManualControlEventHandlers()
    {
        document.addEventListener('DataArrivedFromServer', function (e) {
            ManualControl_.onData(e.detail);
        }, false);

        document.addEventListener('CommandArrived', function (e) {
            ManualControl_.onCommand(e.detail);
        }, false);

    }

    // TEST TODO 
    /*document.addEventListener('ServerInterfaceInfoArrived', function (e) {
        if(e.detail.getInfoType() == EnumServerInterfaceInfo.VisitorMode)
        {
            SetVisitorMode();
        }
    }, false);
    
    function SetVisitorMode()
    {
        SetColumnsToEqualHeight();
    }
    */
    
    // this function sets the content of the control panel to equal height
    function SetColumnsToEqualHeight() 
    {
        var WebCamImage =  $("#webcam_image");
        var DIVRightPanel = $('#DIVRightPanel');
        var BottomNavigationBar = $('#BottomNavigationBar');
        var DIVWebCam = $('#DIVWebCam');
        var WrapperFSMInterpreter = $("#WrapperFSMInterpreter");
        var AnimationDIV = $('#DIVAnimation');
        var SVG = $('#SVGAnimation');

        maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 90 - $('#TopNavigationBar').height() - BottomNavigationBar.height();

        $('.ecp-box').height(maxHeight);

        if (maxHeight <= 3 * ((DIVWebCam.width() / 4))) 
        {
            WebCamImage.height(maxHeight);
            WebCamImage.width((maxHeight / 3) * 4);
        }
        else 
        {
            WebCamImage.height(3 * ((DIVWebCam.width() / 4)));
            WebCamImage.width("100%");
        }
        
        if (SettingsParameter.Mode == "a" || SettingsParameter.Mode == "c" || SettingsParameter.Mode == "d")
        {
            SVG.width((AnimationDIV.width()/100)*80);
        }

        if (maxHeight <= DIVRightPanel.height()) {
            WrapperFSMInterpreter.height(maxHeight - maxHeight / 3);
        }

        $('#RowMainView').css('padding-bottom', BottomNavigationBar.height());

        WrapperFSMInterpreter.width("100%");

        $('.tab-pane').height((maxHeight / 4) * 3);

        WrapperFSMInterpreter.height("100%");
        
        $('.dropdown-menu').css('max-height', (maxHeight + 90).toString() + 'px');
    }

    // this function loads the webcam image dynamically
    function SetWebCam() 
    {
        if(Settings.Mode == 'a' || SettingsParameter.Mode == 'd')
        {
            if(Settings.Mode == 'd')
            {
                if(SettingsParameter.DeviceType == "MicroController" || SettingsParameter.DeviceType == "ProgrammableLogicDevice")
                {
                    $("#" + SettingsParameter.WebCamDIVName).html('<img id="webcam_image" class="img-responsive center-block" src="Images/Devices/chip.jpg">');
                    return;
                }
                else if(SettingsParameter.DeviceType == "SPSLogo8")
                {
                    $("#" + SettingsParameter.WebCamDIVName).html('<img id="webcam_image" style="width:400px!important; height:400px!important;" class="img-responsive center-block" src="Images/Devices/SPSLogo8_big.png">');
                    return;
                }
            }
            else
            {
                return;
            }
        }

        $("#" + SettingsParameter.WebCamDIVName).html('<img id="webcam_image" src="ECP/page-loader.gif" alt="progress" style="width:100%;height:100%"/>');
        WebSocketClient = new WebSocket(SettingsParameter.WebcamSocketURL);
        WebSocketClient.onopen = function (){
            WebSocketClient.send(SettingsParameter.WebcamID);
        };
        WebSocketClient.onmessage = function (Event) {
            $("#webcam_image").attr("src","data:image/png;base64,"+Event.data);

            setTimeout(function(){
                WebSocketClient.send(SettingsParameter.WebcamID);
            },SettingsParameter.WebCamPictureDelay);
        };
/*		WebSocketClient.onclose = function (Event) {
         console.log("close");
         console.log(Event);
         }*/
        WebSocketClient.onerror = function (Event) {
            SetWebCam();
//			console.log("error");
//			console.log(Event);
        }
    }
}

// event handling class - containts all the functions needed for event firing
function GlobalEventHandling() 
{
    GlobalEventHandling.prototype.fireCommandEvent = function (CommandMessage) {
        var CommandEvent = document.createEvent("CustomEvent");
        CommandEvent.initCustomEvent("CommandArrived", true, true, CommandMessage);
        document.dispatchEvent(CommandEvent);
    };

    GlobalEventHandling.prototype.fireDataReceivedEvent = function (DataMessage) {
        var DataEvent = document.createEvent("CustomEvent");
        DataEvent.initCustomEvent("DataArrivedFromServer", true, true, DataMessage);
        document.dispatchEvent(DataEvent);
    };

    GlobalEventHandling.prototype.fireDataSendEvent = function (DataMessage) {
        var DataEvent = document.createEvent("CustomEvent");
        DataEvent.initCustomEvent("DataArrivedToSend", true, true, DataMessage);
        document.dispatchEvent(DataEvent);
    };

    GlobalEventHandling.prototype.fireServerInterfaceInfoEvent = function (DataMessage) {
        var ServerInterfaceInfoEvent = document.createEvent("CustomEvent");
        ServerInterfaceInfoEvent.initCustomEvent("ServerInterfaceInfoArrived", true, true, DataMessage);
        document.dispatchEvent(ServerInterfaceInfoEvent);
    };

    /*GlobalEventHandling.prototype.fireInternalErrorEvent = function (ErrorMessage) {
        var InternalErrorEvent = document.createEvent("CustomEvent");
        InternalErrorEvent.initCustomEvent("InternalErrorArrived", true, true, ErrorMessage);
        document.dispatchEvent(InternalErrorEvent);
    };*/
    
    GlobalEventHandling.prototype.fireInternalHoverEvent = function (HoverMessage) {
        var InternalHoverEvent = document.createEvent("CustomEvent");
        InternalHoverEvent.initCustomEvent("InternalHoverEventArrived", true, true, HoverMessage);
        document.dispatchEvent(InternalHoverEvent);
    };
    
}

