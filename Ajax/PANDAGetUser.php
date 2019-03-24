<?php
if(isset($_REQUEST['Key']) and $_REQUEST['Key']=="bU7kIE5T2e1@vvLhR0lEg9cYdNTrjkWh" and isset($_REQUEST['UserID'])){
    $User = Database::User_GetUserByID($_REQUEST['UserID']);
    $Return = array();
    $Return['UserID'] = $User['UserID'];
    $Return['FirstName'] = $User['FirstName'];
    $Return['LastName'] = $User['LastName'];
    $Return['Email'] = $User['Email'];
    header('Content-type: application/json; charset=utf-8');
    echo json_encode($Return, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

