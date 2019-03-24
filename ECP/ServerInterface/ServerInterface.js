//***************************************
//*
//* This file defines the classes used for server interface
//*
//* It receives data from the GOLDi server and fires an event or receives an event to send data to the server
//*
//***************************************
/**
 * @param {GlobalEventHandling} EventHandler 
 * @param {JSON} SettingsParameter
 * @return none
 */
function ServerInterface(EventHandler, SettingsParameter) 
{
    // Public methods
    
    /**
     * Public function
     * called when a command arrives
     * @param {CommandMessage} Command 
     * @return none
     */
    ServerInterface.prototype.onCommand = function (Command) 
    {
        // If the command does not come from the server interface
        if (Command.getSender() != "ServerInterface") 
        {
            // If not waiting for an ack
            if(!WaitingForAckReceive) 
            {
                // Set flag and send command right away
                WaitingForAckReceive = true;
                SendCommand(Command.getType(), Command.getParameterStringArray());
            }
            // Else push command on the command fifo queue
            else PushCommand(Command.getType(), Command.getParameterStringArray());
        }
    };
    
    /**
     * Public function
     * called when data arrives
     * @param {DataMessage} Data 
     * @return none
     */
    ServerInterface.prototype.onData = function (Data) 
    {
        // Send data
        if(Data.getParameterStringArray() == "SIM")
        {
            //Do not send out any Simulation Data
            //Simulation Data will pass through vPSPU and will be sent as PSPU Data
            return;
        }
        HandleDataToSend(Data);
    };

    // WebSocket declaration
    var WebSocketClient = undefined;
    
    // Command timeout handling - currently not used
    var CommandAckTimeOut = 1000;
    var CommandTimeOutTimer;
    
    // Command FIFO queue declaration
    var CommandFIFO = [];
    
    // Waiting for ack-flag
    var WaitingForAckReceive = false;

    // Private methods
     
    /**
     * Private function
     * Establishes websocket connection to the GOLDi server - is called on instantiation
     * @param none
     * @return none
     */
    function Connect() 
    {
        let keepAliveWebsocketTimer = null;
        // Create the connection in case of a non-virtual mode
        if(SettingsParameter.Mode != "a")
        {
            // Establish websocket connection
            WebSocketClient = new WebSocket(SettingsParameter.DataSocketURL);

            // Handler for received messages
            WebSocketClient.onmessage = function (Event) 
            {
                //debug(Event.data);
                var Message = Event.data;
                HandleReceivedMessage(Message);
            };
            
            // Handler called when the websocket connection is closed
            WebSocketClient.onclose = function () 
            {
                // websocket is closed.
                debug("Command connection closed...");
                debug("Warning: Disconnected from websocket server! Your session has ended.");
                alert("Warning: Disconnected from websocket server! Your session has ended. Your browser window will be closed");
                
                // tell ECP that the connection is closed
                var InitializeMessage = new ServerInterfaceInfoMessage();
                InitializeMessage.setInfoType(EnumServerInterfaceInfo.Disconnect);
                EventHandler.fireServerInterfaceInfoEvent(InitializeMessage);
                //window.close();

                clearInterval(keepAliveWebsocketTimer);
            };
            
            // Handler called when the websocket connection is established
            WebSocketClient.onopen = function ()
            {
                setTimeout(()=>{
                    $("#ExperimentConnectingModal").modal("hide");
                },1000);

                debug("Login");
                Login();

                keepAliveWebsocketTimer = setInterval(Login,1000 * 30);

                // Tell ECP that the connection is established
                var InitializeMessage = new ServerInterfaceInfoMessage();
                InitializeMessage.setInfoType(EnumServerInterfaceInfo.Connect);
                EventHandler.fireServerInterfaceInfoEvent(InitializeMessage);
            };
        }
        else
        {
            // Virtual mode - only temporary
            var InitializeMessage = new ServerInterfaceInfoMessage();
            InitializeMessage.setInfoType(EnumServerInterfaceInfo.Connect);
            EventHandler.fireServerInterfaceInfoEvent(InitializeMessage);
        }
    }

    /**
     * Private function
     * Logs in at the GOLDi server
     * @param none
     * @return none
     */
    function Login() 
    {
        if (WebSocketClient.readyState == 1)
        {
           SendCommand(EnumCommand.NoOperation,[]);
        }
    }

    /**
     * Private function
     * Handles received commands
     * @param {JSON string} Message
     * @return none
     */
    function HandleReceivedCommand(Message) 
    {
        //debug(Message);
        var Segments = JSON.parse(Message);
        var Message = new CommandMessage();

        var MessageCommand = Segments.Command;
        Message.setType(MessageCommand);
        
        // If there are parameters ...
        if(Segments.Parameter != null)
        {
            var ParameterStringArray = [];
            // .. push them on the parameter array
            for (var i = 0; i < Segments.Parameter.length; i++) 
            {
                ParameterStringArray.push(Segments.Parameter[i]);
            }

            Message.setParameterStringArray(ParameterStringArray);
        }
        
        // Send command to the ECP modules
        Message.setSender("ServerInterface");
        EventHandler.fireCommandEvent(Message);
        
        // If the message was an acknowledgement
        if(MessageCommand == EnumCommand.Acknowledge)
        {
            HandleAckReceive();
        }
    }
    
    /**
     * Private function
     * Called when an acknowledgement is received
     * @param none
     * @return none
     */
    function HandleAckReceive()
    {
        // Timeout handling - currently unused
        //clearInterval(CommandTimeOutTimer);
        
        // Ff there are commands in the queue
        if(CommandFIFO.length != 0)
        {
            // send the next command
            SendCommand(CommandFIFO[0][0],CommandFIFO[0][1]);
            CommandFIFO.shift();
        }    
        // If it was the last command, clear flag
        else WaitingForAckReceive = false;
    }

    /**
     * Private function
     * Handles a received message from the websocket
     * @param {JSON string} Data
     * @return none
     */
    function HandleReceivedMessage(Data) 
    {
        var ReceivedMessage = JSON.parse(Data);
    
        // If message contains data
        if(ReceivedMessage.Command == EnumCommand.NoOperation)
        {
            var Message = new DataMessage();
            var Sensors = [];
            
            // Get sensors
            for (var i = 0; i < 128; i++)
            {
                if (ReceivedMessage.Sensors != null)
                    Sensors[i] = ReceivedMessage.Sensors[i] != "0";
                else 
                    Sensors[i] = false;
            }
            
            var Actuators = [];
            
            // Get actuators
            if(ReceivedMessage.Actuators != null)
            {
                for (var i = 0; i < 128; i++)
                {
                    Actuators[i] = ReceivedMessage.Actuators[i] != "0";
                }
            }
            
            var Parameters = [];
            
            var ParameterStringArray = ReceivedMessage.Parameter;
            
            // Get parameters
            if (ParameterStringArray != null)
            {
                if(ParameterStringArray.length == 0)
                {
                    Message.Parameter = null;
                }
                else
                {
                    for (var i = 0; i < ParameterStringArray.length; i++) 
                    {
                        Parameters.push(ParameterStringArray[i]);
                    }
                    
                    Message.setParameterStringArray(Parameters);
                }
            }
            else Message.Parameter = null;
            
            // Send data to the ECP modules
            Message.setActuators(Actuators);
            Message.setSensors(Sensors);

            EventHandler.fireDataReceivedEvent(Message);
        }
        // If message contains a command
        else HandleReceivedCommand(Data);
    }

    /**
     * Private function
     * Handles data to send via the websocket
     * @param {JSON string} Data
     * @return none
     */
    function HandleDataToSend(Data) 
    {
        //if(SettingsParameter.Mode == 'c')
        var Sensors = Data.getSensors();
        
        // Get sensors
        var Sensors_ = [];
        for (var i = 0; i < 128; i++)
        {
            if (Sensors[i] == false) 
            {
                Sensors_[i] = "0";
            }
            else {
                Sensors_[i] = "1";
            }
        }
            
        var Actuators = Data.getActuators();
        var Actuators_ = [];
        
        // Get actuators
        for (var i = 0; i < 128; i++)
        {
            if (Actuators[i] == false) 
            {
                Actuators_[i] = "0";
            }
            else {
                Actuators_[i] = "1";
            }
        }
        
        // Send data
        var Type = Data.getParameterStringArray();
        SendData(Sensors_, Actuators_, Type);
    }

    /**
     * Private function
     * Sends data via websocket
     * @param {Array} Sensors
     * @param {Array} Actuators
     * @param {String array} ParameterStringArray
     * @return none
     */
    function SendData(Sensors, Actuators, ParameterStringArray) 
    {
        if (WebSocketClient != undefined) 
        {
            // If the websocket connection is (still) established
            if (WebSocketClient.readyState == 1) 
            {

                // Build message
                var Message = {};
                Message.SessionID = SettingsParameter.SessionID;
                Message.ExperimentID = SettingsParameter.ExperimentID;
                Message.Command = 0;
                Message.Parameter = null;
                Message.Actuators = Actuators;
                Message.Sensors = Sensors;
                
                var Parameters = [];
                
                // Get parameters
                if(ParameterStringArray.length == 0)
                {
                    Message.Parameter = null;
                }
                else
                {
                    for (var i = 0; i < ParameterStringArray.length; i++) 
                    {
                        Parameters.push(ParameterStringArray[i]);
                    }
                    
                    Message.Parameter = Parameters;
                }
                
                // Build string from json object
                var StringToSend = JSON.stringify(Message);
                
                // Send string via websocket
                return WebSocketClient.send(StringToSend);
            }
        }
    }

    /**
     * Private function
     * Sends incoming commands via websocket
     * @param {EnumCommand} Command
     * @param {String array} ParameterStringArray
     * @return none
     */
    function SendCommand(Command, ParameterStringArray) 
    {
        if (WebSocketClient != undefined) 
        {
            // If the websocket connection is (still) established
            if (WebSocketClient.readyState == 1) 
            {
                // timeout timer - temporarily not used
                /*CommandTimeOutTimer = setInterval(function () {
                    debug("TIMEOUT!");
                }, CommandAckTimeOut);
                */
                
                // Build message                
                var Message = {};
                Message.SessionID = SettingsParameter.SessionID;
                Message.ExperimentID = SettingsParameter.ExperimentID;
                Message.Command = Command;
                Message.Parameter = {};
                Message.Actuators = null;
                Message.Sensors = null;
                
                var Parameters = [];
                
                // Get parameters
                if(ParameterStringArray.length == 0)
                {
                    Message.Parameter = null;
                }
                else
                {
                    for (var i = 0; i < ParameterStringArray.length; i++) 
                    {
                        Parameters.push(ParameterStringArray[i]);
                    }
                    
                    Message.Parameter = Parameters;
                }
                
                // Build string from json object
                var StringToSend = JSON.stringify(Message);
                
                // Send string via websocket
                return WebSocketClient.send(StringToSend); 
            }
        }
    }
    
    /**
     * Private function
     * Pushes command on command fifo queue
     * @param {EnumCommand} Type
     * @param {String array} ParameterStringArray
     * @return none
     */
    function PushCommand(Type, ParameterStringArray)
    {
        CommandFIFO.push([Type,ParameterStringArray]);
    }
    
    // Call the connect function on instantiation
    Connect();
}