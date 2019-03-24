<?php

class Definitions
{
    // MySQL connection
    const ServerURL = '141.24.186.119';
    const ServerSQLUsername = 'tempusadm';
    const ServerSQLPassword = 'SE91?-me';
    const ServerSQLDBName = 'tempus';

    // Language management
    const DefaultLocale = "en_US";

    // Booking system (in minutes)
    const DefaultBookingTimeReal = 30;
    const DefaultBookingTimeLineOffset = 60;
    const MinimumTimeslotLength = 10;
    const MaximumTimeslotLength = 90;
    const DefaultTimeSlotSegments = 5;
    const ExperimentEndingTime = 0;

    // Experiment settings
    const DefaultExperimentTimeReal = 30; // minutes
    const DefaultExperimentTimeVirtual = 300; // minutes
    const WebCamPictureDelay = 100; // milliseconds

    // Email configuration
    const SMTPMailAddressFromName = "GOLDi TU-Ilmenau";
    const SMTPMailAddressFrom = "goldi@tu-ilmenau.de";
    const SMTPMailAddressCc = "goldi@tu-ilmenau.de";
    const SMTPHost = "mail.tu-ilmenau.de";
    const SMTPPort = "25";
    const SMTPUsername = "goldi";
    const SMTPPassword = "VB7sdxGw";
    const SMTPAuthentification = false;

    // Website settings
    const SessionTimeoutSeconds = 1800;

//    const WebControlPanelPassword = "goldisecret";
//    const SMTPMailAddress = "ilab@tu-ilmenau.de";
//    const SMTPMailAddressCc = "goldi@tu-ilmenau.de";
//    const SMTPHost = "mail.tu-ilmenau.de";
//    const SMTPPort = "25";t
//    const SMTPUsername = "ilab";
//    const SMTPPassword = "JUiBwNAI";

}
