<?php
header('Content-type: application/json; charset=utf-8');
echo json_encode(Database::Booking_GetExperimentsBookedForUserNow(),JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);