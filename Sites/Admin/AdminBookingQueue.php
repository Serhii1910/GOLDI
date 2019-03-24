<?php
$ReplaceTags = array(
    "[[++Location++]]" => $Location
);

$SiteContent = Functions::LoadTemplate("Templates/Admin/AdminBookingQueue.tpl",$ReplaceTags);