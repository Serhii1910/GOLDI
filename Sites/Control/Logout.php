<?php
Functions::EndSession();
$_REQUEST['Site'] = 1;
header("location:index.php?".http_build_query($_REQUEST));