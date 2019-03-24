<?php
if(Functions::Ajax_isAdminOfLocation("IUT")) {
    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Firmware_DeleteFirmware($_REQUEST['FirmwareID']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}