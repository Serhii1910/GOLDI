<?php
//Ajaxsizeof(Database::Navigation_GetAdminLocationsOfUser($_SESSION['UserID'])) > 0) {
if(Functions::Ajax_isAdminOfLocation("IUT")){
    if (isset($_FILES['FirmwareFile'])) {
        header('Content-type: application/json; charset=utf-8');
        echo json_encode(Database::Firmware_UploadFirmwareToDatabase($_FILES['FirmwareFile'], $_REQUEST['hardwareconfig']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
}