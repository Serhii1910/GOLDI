$(document).ready(function()
{
    var Location = getParam("Admin");

    // time in milliseconds the visitor's view is being refreshed
    var RefreshTime = 1000;
    var items;
    var Template = $('#QueueTemplate').clone();
    Template.removeClass('hide');

    RefreshExperimentSite();

    var RefreshTimer = setInterval(function () {
        RefreshExperimentSite();
    }, RefreshTime);

    function RefreshExperimentSite()
    {
        $.getJSON("index.php?Function=AdminGetBookingQueue&Location="+Location,function( data )
        {
            items = data;
            BuildBookingQueues(items);
        });
    }

    function BuildBookingQueues(BookingQueue)
    {
        var Obj;

        $('#BPUArea').html('');
        for(var i = 0; i < BookingQueue.BPU.length; i++)
        {
            Device = BookingQueue.BPU[i];
            Obj = $(Template).clone();
            Obj.find("li:nth-child(1)").attr("data-i18n",Device.Type);
            for(var j = 0; j < Device.Users.length; j++)
                Obj.append(' <li class="btn btn-success tag" data-i18n="">Pos. '+Device.Users[j].QueuePosition+': UserID '+Device.Users[j].UserID+'</li>');
            $('#BPUArea').append(Obj);
        }

        $('#PSPUArea').html('');
        for(var i = 0; i < BookingQueue.PSPU.length; i++)
        {
            Device = BookingQueue.PSPU[i];
            Obj = $(Template).clone();
            Obj.find("li:nth-child(1)").attr("data-i18n",Device.Type);
            for(var j = 0; j < Device.Users.length; j++)
                Obj.append(' <li class="btn btn-success">Pos. '+Device.Users[j].QueuePosition+': UserID '+Device.Users[j].UserID+'</li>');
            $('#PSPUArea').append(Obj);
        }

        i18nValidate();
    }

});
