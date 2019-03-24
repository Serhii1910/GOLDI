<!DOCTYPE html>
<html>
<head>
    <!--title>[[**Title**]] - [[++SiteTitle++]]</title-->
    <title class="tag" data-i18n="[[++SiteTitle++]]">GOLDi</title>
    [[++NoJavaScript++]]
    <meta charset="UTF-8">

    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Cache-Control" content="no-cache">
    <meta http-equiv="Expires" content="-1">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="Common/js/jquery.min.js"></script>
    <link href="Common/css/bootstrap.min.css" rel="stylesheet">
    <script type="text/javascript" src="Common/js/bootstrap.min.js"></script>

    <link href="Common/css/Supernice.min.css" rel="stylesheet">

    <link href="Common/css/bootstrap-toggle.min.css" rel="stylesheet">
    <script type="text/javascript" src="Common/js/bootstrap-toggle.min.js"></script>

    <script type="text/javascript" src="JavaScript/i18next-1.10.1.min.js"></script>
    <script type="text/javascript" src="JavaScript/i18nextLoader.js"></script>

    <script src="functions.js"></script>

    <link rel="icon" type="image/x-icon" href="Images/favicon.ico">
    <script type="text/javascript" src="JavaScript/ClickLogin.js"></script>
    <script type="text/javascript" src="JavaScript/CheckSession.js"></script>
    <script type="text/javascript" src="JavaScript/ViewportChanger.js"></script>
    <script type="text/javascript" src="JavaScript/StartBookedExperiment.js"></script>

    <link href="Style/Style.css" rel="stylesheet">

    <!-- Begin Cookie Consent plugin by Silktide - http://silktide.com/cookieconsent -->
    <script type="text/javascript">
        window.cookieconsent_options = {message:"Diese Webseite nutzt Cookies, um Ihnen das bestmögliche Nutzererlebnis zu gewährleisten.","dismiss":"OK!","learnMore":"Mehr Informationen","link":"index.php?Site=133","theme":"dark-bottom"};
    </script>

    <script type="text/javascript" src="Common/js/cookieconsent.min.js"></script>
    <!-- End Cookie Consent plugin -->

</head>
<body>
<div id="settings" visibility="hidden" SessionTimeoutSeconds="[[++SessionTimeoutSeconds++]]"></div>

<div id="LoginWaitingModal" class="modal fade bs-example-modal-sm" data-backdrop="static">
    <div class="modal-dialog modal-dialog-center">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="headerBlock" class="modal-title tag" data-i18n="LoggingIn"></h3>
            </div>
            <div class="modal-body">
                <span id="bodyBlock"></span>
                <br/>
                <p style="text-align: center">
                    <img src="ECP/page-loader.gif" alt="progress" style="width:100px;height:100px"/>
                </p>
            </div>
        </div>
    </div>
</div>

<div id="BookingsSystemStartBookedExperiment" class="modal fade">
    <div class="modal-dialog" data-keyboard="true">
        <div class="modal-content">
            <div class="modal-body tag" data-i18n="BookingsSystemStartBookedExperiment"></div>
            <div class="modal-footer">
                <button type="button" data-dismiss="modal" class="btn btn-primary" id="BookingsSystemStartBookedExperimentYes">Yes</button>
                <button type="button" data-dismiss="modal" class="btn btn-default" id="BookingsSystemStartBookedExperimentCancel">Cancel</button>
            </div>
        </div>
    </div>
</div>

<div id="wrap">
    <div class="navbar navbar-default navbar-fixed-top" style="height:100px; background-position-y:-70px; background-image:url(Images/Locations/Panorama.png); background-repeat: no-repeat;"></div>
    <nav class="navbar navbar-default navbar-fixed-top" style="margin-top:100px" role="navigation">
        <div class="container-fluid">
            <div class="navbar-header">

                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-2">
                    <span class="glyphicon glyphicon-flag"></span>
                </button>

                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <a class="hidden-sm hidden-md hidden-lg navbar-brand" href="index.php">
                    <img style="width:50px; position:relative; top:-15px" src="Images/GOLDi_Logo.png">
                </a>

            </div>

            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

                <ul id="headernavbar" class="nav navbar-nav navbar-left" style="width:100%;">
                    <li>
                        <a class="hidden-xs navbar-brand" href="index.php">
                            <img style="width:50px; position:relative; top:-15px" src="Images/GOLDi_Logo.png">
                        </a>
                    </li>

                    [[++MenuLines++]]

                    [[++ToolMenu++]]

                    [[++AdminMenu++]]

                    <li class="navbar-right">
                        <ul class="nav navbar-nav navbar-left" style="margin:0px">
                            [[++LoginLineString++]]

                            <li>
                                <a href="#" class="dropdown-toggle visible-lg visible-md visible-sm" data-toggle="dropdown">
                                    <span class="glyphicon glyphicon-flag"></span>
                                </a>
                                <ul class="dropdown-menu" role="menu">
                                    [[++LocaleLines++]]
                                </ul>
                            </li>

                        </ul>
                    </li>
                </ul>
            </div>

            <div class="collapse" id="bs-example-navbar-collapse-2">
                <ul class="nav navbar-nav">
                    [[++LocaleLines++]]
                </ul>
            </div>

        </div>
    </nav>