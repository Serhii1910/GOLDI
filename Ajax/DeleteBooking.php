<?php

if(!isset($_REQUEST['BookingID']))
    die("wrong BookingID");

header('Content-type: application/json; charset=utf-8');

$Booking = Database::Booking_GetBookingByID($_REQUEST['BookingID']);
if($Booking and $Booking['UserID'] == $_SESSION['UserID']){
    echo json_encode(Database::Booking_DeleteBookingByID($_REQUEST['BookingID']),JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}else{
    echo json_encode(false);
}

