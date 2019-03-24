<?php
    ob_start();
    var_dump($_SESSION);
    $SiteContent = ob_get_clean();