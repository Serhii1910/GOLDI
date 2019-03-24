function VirtualPSPUInterface(EventHandler, SettingsParameter){
    let VPSPU = new VirtualPSPU(EventHandler, SettingsParameter);

    this.onCommand = function(Command){
        return VPSPU.onCommand(Command);
    };

    this.onData = function(DataArg){
        return VPSPU.onData(DataArg);
    };
}