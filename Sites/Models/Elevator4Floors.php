<?php

$SensorLines = "";
for($i=0;$i<=34;$i++)
{
    $ReplaceTags = array(
        "[[++Index++]]" => $i
    );

    $SensorLines .= Functions::LoadTemplate("Templates/Models/SensorRow.tpl",$ReplaceTags);
}

$ActuatorLines = "";
for($i=0;$i<=29;$i++)
{
    $ReplaceTags = array(
        "[[++Index++]]" => $i
    );

    $ActuatorLines .= Functions::LoadTemplate("Templates/Models/ActuatorRow.tpl",$ReplaceTags);
}

$ReplaceTags = array(
    "[[++SensorLines++]]" => $SensorLines,
    "[[++ActuatorLines++]]" => $ActuatorLines
);

$SiteContent = $LanguageManager->ReplaceTags(Functions::LoadTemplate("Templates/Models/Elevator4Floors.tpl",$ReplaceTags),"PSPU_Elevator4Floors");