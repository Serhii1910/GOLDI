<?php
    $ReplaceTags = array(
        "[[++Location++]]" => $Location
    );

    $SiteContent = Functions::LoadTemplate("Templates/Admin/RunningExperiments.tpl",$ReplaceTags);