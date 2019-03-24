<?php

require "PANDA.php";

$loader = require 'autoload.php';

$config = [
    "version" => '1.0.1',
    "LRS" => [
        "URL" => 'http://ildmz19.idmt.fraunhofer.de/learninglocker/data/xAPI/',
        "username" => '57d20321ecfe48843f81a4056c79d4583f9f0d2b',
        "password" => '05ba84235f13e5968785ae582eb4a130057f3cc1'
    ],
    "authority" => [
        "name" => "IUT",
        "mbox" => "rene.hutschenreuter@tu-ilmenau.de"
    ]
];

$lrs = new TinCan\RemoteLRS(
    $config['LRS']['URL'],
    $config['version'],
    $config['LRS']['username'],
    $config['LRS']['password']
);

$authority = new TinCan\Agent();
$authority->setName($config['authority']['name']);
$authority->setMbox($config['authority']['mbox']);

$actor = new TinCan\Agent();
$actor->setName("");
$actor->setMbox("");

$verbDisplayLanguageMap = new TinCan\LanguageMap();
$verbDisplayLanguageMap ->set('de-DE',"");
$verbDisplayLanguageMap ->set('en-US',"");

$verb = new TinCan\Verb();
$verb->setId("");
$verb->setDisplay($verbDisplayLanguageMap);

$definitionNameLanguageMap = new TinCan\LanguageMap();
$definitionNameLanguageMap->set('de-DE',"");
$definitionNameLanguageMap->set('en-US',"");

$definitionDescriptionLanguageMap = new TinCan\LanguageMap();
$definitionDescriptionLanguageMap ->set('de-DE',"");
$definitionDescriptionLanguageMap ->set('en-US',"");

$definitionExtension = new TinCan\Extensions();
$definitionExtension ->set("","");

$definition = new TinCan\ActivityDefinition();
$definition->setName($definitionNameLanguageMap);
$definition->setDescription($definitionDescriptionLanguageMap);
$definition->setType("");
$definition->setExtensions($definitionExtension);

$object = new TinCan\Activity();
$object->setId("");
$object->setDefinition($definition);

$contextExtension = new TinCan\Extensions();
$contextExtension->set("","");

$context = new TinCan\Context();
$context->setExtensions($contextExtension);

$statement = new TinCan\Statement();
$statement->setVersion($config['version']);
$statement->setAuthority($authority);
$statement->setActor($actor);
$statement->setVerb($verb);
$statement->setObject($object);
$statement->setContext($context);
$statement->setTimestamp(new DateTime('Now'));
$statement->setStored(new DateTime('Now'));

print_r($statement->asVersion($config['version']));
exit;

$response = $lrs->saveStatement($statement);
if ($response->success) {
    print "Statement sent successfully!\n";
}
else {
    print "Error statement not sent: " . $response->content . "\n";
}