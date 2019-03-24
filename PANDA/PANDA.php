<?php
class PANDA
{
    private static $RecordGOLDi = false;

    private static $DBAuth = array
    (
        "moodle_iks" => array(
            "Host" => "141.24.211.89",
            "User" => "moodle_iks",
            "Pass" => "5r3UJzrmVc7CLFS2?!"
        ),

        "lrs" => array(
            "Host" => "141.24.211.89",
            "User" => "root",
            "Pass" => "eAtnkEp3W?!"
        ),

        //goldi-labs.net
//        "tempus" => array(
//            "Host" => "141.24.186.119",
//            "User" => "tempusadm",
//            "Pass" => "SE91?-me"
//        ),

        //goldi-experimental
        "goldi" => array(
            "Host" => "141.24.211.105",
            "User" => "root",
            "Pass" => "eAtnkEp3W?!"
        )
    );

    /*
        private static $DBAuth = array(
            "moodle" => array(
                "Host" => "localhost",
                "User" => "moodle",
                "Pass" => "1q2w3e4r"
            ),
            "lrs" => array(
                "Host" => "localhost",
                "User" => "lrs",
                "Pass" => "1q2w3e4r"
            )
        );
    */

    private static $DBLink = null;

    public static function Connect($Database)
    {
        if(isset(PANDA::$DBAuth[$Database]))
        {
            PANDA::$DBLink = new mysqli
            (
                PANDA::$DBAuth[$Database]['Host'],
                PANDA::$DBAuth[$Database]['User'],
                PANDA::$DBAuth[$Database]['Pass'],
                $Database
            );

            if (mysqli_connect_errno()) {
                die('Konnte keine Verbindung zur Datenbank aufbauen: ' . mysqli_connect_error() . '(' . mysqli_connect_errno() . ')');
            }
            PANDA::Query("SET NAMES utf8");
        }
        else
        {
            die('Keine Anmeldeinformationen vorhanden');
        }
    }

    private static function Close()
    {
        if(PANDA::$DBLink!=null)
            PANDA::$DBLink->close();

        PANDA::$DBLink = null;
    }

    private static function Query($String)
    {
        if(PANDA::$DBLink!=null)
            return PANDA::$DBLink->query($String);
    }

    public static function Moodle_GetStudentIDNumber($UserID)
    {
        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "SELECT matrikelnummer FROM `matrikel` WHERE userID='$UserID' LIMIT 1";
        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
        {
            $Line = mysqli_fetch_assoc($Result);
            return $Line["matrikelnummer"];
        }

        return false;
    }

    public static function Moodle_GetUser($UserID)
    {
        if(PANDA::$DBLink==null)
            PANDA::Connect("moodle_iks");

        $Query = "SELECT * FROM `mdl_user` WHERE `id`='$UserID' LIMIT 1";
        $Result = PANDA::Query($Query);

        PANDA::Close();


        if($Result)
        {
            $Line = mysqli_fetch_assoc($Result);
            $Return = array();
            $Return['firstname'] = $Line['firstname'];
            $Return['lastname'] = $Line['lastname'];
            $Return['email'] = $Line['email'];

            return $Return;
        }

        return false;
    }

    public static function Moodle_GetChapterTitle($ChapterID)
    {
        if(PANDA::$DBLink==null)
            PANDA::Connect("moodle");

        $Query = "SELECT `title` FROM `mdl_book_chapters` WHERE `id`= '$ChapterID' LIMIT 1";
        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
        {
            $Line = mysqli_fetch_assoc($Result);
            return $Line["title"];
        }

        return false;
    }

    public static function Moodle_GetFirstChapterID($BookID)
    {
        if(PANDA::$DBLink==null)
            PANDA::Connect("moodle");

        $Query = "SELECT `id` FROM `mdl_book_chapters` WHERE `bookid`= '$BookID' AND `pagenum` =  '1' LIMIT 1";
        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
        {
            $Line = mysqli_fetch_assoc($Result);
            return $Line["id"];
        }

        return false;
    }

    public static function Moodle_SaveCoinICO($UserID, $ICOID, $Percentage, $Eval, $HintLevel)
    {
        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "INSERT INTO
                    `ico` (`userID`, `icoID`, `percentage`, `eval`, `hintLevel`, `timestamp`)
                  VALUES
                  (
                    '$UserID',
                    '$ICOID',
                    '$Percentage',
                    '$Eval',
                    '$HintLevel',
                    Now()
                  );";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
            return true;

        return false;
    }

    public static function Moodle_SaveCoinLogin($UserID)
    {
        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "INSERT INTO
                    `login` (`userID`, `timestamp`)
                  VALUES
                  (
                    '$UserID',
                    Now()
                  );";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
            return true;

        return false;
    }

    public static function Moodle_SaveCoinChapter($UserID, $ChapterID, $BookID, $ChapterTitle)
    {
        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "INSERT INTO
                    `chapter` (`userID`, `chapterID`, `bookID`, `chapterTitle`, `timestamp`)
                  VALUES
                  (
                    '$UserID',
                    '$ChapterID',
                    '$BookID',
                    '$ChapterTitle',
                    Now()
                  );";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
            return true;

        return false;
    }

    public static function Moodle_SaveCoinURL($UserID, $URLID, $URLContent)
    {
        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "INSERT INTO
                     `url` (`userID`, `urlID`, `urlContent`, `timestamp`)
                  VALUES
                  (
                    '$UserID',
                    '$URLID',
                    '$URLContent',
                    Now()
                  );";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
            return true;

        return false;
    }

    public static function Moodle_SaveCoinComment($UserID, $URLContent, $Comment, $BookID, $BookName)
    {
        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "INSERT INTO
                     `comments` (`userID`, `urlContent`, `comment`, `bookID`, `bookName`, `timestamp`)
                  VALUES
                  (
                    '$UserID',
                    '$URLContent',
                    '$Comment',
                    '$BookID',
                    '$BookName',
                    Now()
                  );";

        $Result = PANDA::Query($Query);
        PANDA::Close();

        if($Result)
            return true;

        return false;
    }

    public static function GOLDi_GetUser($UserID){
        $ch = curl_init("goldi-labs.net/?Function=PANDAGetUser&Key=bU7kIE5T2e1@vvLhR0lEg9cYdNTrjkWh&UserID=$UserID");
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        $content = curl_exec( $ch );
        curl_close ( $ch );
        $TMP = json_decode($content,true);
        if($TMP['FirstName']=="[[**Guest**]]"){
            $TMP['FirstName'] = "Guest";
            $TMP['Email'] = "guest@tu-ilmenau.de";
        }
        Return $TMP;
    }

    public static function GOLDi_GetExperiment($ExperimentID){
        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "SELECT * FROM `GOLDiExperiments` WHERE `ExperimentID` = '$ExperimentID'";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        if ($Result) {
            $row = mysqli_fetch_assoc($Result);
            return $row;
        }

        return false;
    }

    public static function GOLDi_SaveCoinError($ExperimentID, $ErrorCode, $ErrorCodeSource, $MessageCounter)
    {
        if(!PANDA::$RecordGOLDi)
            return true;

        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "INSERT INTO
                    `GOLDiExperimentErrors` (`ExperimentID`, `ErrorCode`, `ErrorCodeSource`, `MessageCounter`, `Timestamp`)
                  VALUES
                  (
                    '$ExperimentID',
                    '$ErrorCode',
                    '$ErrorCodeSource',
                    '$MessageCounter',
                    Now()
                  );";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
            return true;

        return false;
    }

    public static function GOLDi_SaveCoinExperiment($ExperimentID, $UserID, $BPUType, $BPUVirtual, $PSPUType, $PSPUVirtual, $StartTime, $EndTime, $Location)
    {
        if(!PANDA::$RecordGOLDi)
            return true;

        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "INSERT INTO
                    `GOLDiExperiments` (`ExperimentID`, `UserID`, `BPUType`, `BPUVirtual`, `PSPUType`, `PSPUVirtual`, `StartTime`, `EndTime`, `Location`, `Timestamp`)
                  VALUES
                  (
                    '$ExperimentID',
                    '$UserID',
                    '$BPUType',
                    '$BPUVirtual',
                    '$PSPUType',
                    '$PSPUVirtual',
                    '$StartTime',
                    '$EndTime',
                    '$Location',
                    NOW()
                  );";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
            return true;

        return false;
    }

    public static function GOLDi_SaveCoinLogin($UserID)
    {
        if(!PANDA::$RecordGOLDi)
            return true;

        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "INSERT INTO
                    `GOLDiLogins` (`UserID`, `Timestamp`)
                  VALUES
                  (
                    '$UserID',
                    NOW()
                  );";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
            return true;

        return false;
    }

    public static function GOLDi_SaveCoinURL($UserID, $URL, $SiteID)
    {
        if(!PANDA::$RecordGOLDi)
            return true;

        if(PANDA::$DBLink==null)
            PANDA::Connect("goldi");

        $Query = "SELECT * FROM `Sites`";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        $Sites = array();

        while($Line = mysqli_fetch_assoc($Result))
            $Sites[$Line["ID"]] = $Line["NameTag"];

        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "INSERT INTO
                    `GOLDiURLs` (`UserID`, `URL`, `SiteID`, `URLName`, `Timestamp`)
                  VALUES
                  (
                    '$UserID',
                    '$URL',
                    '$SiteID',
                    '".(isset($Sites[$SiteID])?$Sites[$SiteID]:$SiteID)."',
                    NOW()
                  );";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
            return true;

        return false;
    }

    public static function LRS_GetCoins($Table)
    {
        if(in_array($Table,PANDA::API_GetTables())){
            if(PANDA::$DBLink==null)
                PANDA::Connect("lrs");

            $Query = "SELECT * FROM `$Table` WHERE `transmitted`='0'";

            $Result = PANDA::Query($Query);

            PANDA::Close();

            $Coins = array();

            while ($Line = mysqli_fetch_assoc($Result))
                $Coins[$Line["ID"]] = $Line;

            return $Coins;
        }

        return null;
    }

    public static function LRS_SetCoinTransmitted($Table,$ID)
    {
        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "UPDATE `$Table` SET `transmitted` = '1' WHERE `ID` = '$ID'";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        return $Result;
    }

    private static $TinCan_Version = "1.0.1";
    private static $TinCan_SendCounter = 1;

//    private static $TinCan = [
//        "config" =>
//        [
//            "version" => '1.0.0',
//            "LRS" =>
//                [
//                    "URL" => 'https://ildmz19.idmt.fraunhofer.de/learninglocker/data/xAPI/',
//                    "username" => '57d20321ecfe48843f81a4056c79d4583f9f0d2b',
//                    "password" => '05ba84235f13e5968785ae582eb4a130057f3cc1'
//                ],
//            "authority" =>
//                [
//                    "name" => "Moodle IKS",
//                    "mbox" => "ilab@tu-ilmenau.de"
//                ]
//        ],

//            PANDA::$TinCan['config']['LRS']['URL'],
//            PANDA::$TinCan['config']['version'],
//            PANDA::$TinCan['config']['LRS']['username'],
//            PANDA::$TinCan['config']['LRS']['password']

//        $authority->setName(PANDA::$TinCan['config']['authority']['name']);
//        $authority->setMbox(PANDA::$TinCan['config']['authority']['mbox']);
//    ];

    public static function TinCan_SendStatement($Statement){
        require_once '../Modules/TinCan/autoload.php';

        $LRS = new TinCan\RemoteLRS(
            'https://telt.idmt.fraunhofer.de/learninglocker/data/xAPI/',
            PANDA::$TinCan_Version,
            '57d20321ecfe48843f81a4056c79d4583f9f0d2b',
            '05ba84235f13e5968785ae582eb4a130057f3cc1'
        );

        $Return = $LRS->saveStatement($Statement);
        return $Return;
    }

    public static function TinCan_GetCoinTemplate(){
        require_once '../Modules/TinCan/autoload.php';

        $Definition = new TinCan\ActivityDefinition();
        $Definition->setExtensions(new TinCan\Extensions());

        $Object = new TinCan\Activity();
        $Object->setDefinition($Definition);

        $Statement = new TinCan\Statement();
        $Statement->setVersion(PANDA::$TinCan_Version);
        $Statement->setActor(new TinCan\Agent());
        $Statement->setVerb(new TinCan\Verb());
        $Statement->setObject($Object);

        return $Statement;
    }

    public static function TinCan_CreateStatementChapter($Statement,$Coin)
    {
        $Coin['user'] = PANDA::Moodle_GetUser($Coin['userID']);

        $Statement->getActor()->setName($Coin['user']['firstname']." ".$Coin['user']['lastname']);
        $Statement->getActor()->setMBox($Coin['user']['email']);

        $Statement->getVerb()->setId("http://adlnet.gov/expapi/verbs/launched");
        $Statement->getVerb()->getDisplay()->set("en-US","launched");

        $Statement->getObject()->setId("http://141.24.211.89/moodleIKS/");
        $Statement->getObject()->getDefinition()->setType("http://adlnet.gov/expapi/activities/module");
        $Statement->getObject()->getDefinition()->getName()->set("en-US","MoodleIKS chapter");

        $Extension = array();
        $Extension['bookID'] = $Coin['bookID'];
        $Extension['bookTitle'] = $Coin['bookTitle'];
        $Extension['chapterID'] = $Coin['chapterID'];
        $Extension['chapterTitle'] = $Coin['chapterTitle'];

        $Statement->getObject()->getDefinition()->getExtensions()->set("http://goldi-labs.net/statements/moodle_chapter",json_encode($Extension,JSON_UNESCAPED_UNICODE));

        $Time = DateTime::createFromFormat('Y-m-d H:i:s', $Coin['timestamp']);
        $Statement->setTimestamp($Time);

        return $Statement;
    }

    public static function TinCan_CreateStatementLogin($Statement,$Coin)
    {
        $Coin['user'] = PANDA::Moodle_GetUser($Coin['userID']);

        $Statement->getActor()->setName($Coin['user']['firstname']." ".$Coin['user']['lastname']);
        $Statement->getActor()->setMBox($Coin['user']['email']);

        $Statement->getVerb()->setId("https://w3id.org/xapi/adl/verbs/logged-in");
        $Statement->getVerb()->getDisplay()->set("en-US","logged-in");

        $Statement->getObject()->setId("http://141.24.211.89/moodleIKS/");
        $Statement->getObject()->getDefinition()->getName()->set("en-US","MoodleIKS login");

        $Time = DateTime::createFromFormat('Y-m-d H:i:s', $Coin['timestamp']);
        $Statement->setTimestamp($Time);

        return $Statement;
    }

    public static function TinCan_CreateStatementICO($Statement,$Coin)
    {
        $Coin['user'] = PANDA::Moodle_GetUser($Coin['userID']);

        $Statement->getActor()->setName($Coin['user']['firstname']." ".$Coin['user']['lastname']);
        $Statement->getActor()->setMBox($Coin['user']['email']);

        $Statement->getVerb()->setId("http://adlnet.gov/expapi/verbs/interacted");
        $Statement->getVerb()->getDisplay()->set("en-US","interacted");

        $Statement->getObject()->setId("http://141.24.211.89/moodleIKS/");
        $Statement->getObject()->getDefinition()->setType("http://adlnet.gov/expapi/activities/interaction");
        $Statement->getObject()->getDefinition()->getName()->set("en-US","MoodleIKS ICO BMA/BAA");

        $Extension = array();
        $Extension['icoID'] = $Coin['icoID'];
        $Extension['percentage'] = $Coin['percentage'];
        $Extension['eval'] = $Coin['eval'];
        $Extension['hintLevel'] = $Coin['hintLevel'];

        $Statement->getObject()->getDefinition()->getExtensions()->set("http://goldi-labs.net/statements/moodle_ico_bmabaa",json_encode($Extension,JSON_UNESCAPED_UNICODE));

        $Time = DateTime::createFromFormat('Y-m-d H:i:s', $Coin['timestamp']);
        $Statement->setTimestamp($Time);

        return $Statement;
    }

    public static function TinCan_CreateStatementURL($Statement,$Coin)
    {
        $Coin['user'] = PANDA::Moodle_GetUser($Coin['userID']);

        $Statement->getActor()->setName($Coin['user']['firstname']." ".$Coin['user']['lastname']);
        $Statement->getActor()->setMBox($Coin['user']['email']);

        $Statement->getVerb()->setId("http://adlnet.gov/expapi/verbs/launched");
        $Statement->getVerb()->getDisplay()->set("en-US","launched");

        $Statement->getObject()->setId($Coin['urlContent']);
        $Statement->getObject()->getDefinition()->setType("http://adlnet.gov/expapi/activities/objective");
        $Statement->getObject()->getDefinition()->getName()->set("en-US","MoodleIKS URL");

        $Extension = array();
        $Extension['userID'] = $Coin['userID'];
        $Extension['urlID'] = $Coin['urlID'];
        $Extension['urlContent'] = $Coin['urlContent'];

        $Statement->getObject()->getDefinition()->getExtensions()->set("http://goldi-labs.net/statements/moodle_url",json_encode($Extension,JSON_UNESCAPED_UNICODE));

        $Time = DateTime::createFromFormat('Y-m-d H:i:s', $Coin['timestamp']);
        $Statement->setTimestamp($Time);

        return $Statement;
    }

    public static function TinCan_CreateStatementGOLDiLogins($Statement,$Coin)
    {
        $Coin['user'] = PANDA::GOLDi_GetUser($Coin['UserID']);

        $Statement->getActor()->setName($Coin['user']['FirstName']." ".$Coin['user']['LastName']);
        $Statement->getActor()->setMBox($Coin['user']['Email']);

        $Statement->getVerb()->setId("https://w3id.org/xapi/adl/verbs/logged-in");
        $Statement->getVerb()->getDisplay()->set("en-US","logged-in");

        $Statement->getObject()->setId("http://goldi-labs.net/");
        $Statement->getObject()->getDefinition()->getName()->set("en-US","GOLDi-Labs.net login");

        $Time = DateTime::createFromFormat('Y-m-d H:i:s', $Coin['Timestamp']);
        $Statement->setTimestamp($Time);

        return $Statement;
    }

    public static function TinCan_CreateStatementGOLDiURLs($Statement,$Coin)
    {
        $Coin['user'] = PANDA::GOLDi_GetUser($Coin['UserID']);

        $Statement->getActor()->setName($Coin['user']['FirstName']." ".$Coin['user']['LastName']);
        $Statement->getActor()->setMBox($Coin['user']['Email']);

        $Statement->getVerb()->setId("http://adlnet.gov/expapi/verbs/launched");
        $Statement->getVerb()->getDisplay()->set("en-US","launched");

        $Statement->getObject()->setId("http://goldi-labs.net".$Coin['URL']);
        $Statement->getObject()->getDefinition()->setType("http://adlnet.gov/expapi/activities/objective");
        $Statement->getObject()->getDefinition()->getName()->set("en-US","GOLDi-Labs.net URL");

        $Extension = array();
        $Extension['UserID'] = $Coin['UserID'];
        $Extension['URL'] = $Coin['URL'];
        $Extension['SiteID'] = $Coin['SiteID'];
        $Extension['URLName'] = $Coin['URLName'];

        $Statement->getObject()->getDefinition()->getExtensions()->set("http://goldi-labs.net/statements/goldi_url",json_encode($Extension,JSON_UNESCAPED_UNICODE));

        $Time = DateTime::createFromFormat('Y-m-d H:i:s', $Coin['Timestamp']);
        $Statement->setTimestamp($Time);

        return $Statement;
    }

    public static function TinCan_CreateStatementGOLDiExperiments($Statement,$Coin)
    {
        $Coin['user'] = PANDA::GOLDi_GetUser($Coin['UserID']);

        $Statement->getActor()->setName($Coin['user']['FirstName']." ".$Coin['user']['LastName']);
        $Statement->getActor()->setMBox($Coin['user']['Email']);

        $Statement->getVerb()->setId("http://adlnet.gov/expapi/verbs/interacted");
        $Statement->getVerb()->getDisplay()->set("en-US","interacted");

        $Statement->getObject()->setId("http://goldi-labs.net");
        $Statement->getObject()->getDefinition()->setType("http://adlnet.gov/expapi/activities/objective");
        $Statement->getObject()->getDefinition()->getName()->set("en-US","GOLDi-Labs.net experiment");

        $Extension = array();
        $Extension['ExperimentID'] = $Coin['ExperimentID'];
        $Extension['UserID'] = $Coin['UserID'];
        $Extension['BPUType'] = $Coin['BPUType'];
        $Extension['BPUVirtual'] = $Coin['BPUVirtual'];
        $Extension['PSPUType'] = $Coin['PSPUType'];
        $Extension['PSPUVirtual'] = $Coin['PSPUVirtual'];
        $Extension['StartTime'] = (new DateTime("@".$Coin['StartTime']))->format("c");
        $Extension['EndTime'] = (new DateTime("@".$Coin['EndTime']))->format("c");
        $Extension['Location'] = $Coin['Location'];
        $Extension['ExperimentID'] = $Coin['ExperimentID'];

        $Statement->getObject()->getDefinition()->getExtensions()->set("http://goldi-labs.net/statements/goldi_experiment",json_encode($Extension,JSON_UNESCAPED_UNICODE));

        $Time = DateTime::createFromFormat('Y-m-d H:i:s', $Coin['Timestamp']);
        $Statement->setTimestamp($Time);

        return $Statement;
    }

    public static function TinCan_CreateStatementGOLDiExperimentErrors($Statement,$Coin)
    {
        $Coin = array_merge($Coin,PANDA::GOLDi_GetExperiment($Coin['ExperimentID']));
        $Coin['user'] = PANDA::GOLDi_GetUser($Coin['UserID']);

        $Statement->getActor()->setName($Coin['user']['FirstName']." ".$Coin['user']['LastName']);
        $Statement->getActor()->setMBox($Coin['user']['Email']);

        $Statement->getVerb()->setId("http://adlnet.gov/expapi/verbs/interacted");
        $Statement->getVerb()->getDisplay()->set("en-US","interacted");

        $Statement->getObject()->setId("http://goldi-labs.net");
        $Statement->getObject()->getDefinition()->setType("http://adlnet.gov/expapi/activities/objective");
        $Statement->getObject()->getDefinition()->getName()->set("en-US","GOLDi-Labs.net experiment error");

        $Extension = array();
        $Extension['ExperimentID'] = $Coin['ExperimentID'];
        $Extension['UserID'] = $Coin['UserID'];
        $Extension['BPUType'] = $Coin['BPUType'];
        $Extension['BPUVirtual'] = $Coin['BPUVirtual'];
        $Extension['PSPUType'] = $Coin['PSPUType'];
        $Extension['PSPUVirtual'] = $Coin['PSPUVirtual'];
        $Extension['StartTime'] = (new DateTime("@".$Coin['StartTime']))->format("c");
        $Extension['EndTime'] = (new DateTime("@".$Coin['EndTime']))->format("c");
        $Extension['Location'] = $Coin['Location'];
        $Extension['ExperimentID'] = $Coin['ExperimentID'];

        $Extension['ErrorID'] = $Coin['ID'];
        $Extension['ErrorCode'] = $Coin['ErrorCode'];
        $Extension['ErrorCodeSource'] = $Coin['ErrorCodeSource'];
        $Extension['MessageCounter'] = $Coin['MessageCounter'];

        $Statement->getObject()->getDefinition()->getExtensions()->set("http://goldi-labs.net/statements/goldi_experiment_error",json_encode($Extension,JSON_UNESCAPED_UNICODE));

        $Time = DateTime::createFromFormat('Y-m-d H:i:s', $Coin['Timestamp']);
        $Statement->setTimestamp($Time);

        return $Statement;
    }

    public static function TinCan_SendCoins($Table)
    {
        $StatementTemplate = PANDA::TinCan_GetCoinTemplate();
        $Counter = PANDA::$TinCan_SendCounter;
        $Return = array();
        $Return["error"] = 0;
        $Return["success"] = 0;

        foreach(PANDA::LRS_GetCoins($Table) as $Coin)
        {
            $Statement = clone $StatementTemplate;
            switch($Table)
            {
                case 'chapter':
                    PANDA::TinCan_CreateStatementChapter($Statement,$Coin);
                    break;
                case 'login':
                    PANDA::TinCan_CreateStatementLogin($Statement,$Coin);
                    break;
                case 'ico':
                    PANDA::TinCan_CreateStatementICO($Statement,$Coin);
                    break;
                case 'url':
                    PANDA::TinCan_CreateStatementURL($Statement,$Coin);
                    break;
                case 'GOLDiLogins':
                    PANDA::TinCan_CreateStatementGOLDiLogins($Statement,$Coin);
                    break;
                case 'GOLDiURLs':
                    PANDA::TinCan_CreateStatementGOLDiURLs($Statement,$Coin);
                    break;
                case 'GOLDiExperiments':
                    PANDA::TinCan_CreateStatementGOLDiExperiments($Statement,$Coin);
                    break;
                case 'GOLDiExperimentErrors':
                    PANDA::TinCan_CreateStatementGOLDiExperimentErrors($Statement,$Coin);
                    break;
                default:
                    $Return["error"]++;
                    return $Return;
            }

//            return json_encode($Statement->asVersion(PANDA::$TinCan_Version), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
//            print_r($Statement->asVersion(PANDA::$TinCan_Version));

            $Response = PANDA::TinCan_SendStatement($Statement);
            if ($Response->success)
             {
                if(PANDA::LRS_SetCoinTransmitted($Table,$Coin['ID']))
                    $Return["success"]++;
            }
            else
            {
                $Return["error"]++;
//                echo $Response->content;
//                exit;
            }

            if(--$Counter<=0)
                return $Return;

        }
    }

    public static function Api_GetNumberOfStoredCoins($Table = null)
    {
        if($Table != null)
        {
            if (PANDA::$DBLink == null)
                PANDA::Connect("lrs");

            $Query = "SELECT COUNT(`transmitted`) as `number` FROM `$Table` WHERE `transmitted` = '0'";

            $Result = PANDA::Query($Query);

            PANDA::Close();

            if ($Result)
            {
                $Line = mysqli_fetch_assoc($Result);
                return intval($Line['number']);
            }

            return $Result;
        }
        else
        {
            $Return = array();
            foreach(PANDA::API_GetTables() as $Table)
                $Return[$Table] = PANDA::Api_GetNumberOfStoredCoins($Table);
            return $Return;
        }
    }

    public static function API_GetTables()
    {
        if(PANDA::$DBLink==null)
            PANDA::Connect("lrs");

        $Query = "SHOW Tables";

        $Result = PANDA::Query($Query);

        PANDA::Close();

        if($Result)
        {
            $Return = array();
            while($Line = mysqli_fetch_row($Result))
                $Return[] = $Line[0];
            return $Return;
        }

        return $Result;
    }
}