<script src="Modules/VisJS/vis.min.js"></script>

<link href="Modules/VisJS/vis.min.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="JavaScript/Booking.js"></script>

<link href="Modules/DatePicker/datepicker.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="Modules/Datepicker/bootstrap-datepicker.js"></script>

<link href="Modules/Slider/bootstrap-slider.min.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="Modules/Slider/bootstrap-slider.min.js"></script>

<input id="BookingSettings" class="hidden"
       BPUType="[[++BPUType++]]"
       NumberOfExistingBPUDevices="[[++NumberOfExistingBPUDevices++]]"

       PSPUType="[[++PSPUType++]]"
       NumberOfExistingPSPUDevices="[[++NumberOfExistingPSPUDevices++]]"

       Mode="[[++Mode++]]"
       Location="[[++Location++]]"
       UserID="[[++UserID++]]"

       DefaultBookingTimeReal="[[++DefaultBookingTimeReal++]]"
       DefaultBookingTimeLineOffset="[[++DefaultBookingTimeLineOffset++]]"
       MinimumTimeslotLength="[[++MinimumTimeslotLength++]]"
       MaximumTimeslotLength="[[++MaximumTimeslotLength++]]"
       DefaultTimeSlotSegments="[[++DefaultTimeSlotSegments++]]"
       ExperimentEndingTime="[[++ExperimentEndingTime++]]"
>

<input class="tag hidden" value="[[**FormatDatePicker**]]" id="FormatDatePicker" data-i18n="FormatDatePicker">
<input class="tag hidden" value="[[**Real**]]" id="RealString" data-i18n="real">
<input class="tag hidden" value="[[**Virtual**]]" id="VirtualString" data-i18n="virtual">

<br>
<div class="container-fluid">
    <div class="row">
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
            <input style="width:100%; margin-top:5px;" id="Slider" type="text" data-slider-handle="round">
            <div>
                <span class="tag" data-i18n="Duration"></span>
                (<span class="tag" data-i18n="Minutes"></span>)
            </div>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
            <div style="width:100%; margin-top:5px;">
                <input id="Datepicker" class="tag form-control" placeholder="" data-i18n="[placeholder]SetToTime" style="height:48px">
            </div>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" >
            <button style="width:100%; margin-top:5px;" id="StartBooking" type="button" class="btn btn-success btn-default btn-lg tag" data-i18n="Reserve"></button>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" >
            <button style="width:100%; margin-top:5px;" id="DeleteBooking" type="button" class="btn btn-warning btn-default btn-lg tag" data-i18n="DeleteBooking"></button>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" >
            <button style="width:100%; margin-top:5px;" id="BookingHelp" type="button" class="btn btn-info btn-default btn-lg tag" data-i18n="BookingHelp"></button>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" >
            <button style="width:100%; margin-top:5px; overflow: hidden; text-overflow: ellipsis;" id="MyBookings" type="button" class="btn btn-default btn-lg tag" data-i18n="MyBookings"></button>
        </div>
    </div>
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding-left:0px;margin-top:10px;">
        <div class="form-group">
            <select class="form-control" id="BookingSelect">
            </select>
        </div>
    </div>
</div>
<div class="text-center" style="vertical-align: top">
    <div style="">

        <!--div style="display:inline-block">
            <span class="tag" data-i18n="duration"></span>:
            <b id="Duration"></b>
            <span class="tag" data-i18n="minutes"></span>
        </div>
        <div style="display:inline-block; width:30px"></div-->
        <!--div style="display:inline-block; width:30px"></div>
        <button id="FindFreeSlot" type="button" class="btn btn-info btn-default btn-lg tag" data-i18n="FindFreeSlot"></button-->

        <div>
        </div>
        <div style="margin:0px 20px 0px 20px;">
        </div>
    </div>
</div>
<br>
<h4 id="BPUHeader">
    <span class="tag" data-i18n="BPU"></span>:
    <span class="tag" data-i18n="[[++BPUType++]]"></span>
    [<span class="tag" data-i18n="[[++BPUVirtualString++]]"></span>]
</h4>
<div id="BPUVisualization"></div>
<br>
<h4 id="PSPUHeader">
    <span class="tag" data-i18n="PSPU"></span>:
    <span class="tag" data-i18n="[[++PSPUType++]]"></span>
    [<span class="tag" data-i18n="[[++PSPUVirtualString++]]"></span>]
</h4>
<div id="PSPUVisualization"></div>

<br>

<div class="hidden" style="display:block; float:left; margin-right:50px;">
    <span>StartTime:</span>
    <span id="StartTime"></span><br>
    <span>EndTime:</span>
    <span id="EndTime"></span><br><br>
</div>
<div class="hidden" style="display:block">
    <span>StartTimeStamp:</span>
    <span id="StartTimeStamp"></span><br>
    <span>EndTimeStamp:</span>
    <span id="EndTimeStamp"></span>
</div>

<div id="BookingsSystemHelpPanel" class="modal fade">
    <div class="modal-dialog" data-keyboard="true">
        <div class="modal-content" style="padding:20px">
            <h4>Usage of the reservation system</h4>
            <ul>
                <li><b>Drag and drop the "New reservation"-slot:</b><br> Move this timeslot to new position.</li>
                <li><b>Fast double click on the timeline:</b><br> Move the "New reservation"-slot to this position.</li>
                <li><b>Drag and drop the duration slider:</b><br> Change the duration of the booking</li>
                <br>
                <li><b>Drag and drop on Timeline:</b><br> Move the timeline to new position.</li>
                <li><b>Select date:</b><br>Click on the date input box. Move the timeline to this date. <br> Bookings can only take place in the future.<br> If past days were selected, timeline moves to start position.</li>
                <br>
                <li><b>Scroll out on timeline:</b> Increase the range of the timeline.</li>
                <li><b>Scroll in on timeline:</b> Decrease the range of the timeline.</li>
                <br>
                <li><b>Select already reserved experiments</b><br> with the drop down menu or width directly click.</li>
                <li><b>Select one of your reserved experimentes an click delete:</b><br> Cancel this reservation</b>.</li>
            </ul>
            <div class="modal-footer">
                <button type="button" data-dismiss="modal" class="btn btn-primary" id="BookingsSystemHelpPanelOK">OK</button>
            </div>
        </div>
    </div>
</div>


<div id="InfodialogSelectDateInPast" class="modal fade">
    <div class="modal-dialog" data-keyboard="true">
        <div class="modal-content" style="padding:20px">
            <h4>Information</h4>
            <span>
                Your selected date is in the past.
                Bookings can only occur in the future.
                Please select a date in the future. Thank you.
            </span>
            <div class="modal-footer">
                <button type="button" data-dismiss="modal" class="btn btn-primary" id="InfodialogSelectDateInPastOK">OK</button>
            </div>
        </div>
    </div>
</div>

<style>
    .newReservationFree{
        background-color:#006666;
        color:white;
    }
    .newReservationOccupied{
        background-color:#CC0000;
        color:white;
    }
    .otherReservation{
        background-color:#003366;
        color:white;
    }
    .yourReservation{
        background-color:#6699CC;
        color:white;
    }
</style>