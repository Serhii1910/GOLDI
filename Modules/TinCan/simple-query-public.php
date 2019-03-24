<?php
//include "class.twitter.php";
$loader = require 'autoload.php';
//require '/src/Agent.php';

/*
$lrs = new TinCan\RemoteLRS(
    'http://cloud.scorm.com/tc/public',
    '1.0.1',
    'user', // $basicLogin = '09a666ac8b4ddf6c2875895aeb8102d1c96248d5';
    'pass'  // $basicPass = 'b1f697f2d9e4f4488d95cf756f2444125f2e8e1a'; 
);

*/

//Endpoint details for Public LRS 
//$basicLogin = 'username';
//$basicPass = 'password';
// $endpoint = 'https://cloud.scorm.com/ScormEngineInterface/TCAPI/public/';

$lrs = new TinCan\RemoteLRS(
    'https://cloud.scorm.com/ScormEngineInterface/TCAPI/public/', 
    '1.0.1',
    'username', 
    'password'  
);

// for http://ildmz19.idmt.fraunhofer.de/learninganalyst
/*
$lrs = new TinCan\RemoteLRS(
    'http://ildmz19.idmt.fraunhofer.de/learninglocker/data/xAPI/', 
    '1.0.1',
    '09a666ac8b4ddf6c2875895aeb8102d1c96248d5', 
    'b1f697f2d9e4f4488d95cf756f2444125f2e8e1a'  
);
*/

$actor = new TinCan\Agent(
// [ 'mbox' => 'mailto:Christian@panda.com' ]
);

$verb = new TinCan\Verb(
    [
        'id' => 'http://adlnet.gov/expapi/verbs/completed',
        'display' => ['en-US'=>'completed']
    ]
);


$activity = new TinCan\Activity(
    [ 'id' => 'http://panad.com/activities/2014-Rechner-Organisation-exam',
        // 'id' => 'http://panad.com/activities/2014-Rechner-Organisation-Question-1',
        // 'name' => ['en-US'=>' Final RO Exam']
    ]
);

$actor->setMbox('20@panda.com');
//$actor->setName('student-1');

$statement = new TinCan\Statement(
    [
        'actor' => $actor,
        'verb'  => $verb,
        'object' => $activity,
    ]
);

$response = $lrs->queryStatements(['agent' => $actor]);

print_r($response);


die();




//$response = $lrs->queryStatements(['limit' => 2]);


//print_r($response);

