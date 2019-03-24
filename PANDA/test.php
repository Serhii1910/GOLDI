<?php

exit;
include "../Modules/PHPQuery/PHPQuery.php";

function trace($url){
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    $content = curl_exec($ch);
    curl_close($ch);

    $doc = phpQuery::newDocument($content);
    phpQuery::selectDocument($doc);

    foreach(pq('') as $a)
        echo pq($a)->text();

    exit;


    foreach(pq('a') as $a){
        $href=pq($a)->attr("href");
        if($href=="")
            continue;
        if($href=="#")
            continue;
        echo $href."<br>";
    }
}

trace("goldi-labs.net");

exit;

include "PANDA.php";
var_dump(PANDA::TinCan_SendCoins("GOLDiURLs"));

exit;

//header('Content-Type: text/HTML; charset=utf-8');
//header( 'Content-Encoding: none; ' );//disable apache compressed
//session_start();
//ob_start();
//set_time_limit(0);
//error_reporting(0);
//
//for($i=0;$i<10;$i++)
//{
//
//    echo "<br>>>>".$i."<<<br>";
//    echo str_pad('',4096)."\n";
//    ob_flush();
//    flush(); //ie working must
//    sleep(2);
//
//}
//
//ob_end_flush();
$a = array(
//    "chapter",
//    "login",
//    "ico",
//    "url",
//    "GOLDiLogins",
    "GOLDiURLs",
//    "GOLDiExperiments",
//    "GOLDiExperimentErrors",
);

foreach($a as $b)
    echo "\n\n$b\n".PANDA::TinCan_SendCoins($b);


//print_r(PANDA::TinCan_SendCoins("ico"));
//print_r(PANDA::TinCan_SendCoins("login"));
//print_r(PANDA::TinCan_SendCoins("url"));

//include "PANDA.php";
//print_r(PANDA::TinCan_SendCoinsMoodleICO());
//exit;
//PANDA::TinCan_SendCoinsMoodleICO();
//exit;
//echo PANDA::Api_GetNumberOfStoredCoins('GOLDiURLs');

