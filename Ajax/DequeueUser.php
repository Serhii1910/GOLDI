<?php
$Result = true;
$Result &= Database::BookingQueue_Dequeue($_SESSION['UserID'],"BPU");
$Result &= Database::BookingQueue_Dequeue($_SESSION['UserID'],"PSPU");
echo json_encode($Result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
