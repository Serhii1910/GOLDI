function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

$(window).on("unload", function() {
    $.ajax({
        url: "index.php?Function=DequeueUser",
        async: false
    });
});

$(document).ready(function()
{
    var Location = getParam("Location");
    var Mode = getParam("Mode");
    var BPUType = getParam("BPUType");
    var PSPUType = getParam("PSPUType");

    // time in milliseconds the visitor's view is being refreshed
    var RefreshTime = 1000;
    var RefreshTimer;
    var items;
    var Template = $('#QueueTemplate').clone();
    Template.removeClass('hide');

    var params = {
        Mode: Mode,
        BPUType: BPUType,
        PSPUType: PSPUType,
        Location: Location
    }

    function BPUIsVirtualInMode(Mode){
        return Mode.toUpperCase() == "A" || Mode.toUpperCase() == "B";
    }

    function PSPUIsVirtualInMode(Mode){
        return Mode.toUpperCase() == "A" || Mode.toUpperCase() == "D";
    }

    $.ajax({
        url: "index.php?Function=EnqueueUser&"+$.param(params),
    }).done(function(){
        RefreshExperimentSite();
        RefreshTimer = setInterval(function () {
            RefreshExperimentSite();
        }, RefreshTime);
    });

    function RefreshExperimentSite()
    {
        $.getJSON("index.php?Function=GetBookingQueue&Location="+Location,function( data )
        {
            items = data;
            BuildBookingQueues(items);
        });
    }

    function BuildBookingQueues(BookingQueue)
    {
        ExperimentIsReady = true;
        var Obj;

        $('#BPUArea').html('');
        Obj = $(Template).clone();
        Obj.find("li:nth-child(1)").attr("data-i18n",BPUType);
        if(BPUIsVirtualInMode(Mode)){
            Obj.append(' <li class="btn btn-success">1: <span class="tag" data-i18n="You"></span></li>');
        }else if(BookingQueue[PSPUType] != undefined){
            for(var i = 0; i < BookingQueue[BPUType].length; i++)
                if(BookingQueue[BPUType][i].User == "You"){
                    if(!BookingQueue[BPUType][i].DeviceIsAvailable)
                        ExperimentIsReady = false;
                    if(BookingQueue[BPUType][i].QueuePosition != 1)
                        ExperimentIsReady = false;
                    Obj.append(' <li class="btn btn-success">'+BookingQueue[BPUType][i].QueuePosition+': <span class="tag" data-i18n="You"></span></li>');
                }else{
                    Obj.append(' <li class="btn btn-danger">'+BookingQueue[BPUType][i].QueuePosition+': <span class="tag" data-i18n="OtherUser"></span></li>');
                }
        }else{
            ExperimentIsReady = false;
        }
        $('#BPUArea').append(Obj);


        $('#PSPUArea').html('');
        Obj = $(Template).clone();
        Obj.find("li:nth-child(1)").attr("data-i18n",PSPUType);
        if(PSPUIsVirtualInMode(Mode)){
            Obj.append(' <li class="btn btn-success">1: <span class="tag" data-i18n="You"></span></li>');
        }else if(BookingQueue[PSPUType] != undefined){
            for(var i = 0; i < BookingQueue[PSPUType].length; i++)
                if(BookingQueue[PSPUType][i].User == "You"){
                    if(!BookingQueue[PSPUType][i].DeviceIsAvailable)
                        ExperimentIsReady = false;
                    if(BookingQueue[PSPUType][i].QueuePosition != 1)
                        ExperimentIsReady = false;
                    Obj.append(' <li class="btn btn-success">'+BookingQueue[PSPUType][i].QueuePosition+': <span class="tag" data-i18n="You"></span></li>');
                }else{
                    Obj.append(' <li class="btn btn-danger">'+BookingQueue[PSPUType][i].QueuePosition+': <span class="tag" data-i18n="OtherUser"></span></li>');
                }
        }else{
            ExperimentIsReady = false;
        }
        $('#PSPUArea').append(Obj);

        i18nValidate();

        if(ExperimentIsReady)
            $("#StartExperimentDialog").modal();
    }

    $("#StartExperimentDialogYes").click(function(){
        window.location.href = "index.php?Function=ECP&"+$.param(params);
    });

    $("#StartExperimentDialogCancel").click(function(){
        window.location.href = "index.php";
    });

});
