<?php
    $ReplaceTags = array(
        "[[++Location++]]" => $Location
    );

    $SiteContent = Functions::LoadTemplate("Templates/Admin/WebCams.tpl",$ReplaceTags);