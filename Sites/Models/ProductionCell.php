<?php


$SensorLines = "";
for($i=0;$i<=16;$i++)
{
    $ReplaceTags = array(
        "[[++Index++]]" => $i
    );

    $SensorLines .= Functions::LoadTemplate("Templates/Models/SensorRow.tpl",$ReplaceTags);
}

$ActuatorLines = "";
for($i=0;$i<=17;$i++)
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



$SiteContent = $LanguageManager->ReplaceTags(Functions::LoadTemplate("Templates/Models/ProductionCell.tpl",$ReplaceTags),"PSPU_ProductionCell");
