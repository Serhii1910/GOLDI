<?php
Functions::Ajax_TestRequestBPUType();
Functions::Ajax_TestRequestPSPUType();
Functions::Ajax_TestRequestLocation();
Functions::Ajax_TestRequestMode();

$BPUIsVirtual = Functions::BPUIsVirtualInMode($_REQUEST['Mode']);
$PSPUIsVirtual = Functions::PSPUIsVirtualInMode($_REQUEST['Mode']);

if (!$BPUIsVirtual) Database::BookingQueue_Enqueue($_SESSION['UserID'], $_REQUEST['BPUType'], $_REQUEST['Location']);
if (!$PSPUIsVirtual) Database::BookingQueue_Enqueue($_SESSION['UserID'], $_REQUEST['PSPUType'], $_REQUEST['Location']);
