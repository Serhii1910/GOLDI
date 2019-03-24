<?php
$Location = Database::Navigation_GetSiteTagFromSiteID($_REQUEST['Site']);
$Location = str_replace("SiteStart","",$Location);

$Locations = Database::Locations_GetLocationInformation();

$ReplaceTagsTMP = array(
    '[[++ErrorMessage++]]' => "ErrorServerOffline"
);

$ReplaceTags = array(
    "[[++ErrorServerOffline++]]" => Functions::LoadTemplate("Templates/ShowError.tpl",$ReplaceTagsTMP),
    "[[++Location++]]" => $Location,
    "[[++URL++]]" => $Locations[$Location]["DataSocket"]
);

$SiteContent = Functions::LoadTemplate("Templates/StartExperiment/StartExperiment.tpl",$ReplaceTags);

include "Sites/StartExperiment/StartLocationURLs.php";