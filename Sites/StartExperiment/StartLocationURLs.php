<?php
// This could be included, if you want to add all locations with their settings as hidden inputs.
// On this way the "JavaScript/StartLocation.js" gets its information about testing all locations via socket connection.
$Locations  = Database::Locations_GetLocationInformation();

foreach($Locations as $Location => $Settings)
{
    $ReplaceTags = array(
        "[[++Location++]]" => $Location,
        "[[++URL++]]" => $Settings['DataSocket']
    );
    $SiteContent .= Functions::LoadTemplate("Templates/StartExperiment/StartLocationURL.tpl",$ReplaceTags);
}