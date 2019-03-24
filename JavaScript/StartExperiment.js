$(document).ready(function() {
	if(localStorage.GOLDiRunningExperiment == undefined)
        localStorage.GOLDiRunningExperiment = "stop";

	$("#StartExperimentButton").hide();
	$("#EnqueueUserButton").hide();
	$("#InfoText").hide();
	$("#StartBooking").hide();

	var Location = $('#Location').attr("location");
	var URL = $('#Location').attr("url");

	WebSocketClient = new WebSocket(URL);
	WebSocketClient.onopen = function(ev)
	{
		$("#StartContent").toggleClass("hidden");
		$("#StartError").toggleClass("hidden");
		WebSocketClient.close();
	};

	// time in milliseconds the experiment selector view is being refreshed
	var RefreshTime = 1000;
	var Items;
	var DrawnItems;
	var BPUTemplate = $('#BPUTemplate').clone();
	BPUTemplate.removeClass('hidden');
	var PSPUTemplate = $('#PSPUTemplate').clone();
	PSPUTemplate.removeClass('hidden');
	var ButtonStates = [];
	var Mode ="";
	var Parameters;

	RefreshECPSelectSite();

	var RefreshTimer = setInterval(function () {
		if(localStorage.GOLDiRunningExperiment == "stop"){
            GetButtonStates();
            RefreshECPSelectSite();
		}
	}, RefreshTime);

	function StartExperiment(Target, NewWindow){
		GetButtonStates();
		if(Mode != ""){
			if(NewWindow){
				window.open('index.php?'+Target+'&'+$.param(Parameters));
//                window.location.href = 'index.php?Site=47';
			}else{
				window.location.href = 'index.php?'+Target+'&'+$.param(Parameters);
			}
		}
	}

	$('#StartExperimentButton').click(function(){StartExperiment("Function=ECP",true )});
	$('#EnqueueUserButton')    .click(function(){StartExperiment("Function=ECP",true )});
	$('#StartBooking')     	   .click(function(){StartExperiment("Site=124"    ,false)});

	function RefreshECPSelectSite()
	{
		$.getJSON("index.php?Function=GetExistingDeviceTypes&Location="+Location,function( data ) {
			Items = data;

			if(JSON.stringify(data) != DrawnItems)
			{
				BuildUnitButtons(Items);
				RefreshButtons(Items.BPU, Items.PSPU);
			}
		});
	}

	function ActivateButton(Object)
	{
		Object.find('.panel-heading').css('opacity','1');
		Object.find('.panel-heading').css('filter','alpha(opacity=100)');
		Object.find('img').css('opacity','1');
		Object.find('img').css('filter','alpha(opacity=100)');
		Object.find('.toggle').css('opacity','1');
		Object.find('.toggle').css('filter','alpha(opacity=100)');
	}

	function RefreshButtons(BPUButtons, PSPUButtons)
	{
		for(let i = 0; i < BPUButtons.length; i++)
		{
			let Obj = $('#BPUTemplate_' + BPUButtons[i].Type);
            let Input = Obj.find('input');
            let InputParent = Obj.find('input').parent();

			if(BPUButtons[i].ExistingVirtual && BPUButtons[i].ExistingReal)
			{
				ActivateButton(Obj);
				InputParent.css('opacity','1');
				InputParent.css('filter','alpha(opacity=100)');
				Input.removeAttr('disabled');
				InputParent.removeAttr('disabled');
				InputParent.addClass('off');
			}
			else
			{
                Obj.find(".toggle").hide();
                if(BPUButtons[i].ExistingVirtual){
                    InputParent.removeClass('off');
                    Obj.find(".virtual").show();
                }else{
                    InputParent.addClass('off');
                    Obj.find(".real").show();
                }
			}
		}

		for(let i = 0; i < PSPUButtons.length; i++)
		{
			let Obj = $('#PSPUTemplate_' + PSPUButtons[i].Type);
            let Input = Obj.find('input');
            let InputParent = Obj.find('input').parent();

			if(PSPUButtons[i].ExistingVirtual && PSPUButtons[i].ExistingReal)
			{
                ActivateButton(Obj);
				InputParent.css('opacity','1');
				InputParent.css('filter','alpha(opacity=100)');
				Input.removeAttr('disabled');
				InputParent.removeAttr('disabled');
				Obj.find('.toggle').addClass('btn-success');
				Obj.find('.toggle').removeClass('btn-danger');
				InputParent.addClass('off');
			}
			else
			{
                Obj.find(".toggle").remove();

                if(PSPUButtons[i].ExistingVirtual){
                    InputParent.removeClass('off');
                	Obj.find(".virtual").show();

                }else{
                    InputParent.addClass('off');
                    Obj.find(".real").show();
				}
            }
		}

//		$(".goldi-bpu")
	}

	function GetButtonStates(Callback)
	{
		$('.goldi-pspu').each(function(index,object){
			var Attribute = $(object).find('input').parent().hasClass('off');

			// For some browsers, `attr` is undefined; for others,
			// `attr` is false.  Check for both.
			if (typeof Attribute !== typeof undefined && Attribute !== false) {
				ButtonStates[$(object).attr('id')] = 'Real';
			}
			else
			{
				ButtonStates[$(object).attr('id')] = 'Virtual';
			}
		});

		$('.goldi-bpu').each(function(index,object){
			var Attribute = $(object).find('input').parent().hasClass('off');

			// For some browsers, `attr` is undefined; for others,
			// `attr` is false.  Check for both.
			if (typeof Attribute !== typeof undefined && Attribute !== false) {
				ButtonStates[$(object).attr('id')] = 'Real';
			}
			else
			{
				ButtonStates[$(object).attr('id')] = 'Virtual';
			}
		});
	}

	var PermittedDeviceCombinations;
	var CompatibleBPUs = {};
	var CompatiblePSPUs = {};
	var SelectedBPU = undefined;
	var SelectedPSPU = undefined;

	$.ajax({
		url: "index.php?Function=GetPermittedDeviceCombinations&Location="+Location,
		dataType: 'json',
		success: function(data){
			PermittedDeviceCombinations = data;

            $.each(PermittedDeviceCombinations,function(BPUType, ListOfEntrys){
                $.each(ListOfEntrys,function(VirtualReal,ListOfFittingPSPUS){
                    $.each(ListOfFittingPSPUS,function(PSPUType, Key){
						if((Key.hasOwnProperty("Real") && Key["Real"]=="1") || (Key.hasOwnProperty("Virtual") && Key["Virtual"] == "1") ){
							if(CompatibleBPUs[BPUType] == undefined)
                                CompatibleBPUs[BPUType] = {};
                            CompatibleBPUs[BPUType][PSPUType] = true;

                            if(CompatiblePSPUs[PSPUType] == undefined)
                                CompatiblePSPUs[PSPUType] = {};
                            CompatiblePSPUs[PSPUType][BPUType] = true;
						}
                    });
                });
            });

            SelectedBPU = undefined;
            SelectedPSPU = undefined;
        },
		cache: false
	});

	function TestPermittedDeviceCombinations()
	{
		if(SelectedBPU != undefined && SelectedPSPU != undefined){
			var PSPUVirtualText = $(".goldi-pspu.panel-primary").find('input').first().parent().hasClass('off') ? "Real":"Virtual";
			var BPUVirtualText = $(".goldi-bpu.panel-primary").find('input').first().parent().hasClass('off') ? "Real":"Virtual";

			var Return = false;
			if(PermittedDeviceCombinations.hasOwnProperty(SelectedBPU))
				if(PermittedDeviceCombinations[SelectedBPU].hasOwnProperty(BPUVirtualText))
					if(PermittedDeviceCombinations[SelectedBPU][BPUVirtualText].hasOwnProperty(SelectedPSPU))
						if(PermittedDeviceCombinations[SelectedBPU][BPUVirtualText][SelectedPSPU].hasOwnProperty(PSPUVirtualText))
							if(PermittedDeviceCombinations[SelectedBPU][BPUVirtualText][SelectedPSPU][PSPUVirtualText] == 1)
								Return = true;

			$("#StartBooking").hide();

			if(Return)
			{
				$("#InfoText").hide();

				if(SelectedBPU != "" && SelectedPSPU != "") {
					if (BPUVirtualText == "Virtual") {
						if (PSPUVirtualText == "Virtual") {
							Mode = "a";
						}
						else {
							Mode = "b";
						}
					}
					else
					{
						if (PSPUVirtualText == "Virtual") {
							Mode = "d";
						}
						else {
							Mode = "c";
						}
					}
				}

				if(Mode != "a")
					$("#StartBooking").show();

				Parameters = new Object();
				Parameters.Mode = Mode;
				Parameters.BPUType = SelectedBPU;
				Parameters.PSPUType = SelectedPSPU;
				Parameters.Location = Location;

				var url=  "index.php?Function=GetAvailableServiceDestIDsForExperiment&"+$.param(Parameters);

				$.ajax({
					url: "index.php?Function=GetAvailableServiceDestIDsForExperiment&"+$.param(Parameters),
					dataType: 'json',
					success: function(data){
						$("#StartExperimentButton").hide();
						$("#EnqueueUserButton").hide();
						$("#InfoText").hide();

						if(data == false){
							$("#EnqueueUserButton").show();
						}else{
							$("#StartExperimentButton").show();
						}
					},
					cache: false
				});
			}
			else
			{
				$("#StartExperimentButton").hide();
				$("#EnqueueUserButton").hide();
				$("#InfoText").show();
			}
		}else{
            $("#StartExperimentButton").hide();
            $("#StartBooking").hide();
            $("#EnqueueUserButton").hide();
            $("#InfoText").hide();
		}
	}

	function GrayOutIncompatibleDevices(){
    	if(SelectedBPU == undefined && SelectedPSPU == undefined){
            $(".gray_out_bpu").hide();
            $(".gray_out_pspu").hide();
		}else{
            $(".gray_out_bpu").show();
            $(".gray_out_pspu").show();

            if(SelectedBPU != undefined){
                $("#GrayOutBPU_"+SelectedBPU).hide();
                if(CompatibleBPUs[SelectedBPU] != undefined)
                    $.each(CompatibleBPUs[SelectedBPU],function(DeviceType, Value){
                        $("#GrayOutPSPU_"+DeviceType).hide();
                    });
            }

            if(SelectedPSPU != undefined){
                $("#GrayOutPSPU_"+SelectedPSPU).hide();
                if(CompatiblePSPUs[SelectedPSPU] != undefined)
                    $.each(CompatiblePSPUs[SelectedPSPU],function(DeviceType, Value) {
                        $("#GrayOutBPU_" + DeviceType).hide();
                    });
            }
		}
	}

	function BuildUnitButtons(Units)
	{
		var BPUs = Units.BPU;
		var PSPUs = Units.PSPU;

		$('#BPUContainer').html('');
		$('#PSPUContainer').html('');

		for(var i = 0; i < BPUs.length; i++)
		{
			var Obj = $(BPUTemplate).clone();

			Obj.attr('id','BPUTemplate_' + BPUs[i].Type);
			Obj.children().first().attr('id',BPUs[i].Type);
			TMP = "[title]"+BPUs[i].DisplayType+";"+BPUs[i].DisplayType;
			Obj.find('p').attr("data-i18n",TMP);
			Obj.find('img').attr('src',Obj.find('img').attr('src').replace('Dummy.png', BPUs[i].Type + '.png'));
			Obj.find('.gray_out_bpu').attr('id',"GrayOutBPU_"+BPUs[i].Type);

			$('#BPUContainer').append(Obj);
		}

		for(var i = 0; i < PSPUs.length; i++)
		{
			var Obj = $(PSPUTemplate).clone();

			Obj.attr('id','PSPUTemplate_' + PSPUs[i].Type);
			Obj.children().first().attr('id',PSPUs[i].Type);
			TMP = "[title]"+PSPUs[i].DisplayType+";"+PSPUs[i].DisplayType;
			Obj.find('p').attr("data-i18n",TMP);
			Obj.find('img').attr('src',Obj.find('img').attr('src').replace('Dummy.png', PSPUs[i].Type + '.png'));
            Obj.find('.gray_out_pspu').attr('id',"GrayOutPSPU_"+PSPUs[i].Type);

			$('#PSPUContainer').append(Obj);
		}

		DrawnItems = JSON.stringify(Items);

		$('.goldi-bpu').click(function(e) {
			if($(this).hasClass("panel-primary") && !$(e.toElement).hasClass("btn")){
                $('.goldi-bpu').removeClass('panel-primary');
                SelectedBPU = undefined;
			}else{
                $('.goldi-bpu').removeClass('panel-primary');
                $(this).addClass('panel-primary');

                SelectedBPU = $(this).attr("id");

                if(CompatibleBPUs[SelectedBPU] == undefined || CompatibleBPUs[SelectedBPU][SelectedPSPU] == undefined){
                    $('.goldi-pspu').removeClass('panel-primary');
					SelectedPSPU = undefined;
				}

                if(SelectedPSPU == undefined && Object.keys(CompatibleBPUs[SelectedBPU]).length == 1){
                    SelectedPSPU = Object.keys(CompatibleBPUs[SelectedBPU])[0];
                    $("#"+SelectedPSPU).addClass("panel-primary");
                }
			}

            GrayOutIncompatibleDevices();
            TestPermittedDeviceCombinations();
        });

		$('.goldi-pspu').click(function(e) {
            if($(this).hasClass("panel-primary") && !$(e.toElement).hasClass("btn")){
                $('.goldi-pspu').removeClass('panel-primary');
				SelectedPSPU = undefined;
            }else{
                $('.goldi-pspu').removeClass('panel-primary');
                $(this).addClass('panel-primary');

                SelectedPSPU = $(this).attr("id");

                if(CompatibleBPUs[SelectedBPU] == undefined || CompatibleBPUs[SelectedBPU][SelectedPSPU] == undefined){
                    $('.goldi-bpu').removeClass('panel-primary');
					SelectedBPU = undefined;
				}

                if(SelectedBPU == undefined && Object.keys(CompatiblePSPUs[SelectedPSPU]).length == 1){
                    SelectedBPU = Object.keys(CompatiblePSPUs[SelectedPSPU])[0];
                    $("#"+SelectedBPU).addClass("panel-primary");
                }
			}

            GrayOutIncompatibleDevices();
            TestPermittedDeviceCombinations();
        });

		$('.goldi-toggle').change(function() {
			TestPermittedDeviceCombinations();
		});

		$('.goldi-toggle').bootstrapToggle();

		on = $('.toggle-on');
		on.addClass('tag');
		on.attr("data-i18n","Virtual");

		off = $('.toggle-off');
		off.addClass('tag');
		off.attr("data-i18n","Real");

		i18nValidate();

		$(".toggle").css("min-width","120px");
	}
});