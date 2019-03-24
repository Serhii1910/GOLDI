<?php

$Devices = Database::Devices_GetAllDevicesWithCategory($Location);
$DeviceLineString = "";

foreach($Devices as $Device){
    $ReplaceTags = array(
        "[[++DeviceType++]]" => $Device["Type"],
        "[[++Category++]]" => $Device["Category"],
        "[[++ServiceDestID++]]" => $Device["ServiceDestID"],
        "[[++Virtual++]]" => $Device["Virtual"],
        "[[++InMaintenance++]]" => $Device["InMaintenance"]=="0"?"checked":"",
        "[[++IsConnected++]]" => $Device["IsConnected"]
    );
    $DeviceLineString .= Functions::LoadTemplate("Templates/Admin/DeviceListLine.tpl",$ReplaceTags);
}
$ReplaceTags = array(
    "[[++DeviceLines++]]" => $DeviceLineString
);
$SiteContent = Functions::LoadTemplate("Templates/Admin/DeviceList.tpl",$ReplaceTags);