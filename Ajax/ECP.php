<?php
    $VisitorMode = false;
    // VisitorMode
    if(isset($_REQUEST['ExperimentID']))
    {
        $VisitorMode = true;
        $ExperimentID = $_REQUEST['ExperimentID'];
        $Experiment = Database::Experiment_GetExperiment($ExperimentID);
        if(!$Experiment or !(time() > $Experiment['StartTime'] and time() < $Experiment['EndTime']))
            Functions::RedirectToErrorSite("Error_ExperimentNotAvailable");
    }

    // Nutzer Darf kein Experiment eintragen
    elseif($_SESSION['UserID'] == 0)
    {
        Functions::RedirectToErrorSite("Error_NoPermission");
    }

    // Reservierer Start
    elseif(isset($_REQUEST['Reserved']))
    {
        if(isset($_REQUEST['BookingID'])){
            $Booking = Database::Booking_GetBookingByID($_REQUEST['BookingID']);
            if(!$Booking or $Booking['UserID'] != $_SESSION['UserID'])
                die("This BookingID doesn't exist or doesn't belong to your UserID");
        }else{
            $Bookings = Database::Booking_GetExperimentsBookedForUserNow();
            if(sizeof($Bookings) <= 0)
                die("Yout have no bookings at this moment. Please try again later.");
            $Booking = $Bookings[0];
        }

        if($Booking['EndTime'] < time())
            die("This booking lies in past. Please use an actual BookingID");

        $DeviceIDs = Database::Experiment_GetAvailableServiceDestIDsForExperiment(
            Functions::GetMode($Booking['PSPUVirtual'],$Booking['BPUVirtual']),
            $Booking['BPUType'],
            $Booking['PSPUType'],
            $Booking['Location']
        );

        if(empty($DeviceIDs['BPUServiceDestinationID']) or empty($DeviceIDs['PSPUServiceDestinationID']))
            $Experiments = Database::Experiment_GetActiveExperiments($Booking['Location']);

        if(empty($DeviceIDs['BPUServiceDestinationID'])){
            $MinStartTime = PHP_INT_MAX;
            $EndingExperimentID = 0;
            foreach ($Experiments as $ID => $Experiment)
                $Condition1 = $Experiment['BPUType'] == $Booking['BPUType'];
                $Condition2 = $Booking['StartTime'] < $MinStartTime;
                $Condition3 = $Experiment['CorrespondingBookingID'] == "0";
                $Condition4 = Database::Booking_GetBookingByID($Experiment['CorrespondingBookingID'])["EndTime"] < time();
                if($Condition1 and $Condition2 and ($Condition3 or $Condition4)){
                    $MinStartTime = $Booking['StartTime'];
                    $EndingExperimentID = $Experiment['ExperimentID'];
                }

            Database::Experiment_EndExperiment($EndingExperimentID);
        }

        if(empty($DeviceIDs['PSPUServiceDestinationID'])){
            $MinStartTime = PHP_INT_MAX;
            $EndingExperimentID = 0;
            foreach ($Experiments as $ID => $Experiment)
                $Condition1 = $Experiment['PSPUType'] == $Booking['PSPUType'];
                $Condition2 = $Booking['StartTime'] < $MinStartTime;
                $Condition3 = $Experiment['CorrespondingBookingID'] == "0";
                $Condition4 = Database::Booking_GetBookingByID($Experiment['CorrespondingBookingID'])["EndTime"] < time();
                if($Condition1 and $Condition2 and ($Condition3 or $Condition4)){
                    $MinStartTime = $Booking['StartTime'];
                    $EndingExperimentID = $Experiment['ExperimentID'];
                }

            Database::Experiment_EndExperiment($EndingExperimentID);
        }

        $Endtime = max( time()+Definitions::DefaultExperimentTimeReal*60, $Booking["EndTime"]);
        $DeviceIDs = Database::Experiment_GetAvailableServiceDestIDsForExperiment(
            Functions::GetMode($Booking['PSPUVirtual'],$Booking['BPUVirtual']),
            $Booking['BPUType'],
            $Booking['PSPUType'],
            $Booking['Location']
        );

        $ExperimentID = Database::Experiment_InsertExperiment($_SESSION['UserID'], $Endtime, $Booking['BPUType'], $DeviceIDs['BPUServiceDestinationID'], $Booking['PSPUType'],$DeviceIDs['PSPUServiceDestinationID'],session_id(),$Booking['Location'], $Booking['BookingID']);
        $Experiment = Database::Experiment_GetExperiment($ExperimentID);
    }

    // Experiment in Experiments eintragen und starten
    else
    {
        // Developer-Fehler-Ausgabe, falls falsche Parameter übergeben werden

        Functions::Ajax_TestRequestMode();
        Functions::Ajax_TestRequestBPUType();
        Functions::Ajax_TestRequestPSPUType();
        Functions::Ajax_TestRequestLocation();

        $Mode = $_REQUEST['Mode'];
        $BPUType = $_REQUEST['BPUType'];
        $PSPUType = $_REQUEST['PSPUType'];
        $Location = $_REQUEST['Location'];

        $BPUVirtual = Functions::BPUIsVirtualInMode($Mode)?"Virtual":"Real";
        $PSPUVirtual = Functions::PSPUIsVirtualInMode($Mode)?"Virtual":"Real";

        $DeviceCombinations = Database::Devices_GetPermittedDeviceCombinations($Location);

        if(!isset($DeviceCombinations
                    [$BPUType]
                    [Functions::BPUIsVirtualInMode($Mode)?"Virtual":"Real"]
                    [$PSPUType]
                    [Functions::PSPUIsVirtualInMode($Mode)?"Virtual":"Real"]) or
                  $DeviceCombinations
                    [$BPUType]
                    [Functions::BPUIsVirtualInMode($Mode)?"Virtual":"Real"]
                    [$PSPUType]
                    [Functions::PSPUIsVirtualInMode($Mode)?"Virtual":"Real"] != 1)
            die("Device combination is not allowed");


// Experiment in Datenbank Warteschlange eintragen
//-----------------------------------------------------------------------------
        // Aktuelle Buchungen für Nutzer beenden
        Database::Experiment_EndExperimentsForSession();

        $BPUIsVirtual = Functions::BPUIsVirtualInMode($Mode);
        $PSPUIsVirtual = Functions::PSPUIsVirtualInMode($Mode);

        if (!$BPUIsVirtual) Database::BookingQueue_Enqueue($_SESSION['UserID'], $BPUType, $Location);
        if (!$PSPUIsVirtual) Database::BookingQueue_Enqueue($_SESSION['UserID'], $PSPUType, $Location);
        
        $DeviceIDs = Database::Experiment_GetAvailableServiceDestIDsForExperiment($Mode, $BPUType, $PSPUType, $Location);

        $ExperimentStart = true;
        if(empty($DeviceIDs['BPUServiceDestinationID']) or empty($DeviceIDs['PSPUServiceDestinationID']))
            $ExperimentStart = false;
        if(!$BPUIsVirtual and !Database::BookingQueue_UserHasPriorityForDeviceType($_SESSION['UserID'],$BPUType,$Location))
            $ExperimentStart = false;
        if(!$PSPUIsVirtual and !Database::BookingQueue_UserHasPriorityForDeviceType($_SESSION['UserID'],$PSPUType,$Location))
            $ExperimentStart = false;
        
        if (!$ExperimentStart){
            unset($_REQUEST['Function']);
            header("location:index.php?Site=123&".http_build_query($_REQUEST));
            exit;
        }

        $Duration = Definitions::DefaultExperimentTimeReal;
        if($Mode = 'a')
        $Duration = Definitions::DefaultExperimentTimeVirtual;

        $ExperimentID = Database::Experiment_InsertExperiment($_SESSION['UserID'], time()+$Duration*60,$BPUType,$DeviceIDs['BPUServiceDestinationID'],$PSPUType,$DeviceIDs['PSPUServiceDestinationID'],session_id(),$Location);

        PANDA::GOLDi_SaveCoinExperiment(
            $ExperimentID,
            $_SESSION['UserID'],
            $BPUType,
            (Functions::BPUIsVirtualInMode($Mode)?"1":"0"),
            $PSPUType,
            (Functions::PSPUIsVirtualInMode($Mode)?"1":"0"),
            time(),
            time()+$Duration*60,
            $Location
        );

        // Fehler, falls Experimenteintragung scheitert
        if(!$ExperimentID)
            Functions::RedirectToErrorSite("Error_InsertExperiment");

        $Experiment = Database::Experiment_GetExperiment($ExperimentID);
    }

// Template zusammensetzen
//-----------------------------------------------------------------------------
    // Labels //
    $Labels = array(
        "BPUType" => $Experiment['BPUType'],
        "PSPUType" => $Experiment['PSPUType']
    );

    if($Experiment['PSPUType'] == "Elevator4FloorsClassic")
        $Experiment['PSPUType'] = "Elevator4Floors";

    $ReplaceTags = array(
        "[[++PSPUType++]]" => $Experiment['PSPUType'],
    );

    $LoadedModules = "";
    if($Experiment['BPUType'] == 'FSMInterpreter'){
        $LoadedModules = Functions::LoadTemplate("Templates/ECP/ModuleFSM.tpl");
    }else if($Experiment['BPUType'] == 'BEAST'){
        $LoadedModules = Functions::LoadTemplate("Templates/ECP/ModuleBEAST.tpl",$ReplaceTags);
    }else if($Experiment['BPUType'] == 'ManualControl'){
        $LoadedModules = Functions::LoadTemplate("Templates/ECP/ModuleManualControl.tpl",$ReplaceTags);
    }

    // Loaded Modules //
    if(!$VisitorMode and !empty($Experiment['Mode']) and in_array(strtolower($Experiment['Mode']),["a","d"]))
        if($Experiment['PSPUType'] == 'DigitalDemoBoardPSPU') {
            $LoadedModules .= Functions::LoadTemplate("Templates/ECP/ModuleVPSPU_DDB.tpl",$ReplaceTags);
        }else {
            $LoadedModules .= Functions::LoadTemplate("Templates/ECP/ModuleVPSPU.tpl",$ReplaceTags);
        }
    if($Experiment['PSPUType'] == "MasterMind")
        $LoadedModules .= Functions::LoadTemplate("Templates/ECP/ModuleMasterMind.tpl");
    if(!$VisitorMode)
        $LoadedModules .= Functions::LoadTemplate("Templates/ECP/ModuleSimulation.tpl",["[[++PSPUType++]]" => $Experiment['PSPUType']]);

    if(isset($_REQUEST['EnvironmentSimulation']) and is_file("ECP/Animation/EnvironmentSimulation_".$Experiment['PSPUType'].".js"))
        $LoadedModules .= Functions::LoadTemplate("Templates/ECP/ModuleEnvironmentSimulation.tpl", ["[[++PSPUType++]]" => $Experiment['PSPUType']]);

    $ReplaceTags = array(
        "[[++ECPTitle++]]" => $LanguageManager->ReplaceTags($Labels['PSPUType']),
        "[[++LoadedModules++]]" => $LoadedModules,
        "[[++LabelsHTTPQuery++]]" => http_build_query($Labels),
        "[[++PSPUType++]]" => $Experiment['PSPUType'],
        "[[++ECPMainHTTPQuery++]]" => "ExperimentID=".$ExperimentID
    );

    echo Functions::ExtendJSCSSFilePathsWithTimeStamp(Functions::LoadTemplate("Templates/ECP/ECPMain.tpl",$ReplaceTags));

    Database::BookingQueue_Dequeue($_SESSION['UserID'],"BPU");
    Database::BookingQueue_Dequeue($_SESSION['UserID'],"PSPU");
