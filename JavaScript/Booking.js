var BPUType, NumberOfExistingBPUDevices, BPUItems, BPUContainer, BPUTimeline, BookingBPUIsPossible;
var PSPUType, NumberOfExistingPSPUDevices, PSPUItems, PSPUContainer, PSPUTimeline, BookingPSPUIsPossible;
var Options, Location, UserID, Mode, UseBPUTimeline, UsePSPUTimeline;
var DefaultBookingTimeLineOffset, MinimumTimeslotLength, MaximumTimeslotLength, DefaultBookingTimeReal, DefaultTimeSlotSegments, ExperimentEndingTime;
var Now, TimelineStart, StartBookingTime, EndBookingTime;

var VirtualString, RealString;
var Datepicker;
var NewTimelineItems;

var NewTimeslotID = 100000;
var OneMinute = 60 * 1000;

var Slider, SliderElement, BookingSettings;
var UserBookings, BookingSelect, SelectedReservationID = 0;
var LoadingBookingsForBPUWithAjaxIsReady, LoadingBookingsForPSPUWithAjaxIsReady;

$(document).ready(function(){
    BookingSelect = $("#BookingSelect");
    BookingSelect.change(function(){
        SelectedReservationID = parseInt($(this).find(":selected").val());

        if(SelectedReservationID > 0){
            if(BPUTimeline){
                BPUTimeline.moveTo(new Date(UserBookings[SelectedReservationID].StartTime * 1000));
                Options.start = BPUTimeline.options.start;
                Options.end = BPUTimeline.options.end;
            }
            if(PSPUTimeline) {
                PSPUTimeline.moveTo(new Date(UserBookings[SelectedReservationID].StartTime * 1000));
                Options.start = PSPUTimeline.options.start;
                Options.end = PSPUTimeline.options.end;
            }
            SelectBookingAfterAutomove(UserBookings[SelectedReservationID]);
        }else{
            if(BPUTimeline){
                BPUTimeline.moveTo(new Date(TimelineStart));
                Options.start = BPUTimeline.options.start;
                Options.end = BPUTimeline.options.end;
            }
            if(PSPUTimeline) {
                PSPUTimeline.moveTo(new Date(TimelineStart));
                Options.start = PSPUTimeline.options.start;
                Options.end = PSPUTimeline.options.end;
            }
        }
        EnableAndDisalbeDeleteButton();
    });

    VirtualString = $("#VirtualString").val();
    RealString = $("#RealString").val();

    BookingSettings = $("#BookingSettings");
    Mode = BookingSettings.attr("Mode");
    Location = BookingSettings.attr("Location");
    UserID = BookingSettings.attr("UserID");

    UseBPUTimeline = Mode == "c" || Mode == "d";
    BPUType = BookingSettings.attr("BPUType");
    NumberOfExistingBPUDevices = parseInt(BookingSettings.attr("NumberOfExistingBPUDevices"));

    UsePSPUTimeline = Mode == "b" || Mode == "c";
    PSPUType = BookingSettings.attr("PSPUType");
    NumberOfExistingPSPUDevices = parseInt(BookingSettings.attr("NumberOfExistingPSPUDevices"));

    DefaultBookingTimeReal = BookingSettings.attr("DefaultBookingTimeReal") * OneMinute;
    DefaultBookingTimeLineOffset = BookingSettings.attr("DefaultBookingTimeLineOffset") * OneMinute;
    MinimumTimeslotLength = BookingSettings.attr("MinimumTimeslotLength") * OneMinute;
    MaximumTimeslotLength = BookingSettings.attr("MaximumTimeslotLength") * OneMinute;
    DefaultTimeSlotSegments = BookingSettings.attr("DefaultTimeSlotSegments") * OneMinute;
    ExperimentEndingTime = BookingSettings.attr("ExperimentEndingTime") * OneMinute;

    Now = (new Date()).getTime();
    Now = Now - Now % DefaultTimeSlotSegments + DefaultTimeSlotSegments;

    TimelineStart = Now + DefaultBookingTimeLineOffset;
    StartBookingTime = TimelineStart;
    EndBookingTime = StartBookingTime + DefaultBookingTimeReal - ExperimentEndingTime;

    SliderElement = $("#Slider");
    Slider = SliderElement.slider({
        tooltip: 'always',
        step: DefaultTimeSlotSegments / OneMinute,
        min: MinimumTimeslotLength / OneMinute,
        max: MaximumTimeslotLength / OneMinute}
    );
    SliderElement.on("slideStop", function(EV){
        if(UseBPUTimeline){
            BPUItems._data[NewTimeslotID].end = new Date(BPUItems._data[NewTimeslotID].start.getTime() + EV.value * OneMinute);
            SetBPUItems();
        }
        if(UsePSPUTimeline){
            PSPUItems._data[NewTimeslotID].end = new Date(PSPUItems._data[NewTimeslotID].start.getTime() + EV.value * OneMinute);
            SetPSPUItems();
        }
        TestPossibleReservationsAndSetVariables();
    });

    $("#MyBookings").click(function () {
        window.open("index.php?Site=126");
    });
    $("#StartBooking").click(function () {
        LoadBookingsWithAjaxAndRefreshTimelines(function(){
            TestPossibleReservationsAndSetVariables(function() {
                if (BookingBPUIsPossible && BookingPSPUIsPossible) {
                    var Parameters = {};
                    Parameters.Mode = Mode;
                    Parameters.BPUType = BPUType;
                    Parameters.PSPUType = PSPUType;
                    if (UseBPUTimeline) {
                        Parameters.StartTime = Math.floor(BPUItems._data[NewTimeslotID].start / 1000);
                        Parameters.EndTime = Math.floor(BPUItems._data[NewTimeslotID].end / 1000);
                    } else {
                        Parameters.StartTime = Math.floor(PSPUItems._data[NewTimeslotID].start / 1000);
                        Parameters.EndTime = Math.floor(PSPUItems._data[NewTimeslotID].end / 1000);
                    }
                    Parameters.Location = Location;

                    $.ajax({
                        url: "index.php?Function=SetBooking&" + $.param(Parameters),
                        dataType: 'json',
                        success: function () {
                            LoadBookingsWithAjaxAndRefreshTimelines(function(){
                                TestPossibleReservationsAndSetVariables();
                            });
                        },
                        cache: false
                    });
                }
            })
        })
    });

    $("#DeleteBooking").click(function () {
        if(SelectedReservationID != 0 && SelectedReservationID != -1 && SelectedReservationID != NewTimeslotID)
            $.ajax({
                url: "index.php?Function=DeleteBooking&BookingID="+SelectedReservationID,
                dataType: 'json',
                success: function (data) {
                    if(UseBPUTimeline){
                        BPUItems.remove(SelectedReservationID);
                        SetBPUItems();
                    }
                    if(UsePSPUTimeline){
                        PSPUItems.remove(SelectedReservationID);
                        SetPSPUItems();
                    }
                    SelectedReservationID = 0;
                    EnableAndDisalbeDeleteButton();
                    RefreshUserBookings();
                },
                cache: false
            });
    });

    $("#BookingHelp").click(function () {
       $("#BookingsSystemHelpPanel").modal();
    });

    function SelectBookingAfterAutomove(Booking){
        if( UseBPUTimeline && Booking.BPUVirtual == "0" && BPUTimeline.itemSet.items[SelectedReservationID] == undefined ||
            UsePSPUTimeline && Booking.PSPUVirtual == "0" && PSPUTimeline.itemSet.items[SelectedReservationID] == undefined){
            window.setTimeout(SelectBookingAfterAutomove(Booking),50);
            return;
        }

        if(UseBPUTimeline && Booking.BPUVirtual == "0")
            BPUTimeline.setSelection(SelectedReservationID, {focus: true});

        if(UsePSPUTimeline && Booking.PSPUVirtual == "0")
            PSPUTimeline.setSelection(SelectedReservationID, {focus: true});
    }

    function SetBPUItems(){
        BPUTimeline.setItems(BPUItems);
    }

    function SetPSPUItems(){
        PSPUTimeline.setItems(PSPUItems);
    }

    function InitialiseDatepicker(){
        Datepicker = $('#Datepicker').datepicker({
            format: $("#FormatDatePicker").val()
        }).on('changeDate', function(ev) {
            var now = new Date();
            if(ev.date.getTime() < now.getTime() + DefaultBookingTimeLineOffset){
                Datepicker.setValue(TimelineStart);
                $("#InfodialogSelectDateInPast").modal();
            }

            var MoveToDate = new Date(
                Datepicker.date.getFullYear(),
                Datepicker.date.getMonth(),
                Datepicker.date.getDate(),
                Options.start.getHours(),
                Options.start.getMinutes(),
                Options.start.getHours()
            );

            if(UseBPUTimeline){
                BPUTimeline.moveTo(MoveToDate);
                Options.start = BPUTimeline.options.start;
                Options.end = BPUTimeline.options.end;
            }
            if(UsePSPUTimeline){
                PSPUTimeline.moveTo(MoveToDate);
                Options.start = PSPUTimeline.options.start;
                Options.end = PSPUTimeline.options.end;
            }

            Datepicker.hide();
        }).data("datepicker");
    }

    function InsertAndUpdateTimelineItems(Items, NewItems){
        if(NewItems != undefined) {
            // Insert new Items to timeline
            if (Object.keys(NewItems).length > 0) {
                $.each(NewItems, function (Index, Element) {
                    if (Items._data[parseInt(Index)] == undefined)
                        if (Element.UserID == UserID) {
                            Items.add(
                                {
                                    className: 'yourReservation',
                                    id: parseInt(Element.BookingID),
                                    content: 'Your reservation',
                                    start: new Date(parseInt(Element.StartTime) * 1000),
                                    end: new Date(parseInt(Element.EndTime) * 1000),
                                    editable: false
                                }
                            );
                        } else {
                            Items.add(
                                {
                                    className: 'otherReservation',
                                    id: parseInt(Element.BookingID),
                                    content: 'Other reservation',
                                    start: new Date(parseInt(Element.StartTime) * 1000),
                                    end: new Date(parseInt(Element.EndTime) * 1000),
                                    editable: false
                                }
                            );
                        }
                });
            }

            // Remove no longer existing bookings from timeline
            $.each(Items._data,function(Index, Element){
                if( parseInt(Index) != NewTimeslotID &&
                    Element.end.getTime() >= Options.start.getTime() &&
                    Element.start.getTime() <= Options.end.getTime() + Slider.data().value*60 &&
                    NewItems[Index] == undefined)
                        Items.remove(Index);
            });
        }
    }

    function RefreshBPUTimeline(Callback){
        var Parameters = {};
        Parameters.Category = "BPU";
        Parameters.BPUType = BPUType;
        Parameters.Location = Location;
        Parameters.StartTime = Math.floor(Options.start / 1000);
        Parameters.EndTime = Math.floor(Options.end / 1000) + Slider.data().value * 60;

        $.ajax({
            url: "index.php?Function=GetBooking&"+$.param(Parameters),
            dataType: 'json',
            success: function(data){
                InsertAndUpdateTimelineItems(BPUItems,data);
                if(Callback != undefined) Callback();
            },
            cache: false
        });
    }

    function RefreshPSPUTimeline(Callback){
        var Parameters = {};
        Parameters.Category = "PSPU";
        Parameters.PSPUType = PSPUType;
        Parameters.Location = Location;
        Parameters.StartTime = Math.floor(Options.start / 1000);
        Parameters.EndTime = Math.floor(Options.end / 1000) + Slider.data().value * 60;

        $.ajax({
            url: "index.php?Function=GetBooking&"+$.param(Parameters),
            dataType: 'json',
            success: function(data){
                InsertAndUpdateTimelineItems(PSPUItems,data);
                if(Callback != undefined) Callback();
            },
            cache: false
        });
    }

    function RefreshUserBookings(){
        var Parameters = {};
        Parameters.Mode = Mode;
        Parameters.BPUType = BPUType;
        Parameters.PSPUType = PSPUType;
        Parameters.StartTime = Math.floor(Options.start / 1000);
        Parameters.Location = Location;

        $.ajax({
            url: "index.php?Function=GetBooking&GetUserBookings&"+$.param(Parameters),
            dataType: 'json',
            success: function(data){
                UserBookings = data;
                BookingSelect.find("option").remove();

                if(Object.keys(UserBookings).length > 0){
                    BookingSelect.show();
                    BookingSelect.append('<option value="-1"> Your reservations with this device types: </option>');
                    BookingSelect.append('<option value="0"> [= Move to the start of the timeline =] </option>');

                    $.each(UserBookings,function(Index, Element){
                        BookingSelect.append(
                            '<option '+
                            (SelectedReservationID == Index ? " selected " : "")
                            +'value="' +
                            Element.BookingID
                            + '">' +
                            (new Date(Element.StartTime * 1000)).toLocaleString()
                            + ": " +
                            Element.BPUType
                            + " (" +
                            (Element.BPUVirtual == '1' ? VirtualString : RealString)
                            + ") - " +
                            Element.PSPUType
                            + " (" +
                            (Element.PSPUVirtual == '1' ? VirtualString : RealString)
                            + ') ['+
                            (Element.EndTime - Element.StartTime) / 60
                            +' minutes]</option>'
                        );
                    });
                }else{
                    BookingSelect.hide();
                }
            },
            cache: false
        });
    }

    function WaitForLoadingBookingsWithAjaxIsReady(Callback){
        if(LoadingBookingsForBPUWithAjaxIsReady && LoadingBookingsForPSPUWithAjaxIsReady){
            if(Callback != undefined) Callback();
        }else{
            window.setTimeout(function(){
                WaitForLoadingBookingsWithAjaxIsReady(Callback)
            },50);
        }
    }

    function LoadBookingsWithAjaxAndRefreshTimelines(Callback) {
        LoadingBookingsForBPUWithAjaxIsReady = false;
        LoadingBookingsForPSPUWithAjaxIsReady = false;
        
        if(UseBPUTimeline){
            RefreshBPUTimeline(function(){
                LoadingBookingsForBPUWithAjaxIsReady = true;
            });
        }else{
            LoadingBookingsForBPUWithAjaxIsReady = true;
        }

        if(UsePSPUTimeline){
            RefreshPSPUTimeline(function(){
                LoadingBookingsForPSPUWithAjaxIsReady = true;
            });
        }else{
            LoadingBookingsForPSPUWithAjaxIsReady = true;
        }

        RefreshUserBookings();

        if(Callback != undefined)
            WaitForLoadingBookingsWithAjaxIsReady(Callback);
    }

    function TestPossibleReservationsAndSetVariables(Callback){
        var TimeslotStart, TimeslotEnd;
        var BookingStarts = [];
        var BookingEnds = [];
        var MaximumParallelTimeslots ;
        var ParallelTimeslots;

        BookingBPUIsPossible = true;
        if(UseBPUTimeline){
            TimeslotStart = BPUItems._data[NewTimeslotID].start.getTime();
            TimeslotEnd = BPUItems._data[NewTimeslotID].end.getTime();
            $.each(BPUItems._data, function(Index, Element){
                if(Element.id != NewTimeslotID && Element.end.getTime() > TimeslotStart && Element.start.getTime() < TimeslotEnd)
                    if(Element.className == "yourReservation") {
                        BookingBPUIsPossible = false;
                    }else {
                        BookingStarts.push(Element.start.getTime());
                        BookingEnds.push(Element.end.getTime());
                    }
            });

            BookingStarts.sort().reverse();
            BookingEnds.sort().reverse();

            MaximumParallelTimeslots = 0;
            ParallelTimeslots = 0;

            while(BookingStarts.length > 0 && BookingEnds.length > 0){
                if(BookingStarts.length == 0)
                    break;

                if(BookingStarts[BookingStarts.length - 1] < BookingEnds[BookingEnds.length - 1]){
                    ParallelTimeslots++;
                    BookingStarts.pop();
                }else{
                    ParallelTimeslots--;
                    BookingEnds.pop();
                }

                if(ParallelTimeslots > MaximumParallelTimeslots)
                    MaximumParallelTimeslots = ParallelTimeslots;
            }

            BookingBPUIsPossible = BookingBPUIsPossible && NumberOfExistingBPUDevices > MaximumParallelTimeslots;
            if(BookingBPUIsPossible){
                BPUItems._data[NewTimeslotID].className = "newReservationFree";
            }else{
                BPUItems._data[NewTimeslotID].className = "newReservationOccupied";
            }

            SetBPUItems();

            Slider.slider('setValue', (TimeslotEnd-TimeslotStart) / 1000 / 60);
        }

        BookingPSPUIsPossible = true;
        if(UsePSPUTimeline){
            TimeslotStart = PSPUItems._data[NewTimeslotID].start.getTime();
            TimeslotEnd = PSPUItems._data[NewTimeslotID].end.getTime();
            $.each(PSPUItems._data, function(Index, Element){
                if(Element.id != NewTimeslotID && Element.end.getTime() > TimeslotStart && Element.start.getTime() < TimeslotEnd)
                    if(Element.className == "yourReservation") {
                        BookingPSPUIsPossible = false;
                    }else {
                        BookingStarts.push(Element.start.getTime());
                        BookingEnds.push(Element.end.getTime());
                    }
            });

            BookingStarts.sort().reverse();
            BookingEnds.sort().reverse();

            MaximumParallelTimeslots = 0;
            ParallelTimeslots = 0;

            while(BookingStarts.length > 0 && BookingEnds.length > 0){
                if(BookingStarts.length == 0)
                    break;

                if(BookingStarts[BookingStarts.length - 1] < BookingEnds[BookingEnds.length - 1]){
                    ParallelTimeslots++;
                    BookingStarts.pop();
                }else{
                    ParallelTimeslots--;
                    BookingEnds.pop();
                }

                if(ParallelTimeslots > MaximumParallelTimeslots)
                    MaximumParallelTimeslots = ParallelTimeslots;
            }

            BookingPSPUIsPossible = BookingPSPUIsPossible && NumberOfExistingPSPUDevices > MaximumParallelTimeslots;

            if(BookingPSPUIsPossible){
                PSPUItems._data[NewTimeslotID].className = "newReservationFree";
            }else{
                PSPUItems._data[NewTimeslotID].className = "newReservationOccupied";
            }

            SetPSPUItems();
        }

        if(BookingBPUIsPossible && BookingPSPUIsPossible){
            $("#StartBooking").prop("disabled", false);
        }else{
            $("#StartBooking").prop("disabled", true);
        }

        var Items;
        if(UseBPUTimeline) {
            Items = BPUItems;
        }else{
            Items = PSPUItems;
        }
        $("#StartTime").html(Items._data[NewTimeslotID].start.getTime()/1000);
        $("#StartTimeStamp").html(Items._data[NewTimeslotID].start);
        $("#EndTime").html(Items._data[NewTimeslotID].end.getTime()/1000);

        $("#EndTimeStamp").html(Items._data[NewTimeslotID].end);

        if(Callback != undefined) Callback();
    }

    function EnableAndDisalbeDeleteButton(){
        if(SelectedReservationID == NewTimeslotID)
            SelectedReservationID = 0;
        if(SelectedReservationID == -1)
            SelectedReservationID = 0;

        if(SelectedReservationID == 0){
            $("#DeleteBooking").prop("disabled", true);
        }else{
            $("#DeleteBooking").prop("disabled", false);
        }
    }

    Options = {
        start: new Date(TimelineStart),
        end: new Date(TimelineStart + 180 * OneMinute),
        min: TimelineStart,

        margin: {
            item:{
                horizontal:0,
                vertical:2
            },
            axis:0
        },

        minHeight: "180px",
        editable: {
            updateTime: true
        },

        itemsAlwaysDraggable: true,
        zoomMin: 1000*60*60*3,
        zoomMax: 1000*60*60*24*30*3
    };

    if(UseBPUTimeline){
        BPUItems = new vis.DataSet([
            {id: NewTimeslotID, content: 'New reservation', start: new Date(StartBookingTime), end: new Date(EndBookingTime), className: "newReservationFree"}
        ]);

        BPUContainer = document.getElementById('BPUVisualization');
        BPUTimeline = new vis.Timeline(BPUContainer, BPUItems, Options);
    }

    if(UsePSPUTimeline){
        PSPUItems = new vis.DataSet([
            {id: NewTimeslotID, content: 'New reservation', start: new Date(StartBookingTime), end: new Date(EndBookingTime), className: "newReservationFree"}
        ]);

        PSPUContainer = document.getElementById('PSPUVisualization');
        PSPUTimeline = new vis.Timeline(PSPUContainer, PSPUItems, Options);
    }

    NewTimelineItems = $('div').filter(function() { return $(this).html() == 'New reservation'; }).parent().parent();

    // PSPUTimeline.on('rangechange', function (properties) {});

    if(UseBPUTimeline){
        BPUTimeline.on('select', function(properties) {
            if(properties.items.length == 0 || BPUItems._data[properties.items[0]].className == "otherReservation"){
                SelectedReservationID = 0;
                BPUTimeline.setSelection([],{focus:true});
                if(UsePSPUTimeline)
                    PSPUTimeline.setSelection([],{focus:true});
            }else{
                SelectedReservationID = properties.items[0];
                if(UsePSPUTimeline && (SelectedReservationID == NewTimeslotID || UserBookings[SelectedReservationID].PSPUVirtual == "0"))
                    PSPUTimeline.setSelection(SelectedReservationID,{focus:true});
            }

            EnableAndDisalbeDeleteButton();
        });

        BPUTimeline.on('doubleClick', function(properties){
            var ClickTime = properties.time.getTime();
            ClickTime = ClickTime - ClickTime % DefaultTimeSlotSegments;

            var BookingLength = BPUItems._data[NewTimeslotID].end - BPUItems._data[NewTimeslotID].start;
            BPUItems._data[NewTimeslotID].start =  new Date(ClickTime);
            BPUItems._data[NewTimeslotID].end =  new Date(ClickTime + BookingLength);
            BPUTimeline.setItems(BPUItems);

            if(UsePSPUTimeline){
                PSPUItems._data[NewTimeslotID].start =  new Date(ClickTime);
                PSPUItems._data[NewTimeslotID].end =  new Date(ClickTime + BookingLength);
                PSPUTimeline.setItems(PSPUItems);
            }

            window.setTimeout(TestPossibleReservationsAndSetVariables,100);
        });

        BPUTimeline.on('rangechanged', function (properties) {
            Options.start = properties.start;
            Options.end = properties.end;

            if(UsePSPUTimeline) PSPUTimeline.setOptions(Options);

            LoadBookingsWithAjaxAndRefreshTimelines();
        });

        BPUItems.on('*', function(event){
            if(event != "add") {
                DefaultBookingTimeReal = BPUItems._data[NewTimeslotID].end - BPUItems._data[NewTimeslotID].start;
                Slider.slider('setValue', (DefaultBookingTimeReal) / 1000 / 60);

                if (DefaultBookingTimeReal > MaximumTimeslotLength) {
                    DefaultBookingTimeReal = MaximumTimeslotLength;
                    BPUItems._data[NewTimeslotID].end = new Date(BPUItems._data[NewTimeslotID].start.getTime() + DefaultBookingTimeReal);
                    SetBPUItems();
                }

                if (DefaultBookingTimeReal < MinimumTimeslotLength) {
                    DefaultBookingTimeReal = MinimumTimeslotLength;
                    BPUItems._data[NewTimeslotID].end = new Date(BPUItems._data[NewTimeslotID].start.getTime() + DefaultBookingTimeReal);
                    SetBPUItems();
                }

                if (BPUItems._data[NewTimeslotID].start < StartBookingTime) {
                    BPUItems._data[NewTimeslotID].start = new Date(StartBookingTime);
                    BPUItems._data[NewTimeslotID].end = new Date(StartBookingTime + DefaultBookingTimeReal);
                    SetBPUItems();
                }

                if (UsePSPUTimeline) {
                    PSPUItems._data[NewTimeslotID].start = BPUItems._data[NewTimeslotID].start;
                    PSPUItems._data[NewTimeslotID].end = BPUItems._data[NewTimeslotID].end;
                    SetPSPUItems();
                }

                TestPossibleReservationsAndSetVariables();
            }
        });
    }

    if(UsePSPUTimeline){
        PSPUTimeline.on('select', function(properties) {
            if(properties.items.length == 0 || PSPUItems._data[properties.items[0]].className == "otherReservation"){
                SelectedReservationID = 0;
                if(UseBPUTimeline)
                    BPUTimeline.setSelection([],{focus:true});
                PSPUTimeline.setSelection([],{focus:true});
            }else{
                SelectedReservationID = properties.items[0];
                if(UseBPUTimeline && (SelectedReservationID == NewTimeslotID || UserBookings[SelectedReservationID].BPUVirtual == "0"))
                    BPUTimeline.setSelection(SelectedReservationID,{focus:true});
            }

            EnableAndDisalbeDeleteButton();
        });

        PSPUTimeline.on('doubleClick', function(properties){
            var ClickTime = properties.time.getTime();
            ClickTime = ClickTime - ClickTime % DefaultTimeSlotSegments;

            var BookingLength = PSPUItems._data[NewTimeslotID].end - PSPUItems._data[NewTimeslotID].start;
            PSPUItems._data[NewTimeslotID].start =  new Date(ClickTime);
            PSPUItems._data[NewTimeslotID].end =  new Date(ClickTime + BookingLength);
            SetPSPUItems();

            if(UseBPUTimeline){
                BPUItems._data[NewTimeslotID].start =  new Date(ClickTime);
                BPUItems._data[NewTimeslotID].end =  new Date(ClickTime + BookingLength);
                SetBPUItems();
            }

            window.setTimeout(TestPossibleReservationsAndSetVariables,100);
        });

        PSPUTimeline.on('rangechanged', function (properties) {
            Options.start = properties.start;
            Options.end = properties.end;

            if(UseBPUTimeline) BPUTimeline.setOptions(Options);

            LoadBookingsWithAjaxAndRefreshTimelines();
        });

        PSPUItems.on('*', function(event){
            if(event != "add") {

                DefaultBookingTimeReal = PSPUItems._data[NewTimeslotID].end - PSPUItems._data[NewTimeslotID].start;
                Slider.slider('setValue', (DefaultBookingTimeReal) / 1000 / 60);

                if (DefaultBookingTimeReal > MaximumTimeslotLength) {
                    DefaultBookingTimeReal = MaximumTimeslotLength;
                    PSPUItems._data[NewTimeslotID].end = new Date(PSPUItems._data[NewTimeslotID].start.getTime() + DefaultBookingTimeReal);
                    SetPSPUItems();
                }

                if (DefaultBookingTimeReal < MinimumTimeslotLength) {
                    DefaultBookingTimeReal = MinimumTimeslotLength;
                    PSPUItems._data[NewTimeslotID].end = new Date(PSPUItems._data[NewTimeslotID].start.getTime() + DefaultBookingTimeReal);
                    SetPSPUItems();
                }

                if (PSPUItems._data[NewTimeslotID].start < StartBookingTime) {
                    PSPUItems._data[NewTimeslotID].start = new Date(StartBookingTime);
                    PSPUItems._data[NewTimeslotID].end = new Date(StartBookingTime + DefaultBookingTimeReal);
                    SetPSPUItems();
                }

                if (UseBPUTimeline) {
                    BPUItems._data[NewTimeslotID].start = PSPUItems._data[NewTimeslotID].start;
                    BPUItems._data[NewTimeslotID].end = PSPUItems._data[NewTimeslotID].end;
                    SetBPUItems();
                }

                TestPossibleReservationsAndSetVariables();
            }
        });
    }

    InitialiseDatepicker();
    EnableAndDisalbeDeleteButton();
    LoadBookingsWithAjaxAndRefreshTimelines(function(){
        TestPossibleReservationsAndSetVariables();
    });
});