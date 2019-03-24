<?php


class Functions
{
    public static function ExtendJSCSSFilePathsWithTimeStamp($Content){
        $RegEx = <<<REG
/["']([^"']*\.(js|css|JS|CSS))["']/
REG;

        return preg_replace_callback(
            $RegEx,
            function($matches){
//                try{
                    $Ret = $matches[1]."?t=".filemtime($matches[1]);
//                }catch(Exception $e){
//                    die($matches[1]);
//                }
                return '"'.$Ret.'"';
            },
            $Content
        );
    }

    public static function SendSMTPMail($To, $Subject, $Body){
        require 'Modules/PHPMailer/PHPMailerAutoload.php';

        $mail = new PHPMailer;
//        $mail->SMTPDebug = 3;
        $mail->CharSet = 'utf-8';
        $mail->isSMTP();
        $mail->Host = Definitions::SMTPHost;
        $mail->SMTPAuth = Definitions::SMTPAuthentification;
        if(Definitions::SMTPAuthentification)
            $mail->SMTPSecure = 'ssl';
        $mail->Username = Definitions::SMTPUsername;
        $mail->Password = Definitions::SMTPPassword;
        $mail->Port = Definitions::SMTPPort;

        $mail->From = Definitions::SMTPMailAddressFrom;
        $mail->FromName = Definitions::SMTPMailAddressFromName;
        $mail->addAddress($To);
//        $mail->addReplyTo('info@example.com', 'Information');
        $mail->addCC(Definitions::SMTPMailAddressFrom);
//        $mail->addBCC('bcc@example.com');

//        $mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//        $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
        $mail->isHTML(true);                                  // Set email format to HTML

        $mail->Subject = $Subject;
        $mail->Body    = $Body;
//        $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

        if(!$mail->send()) {
            return 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
        } else {
            return 'Message has been sent';
        }
    }

     public static function SendSMTPMailPearMailMime($To, $Subject, $Body){
        require_once "Modules/SMTPMail/Mail.php";
        require_once('Modules/SMTPMail/Mail_Mime/Mail/mime.php');

        $From = Definitions::SMTPMailAddressFrom;
        $Cc = Definitions::SMTPMailAddressCc;

        $Host = Definitions::SMTPHost;
        $Username = Definitions::SMTPUsername;
        $Password = Definitions::SMTPPassword;

        $SMTP = Mail::factory(
            'smtp',
            array (
                'port' => Definitions::SMTPPort,
                'host' => $Host,
                'auth' => Definitions::SMTPAuthentification,
                'username' => $Username,
                'password' => $Password
            )
        );

        $Mail = new Mail_Mime(PHP_EOL);
        $Mail->setHTMLBody($Body);
        $Headers = $Mail->headers();
        $Headers['From'] = $From;
        $Headers['Return-Path'] = $From;
        $Headers['To'] = $To;
        $Headers['Subject'] = $Subject;
        $Headers['Content-type'] = 'text/html';
        $Headers['Charset'] = 'UTF-8';

        $TMP = $Mail->get();

        $Error = $SMTP->send(
            $To,
            $Headers,
            $TMP
        );

        $SMTP->send(
            $Cc,
            $Headers,
            $TMP
        );

        return $Error;
    }

    public static function StartSession()
    {
        session_start();
        if (!isset($_SESSION['UserID']))
            $_SESSION['UserID'] = 0;
        if (!is_numeric($_SESSION['UserID']))
            $_SESSION['UserID'] = 0;
    }

    public static function EndSession(){
        Database::BookingQueue_Dequeue($_SESSION['UserID'],"BPU");
        Database::BookingQueue_Dequeue($_SESSION['UserID'],"PSPU");
        unset($_SESSION);
        session_regenerate_id(true);
        session_destroy();
    }

    public static function GetArrayFromFile($Filename)
    {
        if(is_file($Filename)){
            $String = file_get_contents($Filename);
            return unserialize($String);
        }else{
            return array();
        }
    }

    public static function PutArrayToFile($Array, $Filename)
    {
        file_put_contents($Filename, serialize($Array));
    }

    public static function RedirectToErrorSite($Error,$Hint="")
    {
        if($Hint=="")
            header("location: index.php?Site=20&Error=$Error");
        else
            header("location: index.php?Site=20&Error=$Error&Hint=$Hint");
        exit;
    }

    public static function MyDate($Format, $Time)
    {
        return str_replace(" ", "&nbsp;", strftime(lang($Format), strtotime($Time)));
    }

    public static function GetURLWithoutLocale()
    {
//        $URL = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
        $URL = "index.php";

        if(isset($_GET['locale']))
            unset($_GET['locale']);

        return $URL."?".http_build_query($_GET);
    }

    public static function GetURL()
    {
        return $_SERVER['REQUEST_URI'];
    }

    public static function GetIP()
    {
        return $_SERVER['SERVER_ADDR'];
    }

    public static function ReloadPage()
    {
        header('Location:' . get_url());
    }

    public static function MinutesToHours($Minutes)
    {
        if ($Minutes >= 60) {
            $m = $Minutes % 60;
            $h = floor(($Minutes - $m) / 60);
            return $h . ' h ' . $m . ' min';
        } else {
            return $Minutes . ' min';
        }
    }

    public static function SecondsToH_Min_Sec($Time)
    {
        $Sec = $Time % 60;
        $Time -= $Sec;
        $Time /= 60;
        $Min = $Time % 60;
        $Time -= $Min;
        $Time /= 60;
        $H = $Time % 24;
        return $H.":".str_pad($Min,2,"0", STR_PAD_LEFT ).":".str_pad($Sec,2,"0", STR_PAD_LEFT );
    }

    public static function NBSP($t)
    {
        return str_replace(" ", "&nbsp;", $t);
    }

    public static function StringIncludingSpecialCharacter($String){
        $IncludingSpecialCharacter  = false;
        $IncludingSpecialCharacter |= preg_match('/[\[\]()<>\'"]/',$String);
        return $IncludingSpecialCharacter;
    }

    public static function GetMode($PSPUVirtual, $BPUVirtual){
        $Mode = "";

        if ($BPUVirtual && $PSPUVirtual)
            $Mode = 'A';
        if ($BPUVirtual && !$PSPUVirtual)
            $Mode = 'B';
        if (!$BPUVirtual && !$PSPUVirtual)
            $Mode = 'C';
        if (!$BPUVirtual && $PSPUVirtual)
            $Mode = 'D';

        return $Mode;
    }

    public static function BPUIsVirtualInMode($Mode){
        return in_array(strtoupper($Mode),array("A","B"));
    }

    public static function PSPUIsVirtualInMode($Mode){
        return in_array(strtoupper($Mode),array("A","D"));
    }

    public static function LoadTemplate($URL, $Placeholder = array()){
        $SiteContent = file_get_contents($URL);

        if(sizeof($Placeholder) > 0){
            $ReplaceTags = array_keys($Placeholder);
            $ReplaceValues = array_values($Placeholder);

            $SiteContent = str_replace(
                $ReplaceTags,
                $ReplaceValues,
                $SiteContent
            );
        }

        return $SiteContent;
    }

    public static function CheckSessionIsTimedOut(){
        return (isset($_SESSION['LastAction']) and ($_SESSION['LastAction'] + Definitions::SessionTimeoutSeconds < time()));
    }

    public static function CheckIPHasChanged(){
        $LastLoginInfos = Database::User_GetLastIPAndSessionForUserID($_SESSION['UserID']);
        return  ($_SESSION['UserID'] != 0) AND // Nutzer eingeloggt
            ($LastLoginInfos['LastSessionID'] == session_id()) AND
            ($LastLoginInfos['LastIP'] != $_SERVER['REMOTE_ADDR']);
    }

    public static function CheckSessionIDHasChanged(){
        $LastLoginInfos = Database::User_GetLastIPAndSessionForUserID($_SESSION['UserID']);
        return  ($_SESSION['UserID'] != 0) AND // Nutzer eingeloggt
                ($LastLoginInfos['LastSessionID'] != session_id());
    }

    public static function CheckPrivacyAccepted(){
        return $_SESSION['UserID'] == 0 or Database::User_GetUserByID($_SESSION['UserID'])['PrivacyAgreement'] == 1;
    }

    public static function Ajax_isAdminOfLocation($Location){
        return in_array($Location,Database::Navigation_GetAdminLocationsOfUser($_SESSION['UserID']));
    }

    public static function Ajax_TestRequestLocation(){
        $Locations = Database::Locations_GetAllLocations();
        if(!isset($_REQUEST['Location']) or !in_array($_REQUEST['Location'],$Locations))
            die("Wrong Location, use: Location = [".implode(" | ",$Locations)."]");
    }

    public static function Ajax_TestRequestMode()
    {
        $Modes = ['a','b','c','d'];
        if(!isset($_REQUEST['Mode']) or !in_array(strtolower($_REQUEST['Mode']),$Modes))
            die("Wrong Mode, use: Mode = [".implode(" | ",$Modes)."]");
    }

    public static function Ajax_TestRequestBPUType()
    {
        $BPUTypes = Database::Devices_GetExistingBPUTypes();
        if(!isset($_REQUEST['BPUType']) or !in_array($_REQUEST['BPUType'],$BPUTypes))
            die("wrong BPUType, use BPUType = [".implode(" | ",$BPUTypes)."]");
    }

    public static function Ajax_TestRequestPSPUType()
    {
        $PSPUTypes = Database::Devices_GetExistingPSPUTypes();
        if(!isset($_REQUEST['PSPUType']) or !in_array($_REQUEST['PSPUType'],$PSPUTypes))
            die("wrong PSPUType, use PSPUType = [".implode(" | ",$PSPUTypes)."]");
    }

    public static function Ajax_TestRequestDeviceType()
    {
        $DeviceType = Database::Server_GetAllDeviceTypes();
        if(!isset($_REQUEST['DeviceType']) or !in_array($_REQUEST['DeviceType'],$DeviceType))
            die("wrong DeviceType, use DeviceType = [".implode(" | ",$DeviceType)."]");
    }

    public static function Ajax_TestRequestLocale()
    {
        $Locales = Database::Language_GetAvailableLocales();
        if(!isset($_REQUEST['Locale']) or !in_array($_REQUEST['Locale'],$Locales))
            die("wrong Locale, use Locale = [".implode(", ",$Locales)."]");
    }

    public static function Ajax_TestRequestEperimentID()
    {
        if(!isset($_REQUEST['ExperimentID']) or !is_numeric($_REQUEST['ExperimentID']))
            die("wrong ExperimentID, use ID of existing Experiment");
    }

    public static function Ajax_TestStartTime()
    {
        if(!isset($_REQUEST['StartTime']) or !is_numeric($_REQUEST['StartTime']))
            die("wrong StartTime, use timestamp as StartTime");
    }

    public static function Ajax_TestEndTime()
    {
        if(!isset($_REQUEST['EndTime']) or !is_numeric($_REQUEST['EndTime']))
            die("wrong EndTime, use timestamp as EndTime");
    }

    public static function Ajax_GetLocationFromServer(){
        $Address = gethostbyname($_SERVER['REMOTE_ADDR']);
        return isset(Database::Locations_GetAllAllowedAddressesForLocations()[$Address])?Database::Locations_GetAllAllowedAddressesForLocations()[$Address]:null;
    }
}
