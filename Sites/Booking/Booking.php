<?php
Functions::Ajax_TestRequestBPUType();
Functions::Ajax_TestRequestPSPUType();
Functions::Ajax_TestRequestMode();
Functions::Ajax_TestRequestLocation();

$ReplaceTags = array(
    "[[++BPUType++]]" => $_REQUEST['BPUType'],
    "[[++BPUVirtualString++]]" => Functions::BPUIsVirtualInMode($_REQUEST['Mode'])?"Virtual":"Real",
    "[[++NumberOfExistingBPUDevices++]]" => Database::Devices_GetNumberOfRealExistingDevicesOfType($_REQUEST['BPUType'],$_REQUEST['Location']),

    "[[++PSPUType++]]" => $_REQUEST['PSPUType'],
    "[[++PSPUVirtualString++]]" => Functions::PSPUIsVirtualInMode($_REQUEST['Mode'])?"Virtual":"Real",
    "[[++NumberOfExistingPSPUDevices++]]" => Database::Devices_GetNumberOfRealExistingDevicesOfType($_REQUEST['PSPUType'],$_REQUEST['Location']),

    "[[++Mode++]]" => $_REQUEST['Mode'],
    "[[++Location++]]" => $_REQUEST['Location'],
    "[[++UserID++]]" => $_SESSION['UserID'],

    "[[++DefaultBookingTimeReal++]]" => Definitions::DefaultBookingTimeReal,
    "[[++DefaultBookingTimeLineOffset++]]" => Definitions::DefaultBookingTimeLineOffset,
    "[[++MinimumTimeslotLength++]]" => Definitions::MinimumTimeslotLength,
    "[[++MaximumTimeslotLength++]]" => Definitions::MaximumTimeslotLength,
    "[[++DefaultTimeSlotSegments++]]" => Definitions::DefaultTimeSlotSegments,
    "[[++ExperimentEndingTime++]]" => Definitions::ExperimentEndingTime
);

$SiteContent = Functions::LoadTemplate("Templates/Booking/Booking.tpl",$ReplaceTags);