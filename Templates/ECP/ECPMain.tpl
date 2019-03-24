<!DOCTYPE html>
<html>
<head>
    <title>[[++ECPTitle++]]</title>
    <meta charset="UTF-8">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="pragma" content="no-cache">
    <link rel="icon" type="image/x-icon" href="Images/favicon.ico">
    <script type="application/javascript" src="ECP/Frameworks/js/head.min.js"></script>
    <script>
        head.js(
                {jquery: "Common/js/jquery.min.js"},
                {bootstrapcss: "Common/css/bootstrap.min.css"},
                {supernicecss: "Common/css/Supernice.min.css"},
                //{beastcss: "BEAST/css/bootstrap-theme.css"},
                {bootstrap: "Common/js/bootstrap.min.js"},
                {ecpcss: "ECP/ECP.css"},
                {GOLDiFischCSS: "Style/GOLDiFisch.css"},
                {Enumerations: "ECP/Enumerations.js"},
                {ServerInterface: "ECP/ServerInterface/ServerInterface.js"},
                {Message: "ECP/ServerInterface/Message.js"},
                {Log: "ECP/ServerInterface/Log.js"},
                {ControlPanel: "ECP/ControlPanel/ControlPanel.js"},
                {filesaver: "ECP/Frameworks/js/FileSaver.min.js"},
                {snap: "ECP/Frameworks/js/snap.svg-min.js"},
                {snapSlider: "ECP/Frameworks/js/snap.svg-slider.js"},
                {globalfunctions: "functions.js"},

                {Labels: "index.php?Function=ECPGetLanguageClass&[[++LabelsHTTPQuery++]]"},

                // Model dependent files
                {AnimationClass: "ECP/Animation/Animation.js"},
                {Animation: "ECP/Animation/Animation_[[++PSPUType++]].js"},
                {AnimationInterface: "ECP/Animation/AnimationInterface.js"},

[[++LoadedModules++]]

                // ECP main (top level instance)
                {ECPMain: "ECP/ECPMain.js"}
        );

    </script>
</head>
<body>
<!--div class="loader"></div-->
<script>
    head.ready("ECPMain", function () {
        //called when all scripts have been loaded
        $.getJSON("index.php?Function=Settings&[[++ECPMainHTTPQuery++]]", function(data)
        {
            Settings = data[0];
            Settings.CurrentLanguage = localStorage.locale;
            ECPMain_ = new ECPMain(Settings);
        });
    });
</script>
<div id="DIVControlPanel">
</div>

<div id="ExperimentConnectingModal" class="modal fade bs-example-modal-sm" data-backdrop="static">
    <div class="modal-dialog modal-dialog-center">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title ECP_Label" LabelId="ECP_CONNECTING"></h3>
            </div>
            <div class="modal-body">
                <span id="bodyBlock"></span>
                <br/>
                <p style="text-align: center">
                    <img src="ECP/page-loader.gif" alt="progress" style="width:100px;height:100px"/>
                </p>
            </div>
        </div>
    </div>
</div>

</body>
</html>