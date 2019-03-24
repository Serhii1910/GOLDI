<?php
Functions::Ajax_TestRequestLocation();

header('Content-type: application/json; charset=utf-8');
echo json_encode(Database::BookingQueue_GetQueuesForUserAndLocation($_SESSION['UserID'],$_REQUEST['Location']), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
