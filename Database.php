<?php
require_once("Definitions.php");


class Database
{
    private static $Link = null;

    public  static function Query($String){
        if(Database::$Link == null)
            Database::Connect();

        return Database::$Link->query($String);
    }

    private static function AffectedRows(){
        return mysqli_affected_rows(Database::$Link);
    }

    private static function MYQLiError(){
        return mysqli_error(Database::$Link);
    }

    /*===================== GENERAL =============================*/
    /**
     * Baut die SQL-Verbindung mit dem Server auf.
     * Die Server-Daten werden durch die Funktion get_def aus der Datei /definitions.php geholt.
     */
    public static function Connect()
    {
        Database::$Link = new mysqli(
            Definitions::ServerURL,
            Definitions::ServerSQLUsername,
            Definitions::ServerSQLPassword,
            Definitions::ServerSQLDBName
        ) or die('Could not connect to mysql server.');

        Database::Query("SET character_set_results = 'utf8', character_set_client = 'utf8', character_set_connection = 'utf8', character_set_database = 'utf8', character_set_server = 'utf8'");

        Database::Query("UPDATE `User` SET `LastIP` = NULL, `LastSessionID` = NULL WHERE DATE(`LastLogin`) < DATE_SUB(CURDATE(), INTERVAL 7 DAY)");
//        return Database::$Link->select_db(Definitions::ServerSQLDBName) or die('Could not select database.');
    }

    /*===================== Funktionen f�r die Sprachverwaltung ==============================*/

    /**
     * Gibt ein Array zurück, in dem alle Language-Module enthalten sind
     * @return Array mit Language-Modulen.
     *
     * Array
     * (
     * [0] => Module AuthentificationModule
     * ...
     * )
     */
    public static function Language_GetModules()
    {
        $Query = "SELECT * FROM `LocaleModules`";
        $Result = Database::Query($Query);
        $TMP = array();
        while ($Line = mysqli_fetch_assoc($Result))
            $TMP[] = $Line['module'];
        return $TMP;
    }

    /**
     * Gibt ein Array zurück, in dem alle vorhanden Sprachen der Tabelle `LocaleTags` enthalten sind.
     * @return Array mit vorhandenen Sprachen enthalten.
     * Array
     * (
     * [0] => de_DE
     * ...
     * )
     */
    public static function Language_GetAvailableLocales()
    {
        $Query = "SHOW COLUMNS FROM `LocaleTags`";
        $Result = Database::Query($Query);
        $Return = array();
        while ($Line = mysqli_fetch_assoc($Result))
            if ($Line['Field'] != 'LanguageModule' and $Line['Field'] != 'Tags' and $Line['Field'] != 'ModuleGroup')
                $Return[] = $Line['Field'];

        return $Return;
    }

    /**
     * Gibt ein Array zur�ck, in dem alle benutzten Tags und die �bersetzungeneines Moduls enthalten sind.
     * @Module der Parameter gibt den Namen des Moduls an, von dem die �bersetzungen abgefragt werden
     * @Locale Parameter, die die gew�nschte Sprache �bergibt
     * @return Sortiertes Array mit vorhandenen Tags und allen �bersetzungen eines Moduls
     * Array
     * (
     * [de_DE] => Array
     * (
     * [3-Axis Crane] => 3-Achs-Portal
     * ...
     * )
     * ...
     * )
     */
    public static function Language_GetTranslations($Modules, $Locale)
    {
        $TMP = array();
        foreach($Modules as $Module)
            $TMP[] = "`LanguageModule` = '$Module'";

        $Query = "select `Tags`,`$Locale`,`".Definitions::DefaultLocale."` from `LocaleTags` where ".implode(" or ",$TMP)." order by `Tags` ASC";

        $Result = Database::Query($Query);
        if (!$Result)
            return array();

        $Return = array();

        while ($Line = mysqli_fetch_assoc($Result))
            if($Line[$Locale] == ""){
                $Return[strtoupper($Line['Tags'])] = $Line[Definitions::DefaultLocale];
            }else{
                $Return[strtoupper($Line['Tags'])] = $Line[$Locale];
            }

        return $Return;
    }

    // Language Funktionen
    /**
     * @param null $Module
     * @return array|bool
     */
    public static function Language_LoadAllTags($Module = null)
    {
        if($Module == null)
        {
            $Query = "SELECT `Tags` FROM `LocaleTags` WHERE 1";
        }
        else
        {
            $Query = "SELECT `Tags` FROM `LocaleTags` WHERE `LanguageModule` = '$Module'";
        }
        $Result = Database::Query($Query);

        if ($Result) {
            $Return = Array();
            while ($row = mysqli_fetch_assoc($Result))
                $Return[] = '[[**' . $row['Tags'] . '**]]';

            return $Return;
        } else
            return false;
    }

    public static function Language_LoadAllTranslations($Locale,$Module = null)
    {
        if($Module == null)
        {
            $Query = "SELECT `$Locale` FROM `LocaleTags` WHERE 1";
        }
        else
        {
            $Query = "SELECT `$Locale` FROM `LocaleTags` WHERE `LanguageModule` = '$Module'";
        }

        $Result = Database::Query($Query);

        if ($Result) {
            $Return = Array();
            while ($Line = mysqli_fetch_assoc($Result))
                $Return[] = $Line[$Locale];

            return $Return;
        } else
            return false;
    }

    public static function Langauge_InsertTags($Module,$Tags)
    {
        if (is_array($Tags)) {
            $Return = true;
            foreach ($Tags as $Tag) {
                $Query = "INSERT INTO `LocaleTags`(`LanguageModule`, `Tags`) VALUES ('$Module','$Tag')";
                $Return &= Database::Query($Query);
            }

            return $Return;
        } else {
            $Query = "INSERT INTO `LocaleTags`(`LanguageModule`, `Tags`) VALUES ('$Module','$Tags')";
            return Database::Query($Query);
        }
    }

    public static function Langauge_GetGIFTTags($Language)
    {
        $Query = "SELECT * FROM `LocaleTags` WHERE `LanguageModule` = 'GIFT'";

        $Result = Database::Query($Query);

        $Return = array();

        while ($Line = mysqli_fetch_assoc($Result))
        {
            $Return[$Line['ModuleGroup']][$Line['Tags']] = $Line[$Language];
        }
        return $Return;
    }

    /**
     * Wird aufgerufen, um für die Location die aktuelle DeviceList in der Datenbank zu aktualisieren
     * @param $Location zu aktualisierende Location
     * @param $Data Neue DeviceList
     */
    public static function Devices_SetDeviceList($Location, $Data)
    {
        $Query_SetInactive = "UPDATE `Devices` SET `IsConnected` = '0' WHERE Location = '$Location' and Virtual = '0'";
        Database::Query($Query_SetInactive);

        foreach ($Data as $Record)
        {
            $Type = $Record['Type'];
            $ServiceDestID = $Record['ServiceDestID'];

            if ($Type == "" || $ServiceDestID  == "")
                continue;

            $Query_GetState = "SELECT * FROM `Devices` WHERE `Type` = '$Type' AND `Location` = '$Location' AND `ServiceDestID` = '$ServiceDestID' AND `Virtual` = '0'";
            $Result_GetState = Database::Query($Query_GetState);

            if (mysqli_num_rows($Result_GetState) >= 1)
            {
                $Query_SetActive = "UPDATE `Devices` SET `IsConnected` = '1' WHERE `Type` = '$Type' AND `Location` = '$Location' AND `ServiceDestID` = '$ServiceDestID' AND `Virtual` = '0'";
                Database::Query($Query_SetActive);
            }
            else
            {
                $Query_Insert = "INSERT INTO `tempus`.`Devices` (`Type`, `Location`, `ServiceDestID`, `Virtual`, `InMaintenance`, `IsConnected`) VALUES ('$Type', '$Location', '$ServiceDestID', '0', '0', '1')";
                Database::Query($Query_Insert);
            }
        }
    }

    public static function Devices_SetDeviceToMaintenance($DeviceType, $Location, $ServiceDestID, $Virtual, $InMaintenance)
    {
        $Query = "UPDATE `Devices` SET `InMaintenance` = '$InMaintenance' WHERE `Type` = '$DeviceType' AND `Location` = '$Location' AND `ServiceDestID` = '$ServiceDestID' AND `Virtual` = '$Virtual';";
        Database::Query($Query);
        return Database::AffectedRows() == 1;
    }
        /**
     * Direkte Kopie der Devices-Tabelle für die entsprechende Location. Geräte in Wartung sind ebenfalls enthalten
     *
     * Array
     * (
     *      [0] => Array
     *      (
     *          [Type] => DigitalDemoBoard
     *          [Location] => IUT
     *          [ServiceDestID] => 1803
     *          [Virtual] => 0
     *          [InMaintenance] => 1
     *          [Category] => BPU
     *          [AllowedFileType] => .pof
     *      )
     * ...
     * Wird benutzt, um im Adminbereich alle Geräte anzuzeigen
     * @param $Location
     * @return array
     */
    public static function Devices_GetAllDevicesWithCategory($Location = "")
    {
        $Query = "SELECT * FROM `Devices` NATURAL JOIN `DeviceTypes` ".($Location==""?"":"WHERE `Location`='$Location'")." order by `Location` ASC, `IsConnected` DESC, `InMaintenance` ASC, `Type` ASC";
        $Result = Database::Query($Query);

        $Return = array();
        while($Line = mysqli_fetch_assoc($Result))
            $Return [] = $Line;

        return $Return;
    }

    public static function Devices_GetNumberOfRealExistingDevicesOfType($DeviceType,$Location){
        $Query = "SELECT * FROM `Devices` NATURAL JOIN `DeviceTypes` WHERE `Type`='$DeviceType' AND `Virtual`='0' AND `InMaintenance`='0' AND `Location`='$Location'";
        $Result = Database::Query($Query);
        return mysqli_num_rows($Result);
    }

    /**
     * Gruppiert die ServiceDestIDs aller Geräte, die nicht in Wartung sind über die Kategory, den Typ und virtuell.
     * [PSPU] => Array
     * (
     *      [3AxisPortal] => Array
     *      (
     *          [1] => Array
     *          (
     *              [1856] => 1856
     *          )
     *
     *          [0] => Array
     *          (
     *              [1860] => 1860
     *          )
     * )
     * Aktuell verwendet in zum Aufbau der Warteschlangen für die Admin-Ansicht und für die Ajax-Anfrage was für Geräte für den Experimentstart angeschlossen sind
     * @param $Location
     * @return array
     */
    public static function Devices_GetExistingDevices($Location)
    {
        $Query = "select * from `Devices` natural join `DeviceTypes` where `InMaintenance` = '0' and `IsConnected` = '1' and `Location` = '$Location' order by `Category`,`Type`,`Virtual` desc";
        $Result = Database::Query($Query);

        $AvailableDevices = array();
        while ($Line = mysqli_fetch_assoc($Result))
            $AvailableDevices[$Line['Category']][$Line['Type']][$Line['Virtual']][$Line['ServiceDestID']] = $Line['ServiceDestID'];

        return $AvailableDevices;
    }

    /**
     * Deprecated
     * @param $Location
     * @return array
     */
//    public static function Devices_GetAvailableDevices($Location)
//    {
//        $AvailableDevices = self::Devices_GetExistingDevices($Location);
//
//        $Query = "select * from `Experiments` where '" . time() . "' >= `StartTime` and '" . time() . "' <= `EndTime` and `Location`='$Location'";
//        $Result = Database::Query($Query);
//
//        while ($Line = mysqli_fetch_assoc($Result))
//            foreach ($AvailableDevices as $Category => $Devices)
//                foreach ($Devices as $Type => $Tmp)
//                    foreach ($Tmp as $virtual => $IDs)
//                        if ($virtual == 0 and $IDs != "InUse")
//                            foreach ($IDs as $ID)
//                                if ($Line['BPUServiceDestinationID'] == $ID or $Line['PSPUServiceDestinationID'] == $ID)
//                                    if (sizeof($AvailableDevices[$Category][$Type][$virtual]) == 1) {
//                                        $AvailableDevices[$Category][$Type][$virtual] = "InUse";
//                                    } else {
//                                        unset($AvailableDevices[$Category][$Type][$virtual][$ID]);
//                                    }
//
//        return $AvailableDevices;
//    }

    /* Deprecated
    public static function Devices_GetExisitingDevicesOfOperationModus($OperationModus)
    {
        $sql_condition = "";
        switch ($OperationModus) {
            case 1:
                $sql_condition = " and (`Virtual` = 1) ";
                break;
            case 2:
                $sql_condition = " and (`Virtual` = 0) ";
                break;
        }

        $Return = array();
        $Query = "select * from `Devices` natural join `DeviceTypes` where `Category`!='BCU' and `InMaintenance` = 0 $sql_condition group by `Category`,`Type`,`Virtual` order by `Category`,`Type`,`Virtual` desc";
        $Result = Database::Query($Query);

        while ($Line = mysqli_fetch_assoc($Result))
            if (isset($Return[$Line['Category']][$Line['Type']])) {
                $Return[$Line['Category']][$Line['Type']] += $Line['Virtual'] == 1 ? 1 : 2;
            } else {
                $Return[$Line['Category']][$Line['Type']] = $Line['Virtual'] == 1 ? 1 : 2;
            }

        return $Return;
    }
    */

    /**
     * Wird für die Admin-Ansicht Webcams benutzt
     * @param $Location
     * @return array
     */
    public static function Devices_GetAllDevicesAndWebcams($Location)
    {
        $Query = "select * from `Devices` left outer join `Webcams` on `Devices`.`ServiceDestID` = `Webcams`.`DeviceServiceDestinationID` and `Devices`.`Location` = `Webcams`.`Location` where `Devices`.`Location` = '$Location' and `Devices`.`Virtual` = '0' order by `Virtual`,`Type`";
        $Result = Database::Query($Query);

        $Return = Array();
        while ($Line = mysqli_fetch_assoc($Result))
            $Return[] = $Line;

        return $Return;
    }

    public static function Devices_SetNewWebCamSettings($WebcamType, $URL, $Parameter, $ServiceDestID, $Rotation, $Location)
    {
        $Query = "SELECT * FROM `Webcams` WHERE `DeviceServiceDestinationID` = '$ServiceDestID' AND `Location`='$Location'";
        $Result = Database::Query($Query);
        if(mysqli_num_rows($Result) > 0)
        {
            $Query = "UPDATE `Webcams` SET
                    `WebcamType` = '$WebcamType',
                    `URL` = '$URL',
                    `Parameter` = '$Parameter',
                    `Rotation` = '$Rotation'
                    WHERE `DeviceServiceDestinationID` = '$ServiceDestID' 
                    AND `Location` = '$Location'";
        }
        else
        {
            $Query = "INSERT INTO `Webcams`
                        (`WebcamType`, `URL`, `Parameter`, `DeviceServiceDestinationID`, `Rotation`, `Location`)
                      VALUES
                        ('$WebcamType', '$URL', '$Parameter', '$ServiceDestID', '$Rotation', '$Location')";
        }

        $Result = Database::Query($Query);
        return Database::AffectedRows() == 1;
    }

    /**
     * Gibt ein Array zurück, in dem alle aktuell nicht genutzten Geräte mit ID aufgelistet sind
     * und ob diese virtuell oder real sind. Zugeordnete Werte für Geräte:
     *    1: Virtuell
     *    0: Real
     * @return Array mit freien Ger�ten, IDs und ob diese Virtuel oder Real sind.
     * Array
     * (
     * [3AxisPortal] => Array
     * (
     * [11] => 1
     * [6] => 0
     * )
     * )
     */

    /**
     * Geht aktive Experimente durch und entfernt aktuell verwendete Geräte aus der Liste der vorhandenen Geräte, Gibt diese Liste anschließend zurück
     * @param $Location
     * @return array
     */
    private static function Devices_GetAvailableDevicesWithIDs($Location)
    {
        $AvailableDevices = array();
        $Query = "select * from `Devices` natural join `DeviceTypes` where `InMaintenance` = '0' and `IsConnected` = '1' and `Location` = '$Location' order by `Category`,`Type`,`Virtual` desc";
        $Result = Database::Query($Query);

        while ($Line = mysqli_fetch_assoc($Result))
            $AvailableDevices[$Line['Type']][$Line['ServiceDestID']] = $Line['Virtual'];

        $Query = "select * from `Experiments` where '" . time() . "' > `StartTime` and '" . time() . "' < `EndTime` and `Location` = '$Location'";
        $Result = Database::Query($Query);
        while ($Line = mysqli_fetch_assoc($Result))
            foreach ($AvailableDevices as $Type => $Device)
                foreach ($Device as $ID => $Value)
                    if ($Value == 0)
                        if ($Line['BPUServiceDestinationID'] == $ID or $Line['PSPUServiceDestinationID'] == $ID)
                            unset($AvailableDevices[$Type][$ID]);

        return $AvailableDevices;
    }

    /**
     *
     * @param $DeviceType
     * @param $Virtual = 1, falls virtuelles Gerät und 0, falls reales Gerät
     * @param $Location
     * @return bool|int|string
     */
    public static function Devices_GetAvailableServiceDestIDOfTyp($DeviceType, $Virtual, $Location)
    {
        $AvailableDevices = Database::Devices_GetAvailableDevicesWithIDs($Location);
        if (isset($AvailableDevices[$DeviceType]))
            foreach ($AvailableDevices[$DeviceType] as $ID => $V) {
                if ($V == $Virtual)
                    return $ID;
            }
        return false;
    }

    public static function Devices_GetPermittedDeviceCombinations($Location)
    {
        $PermittedDeviceCombinations = array();
        $Query = "select * from `PermittedDeviceCombinations` where `Location` = '$Location'";
        $Result = Database::Query($Query);

        while ($Line = mysqli_fetch_assoc($Result))
            $PermittedDeviceCombinations[$Line['BPUType']][$Line['BPUVirtual']==1?"Virtual":"Real"][$Line['PSPUType']][$Line['PSPUVirtual']==1?"Virtual":"Real"] = $Line['Permitted'];
//            $PermittedDeviceCombinations[$Line['BPUType']][$Line['BPUVirtual']][$Line['PSPUType']][$Line['PSPUVirtual']] = $Line['Permitted'];

        return $PermittedDeviceCombinations;
    }

    public static function Devices_SetPermittedDeviceCombinations($BPUType,$BPUVirtual,$PSPUType,$PSPUVirtual,$Permitted,$Location)
    {
        $PermittedDeviceCombinations = Database::Devices_GetPermittedDeviceCombinations($Location);

//        if(isset($PermittedDeviceCombinations[$BPUType][$BPUVirtual==1?"Virtual":"Real"][$PSPUType][$PSPUVirtual==1?"Virtual":"Real"]))
        if(isset($PermittedDeviceCombinations[$BPUType][$BPUVirtual][$PSPUType][$PSPUVirtual]))
        {
            if($PermittedDeviceCombinations[$BPUType][$BPUVirtual][$PSPUType][$PSPUVirtual] != $Permitted)
            {
                $Query =
                " update `PermittedDeviceCombinations`
                  set `Permitted` = '".$Permitted."'
                  where
                    `BPUType` = '".$BPUType."' and
                    `BPUVirtual` = '".($BPUVirtual=="Virtual"?1:0)."' and
                    `PSPUType` = '".$PSPUType."' and
                    `PSPUVirtual` = '".($PSPUVirtual=="Virtual"?1:0)."' and
                     `Location` = '$Location'
                ";
                return Database::Query($Query);
            }

            return true;
        }
        else
        {
            $Query =
            "   insert into `PermittedDeviceCombinations` (`BPUType`,`BPUVirtual`,`PSPUType`,`PSPUVirtual`,`Permitted`,`Location`)
                values (
                  '".$BPUType."',
                  '".($BPUVirtual=="Virtual"?1:0)."',
                  '".$PSPUType."',
                  '".($PSPUVirtual=="Virtual"?1:0)."',
                  '".$Permitted."',
                  '".$Location."'
                )
            ";
            return Database::Query($Query);
        }
    }

    public static function Devices_GetBPUTypesForLocation($Location)
    {
        $BPUTypes = array();
        $Query = "select * from `Devices` natural join `DeviceTypes` where `Category` = 'BPU' and `Location` = '$Location' group by `type`,`virtual`";
        $Result = Database::Query($Query);

        while ($Line = mysqli_fetch_assoc($Result))
            $BPUTypes[$Line['Type']][$Line['Virtual']==1?"Virtual":"Real"] = true;

        return $BPUTypes;
    }

    public static function Devices_GetPSPUTypesForLocation($Location)
    {
        $PSPUTypes = array();
        $Query = "select * from `Devices` natural join `DeviceTypes` where `Category` = 'PSPU' and `Location` = '$Location' group by `type`,`virtual`";
        $Result = Database::Query($Query);

        while ($Line = mysqli_fetch_assoc($Result))
            $PSPUTypes[$Line['Type']][$Line['Virtual']==1?"Virtual":"Real"] = true;

        return $PSPUTypes;
    }

    public static function Devices_GetExistingBPUTypes()
    {
        $ExistingBPUTypes = array();
        $Query = "select * from `DeviceTypes` where `Category` = 'BPU'";
        $Result = Database::Query($Query);

        while ($Line = mysqli_fetch_assoc($Result))
            $ExistingBPUTypes[] = $Line['Type'];

        return $ExistingBPUTypes;
    }

    public static function Devices_GetExistingPSPUTypes()
    {
        $ExistingPSPUTypes = array();
        $Query = "select * from `DeviceTypes` where `Category` = 'PSPU'";
        $Result = Database::Query($Query);

        while ($Line = mysqli_fetch_assoc($Result))
            $ExistingPSPUTypes[] = $Line['Type'];

        return $ExistingPSPUTypes;
    }

    public static function Devices_GetCategoryOfDeviceType($DeviceType){
        $Query = "select `Category` from `DeviceTypes` where `Type` = '$DeviceType'";
        $Result = Database::Query($Query);

        if(Database::AffectedRows() == 1)
            return mysqli_fetch_assoc($Result)['Category'];

        return false;
    }

    public static function Locations_GetAllAllowedAddressesForLocations(){
        $Locations = array();
        $Query = "select * from `Locations` order by `Order`";
        $Result = Database::Query($Query);

        while ($Line = mysqli_fetch_assoc($Result)){
            $TMP = explode(";",$Line["IncomingTrafficFilter"]);
            foreach($TMP as $Domain)
                if($Domain != "")
                    $Locations[gethostbyname($Domain)] = $Line["LocationID"];
        }

        return $Locations;
    }

    public static function Locations_GetLocationInformation()
    {
        $Locations = array();
        $Query = "select * from `Locations` order by `Order`";
        $Result = Database::Query($Query);

        while ($Line = mysqli_fetch_assoc($Result)) {
            $Locations[$Line['LocationID']] = $Line;
            unset($Locations[$Line['LocationID']]['ServerPassword']);
        }

        return $Locations;
    }

    public static function Locations_GetAllLocations()
    {
        $Locations = array();
        $Query = "select `LocationID` from `Locations`";
        $Result = Database::Query($Query);

        while ($Line = mysqli_fetch_assoc($Result))
            $Locations[] = $Line['LocationID'];

        return $Locations;
    }

    private static function Protection_SetCompleteProtection($DeviceType,$Assignments)
    {
        $Query = "DELETE FROM `Protections` WHERE `DeviceType` = '$DeviceType'";
        Database::Query($Query);

        foreach ($Assignments as $ErrorCode => $Conditions)
            foreach ($Conditions as $Key => $Values) {
                $Query = "INSERT INTO `Protections` (`DeviceType`, `ErrorCode`, `Type`, `Number`, `Value`) VALUES (
                    '$DeviceType',
                    '" . $ErrorCode . "',
                    '" . $Values['Type'] . "',
                    '" . $Values['Number'] . "',
                    '" . $Values['Value'] . "'

                )";
                Database::Query($Query);
            }
    }

    public static function Protection_InsertFilesIntoDatabase($Files){
        $Path = 'D:\SVN\GOLDiHardware\Firmwares\Modules\PSPU_ErrorMask';

//        $Files = array(
//            "3AxisPortal"       => $Path.'\PU_ErrorMask_3Axis_v1_00\Source\PSPU_ErrorMask_3Axis_v1_00.vhd',
//            "Elevator3Floors"   => $Path.'\PSPU_ErrorMask_Elevator3Floor_v1_00\Source\PSPU_ErrorMask_Elevator3Floor_v1_00.vhd',
//            "Elevator4Floors"   => $Path.'\PSPU_ErrorMask_Elevator4Floor_v1_00\Source\PSPU_ErrorMask_Elevator4Floor_v1_00.vhd',
//            "ProductionCell"    => $Path.'\PSPU_ErrorMask_ProductionCell_v1_04\PSPU_ErrorMask_ProductionCell_v1_04.vhd',
//            "Pump"              => $Path.'\PSPU_ErrorMask_Pump_v1_00\PSPU_ErrorMask_Pump_v1_00.vhd',
//            "Warehouse"         => $Path.'\PSPU_ErrorMask_Warehouse_v1_00\PSPU_ErrorMask_Warehouse_v1_00.vhd'
//        );

        foreach($Files as $DeviceType => $Path){
            $Text = file_get_contents($Path);

            preg_match_all("/^.*\((.*)\).*when(.*);/m",$Text,$SearchLines);

            $Result = array();
            foreach($SearchLines[0] as $LinesKey => $LinesValue){
                preg_match_all("/.*_(.*)\((.*)\).*'(.*)'/mU",$SearchLines[2][$LinesKey],$SearchConditions);

                $Condition = array();
                foreach($SearchConditions[0] as $ConditionKey => $ConditionValue){
                    $TMP = array();
                    $TMP ['Type']   = trim($SearchConditions[1][$ConditionKey]);
                    $TMP ['Number'] = trim($SearchConditions[2][$ConditionKey]);
                    $TMP ['Value']  = trim($SearchConditions[3][$ConditionKey]);
                    $Condition[] = $TMP;
                }

                $Result[trim($SearchLines[1][$LinesKey])] = $Condition;
            }

            Database::Protection_SetCompleteProtection($DeviceType,$Result);
        }
    }

    public static function Protection_GetErrorDescription($DeviceType,$Locale){
        $Query = "SELECT * FROM `LocaleTags` WHERE `LanguageModule` = 'PSPU_$DeviceType' AND `Tags` LIKE '%Error%'";
        $Result = Database::Query($Query);

        $Return = array();
        while ($Line = mysqli_fetch_assoc($Result)){
            $ErrorCode = str_replace("Error_","",$Line['Tags']);
            $Return[$ErrorCode] = $Line[$Locale];
        }

        return $Return;
    }

    private static function Protection_GetCodeSnippet($Language,$ErrorCode,$Values,$Comment=""){
        $TMP = array();
        foreach($Values as $Key => $Value)
            switch($Language) {
                case "VHDL":
                    $TMP[] = "pY_".$Value['Type']."(".$Value['Number'].") = '".$Value['Value']."'";
                    break;
                case "JS":
                    $TMP[] = "this.".$Value['Type']."[".$Value['Number']."] == ".($Value['Value'] == 1?"true":"false");
                    break;
            }

        switch($Language){
            case "VHDL":
                return "sErrorBitMask(" . $ErrorCode . ") <= '1' when ".implode(" and ",$TMP)." else '0'; ".($Comment==""?"":"-- ".$Comment)."\n";
            case "JS":
                return "if(".implode(" && ",$TMP).") ErrorNumbersTemp.push(".$ErrorCode."); ".($Comment==""?"":"// ".$Comment)."\n";
        }
    }

    public static function Protection_GetCode($DeviceType, $Language, $Locale=""){
        $Query = "SELECT * FROM `Protections` WHERE `DeviceType` = '$DeviceType'";
        $Result = Database::Query($Query);

        $Conditions = array();
        while ($Line = mysqli_fetch_assoc($Result)){
            $TMP = array();
            $TMP['Type'] = $Line['Type'];
            $TMP['Number'] = $Line['Number'];
            $TMP['Value'] = $Line['Value'];
            $Conditions[$Line['ErrorCode']][] = $TMP;
        }

        if($Locale != "")
            $Comments = Database::Protection_GetErrorDescription($DeviceType,$Locale);

        $Return = "";
        foreach($Conditions as $ErrorCode => $Values){
            if(!isset($Comments[$ErrorCode+1]))
                $Comments[$ErrorCode+1] = "";
            $Comment = $Locale == "" ? "" : $Comments[$ErrorCode+1];
            $Return .= Database::Protection_GetCodeSnippet($Language,$ErrorCode,$Values,$Comment);
        }

        return $Return;
    }

    public static function BookingQueue_LengthOfQueue($DeviceType,$Location)
    {
        $Query = "SELECT `QueuePosition` FROM `BookingQueue` WHERE `DeviceType`= '$DeviceType' AND `Location`='$Location' ORDER BY `QueuePosition` DESC LIMIT 1";
        $Result = Database::Query($Query);

        if(Database::AffectedRows() >= 1){
            $Line = mysqli_fetch_assoc($Result);
            return $Line['QueuePosition'];
        }else{
            return 0;
        }
    }

    public static function BookingQueue_Enqueue($UserID, $DeviceType, $Location)
    {
        $Category = Database::Devices_GetCategoryOfDeviceType($DeviceType);
        $BookedDevices = Database::BookingQueue_GetDevicesForUser($UserID);
        $QueueLength = Database::BookingQueue_LengthOfQueue($DeviceType,$Location);

        if(isset($BookedDevices[$Location][$Category]) and $BookedDevices[$Location][$Category] == $DeviceType)
            return true;

        Database::BookingQueue_Dequeue($UserID,$Category);

        $Query = "INSERT INTO `BookingQueue` (`UserID`, `InsertTime`, `QueuePosition`, `DeviceType`, `Location`) VALUES (
                    '$UserID',
                    '" . (microtime(true)*10000) . "',
                    '".($QueueLength+1)."',
                    '$DeviceType',
                    '$Location'
                  )";

        Database::Query($Query);
        return Database::AffectedRows() == 1;
    }

    public static function BookingQueue_GetDevicesForUser($UserID)
    {
        $Query = "SELECT `DeviceType`,`Category`,`Location` FROM `BookingQueue` JOIN `DeviceTypes` ON `BookingQueue`.`DeviceType`=`DeviceTypes`.`Type` WHERE `UserID`= '$UserID'";
        $Result = Database::Query($Query);

        $Return = array();
        while ($Line = mysqli_fetch_assoc($Result))
            $Return[$Line['Location']][$Line['Category']] = $Line['DeviceType'];

        return $Return;
    }

    public static function BookingQueue_GetQueuesForUserAndLocation($UserID,$Location)
    {
        $Query = "SELECT `DeviceType`,`UserID`,`QueuePosition` FROM `BookingQueue` WHERE `DeviceType` IN (SELECT `DeviceType` FROM `BookingQueue` WHERE `UserID` = '$UserID') AND `Location`='$Location' ORDER BY `DeviceType` ASC, `QueuePosition` ASC";
        $Result = Database::Query($Query);

        $Return = array();
        while ($Line = mysqli_fetch_assoc($Result)){
            $TMP = array(
                'User' => $Line['UserID']==$UserID?"You":"User",
                'QueuePosition' => $Line['QueuePosition'],
                'DeviceIsAvailable' => ($Line['UserID'] == $UserID and $Line['QueuePosition'] == 1 and self::Devices_GetAvailableServiceDestIDOfTyp($Line['DeviceType'],0,$Location))
            );
            $Return[$Line['DeviceType']][] = $TMP;
        }

        return $Return;
    }

    public static function BookingQueue_GetQueueForDeviceType($DeviceType, $Location)
    {
        $Query = "SELECT `QueuePosition`,`UserID` FROM `BookingQueue` WHERE `DeviceType`='$DeviceType' AND `Location`='$Location' ORDER BY `QueuePosition` ASC";
        $Result = Database::Query($Query);

        $Return = array();
        while ($Line = mysqli_fetch_assoc($Result))
            $Return[] = $Line;

        return $Return;
    }

    public static function BookingQueue_UserHasPriorityForDeviceType($UserID, $DeviceType, $Location)
    {
        $Queue = Database::BookingQueue_GetQueueForDeviceType($DeviceType,$Location);
        return sizeof($Queue) == 0 or $Queue[0]['UserID'] == $UserID;
    }

    public static function BookingQueue_Dequeue($UserID, $DeviceCategory)
    {
        $Query = "SELECT `QueuePosition`, `DeviceType`, `Location` FROM `BookingQueue` JOIN `DeviceTypes` ON `BookingQueue`.`DeviceType` = `DeviceTypes`.`Type` WHERE
                    `UserID` = '$UserID' AND
                    `Category` = '$DeviceCategory'
                  ";

        $Result = Database::Query($Query);
        if(Database::AffectedRows() >= 1){
            $Line = mysqli_fetch_assoc($Result);

            $Query = "UPDATE `BookingQueue` SET `QueuePosition` = `QueuePosition` - 1 WHERE 
                        `DeviceType`='".$Line['DeviceType']."' AND 
                        `QueuePosition`>'".$Line['QueuePosition']."' AND
                        `Location`='".$Line['Location']."'";

            Database::Query($Query);

            $Query = "DELETE `BookingQueue` FROM `BookingQueue` JOIN `DeviceTypes` ON `BookingQueue`.`DeviceType` = `DeviceTypes`.`Type` WHERE
                        `UserID` = '$UserID' AND
                        `Category` = '$DeviceCategory'";

            Database::Query($Query);
            return Database::AffectedRows() == 1;
        }else{
            return false;
        }
    }

    public static function Booking_GetBookingByID($BookingID){
        $Query = "SELECT * FROM `Bookings` WHERE `BookingID` = '$BookingID'";
        $Result = Database::Query($Query);

        if(mysqli_num_rows($Result) > 0)
            return mysqli_fetch_assoc($Result);

        return false;
    }

    public static function Booking_GetBookingsForUserID($UserID){
        $Query = "SELECT * FROM `Bookings` WHERE `UserID` = '$UserID' AND `EndTime` > '".time()."'";
        $Result = Database::Query($Query);
        $Return = array();
        while($Line = mysqli_fetch_assoc($Result))
            $Return[intval($Line['BookingID'])] = $Line;

        return $Return;
    }

    public static function Booking_DeleteBookingByID($BookingID){
        $Query = "DELETE FROM `Bookings` WHERE `BookingID` = '$BookingID'";
        Database::Query($Query);
        return Database::AffectedRows() == 1;
    }

    public static function Booking_GetBookingsForUserWithTypes($BPUType, $PSPUType, $Location){
        $DeviceTypeStrings = array();
        if(!empty($BPUType))
            $DeviceTypeStrings[] = "(`BPUType` = '$BPUType' AND `BPUVirtual` = '0')";
        if(!empty($PSPUType))
            $DeviceTypeStrings[] = "(`PSPUType` = '$PSPUType'  AND `PSPUVirtual` = '0')";

        $Query = "SELECT * FROM `Bookings` WHERE (".implode(" OR ",$DeviceTypeStrings).") AND `UserID` = '".$_SESSION['UserID']."' AND `StartTime` > ".(time()+Definitions::DefaultBookingTimeLineOffset*60)." AND `Location`='$Location'";

        $Result = Database::Query($Query);
        $Return = array();
        while($Line = mysqli_fetch_assoc($Result))
            $Return[intval($Line["BookingID"])] = $Line;
        return $Return;
    }

    public static function Booking_GetBookingsWithTypesInTime($BPUType = null, $PSPUType = null, $StartTime = 0, $EndTime = 0 , $Location =""){
        $DeviceTypeStrings = array();
        if(!empty($BPUType))
            $DeviceTypeStrings[] = "`BPUType` = '$BPUType' AND `BPUVirtual` = '0'";
        if(!empty($PSPUType))
            $DeviceTypeStrings[] = "`PSPUType` = '$PSPUType'  AND `PSPUVirtual` = '0'";

        $Query = "SELECT * FROM `Bookings` WHERE ".implode(" AND ",$DeviceTypeStrings)." AND `EndTime` >= '$StartTime' AND `StartTime` <= $EndTime AND `Location`='$Location'";

        $Result = Database::Query($Query);
        $Return = array();
        while($Line = mysqli_fetch_assoc($Result))
            $Return[intval($Line["BookingID"])] = $Line;
        return $Return;
    }

    public static function Booking_InsertBooking($UserID, $BPUType, $BPUVirtual, $PSPUType, $PSPUVirtual, $StartTime, $EndTime, $Location){
        Database::Booking_CleanOldBookings();

        $Query = "INSERT INTO `Bookings` (`UserID`, `BPUType`, `BPUVirtual`, `PSPUType`, `PSPUVirtual`, `StartTime`, `EndTime`, `Location`) VALUES (
					 '" . $UserID . "',
					 '" . $BPUType . "',
					 '" . $BPUVirtual . "',
					 '" . $PSPUType . "',
					 '" . $PSPUVirtual . "',
					 '" . $StartTime . "',
					 '" . $EndTime . "',
					 '" . $Location . "'
				 )";

        $Result = Database::Query($Query);

        if ($Result)
            return true;

        return false;
    }

    public static function Booking_GetExperimentsBookedForUserNow(){
        $Date = time();
        $Query = "SELECT * FROM `Bookings` WHERE `UserID` = '".$_SESSION['UserID']."' AND `StartTime` < '$Date' AND `EndTime` > '$Date'";
        $Result = Database::Query($Query);
        $Return = array();

        while($Line = mysqli_fetch_assoc($Result))
            $Return [] = $Line;

        return $Return;
    }

    public static function Booking_CleanOldBookings()
    {
        $Query = "DELETE FROM `Bookings` WHERE `EndTime` < '".(time() - 60*60*24*30)."'";
        $Result = Database::Query($Query);
        if($Result)
            return true;

        return false;
    }
       /*
        public static function BookingQueue_GetQueues(){
            $Query = "SELECT * FROM `BookingQueue` ORDER BY `InsertTime` ASC";
            $Result = Database::Query($Query);
            $Return = array();
            while($Line = mysqli_fetch_assoc($Result))
                $Return[$Line["DeviceID"]][] = $Line;

            return $Return;
        }

        public static function BookingQueue_GetQueueForDevice($DeviceID){
            $Query = "SELECT * FROM `BookingQueue` WHERE `DeviceID` = '$DeviceID' ORDER BY `InsertTime` ASC";
            $Result = Database::Query($Query);
            $Return = array();
            while($Line = mysqli_fetch_assoc($Result))
                $Return[] = $Line;

            return $Return;
        }

    */

    public static function Experiment_GetAvailableServiceDestIDsForExperiment($Mode, $BPUType, $PSPUType, $Location)
    {
        $Result = array();
        switch (strtoupper($Mode)) {
            case 'A':
                $Result['BPUServiceDestinationID'] = Database::Devices_GetAvailableServiceDestIDOfTyp($BPUType, 1, $Location);
                $Result['PSPUServiceDestinationID'] = Database::Devices_GetAvailableServiceDestIDOfTyp($PSPUType, 1, $Location);
                break;
            case 'B':
                $Result['BPUServiceDestinationID'] = Database::Devices_GetAvailableServiceDestIDOfTyp($BPUType, 1, $Location);
                $Result['PSPUServiceDestinationID'] = Database::Devices_GetAvailableServiceDestIDOfTyp($PSPUType, 0, $Location);
                break;
            case 'C':
                $Result['BPUServiceDestinationID'] = Database::Devices_GetAvailableServiceDestIDOfTyp($BPUType, 0, $Location);
                $Result['PSPUServiceDestinationID'] = Database::Devices_GetAvailableServiceDestIDOfTyp($PSPUType, 0, $Location);
                break;
            case 'D':
                $Result['BPUServiceDestinationID'] = Database::Devices_GetAvailableServiceDestIDOfTyp($BPUType, 0, $Location);
                $Result['PSPUServiceDestinationID'] = Database::Devices_GetAvailableServiceDestIDOfTyp($PSPUType, 1, $Location);
                break;
        }

        return $Result;
//        if ($Result['BPUServiceDestinationID'] and $Result['PSPUServiceDestinationID'])
//            return $Result;
//
//        return false;
    }


    public static function Experiment_EndExperiment($ExperimentID)
    {
        $Query = "UPDATE `Experiments` SET `EndTime` = '".(time()-1)."' WHERE `ExperimentID`='$ExperimentID' AND `EndTime` > '".time()."'";
        $Result = Database::Query($Query);
        if($Result)
            return true;
        return false;
    }

    public static function Experiment_EndAllExperiments($Location)
    {
        $Query = "UPDATE `Experiments` SET `EndTime` = '".(time()-1)."' WHERE `EndTime` > '".time()."' AND `Location` = '$Location'";
        $Result = Database::Query($Query);
        if($Result)
            return true;
        return false;
    }

    public static function Experiment_InsertExperiment($UserID, $EndTime, $BPUType, $BPUServiceDestinationID, $PSPUType, $PSPUServiceDestinationID, $SessionID, $Location, $CorrespondingBookingID=0)
    {
        Database::Experiment_CleanOldExperiments();

        // Buchungen werden nur eingetragen, wenn die Endzeit des Experimentes noch nicht erreicht ist
        if (time() > $EndTime)
            return false;

        $Query = "INSERT INTO `Experiments` (`UserID`,`BPUServiceDestinationID`,`BPUType`,`PSPUServiceDestinationID`,`PSPUType`,`StartTime`,`EndTime`,`SessionID`, `Location`, `CorrespondingBookingID`) VALUES (
					 " . $UserID . ",
					 " . $BPUServiceDestinationID . ",
					 '" . $BPUType . "',
					 " . $PSPUServiceDestinationID . ",
					 '" . $PSPUType . "',
					 " . time() . ",
					 " . $EndTime . ",
					 '" . $SessionID . "',
					 '" . $Location. "',
					 '" . $CorrespondingBookingID . "'
				 )";

        Database::Query($Query);

        $Query = "SELECT * FROM `Experiments` WHERE
			`UserID` = " . $UserID . " AND
			`BPUServiceDestinationID` = " . $BPUServiceDestinationID . " AND
			`PSPUServiceDestinationID` = " . $PSPUServiceDestinationID . " AND
			`EndTime` = " . $EndTime . " AND
			`SessionID` = '" . $SessionID . "'";

        $Result = Database::Query($Query);
        if ($Result)
        {
            $Line = mysqli_fetch_assoc($Result);
            return $Line['ExperimentID'];
        }

        return false;
    }

    public static function Experiment_EndExperimentsForSession()
    {
        $Query = "update `Experiments` set `EndTime` = '" . (time() - 1) . "' where `SessionID`='" . session_id() . "' and '" . time() . "' >= `StartTime` and '" . time() . "' <= `EndTime`";
        $Result = Database::Query($Query);
        return $Result;
    }

    public static function Experiment_GetExperiment($ExperimentID)
    {
        $Query=
            "SELECT
                `UserID`,
                `ExperimentID`,
                `BPUType`,
                `PSPUType`,
                `D1`.`Virtual` AS `BPUVirtual`,
                `D2`.`Virtual` AS `PSPUVirtual`,
                `BPUServiceDestinationID`,
                `PSPUServiceDestinationID`,
                `StartTime`,
                `EndTime`,
                `SessionID`,
                `B`.`Location`

            FROM `Experiments` AS `B`

            JOIN `Devices` AS `D1` ON
              `B`.`BPUServiceDestinationID` = `D1`.`ServiceDestID` AND 
              `B`.`Location` = `D1`.`Location` AND 
              `B`.`BPUType` = `D1`.`Type` 
            JOIN `Devices` AS `D2` ON
              `B`.`PSPUServiceDestinationID` = `D2`.`ServiceDestID` AND 
              `B`.`Location` = `D2`.`Location` AND 
              `B`.`PSPUType` = `D2`.`Type`

            WHERE `ExperimentID` = '$ExperimentID'";

        $Result = Database::Query($Query);

        if ($Result and $Line = mysqli_fetch_assoc($Result))
        {
            $TMP = Array();
            $TMP['UserID'] = $Line['UserID'];
            $TMP['ExperimentID'] = $ExperimentID;
            $TMP['BPUType'] = $Line['BPUType'];
            $TMP['PSPUType'] = $Line['PSPUType'];
            $TMP['BPUVirtual'] = $Line['BPUVirtual'];
            $TMP['PSPUVirtual'] = $Line['PSPUVirtual'];
            $TMP['BPUServiceDestinationID'] = $Line['BPUServiceDestinationID'];
            $TMP['PSPUServiceDestinationID'] = $Line['PSPUServiceDestinationID'];
            $TMP['Mode'] = Functions::GetMode($TMP['PSPUVirtual'], $TMP['BPUVirtual']);
            $TMP['StartTime'] = $Line['StartTime'];
            $TMP['EndTime'] = $Line['EndTime'];
            $TMP['SessionID'] = $Line['SessionID'];
            $TMP['Location'] = $Line['Location'];
            //TODO Number of errors
            $TMP['NumberOfError'] = 0;
            return $TMP;
        }

        return false;
    }

    public static function Experiment_GetActiveExperiments($Location = "")
    {
        $Query=
            "SELECT
                `UserID`,
                `Username`,
                `ExperimentID`,
                `BPUType`,
                `PSPUType`,
                `D1`.`Virtual` AS `BPUVirtual`,
                `D2`.`Virtual` AS `PSPUVirtual`,
                `BPUServiceDestinationID`,
                `PSPUServiceDestinationID`,
                `StartTime`,
                `EndTime`,
                `SessionID`,
                `B`.`Location`,
                `CorrespondingBookingID`

            FROM `Experiments` AS `B`

            JOIN `Devices` AS `D1` ON
              `B`.`BPUServiceDestinationID` = `D1`.`ServiceDestID` AND 
              `B`.`Location` = `D1`.`Location` AND 
              `B`.`BPUType` = `D1`.`Type` 
            JOIN `Devices` AS `D2` ON
              `B`.`PSPUServiceDestinationID` = `D2`.`ServiceDestID` AND 
              `B`.`Location` = `D2`.`Location` AND 
              `B`.`PSPUType` = `D2`.`Type`
            NATURAL JOIN `User`

            WHERE `EndTime` >= '" . time() . "' AND `StartTime` <= '" . time() . "'
            AND (`D1`.`Virtual` = '0' OR `D2`.`Virtual` = '0')";

        if($Location != "")
            $Query .= " AND `B`.`Location` = '$Location'";

        $Result = Database::Query($Query);

        $Return = Array();

        while ($Result and $Line = mysqli_fetch_assoc($Result))
        {
            $TMP = Array();
            $TMP['ExperimentID'] = $Line['ExperimentID'];
            $TMP['UserID'] = $Line['UserID'];
            $TMP['Username'] = $Line['Username'];
            $TMP['BPUType'] = $Line['BPUType'];
            $TMP['BPUServiceDestinationID'] = $Line['BPUServiceDestinationID'];
            $TMP['PSPUType'] = $Line['PSPUType'];
            $TMP['PSPUServiceDestinationID'] = $Line['PSPUServiceDestinationID'];
            $TMP['BPUVirtual'] = $Line['BPUVirtual'];
            $TMP['PSPUVirtual'] = $Line['PSPUVirtual'];
            $TMP['StartTime'] = $Line['StartTime'];
            $TMP['EndTime'] = $Line['EndTime'];
            $TMP['NumberOfError'] = 0;
            $TMP['Location'] = $Line['Location'];
            $TMP['CorrespondingBookingID'] = $Line['CorrespondingBookingID'];
            $Return[] = $TMP;
        }

        return $Return;
    }

    public static function Experiment_GetActiveExperimentIDForUserID($UserID, $SessionID)
    {
        $Query = "SELECT `ExperimentID` FROM `Experiments` WHERE `UserID` = '$UserID' AND `SessionID` = '$SessionID' AND `StartTime` <= '".time()."' AND `EndTime` >= '".time()."' ORDER BY `ExperimentID` DESC LIMIT 1";
        $Result = Database::Query($Query);
        if($Result)
        {
            $Line = mysqli_fetch_assoc($Result);
            return $Line['ExperimentID'];
        }
        return false;
    }

    public static function Experiment_UploadFileToDatabase($File,$ExperimentID)
    {
        if(!empty($File) && $File['UserFile']['size'] > 0 && $File['UserFile']['size'] < 102400)
        {
            Database::Experiment_CleanOldProgrammingFiles();

            $FP = fopen($File['UserFile']['tmp_name'], 'r');
            $Content = fread($FP, $File['UserFile']['size']);
            $Content = addslashes($Content);
            fclose($FP);

            $FileName = addslashes($File['UserFile']['name']);

            $Query = "INSERT INTO `ProgrammingFiles` (`ExperimentID`, `FileName`, `File`, `Timestamp`, `FileSize`) VALUES ('$ExperimentID','$FileName','$Content','".time()."', " . $File['UserFile']['size'] . ")";

            $Result = Database::Query($Query);

            if($Result)
                return true;
        }

        return false;
    }

    public static function Experiment_CleanOldProgrammingFiles()
    {
        $Query = "DELETE FROM `ProgrammingFiles` WHERE `Timestamp` < '".(time() - 60*60*24*30)."'";
        $Result = Database::Query($Query);
        if($Result)
            return true;

        return false;
    }

    public static function Experiment_CleanOldExperiments()
    {
        $Query = "DELETE FROM `Experiments` WHERE `EndTime` < '".(time() - 60*60*24*30)."'";
        $Result = Database::Query($Query);
        if($Result)
            return true;

        return false;
    }

    /*============================ Funktionen, um Javascrtiptvariablen f�r ECP zu setzen ===================*/
/*
    public static function ECP_GetExperimentWebcamURL($PSPUID)
    {
        $Query = "select `WebcamURL` from `Devices` where `DeviceID` = '$PSPUID'";
        $Result = Database::Query($Query);

        if ($Result)
        {
            $Line = mysqli_fetch_assoc($Result);
            return $Line['WebcamURL'];
        }

        return false;
    }

    public static function ECP_GetExperimentWebcamOrientation($PSPUID)
    {
        $Query = "select `WebcamOrientation` from `Devices` where `DeviceID` = '$PSPUID'";
        $Result = Database::Query($Query);

        if ($Result)
        {
            $Line = mysqli_fetch_assoc($Result);
            return $Line['WebcamOrientation'];
        }

        return false;
    }
*/

    public static function ECP_GetBPUAllowedFileType($BPUType)
    {
        $Query = "select `AllowedFileType` from `DeviceTypes` where `Type` = '$BPUType' and `Category` = 'BPU'";
        $Result = Database::Query($Query);

        if ($Result)
        {
            $Line = mysqli_fetch_assoc($Result);
            return $Line['AllowedFileType'];
        }

        return false;
    }

    public static function ECP_GetExperimentSettings($PSPUType)
    {
        $Query = "select * from `DeviceSettings` where `PSPUType` = '$PSPUType'";
        $Result = Database::Query($Query);

        if ($Result)
        {
            $Return = array();
            while ($Line = mysqli_fetch_assoc($Result))
                $Return[$Line['SettingType']] = $Line['Value'];

            return $Return;
        }

        return false;
    }

    public static function ECP_ExperimentExamples($BPUType, $PSPUType)
    {
        $Query = "select * from `DeviceExamples` where `ExampleBPUType` = '$BPUType' and `ExamplePSPUType` = '$PSPUType'";
        $Result = Database::Query($Query);

        if ($Result) {
            $Return = array();
            while ($Line = mysqli_fetch_assoc($Result))
                if (in_array($BPUType, ["FSMInterpreter","BEAST"])) {
                    $Return[$Line['ExampleNumber']] = $Line['Example'];
                } else {
                    $Return[$Line['ExampleNumber']] = "";
                }

            return $Return;
        }

        return false;
    }


    public static function Functions_GetFunction($FunctionName)
    {
        $Query = "SELECT * FROM `Functions` WHERE `FunctionName` = '".Database::$Link->real_escape_string($FunctionName)."' ";
        $Result = Database::Query($Query);

        if ($Result)
            Return mysqli_fetch_assoc($Result);

        Return False;
    }


    // Hilfsfunktion
    public static function Navigation_GetFirstSiteIDByMenuTag($MenuTag, $GroupIDArray)
    {
        $Query = "SELECT  `PageStructure`.`Site` FROM  `PageStructure` ,  `Sites` WHERE  `Menu` = ( SELECT  `ID` FROM  `Menus` WHERE  `NameTag` =  '$MenuTag' ) AND  `PageStructure`.`Site` =  `Sites`.`ID` ORDER BY  `Sites`.`Order` ASC";
        $Result = Database::Query($Query);

        if ($Result) {
            $PossibleSites = Database::Navigation_GetAllSitesForUser($GroupIDArray);
            while ($row = mysqli_fetch_assoc($Result))
                if(in_array($row['Site'],$PossibleSites))
                    return $row['Site'];

            return "";
        }

        return false;
    }

    public static function Navigation_GetAllSitesForUser($GroupIDArray)
    {
        $Query = "SELECT `ID` FROM `Sites` WHERE " . Database::Navigation_GetGroupStringFromArray($GroupIDArray) . " ORDER BY `Order` ASC";
        $Result = Database::Query($Query);

        if ($Result) {
            $Return = Array();
            while ($row = mysqli_fetch_assoc($Result))
                $Return[] = $row['ID'];

            return $Return;
        }

        return false;
    }

    //Hilfsfunktion
    private static function Navigation_GetGroupStringFromArray($GroupIDArray)
    {
        $GroupString = " (";

        for ($i = (count($GroupIDArray) - 1); $i > 0; $i--)
            $GroupString .= "`Group` = '" . $GroupIDArray[$i] . "' OR ";

        $GroupString .= "`Group` = '" . $GroupIDArray[$i] . "') ";

        return $GroupString;
    }

/*
    public static function Navigation_GetSiteIDFromSiteTag($SiteTag)
    {
        $Query = "SELECT `ID` FROM `Sites` WHERE `NameTag`='$SiteTag'";
        $Result = Database::Query($Query);

        if ($Result) {
            $row = mysqli_fetch_assoc($Result);
            return $row['ID'];
        }

        return false;
    }
*/
    public static function Navigation_GetSiteTagFromSiteID($SiteID)
    {
        if(!is_numeric($SiteID) || strlen(strval($SiteID)) > 4) return;
        $Query = "SELECT `NameTag` FROM `Sites` WHERE `id`='".Database::$Link->real_escape_string($SiteID)."'";
        $Result = Database::Query($Query);

        if ($Result) {
            $row = mysqli_fetch_assoc($Result);
            return $row['NameTag'];
        }

        return false;
    }

    public static function Navigation_GetAllSitesForUserFromAMenu($SiteID, $GroupIDArray)
    {
        if(!is_numeric($SiteID) || strlen(strval($SiteID)) > 4) return;
        $Query = "SELECT `Site`,`NameTag` FROM `PageStructure`,`Sites` WHERE `PageStructure`.`Menu`=(SELECT `Menu` FROM `PageStructure` WHERE `Site`='".Database::$Link->real_escape_string($SiteID)."') AND " . Database::Navigation_GetGroupStringFromArray($GroupIDArray) . " AND `Sites`.`ID` = `PageStructure`.`Site` ORDER BY `Sites`.`Order` ASC";
        $Result = Database::Query($Query);

        if ($Result) {
            $Return = Array();
            while ($row = mysqli_fetch_assoc($Result))
                $Return[$row['Site']] = $row['NameTag'];

            return $Return;
        }

        return array();
    }

    public static function Navigation_GetMenuTagFromSiteID($SiteID)
    {
        if(!is_numeric($SiteID) || strlen(strval($SiteID)) > 4) return;
        $Query = "SELECT `NameTag` FROM `Menus` WHERE `id`=(SELECT `Menu` FROM `PageStructure` WHERE `Site`='".Database::$Link->real_escape_string($SiteID)."' LIMIT 1)";
        $Result = Database::Query($Query);

        if ($Result) {
            $row = mysqli_fetch_assoc($Result);
            return $row['NameTag'];
        }

        return false;
    }

    public static function Navigation_GetAllMenusForUser($GroupIDArray)
    {
        $Query = "SELECT `NameTag`,`Visible` FROM `Menus` WHERE " . Database::Navigation_GetGroupStringFromArray($GroupIDArray) . " ORDER BY  `Order` ASC";
        $Result = Database::Query($Query);

        if ($Result) {
            $Return = Array();
            while ($row = mysqli_fetch_assoc($Result))
                if($row['Visible'] == 1)
                    $Return[] = $row['NameTag'];

            return $Return;
        }

        return false;
    }

    public static function Navigation_GetIncludePath($SiteID)
    {
        if(!is_numeric($SiteID) || strlen(strval($SiteID)) > 4) return;
        $Query = "SELECT `SiteFile` FROM `Sites` WHERE `ID` = '".Database::$Link->real_escape_string($SiteID)."' LIMIT 1";
        $Result = Database::Query($Query);

        if ($Result) {
            $Return = Array();
            $row = mysqli_fetch_assoc($Result);
            return $row['SiteFile'];
        }

        return false;
    }

    public static function Navigation_SiteStartIDForLocation($Location)
    {
        $Query = "SELECT `ID` FROM `Sites` WHERE `NameTag` = 'SiteStart$Location'";
        $Result = Database::Query($Query);

        if ($Result) {
            $row = mysqli_fetch_assoc($Result);
            return $row['ID'];
        }

        return "";
    }

    public static function Navigation_GetAdminLocationsOfUser($UserID)
    {
        $Query = "select `LocationID` from `AdminOfLocation` where `UserID` = '$UserID'";
        $Result = Database::Query($Query);

        $Locations = array();
        while ($Line = mysqli_fetch_assoc($Result))
            $Locations[] = $Line["LocationID"];

        return $Locations;
    }


// Nutzerverwaltung

//    public static function User_GetAllFirstAndLastNames(){
//        $Query = "select `FirstName`, `LastName` from `User`";
//        $Result = Database::Query($Query);
//
//        $User = array();
//        while ($Line = mysqli_fetch_assoc($Result))
//            $User[] = $Line["FirstName"].$Line["LastName"];
//
//        return $User;
//    }

    public static function User_Authentificate($Username, $Password)
    {
        $Username = Database::$Link->real_escape_string($Username);
        $Query = "SELECT * FROM `User` WHERE `Username` = '$Username'";
        $Result = Database::Query($Query);
        if (!$Result) return ["error" => "error_sql_request"];
        if (mysqli_num_rows($Result) == 0) return ["error" => "error_no_userentry_in_db"];

        $Line = mysqli_fetch_assoc($Result);

        if($Line["RegisterToken"] != "")
            return ["error" => "error_account_not_confirmed"];

        if (
                $Line['Password'] == md5($Password) and
                (
                    $Line['LoginType'] == "LDB" or
                    time()-strtotime($Line["LastLogin"]) < 60*60*24*7
                )
        )// Wenn das Login weniger als eine Woche alt ist
            return ["success" => $Line];

        return ["error" => "error_ldap_login_to_old"];
    }

    public static function User_GetUserIDandUpdateOrInsertLDAPLogin($Username, $Password, $EMail, $StudentNumber, $FirstName, $LastName, $AuthName)
    {
        $Username = Database::$Link->real_escape_string($Username);
        $Query = "select * from `User` where `Username`='" . $Username . "' and `Email`='$EMail'";
        $Result = Database::Query($Query);

        if ($Result and mysqli_num_rows($Result) > 0) {
            $Query = "update `User` set `Password`='" . md5($Password) . "' where `UserID`='" . Database::User_GetUserIDByUsername($Username) . "'";
            Database::Query($Query);
        } else {
            $Query = "insert into
                            `User` (
								`StudentNumber`,
								`FirstName`,
								`LastName`,
								`Username`,
								`Password`,
								`Email`,
								`LastLogin`,
								`Blocked`,
								`LoginType`)
                            values (
								'" . $StudentNumber . "',
								'" . $FirstName . "',
								'" . $LastName . "',
								'" . $Username . "',
								'" . md5($Password) . "',
								'" . $EMail . "',
								NOW(),
								'0',
								'" . $AuthName . "')";

            Database::Query($Query);
//            $Result = Database::Query($Query);

            $Query = "select * from `User` where `Username`='" . $Username . "' and `Password`='" . md5($Password) . "'";
            Database::Query($Query);
//            $Result = Database::Query($Query);
//            $user = mysqli_fetch_assoc($Result);

            $Query = "insert into `UserHasGroups` (`UserID`,`GroupID`) values ('" . Database::User_GetUserIDByUsername($Username) . "','0')";
            Database::Query($Query);
//            $Result = Database::Query($Query);

            $Query = "insert into `UserHasGroups` (`UserID`,`GroupID`) values ('" . Database::User_GetUserIDByUsername($Username) . "','1')";
            Database::Query($Query);
//            $Result = Database::Query($Query);
        }

        return Database::User_GetUserIDByUsername($Username);
    }

    public static function User_GetUserByID($UserID)
    {
        $Query = "SELECT * FROM `User` WHERE `UserID` = '$UserID'";
        $Result = Database::Query($Query);
        if ($Result) {
            $row = mysqli_fetch_assoc($Result);
            return $row;
        }

        return false;
    }

    public static function User_GetUserIDByUsername($Username)
    {
        $Username = Database::$Link->real_escape_string($Username);
        $Query = "SELECT `UserID` FROM `User` WHERE `Username` = '$Username'";
        $Result = Database::Query($Query);
        if ($Result) {
            $row = mysqli_fetch_assoc($Result);
            return $row['UserID']   ;
        }

        return false;
    }

    public static function User_IsBlocked($UserID)
    {
        $Query = "SELECT `Blocked` FROM `User` WHERE `UserID` = '$UserID'";
        $Result = Database::Query($Query);
        if ($Result) {
            $row = mysqli_fetch_assoc($Result);
            return $row['Blocked'] == 1;
        }

        return null;
    }

    public static function User_GetGroupsForUser($UserID)
    {
        $Query = "SELECT `GroupID` FROM `UserHasGroups` WHERE `UserID` = '$UserID'";
        $Result = Database::Query($Query);

        if ($Result and mysqli_num_rows($Result) > 0) {
            $Return = Array();
            while ($row = mysqli_fetch_assoc($Result))
                $Return[] = $row['GroupID'];

            return $Return;
        }

        return Array(0);
    }

    public static function User_GetLastIPAndSessionForUserID($UserID)
    {
        $Query = "SELECT `LastIP`, `LastSessionID` FROM `User` WHERE `UserID` = '$UserID'";
        $Result = Database::Query($Query);
        if($Result AND mysqli_num_rows($Result) == 1)
            return mysqli_fetch_assoc($Result);

        return false;
    }

    public static function User_SetPrivacyAgreement($UserID)
    {
        $Query = "update `User` set 
                    `PrivacyAgreement` = '1' 
                   where `UserID`='" . $UserID . "'";
        Database::Query($Query);
    }

    public static function User_SetLastLoginToNow($UserID)
    {
        $Query = "update `User` set 
                    `LastLogin`=NOW(), 
                    `LastIP`='".$_SERVER['REMOTE_ADDR']."', 
                    `LastSessionID`='".session_id()."' 
                   where `UserID`='" . $UserID . "'";
        $Result = Database::Query($Query);
    }

    public static function User_UsernameExists($Username)
    {
        $Query = "SELECT * FROM `User` WHERE `Username` = '" . Database::$Link->real_escape_string($Username) . "' LIMIT 1";
        $Result = Database::Query($Query);
        if (mysqli_num_rows($Result) >= 1)
            return true;
        else
            return false;
    }

    public static function User_EmailExists($Email)
    {
        $Query = "SELECT * FROM `User` WHERE `Email` = '" . Database::$Link->real_escape_string($Email) . "' OR `Username` = '" . Database::$Link->real_escape_string($Email) . "' LIMIT 1";
        $Result = Database::Query($Query);
        if (mysqli_num_rows($Result) >= 1)
            return true;
        else
            return false;
    }

    public static function User_GetLoginType($UserID)
    {
        $Query = "SELECT `LoginType` FROM `User` WHERE `UserID` = '$UserID' LIMIT 1";
        $Result = Database::Query($Query);
        if ($Result) {
            $Line = mysqli_fetch_assoc($Result);
            return $Line['LoginType'];
        } else
            return false;
    }

    public static function User_GetVerificationToken($Username)
    {
        $Query = "SELECT `RegisterToken` FROM `User` WHERE `Username` = '$Username'";
        $Result = Database::Query($Query);
        if($Result){
            $Line = mysqli_fetch_assoc($Result);
            return $Line['RegisterToken'];
        }
        return false;
    }

    public static function User_VerificateUser($Username)
    {
        $Query = "UPDATE `User` SET `RegisterToken` = NULL WHERE `Username` = '$Username'";
        Database::Query($Query);

        return Database::AffectedRows() == 1;
    }

    public static function User_RemoveForgotPasswordToken($Username)
    {
        $Query = "UPDATE `User` SET `ForgotPasswordToken` = NULL WHERE `Username` = '$Username'";
        Database::Query($Query);
        return Database::AffectedRows() == 1;
    }


    public static function User_GenerateAndInsertForgotPasswordToken($User)
    {
        $Token = md5($User['FirstName'].$User['LastName'].$User['EMail']."SecretMD5Hash".time());
        $Query = "UPDATE `User` SET `ForgotPasswordToken` = '$Token' WHERE `UserID`='".$User['UserID']."'";
        Database::Query($Query);
        if(Database::AffectedRows() == 1){
            return $Token;
        }else {
            return false;
        }
    }

    public static function User_GetForgotPasswordToken($Username)
    {
        $Username = Database::$Link->real_escape_string($Username);
        $Query = "SELECT `ForgotPasswordToken` FROM `User` WHERE `Username` = '$Username'";
        $Result = Database::Query($Query);
        if($Result){
            $Line = mysqli_fetch_assoc($Result);
            return $Line['ForgotPasswordToken'];
        }
        return false;
    }

    public static function User_InsertNewUser($FirstName, $LastName, $Username, $Password, $Email, $Token)
    {
        $Query = "INSERT INTO `User` (`FirstName`, `LastName`, `Username`, `Password`, `Email`, `LastLogin`, `Blocked`, `LoginType`, `RegisterToken`, `PrivacyAgreement`) VALUES
                                     (
                                         '" . Database::$Link->real_escape_string($FirstName) . "',
                                         '" . Database::$Link->real_escape_string($LastName) . "',
                                         '" . Database::$Link->real_escape_string($Username) . "',
                                         '" . MD5($Password) . "',
                                         '" . Database::$Link->real_escape_string($Email) . "',
                                         '2000-01-01 00:00:01', '0',
                                         'LDB',
                                         '$Token',
                                         '1'
                                     )";

        if (Database::Query($Query)) {
            $LastID = Database::$Link->insert_id;

            $Query = "INSERT INTO  `UserHasGroups` (`UserID` ,`GroupID`) VALUES ($LastID, '0')";

            $success = Database::Query($Query);

            $Query = "INSERT INTO  `UserHasGroups` (`UserID` ,`GroupID`) VALUES ($LastID, '1')";

            $success &= Database::Query($Query);

            return $success;
        }
        return false;
    }

    public static function User_CheckPasswordForID($UserID, $Password)
    {
        $Query = "SELECT * FROM `User` WHERE `UserID` = '$UserID' AND `Password` = '" . MD5($Password) . "' LIMIT 1";
        $Result = Database::Query($Query);
        return mysqli_num_rows($Result) == 1;
    }

    public static function User_CheckPasswordForUsername($Username, $Password)
    {
        $Query = "SELECT * FROM `User` WHERE `Username` = '$Username' AND `Password` = '" . MD5($Password) . "' LIMIT 1";
        $Result = Database::Query($Query);

        if (mysqli_num_rows($Result) >= 1)
            return true;

        return false;
    }

    public static function User_SetNewPassword($UserID, $Password)
    {
        if(Database::User_CheckPasswordForID($UserID,$Password))
            return true;

        $Query = "UPDATE `User` SET `Password` = '" . MD5($Password) . "' WHERE `UserID` = '$UserID'";
        Database::Query($Query);
        return Database::AffectedRows() == 1;
    }

    public static function User_SetSuperAdminForUserID($UserID)
    {
        $Locations =  Database::Locations_GetAllLocations();
        Database::User_RemoveSuperAdminForUserID($UserID);
        $Result = true;
        foreach($Locations as $Location)
        {
            $Query = "INSERT INTO `AdminOfLocation` (`UserID`, `LocationID`) VALUES ('$UserID', '$Location')";
            Database::Query($Query);
            if(Database::MYQLiError() != "")
                $Result = false;
        }

        $Query = "INSERT INTO `UserHasGroups` (`UserID`,`GroupID`) VALUES ('$UserID','4')";
        Database::Query($Query);
        if(Database::MYQLiError() != "")
            $Result = false;

        return $Result;
    }

    public static function User_RemoveSuperAdminForUserID($UserID)
    {
        $Query = "DELETE FROM `AdminOfLocation` WHERE `UserID` ='$UserID'";
        Database::Query($Query);
        $Result = Database::MYQLiError() == "";

        $Query = "DELETE FROM `UserHasGroups` WHERE `UserID` = '$UserID' AND `GroupID` = '4'";
        Database::Query($Query);
        if(Database::MYQLiError() != "")
            $Result = false;

        return $Result;
    }

//    public static function User_GetAllSuperadmins(){
//        $Query = "SELECT * FROM `Superadmins`";
//        $Result = Database::Query($Query);
//
//        $Return = [];
//        while ($Line = mysqli_fetch_assoc($Result)){
//            $Return[] = $Line["AdminID"];
//        }
//
//        return array_values($Return);
//    }

    /**
     * Server fragt alle im GOLDi-Lab existieren DeviceTypes ab
     * @return array
     */
    public static function Server_GetAllDeviceTypes()
    {
        $Query = "select * from `DeviceTypes` where `Category`!='BCU'";
        $Result = Database::Query($Query);

        $Return = Array();
        while ($Line = mysqli_fetch_assoc($Result))
            $Return[] = $Line['Type'];

        return $Return;
    }

    public static function Server_GetWebcamList($Location)
    {
        $Query = "select `WebcamID`, `WebcamType`, `URL`, `Parameter`, `DeviceServiceDestinationID`, `Rotation` from `Webcams` where `Location` = '$Location'";
        $Result = Database::Query($Query);

        $Return = Array();
        while ($Line = mysqli_fetch_assoc($Result))
            $Return[] = $Line;

        return $Return;
    }

    public static function Server_GetExperimentDataPacket($ExperimentID)
    {
        $Query = "select * from `Experiments` where `ExperimentID` = '$ExperimentID'";
        $Result = Database::Query($Query);
        return mysqli_fetch_assoc($Result);
    }

    public static function Server_GetExamplePacket($ExampleNumber, $BPUType, $PSPUType)
    {
        $Query = "select * from `DeviceExamples` where `ExampleNumber` = '$ExampleNumber' and `ExampleBPUType` = '$BPUType' and `ExamplePSPUType` = '$PSPUType'";
        $Result = Database::Query($Query);
        return mysqli_fetch_assoc($Result);
    }

    public static function Server_GetProgramFile($ExperimentID)
    {
        $Query = "select * from `ProgrammingFiles` where `ExperimentID` = '$ExperimentID' ORDER BY `ProgrammingFiles`.`ID` DESC Limit 1";
        $Result = Database::Query($Query);
        return mysqli_fetch_assoc($Result);
    }


    public static function Firmware_GetKnownHardwareConfiguration(){
        $Query = "SELECT * FROM `KnownHardwareConfigurations` ORDER BY `BoardType` DESC, `HardwareVersion` ASC";
        $Result = Database::Query($Query);

        $Return = Array();
        while ($Line = mysqli_fetch_assoc($Result))
            $Return[] = $Line;

        return $Return;
    }

    public static function Firmware_GetNextPendingFirmwareForTest(){
        $Query =    "SELECT FirmwareID, Data, HardwareVersion, BoardType ".
                    "FROM `FirmwareFiles` ff INNER JOIN `KnownHardwareConfigurations` khw ON ff.`HWConfigID` = khw.`HWConfigID` ".
                    "WHERE `TestState` = 'Pending' ORDER BY `UploadDate` ASC Limit 1";
        $Result = Database::Query($Query);
        if(Database::AffectedRows() == 1){
            return mysqli_fetch_assoc($Result);
        }else{
            return null;
        }
    }
    public static function Firmware_ChangeFirmwareTestState($FirmwareID, $TestState){
        $Query = "UPDATE `FirmwareFiles` SET `TestState` = '$TestState' WHERE `FirmwareID` = '$FirmwareID'";
        Database::Query($Query);
        return Database::AffectedRows() == 1;
    }

    public static function Firmware_InsertFirmwareInfo($FirmwareID, $FirmwareVersion, $DeviceType){
        $Query = "INSERT INTO `FirmwareInfo` (`FirmwareID`, `FirmwareVersion`, `DeviceType`) VALUES ('$FirmwareID', '$FirmwareVersion', '$DeviceType');";
        Database::Query($Query);
        return Database::AffectedRows() == 1;
    }

    public static function Firmware_GetLatestFirmwareForDevice($DeviceType,$HardwareVersion,$BuildType){
        $Query = "SELECT * FROM 
                    `FirmwareFiles` 
                  NATURAL JOIN 
                    `FirmwareApproval`
                  NATURAL JOIN 
                    `KnownHardwareConfigurations`
                  NATURAL JOIN 
                    `FirmwareInfo` 
                  WHERE 
                    `DeviceType` = '$DeviceType' AND 
                    `HardwareVersion` = '$HardwareVersion' AND
                    `BuildType` = '$BuildType'
                  ORDER BY 
                    `FirmwareVersion` DESC 
                  LIMIT 1";

        $Result = Database::Query($Query);
        if(Database::AffectedRows() == 1){
            return mysqli_fetch_assoc($Result);
        }else{
            return null;
        }
    }

    public static function Firmware_WriteLogEntry($DeviceType, $Location, $ServiceDestID, $FirmwareID, $Result){
        $Query = "INSERT INTO `FirmwareUpdateLog` (
                    `Type`, 
                    `Location`, 
                    `ServiceDestID`, 
                    `Virtual`, 
                    `Timestamp`, 
                    `FirmwareID`, 
                    `Result`
                  ) VALUES (
                    '$DeviceType', 
                    '$Location', 
                    '$ServiceDestID',
                    '0',
                    '".time()."',
                    '$FirmwareID', 
                    '$Result'
                  );";
        Database::Query($Query);
        return Database::AffectedRows() == 1;
    }

    public static function Firmware_UploadFirmwareToDatabase($File, $HardwareConfig)
    {
        if(!empty($File) && $File['size'] > 0 /*&& $File['size'] < 102400*/)
        {
            $FP = fopen($File['tmp_name'], 'r');
            $Content = fread($FP, $File['size']);
            $SHA1 = sha1($Content);
//            $Content = addslashes($Content);
            $Content = base64_encode($Content);
            fclose($FP);

            $Query = "INSERT INTO `FirmwareFiles` (`Signature`, `UploadDate`, `HWConfigID`, `Data`) VALUES (
                '".$SHA1."', 
                '".time()."', 
                '$HardwareConfig',
                '$Content' 
            );";

            Database::Query($Query);
            $a = Database::MYQLiError();
            if($a != "")
                return "Error: ".$a;

            if(Database::AffectedRows() != 1)
                return "Error: AffectedRows != 1";

            return true;
        }

        return "Error: Filesize";
    }

    public static function Firmware_GetFirmwaresWithApproval(){
        $Query = "SELECT `BuildType`, `FirmwareID`, `HWConfigID`, `UploadDate`, `UploadDate`, `TestState`, `FirmwareVersion`, `DeviceType`, `HardwareVersion`, `BoardType` FROM `FirmwareApproval` NATURAL JOIN `FirmwareFiles` NATURAL JOIN `FirmwareInfo` NATURAL JOIN `KnownHardwareConfigurations` ORDER BY `FirmwareID` ASC";
        $Result = Database::Query($Query);

        $Return = [];
        while ($Line = mysqli_fetch_assoc($Result)){
            $BuildType = $Line['BuildType'];
            $ID = $Line['FirmwareID'];

            if(!isset($Return[$ID])){
                unset($Line['BuildType']);
                $Return[$ID] = $Line;
                $Return[$ID]["BuildTypes"] = [];
            }

            $Return[$ID]["BuildTypes"][] = $BuildType;
        }

        return array_values($Return);
    }

    public static function Firmware_GetFirmwaresWithoutApproval(){
        $Query = "SELECT `FirmwareID`, `HWConfigID`, `UploadDate`, `TestState`, `HardwareVersion`, `BoardType` FROM `FirmwareFiles` NATURAL JOIN `KnownHardwareConfigurations` WHERE `FirmwareID` NOT IN (SELECT `FirmwareID` FROM `FirmwareApproval`)";
        $Result = Database::Query($Query);

        $Return = [];
        while ($Line = mysqli_fetch_assoc($Result)){
            $ID = $Line['FirmwareID'];
            $Return[$ID] = $Line;
        }

        return array_values($Return);
    }

    public static function Firmware_AddApproval($FirmwareID, $BuildType){
        $Query = "INSERT INTO `FirmwareApproval` (`FirmwareID`,`BuildType`) VALUES (
                    '$FirmwareID', 
                    '$BuildType'
                  );";
        Database::Query($Query);
        return Database::AffectedRows() == 1;
    }

    public static function Firmware_RemoveApproval($FirmwareID, $BuildType)
    {
        $Query = "DELETE FROM `FirmwareApproval` WHERE `FirmwareID` = '$FirmwareID' AND `BuildType` = '$BuildType'";
        Database::Query($Query);
        return Database::AffectedRows() == 1;
    }

    public static function Firmware_DeleteFirmware($FirmwareID){
        $Query = "DELETE FROM `FirmwareFiles` WHERE `FirmwareID` = '$FirmwareID'";
        Database::Query($Query);
        return Database::AffectedRows() == 1;
    }

    public static function Firmware_GetFirmwareUpdateLog(){
        $Query = "SELECT * FROM `FirmwareUpdateLog` ORDER BY `Timestamp` DESC";
        $Result = Database::Query($Query);

        $Return = Array();
        while ($Line = mysqli_fetch_assoc($Result))
            $Return[] = $Line;

        return $Return;
    }

        /*
        public static function Firmware_GetCurrentFirmware($DeviceType, $HardwareVersion, $BuildType){
            $Query = "select * from `Firmwares` where
                  `DeviceType` = '$DeviceType' and
                  `HardwareVersion` = '$HardwareVersion' and
                  `BuildType` = '$BuildType'
                  ORDER BY `FirmwareVersion` DESC Limit 1";
            $Result = Database::Query($Query);
            return mysqli_fetch_assoc($Result);
        }

        public static function Firmware_GetFirmwareID($DeviceType, $FirmwareVersion, $HardwareVersion, $BuildType){
            $Query = "select * from `Firmwares` where
                  `DeviceType` = '$DeviceType' and
                  `FirmwareVersion` = '$FirmwareVersion' and
                  `HardwareVersion` = '$HardwareVersion' and
                  `BuildType` = '$BuildType'";
            $Result = Database::Query($Query);
            if(!$Result)
                return null;

            return mysqli_fetch_assoc($Result)["FirmwareID"];
        }

        public static function Firmware_GetPreviousFirmwareIDForDeviceUpdate($Type, $Location, $ServiceDestID){
            $Query = "select * from `FirmwareUpdateLog` where
                  `Location` = '$Location' and
                  `ServiceDestID` = '$ServiceDestID' and
                  `Virtual` = '0'
                  order by TimeStamp DESC limit 1";
            $Result = Database::Query($Query);
            if(!$Result)
                return null;

            return mysqli_fetch_assoc($Result)["FirmwareIDNew"];
        }

        public static function Firmware_WriteLog($DeviceID, $DeviceType, $Location, $ServiceDestID, $FirmwareIDOld, $FirmwareIDNew, $Result){
            $Query = "INSERT INTO `tempus`.`FirmwareUpdateLog` (`LogID`, `DeviceID`, `Type`, `Location`, `ServiceDestID`, `Virtual`, `FirmwareIDOld`, `FirmwareIDNew`, `TimeStamp`, `Result`) VALUES
                  (NULL, '$DeviceID', '$DeviceType', '$Location', '$ServiceDestID', '0', ".($FirmwareIDOld==null?"null":$FirmwareIDOld).", '$FirmwareIDNew', '".time()."', '$Result');";

            $Result = Database::Query($Query);
            if($Result)
                return true;

            return false;
        }
    */
}
