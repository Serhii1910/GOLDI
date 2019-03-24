function ManualControlObject (Objects, Key, CallBackPress, CallBackRelease){
    if(Objects == undefined){
        this.Objects = [];
    }else{
        this.Objects = Array.isArray(Objects) ? Objects : [Objects];
    }

    this.SetEnabled = function(){
        for(let i=0; i<this.Objects.length; i++)
            this.AbstractSetEnabled(this.Objects[i]);
    };

    this.AbstractSetEnabled = function(Object){
        Object.attr("fill", "#FBD7BB");
    };

    this.SetDisabled = function(){
        for(let i=0; i<this.Objects.length; i++)
            this.AbstractSetDisabled(this.Objects[i]);
    };

    this.AbstractSetDisabled = function(Object){
        Object.attr("fill", "#CCCCCC");
    };

    this.SetActive = function(){
        for(let i=0; i<this.Objects.length; i++)
            this.AbstractSetActive(this.Objects[i]);
    };

    this.AbstractSetActive = function(Object){
        Object.attr("fill", "#FFFF00"); // Default: Switching between yellow and dark yellow
    };

    this.Translate = function(DX, DY){
        for(let i=0; i<this.Objects.length; i++)
            this.AbstractTranslate(this.Objects[i],DX,DY);
    };

    this.AbstractTranslate = function(Object, DX, DY){
        Object.transform("translate("+DX+","+DY+")");
    };

    this.SetAttributes = function(Attributes){
        for(let i=0; i<this.Objects.length; i++)
            this.AbstractSetAttributes(this.Objects[i],Attributes);
    };

    this.AbstractSetAttributes = function(Object, Attributes){
        Object.attr(Attributes);
    };

    if (this.GetManualControl != undefined) {
        if (Key != undefined) {
            let Body = $("Body");
            if (CallBackPress != undefined)
                Body.keydown((event) => {
                    if (
                        this.GetManualControl().PSPU_Running &&
                        (
                            event.which == Key.toUpperCase().charCodeAt(0) ||
                            event.which == Key.toUpperCase().charCodeAt(0)
                        )
                    ) {
                        CallBackPress();
                        this.GetManualControl().Refresh();
                    }
                });

            if (CallBackRelease != undefined)
                Body.keyup((event) => {
                    if (
                        this.GetManualControl().PSPU_Running &&
                        (
                            event.which == Key.toUpperCase().charCodeAt(0) ||
                            event.which == Key.toUpperCase().charCodeAt(0)
                        )
                    ) {
                        CallBackRelease();
                        this.GetManualControl().Refresh();
                    }
                });
        }

        if (CallBackPress != undefined)
            $.each(this.Objects, (Index, Object) => {
                Object.mousedown(() => {
                    if (this.GetManualControl().PSPU_Running) {
                        CallBackPress();
                        this.GetManualControl().Refresh();
                    }
                });
            });

        if (CallBackRelease != undefined)
            $.each(this.Objects, (Index, Object) => {
                Object.mouseup(() => {
                    if (this.GetManualControl().PSPU_Running) {
                        CallBackRelease();
                        this.GetManualControl().Refresh();
                    }
                });
            });
    }
}

function ManualControl(EventHandler, SettingsParameter, CallBack)
{
    ManualControlObject.prototype.GetManualControl = ()=>{
        return this;
    };

    this.PSPU_Running = false;

    this.Sensors = [];
    this.Actuators = [];

    this.ControlElements = [];

     for (let i = 0; i < 128; i++)
    {
        this.Actuators[i] = false;
        this.Sensors[i] = false;
    }

    this.onData = function (Data)
    {
        if(this.PSPU_Running && Data.getSensors()[0] != undefined){
            this.Sensors = Data.getSensors();
            this.Refresh();
        }
    };

    this.onCommand = function (Command)
    {
        if (Command.getType() == EnumCommand.PSPURun) {
            this.EnableAllControls();
            this.SendAllActuatorsFalse();
        }
        if (Command.getType() == EnumCommand.PSPUStop ||
            Command.getType() == EnumCommand.PSPUErrorCode ||
            Command.getType() == EnumCommand.PSPUReachedBreakpoint ||
            Command.getType() == EnumCommand.PSPUReachedSingleStepActuator ||
            Command.getType() == EnumCommand.PSPUReachedSingleStepSensor)
        {
            this.DisableAllControls();
            this.SendAllActuatorsFalse();
        }
    };

    this.Initialize = function(){
        $("#" + SettingsParameter.RightPanelDIVName).load("ECP/Simulation/ManualControl_"+SettingsParameter.ECPPhysicalSystemName+".svg", () => {
            this.BuildUserControlPanelContent();
            // $.each(this.ControlElements, (Index,Element)=>{
            //     Element.SetManualControl();
            // });
            CallBack();
        });
    };

    this.EnableAllControls = function(){
        this.PSPU_Running = true;

        $.each(this.ControlElements, (Index,Element)=>{
            Element.SetEnabled();
        });
    };

    this.DisableAllControls = function(){
        this.PSPU_Running = false;

        $.each(this.ControlElements, (Index,Element)=>{
            Element.SetDisabled();
        });
    };

    this.SendAllActuatorsFalse = function(){
        let Actuators = [];
        for(let i=0;i<=29;i++)
            Actuators.push([i,false]);
        this.SendActuators(Actuators);
    };

    this.SendActuators = function(Actuator, Value)
    {
        if(!this.PSPU_Running)
            return;

        let FullModelActuatorsArray = new Array(128);

        if(Actuator instanceof Array){
            for (let i = 0; i < 128; i++)
                FullModelActuatorsArray[i] = this.Actuators[i];

            for(let i = 0; i < Actuator.length; i++){
                FullModelActuatorsArray[Actuator[i][0]] = Actuator[i][1];
                this.Actuators[Actuator[i][0]] = Actuator[i][1];
            }
        }else{
            for (let i = 0; i < 128; i++)
                if (i == Actuator){
                    FullModelActuatorsArray[i] = Value;
                    this.Actuators[i] = Value;
                }else{
                    FullModelActuatorsArray[i] = this.Actuators[i];
                }
        }

        let Message = new DataMessage();
        Message.setSensors(this.Sensors);
        Message.setParameterStringArray(["BPU"]);
        Message.setActuators(FullModelActuatorsArray);
        EventHandler.fireDataSendEvent(Message);
    };

    this.Initialize();
}