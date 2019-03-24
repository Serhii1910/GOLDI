<?php
Functions::Ajax_TestRequestMode();
Functions::Ajax_TestRequestBPUType();
Functions::Ajax_TestRequestPSPUType();
Functions::Ajax_TestStartTime();
Functions::Ajax_TestEndTime();
Functions::Ajax_TestRequestLocation();

if(strtoupper($_REQUEST['Mode']) == "A")
    die("Bookings for Mode 'a' are not nessesary!");

header('Content-type: application/json; charset=utf-8');
echo json_encode(Database::Booking_InsertBooking(
    $_SESSION['UserID'],
    $_REQUEST['BPUType'],
    Functions::BPUIsVirtualInMode($_REQUEST['Mode'])?1:0,
    $_REQUEST['PSPUType'],
    Functions::PSPUIsVirtualInMode($_REQUEST['Mode'])?1:0,
    $_REQUEST['StartTime'],
    $_REQUEST['EndTime'],
    $_REQUEST['Location']
));