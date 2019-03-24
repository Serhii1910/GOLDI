<?php
    $ReplaceTags = array(
        "[[++Year++]]" => date("Y")
    );
    $FooterContent = Functions::LoadTemplate("Templates/Structure/Footer.tpl",$ReplaceTags);
