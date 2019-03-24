<?php
if(Functions::Ajax_isAdminOfLocation("IUT")) {
    header('Content-type: application/json; charset=utf-8');
    echo json_encode(Database::Firmware_RemoveApproval($_REQUEST['FirmwareID'],$_REQUEST['BuildType']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}