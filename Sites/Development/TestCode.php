<?php


$SiteContent = "test";

//Database::User_RemoveSuperAdminForUserID(5);
//Database::User_SetSuperAdminForUserID(5);
//Database::User_RemoveSuperAdminForUserID(312);
//Database::User_RemoveSuperAdminForUserID(144);


//SEUA WebcamSocket


//include "Modules/WebsocketPHPMaster/lib/Base.php";
//include "Modules/WebsocketPHPMaster/lib/Exception.php";
//include "Modules/WebsocketPHPMaster/lib/ConnectionException.php";
//include "Modules/WebsocketPHPMaster/lib/Client.php";
//
//use WebSocket\Client;
//
//$client = new Client("ws://109.75.39.182:970");
//
//$client->send(24);
//
//$SiteContent = $client->receive();


//$SiteContent = "<pre>".print_r(Database::BookingQueue_GetQueueForDevice(77),true)."</pre><br>".time();

//$SiteContent = "<pre>".print_r($_SERVER,true)."</pre>";


//ob_start();
////var_dump(Database::Devices_SetPermittedDeviceCombinations("A",2,"B",3,2));
//var_dump(Database::Devices_GetPermittedDeviceCombinations());
//$SiteContent = ob_get_clean();



/*
$ldapCon = ldap_connect("ldaps://ldapauth.tu-ilmenau.de", "636");
$ldapBind = ldap_bind($ldapCon, "cn=".$_REQUEST['user'].",ou=user,o=uni", $_REQUEST['pass']);
$searchForUser = ldap_search($ldapCon, "cn=" . $_REQUEST['user']. ",ou=user,o=uni", "cn=*");
$all = ldap_get_entries($ldapCon, $searchForUser);
$SiteContent = print_r($all,true);
*/



/*
$SiteContent = "";

$query = "select * from `locale_tags` where `tags` like 'LabPresentation%'";
$result = mysql_query($query);

while($line = mysql_fetch_assoc($result))
{
    $string = trim(mysql_real_escape_string(preg_replace("/\s+/", " ", $line['en_US'])));
    $query = "update `locale_tags` set `en_US` = '".$string."' where `tags` = '".$line['tags']."'";
//    $result = $mysql_query($query);

    $string = trim(mysql_real_escape_string(preg_replace("/\s+/", " ", $line['de_DE'])));
    $query = "update `locale_tags` set `de_DE` = '".$string."' where `tags` = '".$line['tags']."'";
//    $result = $mysql_query($query);

//    $SiteContent .= $query ."<br><br>";
//    $SiteContent .= $line['tags'] .":".preg_replace("/\s+/", " ", $line['en_US'])."\n\n";
}
*/

//ob_start();
//var_dump(Database::Functions_GetFunction('Settings'));
//$SiteContent = ob_get_clean();