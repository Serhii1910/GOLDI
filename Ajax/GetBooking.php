<?php
header('Content-type: application/json; charset=utf-8');
if(isset($_REQUEST['GetAllUserBookings'])){
    echo json_encode(Database::Booking_GetBookingsForUserID($_SESSION['UserID']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}else if(isset($_REQUEST['GetUserBookings'])){
    Functions::Ajax_TestRequestMode();
    Functions::Ajax_TestRequestBPUType();
    Functions::Ajax_TestRequestPSPUType();
    Functions::Ajax_TestRequestLocation();

    switch (strtolower($_REQUEST['Mode'])){
        case 'a':
            echo json_encode(array(), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            break;
        case 'b':
            echo json_encode(Database::Booking_GetBookingsForUserWithTypes(null,$_REQUEST['PSPUType'],$_REQUEST['Location']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            break;
        case 'c':
            echo json_encode(Database::Booking_GetBookingsForUserWithTypes($_REQUEST['BPUType'],$_REQUEST['PSPUType'],$_REQUEST['Location']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            break;
        case 'd':
            echo json_encode(Database::Booking_GetBookingsForUserWithTypes($_REQUEST['BPUType'],null,$_REQUEST['Location']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            break;
    }
}else{
    if(!isset($_REQUEST['Category']) or !in_array($_REQUEST['Category'],array("BPU","PSPU")))
        die('wrong Category, use Category = ["BPU" | "PSPU"]');

    if($_REQUEST['Category'] == "BPU")
        Functions::Ajax_TestRequestBPUType();
    if($_REQUEST['Category'] == "PSPU")
        Functions::Ajax_TestRequestPSPUType();

    Functions::Ajax_TestRequestLocation();
    if(!isset($_REQUEST['StartTime']) or !is_numeric($_REQUEST['StartTime']))
        die("wrong StartTime, use timestamp as StartTime");
    if(!isset($_REQUEST['EndTime']) or !is_numeric($_REQUEST['EndTime']))
        die("wrong EndTime, use timestamp as EndTime");

    if($_REQUEST['Category'] == "BPU"){
        echo json_encode(
            Database::Booking_GetBookingsWithTypesInTime(
                $_REQUEST['BPUType'],
                null,
                $_REQUEST['StartTime'],
                $_REQUEST['EndTime'],
                $_REQUEST['Location']
            ), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
        );
    }else{
        echo json_encode(
            Database::Booking_GetBookingsWithTypesInTime(
                null,
                $_REQUEST['PSPUType'],
                $_REQUEST['StartTime'],
                $_REQUEST['EndTime'],
                $_REQUEST['Location']
            ), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
        );
    }
}
