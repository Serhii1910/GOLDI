<?php

$ImageSrc = "Images/Speedtest.bmp";
$ImageSize = strlen(file_get_contents($ImageSrc));

$ReplaceTags = array(
    "[[++ImagePath++]]" => $ImageSrc,
    "[[++ImageSize++]]" => $ImageSize
);

$SiteContent = Functions::LoadTemplate("Templates/Speedtest.tpl",$ReplaceTags);
