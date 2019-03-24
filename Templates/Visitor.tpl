<script type="text/javascript" src="JavaScript/Visitor.js"></script>
<h1 class="tag" data-i18n="SiteVisitorHeadline"></h1>
<br>
<p class="tag" data-i18n="SiteVisitorText"></p>
<p><span class="tag" data-i18n="SiteVisitorAvailableExperimentsText"></span> : <b id="RunningExperiments"></b></p>
<br>

<div id="ButtonContainer" class="center-block" style="max-width:500px">

    <div id="ExperimentTemplate" class="hidden">
        <p>&nbsp;</p>
        <button type="button" class="btn btn-block btn-default">

            <div class="row">

                <div class="col-md-4 col-lg-4 col-sm-4 vcenter">
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-md-12 col-xs-8">
                            <img alt="PSPU" class="img1 btn tag" data-src="holder.js/300x300"
                                 data-i18n=""
                                 style="position:relative; z-index:1; margin-bottom:40px;"
                                 src="Images/Devices/Dummy.png">  <!-- PSPUImageName -->

                            <img alt="BPU" class="img2 tag" data-src="holder.js/300x300"
                                 data-i18n=""
                                 style="width: 50px; height: 50px; position: relative;z-index: 2;top: 40px; left: -40px;border: 2px solid #0055BB;box-shadow: 5px 5px 5px #888888;"
                                 src="Images/Devices/Dummy.png"> <!-- BPUImageName -->
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-4">
                            <img alt="BPU" class="loc" data-src="holder.js/70x70" src="Images/Locations/Logo/Dummy.png">
                        </div>
                    </div>
                </div>  <!-- col-md-4 Ende -->

                <div class="col-md-8 col-lg-8 col-sm-8">

                    <h3 style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        <span id="PSPUName" class="tag" data-i18n=""></span>
                        (<span id="PSPUVirtual" class="tag" data-i18n=""></span>)
                    </h3>
                    <h4 style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        <span id="BPUName" class="tag" data-i18n=""></span>
                        (<span id="BPUVirtual" class="tag" data-i18n=""></span>)
                    </h4>

                    <br>
                    <p style="padding-left:10px; padding-right:10px">
                        <span class="pull-left tag" data-i18n="StartTime"></span>
                        <strong id="StartTime" class="pull-right"><!-- StartTime --></strong>
                        <br>

                        <span class="pull-left tag" data-i18n="EndTime"></span>
                        <strong id="EndTime" class="pull-right"><!-- EndTime --></strong>
                        <br>

                        <span class="pull-left tag" data-i18n="RemainingTime"></span>
                        <strong id="RemainingTime" class="pull-right"><!-- RemainingTime --></strong>
                        <br>

                        <span class="pull-left tag" data-i18n="NumbersOfError"></span>
                        <strong id="NumberOfErrors" class="pull-right"><!-- NumberOfError --></strong>
                        <br>

                        <span class="pull-left tag" data-i18n="ExperimentID"></span>
                        <strong id="ExperimentID" class="pull-right"><!--ExperimentID--></strong>
                        <br>

                        <span class="pull-left tag" data-i18n="Location"></span>
                        <strong id="Location" class="pull-right"><!--ExperimentID--></strong>
                        <br>
                    </p>
                </div>
            </div>
        </button>
    </div>

</div>