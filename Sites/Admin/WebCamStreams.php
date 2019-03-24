<?php
$SiteContent = "";

$Locations  = Database::Locations_GetLocationInformation();

if(isset($_REQUEST['Admin']) AND isset($Locations[$_REQUEST['Admin']])){
    $Settings = $Locations[$_REQUEST['Admin']];

    $ReplaceTags = array(
        "[[++Location++]]" => $_REQUEST['Admin'],
        "[[++URL++]]" => $Settings['WebcamSocket']
    );

    $SiteContent = Functions::LoadTemplate("Templates/StartExperiment/StartLocationURL.tpl",$ReplaceTags);
    $SiteContent .= Functions::LoadTemplate("Templates/Admin/AdminWebcamStream.tpl",$ReplaceTags);
}

