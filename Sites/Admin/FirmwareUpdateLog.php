<?php

$Log = Database::Firmware_GetFirmwareUpdateLog();

$LogEntryLines = "";
foreach ($Log as $LogEntry)
    $LogEntryLines .= Functions::LoadTemplate("Templates/Admin/FirmwareUpdateLogLines.tpl",
        array(
            "[[++Timestamp++]]" => date("Y-m-d, h:m:s",$LogEntry['Timestamp']),
            "[[++Location++]]" => $LogEntry['Location'],
            "[[++DeviceType++]]" => $LogEntry['Type'],
            "[[++FirmwareID++]]" => $LogEntry['FirmwareID'],
            "[[++Result++]]" => $LogEntry['Result']
        )
    );

$SiteContent = Functions::LoadTemplate("Templates/Admin/FirmwareUpdateLog.tpl", array("[[++FirmwareUpdateLogLines++]]" => $LogEntryLines));
