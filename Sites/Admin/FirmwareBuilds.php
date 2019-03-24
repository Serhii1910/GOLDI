<?php
/*$FirmwareWithoutApproval = Database::Firmware_GetFirmwaresWithoutApproval();

$FirmwareWithoutApprovalString = "";
foreach($FirmwareWithoutApproval as $ID => $Firmware){
    $FirmwareWithoutApprovalString .= "
        <td>$ID</td>
        <td>{$Firmware['HWConfigID']}</td>
        <td>{$Firmware['HardwareVersion']}</td>
        <td>{$Firmware['BoardType']}</td>
        <td>{$Firmware['UploadDate']}</td>
        <td>{$Firmware['TestState']}</td>
        <td><button id='deletefw_$ID' class='btn btn-danger'>X</button></td>
    ";

    if($Firmware['TestState'] == "Verified"){
        $FirmwareWithoutApprovalString .= "<td><button id='releasefw_$ID' class='btn btn-success'>Release</button></td>";
    }else{
        $FirmwareWithoutApprovalString .= "<td></td>";
    }

}

$SiteContent = Functions::LoadTemplate("Templates/Admin/FirmwareBuilds.tpl",["[[++FirmwaresWithoutApproval++]]" => $FirmwareWithoutApprovalString]);

$FirmwareWithApproval = Database::Firmware_GetFirmwaresWithApproval();
*/

$SiteContent = Functions::LoadTemplate("Templates/Admin/FirmwareBuilds.tpl");

//$SiteContent .= "<pre>".print_r(Database::Firmware_GetFirmwaresWithoutApproval(),true)."</pre>";
//$SiteContent .= "<pre>".print_r(Database::Firmware_GetFirmwaresWithApproval(),true)."</pre>";