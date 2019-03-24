<?php
$Locations  = Database::Locations_GetLocationInformation();
$SiteContent = "";

foreach($Locations as $Location => $Settings)
{
    $Site = Database::Navigation_SiteStartIDForLocation($Location);
    if($_SESSION['UserID'] == 0)
        $Site = 11;

    $ReplaceTags = array(
        "[[++Site++]]" => $Site,
        "[[++Location++]]" => $Location,
    );
    $SiteContent .= Functions::LoadTemplate("Templates/StartExperiment/StartLocationLine.tpl",$ReplaceTags);
}

$ReplaceTags = array(
    "[[++LocationLines++]]" => $SiteContent
);

$SiteContent = Functions::LoadTemplate("Templates/StartExperiment/StartLocation.tpl",$ReplaceTags);

include "Sites/StartExperiment/StartLocationURLs.php";