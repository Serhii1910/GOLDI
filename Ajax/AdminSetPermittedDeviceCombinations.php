<?php
Functions::Ajax_TestRequestLocation();

if(Functions::Ajax_isAdminOfLocation($_REQUEST['Location']))
{
    header('Content-type: application/json; charset=utf-8');

    Functions::Ajax_TestRequestBPUType();
    Functions::Ajax_TestRequestPSPUType();

    if (!isset($_REQUEST['BPUVirtual']) or !in_array($_REQUEST['BPUVirtual'], array("Virtual", "Real")))
        die("wrong BPUVirtual, use BPUVirtual = [ Virtual | Real ]");

    if (!isset($_REQUEST['PSPUVirtual']) or !in_array($_REQUEST['PSPUVirtual'], array("Virtual", "Real")))
        die("wrong PSPUVirtual, use BPUVirtual = [ Virtual | Real ]");

    if (!isset($_REQUEST['Permitted']) or !in_array($_REQUEST['Permitted'], array(0, 1)))
        die("wrong Permitted, use Permitted = [ 0 | 1 ]");

    echo json_encode(Database::Devices_SetPermittedDeviceCombinations($_REQUEST['BPUType'], $_REQUEST['BPUVirtual'], $_REQUEST['PSPUType'], $_REQUEST['PSPUVirtual'], $_REQUEST['Permitted'], $_REQUEST['Location']));
}