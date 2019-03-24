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

$lrs = new TinCan\RemoteLRS(
    'http://ildmz19.idmt.fraunhofer.de/learninglocker/data/xAPI/',
    '1.0.1',
    'e9c4f8f7cb6780d43c0b2e9a40d40474a51023ff',
    '0852484bb165cc38b2c261b58c773d04841b076f'
);


$actor = new TinCan\Agent(
   // [ 'mbox' => 'mailto:Christian@panda.com' ]
);

$verb = new TinCan\Verb(
    [
        'id' => 'http://adlnet.gov/expapi/verbs/completed',
        'display' => ['en-US'=>'completed']
    ]
);


//$verb->setDisplay($str);



// parameters to be changed by each cvs file. this can be designed later as rest web service 
$activity = new TinCan\Activity(
    [ //'id' => 'http://panad.com/activities/2014-Rechner-Organisation-exam',
      'id' => 'http://panad.com/activities/2014-Rechner-Organisation-Question-1',
     // 'name' => ['en-US'=>' Final RO Exam']
    ]
);
//$activity->setDefinition( ['en-US'=>'RO exam in 2014'] );

$score=new TinCan\Score(
);

$result = new TinCan\Result(
);
// max values :
 /* Q1=6,
    Q2=6,
	Q3=4,
	Q4=6,
	Q5=8,
	Q6=7,
	Q7=3,
	Q8=3,
	Q9=7,     
 */
$score->setMax(6);
//$score->setMax(7);
$score->setMin(0);
//$file = fopen('dummy-data-total-score.csv', 'r');
$file = fopen('CO-assessment-data-2014-Q1.csv', 'r');

$temp_i=0;
while (($line = fgetcsv($file)) !== FALSE) {
    //$line is an array of the csv elements
    // print_r($line);

    $statement = new TinCan\Statement(
    );

    if (0!=$temp_i)
    {
        echo '<pre>';

//        print_r($line[0]);
        $actor->setMbox($line[0].'@panda.com');
        $actor->setName('student-'.$line[0]);

        $score->setRaw($line[1]);
		//print_r($line[1]);
        $result->setCompletion(true);
        $result->setScore($score);

        $statement->setActor($actor);
        $statement->setVerb($verb);
        $statement->setObject($activity);
        $statement->setResult($result);


        print_r($statement->asVersion("1.0.1"));
        exit;

//        $lrs->
        echo '<pre>';
//        echo $temp_i." ".$statement->getContext()."<br>";
        print_r($statement);


        $response = $lrs->saveStatement($statement);
/*        if ($response->success) {
            print "Statement sent successfully!\n";
        }
        else {
            print "Error statement not sent: " . $response->content . "\n";
        }
*/
		
        echo '</pre>';

       // die();
    }
    unset($statement);
    $temp_i=$temp_i+1;
}
fclose($file);

//$response = $lrs->queryStatements(['limit' => 2]);

//print_r($response);


die();


//$response = $lrs->queryStatements(['limit' => 2]);


//print_r($response);

