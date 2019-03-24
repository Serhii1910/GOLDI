function BEAST(EventHandler, SettingsParameter, CallBack, GetLabel)
{
//    console.log(SettingsParameter);
    this.RunningBeastController = undefined;

    let Sensors = new Array(128);
    let Actuators = new Array(128);

    for (let i = 0; i < 128; i++) {
        Sensors[i] = false;
        Actuators[i] = false;
    }

    BEAST.prototype.onCommand = function (Command)
    {
        const SimulationInterface = this.RunningBeastController.getSimulationInterface();
        if (Command.getType() === EnumCommand.Initialize)
        {
            SimulationInterface.paused = true;
            SimulationInterface.activate();
        }
        else if (Command.getType() === EnumCommand.PSPUFinishedInit)
        {
        }
        else if (Command.getType() === EnumCommand.LoadBPUExample)
        {
            //            LoadExample(Command.getParameterStringArray()[1].replace(/\\n/g, "\n").replace(/\r/g, ""));
            //            this.RunningBeastController.loadExample()
                       console.log(Command.getParameterStringArray());
        }
        else if(Command.getType() === EnumCommand.PSPURun)
        {
            SimulationInterface.activate();
            SimulationInterface.postLateCallback(() => {
                const outputs = SimulationInterface.getOutputs();
                for (const name in outputs) {
                    updateActuatorValue(name, outputs[name]);
                }
                SendData(Actuators, Sensors);
            });
            SimulationInterface.paused = false;
        }
        else if(Command.getType() === EnumCommand.PSPUStop)
        {
            SimulationInterface.paused = true;
        }
        else if(Command.getType() === EnumCommand.PSPUSingleStepActuator)
        {
            SimulationInterface.paused = false;
        }
        else if(Command.getType() === EnumCommand.PSPUSingleStepSensor)
        {
            SimulationInterface.paused = false;
        }
    };

    let updateActuatorValue = function (name, value) {
        const num = Number(name.split("ACTUATOR_Y")[1]); //TODO: Remove hack
        Actuators[num] = value;
    };

    let outputSendTimer = null;
    let outputChangeHandler = function (name, value) {
        updateActuatorValue(name, value);

        if(outputSendTimer != null)
            clearTimeout(outputSendTimer);

        outputSendTimer = setTimeout(() => {
            // console.log(`Aktuatoren: ${Actuators.map(a => a?"1":"0").join("")}`);
            // console.log(`Sensoren: ${Sensors.map(a => a?"1":"0").join("")}`);
            SendData(Actuators, Sensors);
        },100);
    };

    BEAST.prototype.onServerInterfaceInfo = function (Info)
    {
    };

    BEAST.prototype.onData = function (Data)
    {

        if(Data.getParameterStringArray()[0] !== "BPU")
        {
            Sensors = Data.getSensors();
            // console.log(Sensors);

            const SimulationInterface = this.RunningBeastController.getSimulationInterface();
            for (let i = 0; i<SettingsParameter.NumberOfSensors; i++) {
                const sensorID = "SENSOR_X" + i;
                SimulationInterface.setInput(sensorID, Sensors[i]);
            }
        }
    };

    function RefreshLabels() {
        let LabelArray = $('.ECP_Label');
        for(let i = 0; i < LabelArray.length; i++){
            LabelArray[i].textContent = GetLabel(LabelArray[i].getAttribute("LabelId"));
        }
    }

    $(document).ready(() => {
        $("body").prepend(`
            <div id="BEASTContentModal" style="display:none;z-index:10000;position:absolute;height:100%;left:0;width:100%; background-color:white">
                <div id="BEASTContent" style="width:100%;height:calc(100% - 58px);">
            
                </div>
                <div style="padding:5px; text-align:right; width:100%;height:58px;">
                    <button id="CloseBEAST" class="btn btn-primary btn-lg">Close BEAST</button>
                </div>
            </div>
        `);

        $("#DIVRightPanel").load("ECP/Simulation/BEASTInclude.html", () => {
            $("#OpenBEASTContent").click(() => {
                $("#BEASTContentModal").fadeIn();

                this.RunningBeastController.reinitUI();
            });

            $("#CloseBEAST").click(function(){
                $("#BEASTContentModal").fadeOut();
            });

            $("#BEASTContent").load("ECP/Simulation/BEAST.html", () => {
                head.js(
                    [
                        {jquery_ui_css: "Common/css/jquery-ui.min.css"},
                        {jquery_ui_js: "Common/js/jquery-ui.min.js"},
                        {bootstrap_toggle_css: "Common/css/bootstrap-toggle.min.css"},
                        {bootstrap_toggle_js: "Common/js/bootstrap-toggle.min.js"},
                        {fancytree_css: "BEAST/css/ui.fancytree.css"},
                        {context_enu_css: "BEAST/css/contextMenu.css"},
                        {context_enu_js: "BEAST/js/plugins/jquery.contextMenu.js"},
                        {fancytree_js: "BEAST/js/plugins/jquery.fancytree.js"},
                        {fancytree_context_enu_js: "BEAST/js/plugins/jquery.fancytree.contextMenu.js"},
                        {fancytree_dnd_js: "BEAST/js/plugins/jquery.fancytree.dnd.js"},
                        {fancytree_edit_js: "BEAST/js/plugins/jquery.fancytree.edit.js"},
                        {fancytree_glyph_js: "BEAST/js/plugins/jquery.fancytree.glyph.js"},
                        {spectrum_js: "BEAST/js/spectrum.js"},
                        {spectrum_css: "BEAST/css/spectrum.css"},
                        {svg_raphics_js: "BEAST/js/SVGGraphics.js"},
                        {event_queue_js: "BEAST/js/event_queue.js"},
                        {simcir_css: "BEAST/css/simcir.css"},
                        {dialog_js: "BEAST/js/Dialog.js"},
                        {common_js: "BEAST/js/controller/common.js"},
                        {parameter_inputs_js: "BEAST/js/workspace/ParameterInputs.js"},
                        {parameter_dialog_js: "BEAST/js/workspace/ParameterDialog.js"},
                        {workspace_js: "BEAST/js/workspace/workspace.js"},
                        {simulation_interface_js: "BEAST/js/workspace/SimulationInterface.js"},
                        {main_js: "BEAST/js/workspace/main.js"},
                        {editor_controller_js: "BEAST/js/controller/editorController.js"},
                        {workspace_controller_js: "BEAST/js/controller/workspaceController.js"},
                        {modle_js: "BEAST/js/model/model.js"},
                        {menubar_controller_js: "BEAST/js/controller/menubarController.js"},
                        {tree_controller_js: "BEAST/js/fancytree/treeController.js"},
                        {beast_controller_js: "BEAST/js/controller/BeastController.js"},
                        {embedded_beast_controller_js: "BEAST/js/controller/EmbeddedBeastController.js"},
                        {simcir_builtins_js: "BEAST/js/simcir/simcir-builtins.js"},
                        {basicset_css: "BEAST/css/simcir-basicset.css"},
                        {grid_builder: "BEAST/js/simcir/GridBuilder.js"},
                        {basicset_js: "BEAST/js/simcir/simcir-basicset.js"},
                        {simcir_dso_js: "BEAST/js/simcir/simcir-dso.js"},
                        {simcir_transmitter_js: "BEAST/js/simcir/simcir-transmitter.js"},
                        {beast_ui_css: "BEAST/css/BEAST-UI.css"}
                    ],
                    () => {
                        let sensors = {};
                        for (let i = 0; i<SettingsParameter.NumberOfSensors; i++) {
                            const sensorID = "SENSOR_X" + i;
                            sensors[sensorID] = GetLabel(sensorID);
                        }

                        let actuators = {};
                        for (let i = 0; i<SettingsParameter.NumberOfActuators; i++) {
                            const actuatorID = "ACTUATOR_Y" + i;
                            actuators[actuatorID] = GetLabel(actuatorID);
                        }

                        this.RunningBeastController = new EmbeddedBeastController(() => {
                            this.RunningBeastController.initVersion();

                            const SimulationInterface = this.RunningBeastController.getSimulationInterface();
                            SimulationInterface.onOutputChange(outputChangeHandler);

                            CallBack();
                            RefreshLabels();
                        }, sensors, actuators, SettingsParameter.ECPPhysicalSystemName); //test42
                    }
                );
            });
        });
    });

    function SendData(Actuators_, Sensors_)
    {
        let Message = new DataMessage();
        Message.setActuators(Actuators_);
        Message.setSensors(Sensors_);

        let Type = ["BPU"];
        Message.setParameterStringArray(Type);
        EventHandler.fireDataSendEvent(Message);
    }
}