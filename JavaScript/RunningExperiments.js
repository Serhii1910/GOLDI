$(document).ready(function()
{
    var Location = getParam("Admin");

    // time in milliseconds the visitor's view is being refreshed
    var RefreshTime = 1000;
    var items;
    var Template = $('#ExperimentTemplate').clone();
    Template.removeClass('hide');
    var ExperimentIDs = new Object();
	var DrawExperiments = false;

    RefreshExperimentSite();
    
    var RefreshTimer = setInterval(function () {
        RefreshExperimentSite();
    }, RefreshTime);
    
    function RefreshExperimentSite()
    {
        $.getJSON("index.php?Function=Visitor&Location="+Location,function( data )
        {
            items = data;
			DrawExperiments = false;

			//Check, if there are new Experiments or old ones are gone
			if(items.length != Object.keys(ExperimentIDs).length)
			{
				DrawExperiments = true;
			}
			else
			{
				for(var i = 0; i < items.length; i++)
				{
					if(ExperimentIDs['Experiment_' + items[i].ExperimentID] != items[i].ExperimentID)
					{
						DrawExperiments = true;
					}
				}
			}
            if(DrawExperiments) BuildExperimentButtons(items);
			//RefreshRemainingTimesAndErrors(items, ExperimentIDs);
        });
    }

/*	function RefreshRemainingTimesAndErrors(Experiments, IDs)
	{
		for(var i = 0; i < Experiments.length; i++)
        {
            var Obj = $('#ExperimentTemplate_' + IDs['ExperimentTemplate_' + Experiments[i].ExperimentID]);
			Obj.find('#RemainingTime_' + Experiments[i].ExperimentID).html(Experiments[i].Duration);
			Obj.find('#NumberOfErrors_' + Experiments[i].ExperimentID).html(Experiments[i].NumberOfError)
        }
	}*/

    function BuildExperimentButtons(Experiments)
    {
        var Obj;
        $('#ExperimentContainer').html('');

		ExperimentIDs = {};

        for(var i = 0; i < Experiments.length; i++)
        {
            var ExperimentID = Experiments[i].ExperimentID;
            Obj = $(Template).clone();

            Obj.find(":nth-child(1)").text(Experiments[i].ExperimentID);
            Obj.find(":nth-child(2)").text(Experiments[i].Username);
            Obj.find(":nth-child(3)").attr("data-i18n",Experiments[i].PSPUType);
            Obj.find(":nth-child(4)").attr("data-i18n",Experiments[i].PSPUVirtual == 0 ? "Real" : "Virtual");
            Obj.find(":nth-child(5)").attr("data-i18n",Experiments[i].BPUType);
            Obj.find(":nth-child(6)").attr("data-i18n",Experiments[i].BPUVirtual == 0 ? "Real" : "Virtual");
            Obj.find(":nth-child(7)").text(Experiments[i].StartTime);
            Obj.find(":nth-child(8)").text(Experiments[i].EndTime);

            var ID = "Experiment_"+Experiments[i].ExperimentID;
            Obj.find(".EndExperiment").attr("ID",Experiments[i].ExperimentID);
            Obj.find(".EndExperiment").click(function() {
                $.post("index.php?Function=AdminEndExperiment&ExperimentID="+$(this).attr("ID"),function(data){
                    //console.log(data);
                });
            });
            ExperimentIDs[ID] = Experiments[i].ExperimentID;

            $('#ExperimentContainer').append(Obj);
        }

        i18nValidate();
    }

    $('#EndAllExperiments').click(function(){
        $.post("index.php?Function=AdminEndAllExperiments&Location="+Location);
    });
});
