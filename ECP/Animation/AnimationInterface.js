function AnimationInterface(EventHandler, SettingsParameter, CallBack){
    let Ani = new Animation(EventHandler, SettingsParameter, CallBack);

    this.onCommand = function(Command){
        return Ani.onCommand(Command);
    };

    this.onData = function(DataArg){
        return Ani.onData(DataArg);
    };

    this.onServerInterfaceInfo = function (Info) {
        return Ani.onServerInterfaceInfo(Info);
    };

    this.onHoverEvent = function (HoverData) {
        return Ani.onHoverEvent(HoverData);
    };
}