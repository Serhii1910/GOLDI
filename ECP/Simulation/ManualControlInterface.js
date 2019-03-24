function ManualControlInterface(EventHandler, SettingsParameter, CallBack) {
    let MC = new ManualControl(EventHandler, SettingsParameter, CallBack);

    this.onData = function (Data){
        MC.onData(Data);
    };

    this.onCommand = function (Command){
        MC.onCommand(Command);
    };
}