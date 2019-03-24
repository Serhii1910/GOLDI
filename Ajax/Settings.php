<?php
Functions::Ajax_TestRequestEperimentID();

header('Content-type: application/json; charset=utf-8');
$Experiment = Database::Experiment_GetExperiment($_REQUEST['ExperimentID']);

if(!$Experiment)
    die("ExperimentNotExisting");

if($Experiment['SessionID'] != session_id())
{
    $Experiment['SessionID'] = 0;
//    $Experiment['Mode'] = 'c';
}

$Settings = array();

//$Settings['ServerIP'] = Database::Devices_GetLocations()[$Experiment['Location']];
$Settings['DataSocketURL'] = Database::Locations_GetLocationInformation()[$Experiment['Location']]['DataSocket'];
$Settings['WebcamSocketURL'] = Database::Locations_GetLocationInformation()[$Experiment['Location']]['WebcamSocket'];
$Settings['GuacamoleURL'] = Database::Locations_GetLocationInformation()[$Experiment['Location']]['GuacamoleURL'];
$Settings['WebCamPictureDelay'] = Definitions::WebCamPictureDelay;

$Settings['WebcamID'] = null;
$Webcams = Database::Server_GetWebcamList($Experiment['Location']);
foreach($Webcams as $Webcam)
    if(in_array($Webcam['DeviceServiceDestinationID'],array($Experiment['BPUServiceDestinationID'],$Experiment['PSPUServiceDestinationID'])))
    {
        $Settings['WebcamID'] = $Webcam['DeviceServiceDestinationID'];
        break;
    }

$Settings['debug'] = true;
$Settings['verbose'] = true;
$Settings['ORSign'] = '#';
$Settings['ANDSign'] = '&';
$Settings['NOTSign'] = '!';
$Settings['AnimationDIVName'] = 'DIVAnimation';
$Settings['ControlPanelDIVName'] = 'DIVControlPanel';
$Settings['RightPanelDIVName'] = 'DIVRightPanel';
$Settings['WebCamDIVName'] = 'DIVWebCam';

$Settings['CurrentLanguage'] = 'en_US';

$Settings['ExperimentID'] = $Experiment['ExperimentID'];
$Settings['DeviceType'] = $Experiment['BPUType'];

if($Experiment['PSPUType'] == "Elevator4FloorsClassic")
    $Experiment['PSPUType'] = "Elevator4Floors";

$Settings['ECPPhysicalSystemName'] = $Experiment['PSPUType'];
$Settings['Mode'] = strtolower($Experiment['Mode']);
$Settings['ValidTime'] = (1000 * ($Experiment['EndTime'] - time()));
$Settings['SessionID'] = $Experiment['SessionID'] .'';
$Settings['FileName'] = $Experiment['PSPUType'].'.ecp';

$Settings['BPUAllowedFileType'] = Database::ECP_GetBPUAllowedFileType($Experiment['BPUType']);

$TMP = Database::ECP_GetExperimentSettings($Experiment['PSPUType']);
if ($TMP)
    foreach ($TMP as $Key => $Value)
        $Settings[$Key] = $Value .'';

$Settings['Examples'] = array();
$TMP = Database::ECP_ExperimentExamples($Experiment['BPUType'], $Experiment['PSPUType']);
foreach ($TMP as $Key => $Value)
    $Settings['Examples'][$Key] = utf8_encode($Value);
//        $Settings['Examples'][$Key] = str_replace("\\n","\n",$Value);
//        $Settings['Examples'][$Key] = $Value;

$Indicators = array();
$Indicators['COMMON_LABEL_INDICATOR'] = 'ECP_';
$Indicators['LAB_ERROR_LABEL_INDICATOR'] = 'RIA_ERROR_LAB';
$Indicators['MODEL_ERROR_LABEL_INDICATOR'] = 'RIA_ERROR_PORTAL';
$Indicators['PARSE_ERROR_LABEL_INDICATOR'] = 'RIA_ERROR_PARSE';
$Indicators['CUSTOM_LABEL_INDICATOR'] = '';
$Indicators['ANIMATION_LABEL_INDICATOR'] = 'RIA_PORTAL_ANIMATION';
$Settings['Indicators'] = $Indicators;

echo json_encode(array($Settings), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);






/*


//index.php?Function=Settings&Mode=a&BPUType=FSMInterpreter&PSPUType=Elevator3Floors&Location=IUT&ExerimentID=1
    header('Content-type: application/json; charset=utf-8');

    // Developer-Fehler-Ausgabe, falls falsche Parameter �bergeben werden
    $URL = "index.php?Function=ECP&Mode=...&BPUType=...&PSPUType=...&Location=...";

    $Locations = Database::Devices_GetLocations();
    if(empty ($_REQUEST['Location']) or !in_array($_REQUEST['Location'],array_keys($Locations)))
        die("Wrong_Location<br><br> Use: <br>".$URL."<br> Location: ".implode(", ",array_keys($Locations)));

    $Devices = Database::Devices_GetAvailableDevices($_REQUEST['Location']);

    if(empty ($_REQUEST['Mode']) or !in_array(strtolower($_REQUEST['Mode']),array('a','b','c','d')))
        die("Wrong_Mode<br><br> Use: <br>".$URL."<br>Mode: a, b, c, d");

    if(empty ($_REQUEST['PSPUType']) or !isset($Devices['PSPU'][$_REQUEST['PSPUType']]))
        die("Wrong_BPUType<br><br> Use: <br>".$URL."<br>BPU: ".implode(", ",array_keys($Devices['BPU'])));

    if(empty ($_REQUEST['PSPUType']) or !isset($Devices['PSPU'][$_REQUEST['PSPUType']]))
        die("Wrong_PSPUType<br><br> Use: <br>".$URL."<br>PSPU: ".implode(", ",array_keys($Devices['PSPU'])));


    $Settings = array();

    $Settings['ServerIP'] = $Locations[$_REQUEST['Location']];
    $Settings['WebCamPictureDelay'] = Definitions::WebCamPictureDelay;

    //TODO vom Server setzen
    $Settings['WebcamID'] = null;

    $Settings['debug'] = true;
    $Settings['verbose'] = true;
    $Settings['ORSign'] = '#';
    $Settings['ANDSign'] = '&';
    $Settings['NOTSign'] = '!';
    $Settings['AnimationDIVName'] = 'DIVAnimation';
    $Settings['ControlPanelDIVName'] = 'DIVControlPanel';
    $Settings['RightPanelDIVName'] = 'DIVRightPanel';
    $Settings['WebCamDIVName'] = 'DIVWebCam';

    $Settings['CurrentLanguage'] = 'en_US';

    $Settings['ExperimentID'] = isset($_REQUEST['ExperimentID']) ? $_REQUEST['ExperimentID'] : 0;
    $Settings['DeviceType'] = $_REQUEST['BPUType'];
    $Settings['ECPPhysicalSystemName'] = $_REQUEST['PSPUType'];
    $Settings['Mode'] = strtolower($_REQUEST['Mode']);

    $Settings['ValidTime'] = strtolower($_REQUEST['Mode'])=='a' ? Definitions::GuestUserTimeMinutesVirtual * 1000 : Definitions::GuestUserTimeMinutes * 1000;
    $Settings['SessionID'] = session_id();
    $Settings['FileName'] = $_REQUEST['PSPUType'].'.ecp';
    $Settings['Location'] = $_REQUEST['Location'];

    $Settings['BPUAllowedFileType'] = Database::ECP_GetBPUAllowedFileType($_REQUEST['BPUType']);

    $TMP = Database::ECP_GetExperimentSettings($_REQUEST['PSPUType']);
    if ($TMP)
        foreach ($TMP as $Key => $Value)
            $Settings[$Key] = strval($Value);

    $Settings['Examples'] = array();
    $TMP = Database::ECP_ExperimentExamples($_REQUEST['BPUType'], $_REQUEST['PSPUType']);
    foreach ($TMP as $Key => $Value)
        $Settings['Examples'][$Key] = utf8_encode($Value);

    $Indicators = array();
    $Indicators['COMMON_LABEL_INDICATOR'] = 'ECP_';
    $Indicators['LAB_ERROR_LABEL_INDICATOR'] = 'RIA_ERROR_LAB';
    $Indicators['MODEL_ERROR_LABEL_INDICATOR'] = 'RIA_ERROR_PORTAL';
    $Indicators['PARSE_ERROR_LABEL_INDICATOR'] = 'RIA_ERROR_PARSE';
    $Indicators['CUSTOM_LABEL_INDICATOR'] = '';
    $Indicators['ANIMATION_LABEL_INDICATOR'] = 'RIA_PORTAL_ANIMATION';
    $Settings['Indicators'] = $Indicators;

    echo json_encode(array($Settings), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

*/