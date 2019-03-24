<?php


$HardwareConfigurations = Database::Firmware_GetKnownHardwareConfiguration();
$HardwareConfigurationOptionString = "";
foreach ($HardwareConfigurations as $HardwareConfiguration){
    $HardwareConfigurationOptionString .= Functions::LoadTemplate("Templates/Admin/UploadFirmware_HardwareConfig.tpl",[
        "[[++value++]]" => $HardwareConfiguration["HWConfigID"],
        "[[++option++]]" => $HardwareConfiguration["BoardType"]." (".$HardwareConfiguration["HardwareVersion"].")"
    ]);
}



$SiteContent = Functions::LoadTemplate("Templates/Admin/UploadFirmware.tpl",[
    "[[++options++]]" => $HardwareConfigurationOptionString
]);

/*
            var formData = new FormData($('#UploadForm')[0]);
            $.ajax({
                url: 'index.php?Function=UploadFile',  //Server script to process data
                type: 'POST',
                //Ajax events
                //beforeSend: BeforeSendHandler,
                success: CompleteHandler,
                error: ErrorHandlerAjax,
                // Form data
                data: formData,
                //Options to tell jQuery not to process data or worry about content-type.
                cache: false,
                contentType: false,
                processData: false
            });
 */


/*
            <form id="UploadForm" action="upload.php" method="post" enctype="multipart/form-data">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                                class="sr-only">Close</span></button>
                        <h4 class="modal-title">File upload</h4>
                    </div>
                    <div id="UploadDialogContent" class="modal-body">
                        <input id="FileUpload" type="file" name="UserFile" data-bfi-disabled>
                    </div>
                    <div class="modal-footer">
                        <div style="float:left" id="UploadDialogFooterInfo"></div>
                        <button id="UploadFileButton" type="button" class="btn btn-primary" disabled>Upload</button>
						<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </form>

 */

/*
    $Result = Database::Experiment_UploadFileToDatabase($_FILES, $ExperimentID);

 */

/*
        if(!empty($File) && $File['UserFile']['size'] > 0 && $File['UserFile']['size'] < 102400)
        {
            Database::Experiment_CleanOldProgrammingFiles();

            $FP = fopen($File['UserFile']['tmp_name'], 'r');
            $Content = fread($FP, $File['UserFile']['size']);
            $Content = addslashes($Content);
            fclose($FP);

            $FileName = addslashes($File['UserFile']['name']);

            $Query = "INSERT INTO `ProgrammingFiles` (`ExperimentID`, `FileName`, `File`, `Timestamp`, `FileSize`) VALUES ('$ExperimentID','$FileName','$Content','".time()."', " . $File['UserFile']['size'] . ")";

            $Result = Database::Query($Query);

            if($Result)
                return true;
        }

        return false;

 */