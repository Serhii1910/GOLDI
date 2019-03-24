<?php


$SensorLines = "";
for($i=0;$i<=41;$i++)
{
    $ReplaceTags = array(
        "[[++Index++]]" => $i
    );

    $SensorLines .= Functions::LoadTemplate("Templates/Models/SensorRow.tpl",$ReplaceTags);
}

$ActuatorLines = "";
for($i=0;$i<=6;$i++)
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

$SiteContent = $LanguageManager->ReplaceTags(Functions::LoadTemplate("Templates/Models/3AxisPortal.tpl",$ReplaceTags),"PSPU_3AxisPortal");
