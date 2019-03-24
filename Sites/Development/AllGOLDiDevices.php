<?php

$Devices = Database::Devices_GetAllDevicesWithCategory();
$DeviceLineString = "";

foreach($Devices as $Device)
    if($Device["Virtual"] == 0){
        $ReplaceTags = array(
            "[[++Location++]]" => $Device["Location"],
            "[[++Type++]]" => $Device["Type"],
            "[[++InMaintenance++]]" => $Device["InMaintenance"],
            "[[++IsConnected++]]" => $Device["IsConnected"],
            "[[++Category++]]" => $Device["Category"],
            "[[++ServiceDestID++]]" => $Device["ServiceDestID"]
        );
        $DeviceLineString .= Functions::LoadTemplate("Templates/Development/AllGOLDiDevicesLine.tpl",$ReplaceTags);
    }

$ReplaceTags = array(
    "[[++DeviceLines++]]" => $DeviceLineString
);
$SiteContent = Functions::LoadTemplate("Templates/Development/AllGOLDiDevices.tpl",$ReplaceTags);