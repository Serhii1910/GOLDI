<script type="text/javascript" src="JavaScript/StartExperiment.js"></script>
<script type="text/javascript" src="JavaScript/StartLocation.js"></script>

<input id="Location" class="hidden" location="[[++Location++]]" url="[[++URL++]]">
<!--div id="GoldiTranslations" class="hidden" Attention = "[[**Attention**]]" SelectBPU ="[[**SelectBPU**]]" SelectPSPU ="[[**SelectPSPU**]]" SelectBPUPSPU ="[[**SelectBPUPSPU**]]" ExperimentNotAvailable="[[**ExperimentNotAvailable**]]"></div-->
<!--div id="GoldiTranslations" class="hidden" Attention = "[[**Attention**]]" Virtual="[[**Virtual**]]" Real ="[[**Real**]]" SelectBPU ="[[**SelectBPU**]]" SelectPSPU ="[[**SelectPSPU**]]" SelectBPUPSPU ="[[**SelectBPUPSPU**]]" ExperimentNotAvailable="[[**ExperimentNotAvailable**]]"></div-->

<div id="StartError">
    [[++ErrorServerOffline++]]
</div>

<div id="StartContent" class="hidden">
    <div class="panel" style="margin:0px">
        <!--div class="panel-heading"-->
        <h4 class="tag" data-i18n="BPU" style="padding:0px; margin:0px 0px 5px 0px"></h4>
        <div class="panel-body" id="panelBPU" style="padding:0px">
            <div id="BPUContainer" class="row">
                <div id="BPUTemplate" class="hidden col-lg-2 col-md-3 col-sm-4 col-sx-6;" style="padding:0px 15px 0px 0px; margin:0px 0px 15px 0px;">
                    <div class="goldi-bpu panel" style="margin:0px;">
                        <div class="gray_out_bpu" style="position:absolute; width:99%; height:100%; background-color:white; z-index:999; opacity:0.8" hidden></div>
                        <div class="panel-heading text-center btn-success" style="padding:4px; font-size:15px">
                            <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin:0px" class="tag" data-i18n=""></p>
                        </div>
                        <div class="panel-body" style="background-color: #DDDDDD; padding:0px 0px 3px 0px">
                            <div class="row" style="text-align: center">
                                <div class="col-md-12" id="Img">
                                    <img src="Images/Devices/Dummy.png">
                                </div>
                                <div class="col-md-12" style="margin:2px; height:35px">
                                    <input class="goldi-toggle" id="toggle-" type="checkbox" data-onstyle="danger" data-offstyle="success">
                                    <input disabled class="btn btn-danger virtual" type="button" value="Virtual" style="display:none; width:120px">
                                    <input disabled class="btn btn-success real" type="button" value="Real" style="display:none; width:120px">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="panel" style="margin:0px">
        <!--div class="panel-heading"-->
        <h4 class="tag" data-i18n="PSPU" style="margin:0px 0px 5px 0px"></h4>
        <div class="panel-body" id="panelPSPU" style="padding:0px">
            <div id="PSPUContainer" class="row">
                <div id="PSPUTemplate" class="hidden col-lg-2 col-md-3 col-sm-4 col-sx-6;" style="padding:0px 15px 0px 0px; margin:0px 0px 15px 0px;">
                    <div class="goldi-pspu panel" style="margin:0px;">
                        <div class="gray_out_pspu" style="position:absolute; width:99%; height:100%; background-color:white; z-index:999; opacity:0.8" hidden></div>
                        <div class="panel-heading text-center btn-success" style="padding:4px; font-size:15px">
                            <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin:0px" class="tag" data-i18n=""></p>
                        </div>
                        <div class="panel-body" style="background-color: #DDDDDD; padding:0px 0px 3px 0px">
                            <div class="row" style="text-align: center">
                                <div class="col-md-12" id="Img">
                                    <img src="Images/Devices/Dummy.png">
                                </div>
                                <div class="col-md-12" style="margin:2px; height:35px">
                                    <input class="goldi-toggle" id="toggle-" type="checkbox" data-onstyle="danger" data-offstyle="success">
                                    <input disabled class="btn btn-danger virtual" type="button" value="Virtual" style="display:none; width:120px">
                                    <input disabled class="btn btn-success real" type="button" value="Real" style="display:none; width:120px">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="text-center" style="margin-top:15px;">
        <button id="StartExperimentButton" type="button" class="btn btn-success btn-default btn-lg tag" data-i18n="StartExperiment"></button>
        <button id="EnqueueUserButton" type="button" class="btn btn-default btn-warning btn-lg tag" data-i18n="EnqueueUser"></button>
        <button id="InfoText" disabled type="button" class="btn btn-danger btn-lg tag" data-i18n="ExperimentNotAvailable"></button>
        <button id="StartBooking" type="button" class="btn btn-info btn-default btn-lg tag" style="margin-left:50px" data-i18n="StartBooking"></button>
    </div>

    <!--div class="row">
        <div class="col-lg-6">
        </div>
        <div class="col-lg-6 text-danger">
        </div>
    </div>
    </p-->
</div>

<div id="InfoDialog" class="modal fade" data-backdrop="true">
    <div class="modal-dialog">
        <div id="ErrorDialogContent" class="modal-content">
			<div>
				<div class="modal-header alert alert-danger" role="alert" style="text-align:center;">
					<h4 class="modal-title tag" data-i18n="Attention"></h4>
				</div>
				<dl class="modal-body" id="InfoText" style="text-align:center;">
				</dl>
				<div class="modal-footer" style="text-align:center;">
					<button type="button" class="btn btn-default" data-dismiss="modal">OK</button>
				</div>
			</div>
        </div>
    </div>
</div>

<!-- div vom row - begonnen in der sidebar -->
</div>

<!-- div vom container - begonnen in der sidebar -->
</div>