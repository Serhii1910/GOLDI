$(document).ready(function()
{
    var RefreshTimer = undefined;
    // time in milliseconds the visitor's view is being refreshed
    var RefreshTime = 1000;
    var items;
    var Template = $('#ExperimentTemplate').clone();
	Template.removeClass('hidden');
    var ExperimentIDs = new Array();
	var DrawExperiments = false;

    //var RealString = $("#Translations").attr("Real");
    //var VirtualString = $("#Translations").attr("Virtual");

    //var PSPUString = $("#Translations").attr("PSPU");
    //var BPUString = $("#Translations").attr("BPU");

    RefreshVisitorSite();
    
    RefreshTimer = setInterval(function () {
        RefreshVisitorSite();
    }, RefreshTime);
    
    function RefreshVisitorSite()
    {
        $.getJSON("index.php?Function=Visitor",function( data ) 
        {
            items = data;
			DrawExperiments = false;

            $('#RunningExperiments').html(data.length);

			//Check, if there are new Experiments or old ones are gone
			if(items.length != Object.keys(ExperimentIDs).length)
			{
				DrawExperiments = true;
			}
			else
			{
				for(var i = 0; i < items.length; i++)
				{
					if(ExperimentIDs['ExperimentTemplate_' + items[i].ExperimentID] != items[i].ExperimentID)
					{
						DrawExperiments = true;
					}
				}
			}
            if(DrawExperiments) BuildExperimentButtons(items);
			RefreshRemainingTimesAndErrors(items, ExperimentIDs);
        });
    }
	
	function RefreshRemainingTimesAndErrors(Experiments, IDs)
	{
		for(var i = 0; i < Experiments.length; i++)
        {
            var Obj = $('#ExperimentTemplate_' + IDs['ExperimentTemplate_' + Experiments[i].ExperimentID]);
			Obj.find('#RemainingTime_' + Experiments[i].ExperimentID).html(Experiments[i].Duration);
            Obj.find('#NumberOfErrors_' + Experiments[i].ExperimentID).html(Experiments[i].NumberOfError);
            Obj.find('#StartTime_' + Experiments[i].ExperimentID).html(Experiments[i].StartTime);
            Obj.find('#EndTime_' + Experiments[i].ExperimentID).html(Experiments[i].EndTime);
        }
	}
    
    function BuildExperimentButtons(Experiments)
    {
        var Obj;
        $('#ButtonContainer').html('');
    
		ExperimentIDs = [];
	
        for(var i = 0; i < Experiments.length; i++)
        {
            Obj = $(Template).clone();
			
			var NumberOfErrors = Obj.find('#NumberOfErrors');
			var StartTime = Obj.find('#StartTime');
			var EndTime = Obj.find('#EndTime');

            Obj.find("#PSPUName").attr("data-i18n","[title]"+Experiments[i].PSPUType+";"+Experiments[i].PSPUType);
            TMP = Experiments[i].PSPUVirtual == 1?"Virtual":"Real";
            Obj.find("#PSPUVirtual").attr("data-i18n","[title]"+TMP+";"+TMP);
            Obj.find(".img1").attr("data-i18n","[title]"+Experiments[i].PSPUType);

            Obj.find("#BPUName").attr("data-i18n","[title]"+Experiments[i].BPUType+";"+Experiments[i].BPUType);
            TMP = Experiments[i].BPUVirtual == 1?"Virtual":"Real";
            Obj.find("#BPUVirtual").attr("data-i18n","[title]"+TMP+";"+TMP);
            Obj.find(".img2").attr("data-i18n","[title]"+Experiments[i].BPUType);

            Obj.find('#ExperimentID').html(Experiments[i].ExperimentID);

            Obj.attr('id','ExperimentTemplate_' + Experiments[i].ExperimentID);
            Obj.find('.img2').attr('src',Obj.find('.img2').attr('src').replace('Dummy.png', Experiments[i].BPUType + '.png'));
            Obj.find('.img1').attr('src',Obj.find('.img1').attr('src').replace('Dummy.png', Experiments[i].PSPUType + '.png'));
            NumberOfErrors.html(Experiments[i].NumberOfError);
            NumberOfErrors.attr('id','NumberOfErrors_' + Experiments[i].ExperimentID);
            StartTime.html(Experiments[i].StartTime);
            StartTime.attr('id','StartTime_' + Experiments[i].ExperimentID);
            EndTime.html(Experiments[i].EndTime);
            EndTime.attr('id','EndTime_' + Experiments[i].ExperimentID);
			Obj.find('#RemainingTime').attr('id','RemainingTime_' + Experiments[i].ExperimentID);
            ExperimentIDs[Obj.attr('id')] = Experiments[i].ExperimentID;
            Obj.find('#Location').text(Experiments[i].Location);
            Obj.find('.loc').attr('src',Obj.find('.loc').attr('src').replace('Dummy.png', Experiments[i].Location + '.png'));
            Obj.click(function()
            {
                window.open('index.php?Function=ECP&ExperimentID=' + ExperimentIDs[$(this).attr('id')]);
            });
            
            $('#ButtonContainer').append(Obj);
        }
        i18nValidate();
    }
});
