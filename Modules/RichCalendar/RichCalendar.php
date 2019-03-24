<script> // F�r Kalender
    <?php //push_locale_dir('RichCalendar'); ?>

    // ----- Einbinden des Rich-Kalender -----
    var text = new Array();

    var head = document.getElementsByTagName('head')[0];

    var script = document.createElement('script');
    script.onload = load_language;
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", 'Modules/RichCalendar/rich_calendar.js');
    head.appendChild(script);

    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = 'Modules/RichCalendar/RichCalendar.css';
    head.appendChild(style);
    // ----- Ende Einbinden des Rich-Kalender -----


    // ----- LanguageSupport f�r Rich-Kalender -----
    function load_language() {
        text['today'] = '<?php echo lang('today'); ?>';
        text['time'] = '<?php echo lang('time'); ?>';

        text['dayNamesShort'] = new Array(
            <?php
            for($i=0;$i<=5;$i++)
                echo "'".utf8_encode(strftime('%a',1394924400+60*60*24*$i))."',";
            echo "'".utf8_encode(strftime('%a',1394924400+60*60*24*6))."'";
            ?>
        );

        text['dayNames'] = new Array(
            <?php
            for($i=0;$i<=5;$i++)
                echo "'".utf8_encode(strftime('%A',1394924400+60*60*24*$i))."',";
            echo "'".utf8_encode(strftime('%A',1394924400+60*60*24*6))."'";
            ?>
        );

        text['monthNamesShort'] = new Array(
            <?php
            for($i=0;$i<=10;$i++)
                echo "'".utf8_encode(strftime('%b',1389740400+60*60*24*30*$i))."',";
            echo "'".utf8_encode(strftime('%b',1389740400+60*60*24*30*11))."'";
            ?>
        );

        text['monthNames'] = new Array(
            <?php
            for($i=0;$i<=10;$i++)
                echo "'".utf8_encode(strftime('%B',1389740400+60*60*24*30*$i))."',";
            echo "'".utf8_encode(strftime('%B',1389740400+60*60*24*30*11))."'";
            ?>
        );

        text['footerDateFormat'] = '<?php echo lang('format_calendar_date'); ?>',
            text['dateFormat'] = '<?php echo lang('format_calendar_date'); ?>',
            text['footerDefaultText'] = '<?php echo lang('footerDefaultText'); ?>',
            text['clear'] = '<?php echo lang('clear_date'); ?>',
            text['prev_year'] = '<?php echo lang('prev_year'); ?>',
            text['prev_month'] = '<?php echo lang('prev_month'); ?>',
            text['next_month'] = '<?php echo lang('next_month'); ?>',
            text['next_year'] = '<?php echo lang('next_year'); ?>',
            text['close'] = '<?php echo lang('close'); ?>',

            // weekend days (0 - sunday, ... 6 - saturday)
            text['weekend'] = "0,6";
        text['make_first'] = "<?php echo lang('make_first'); ?> %s";

        RichCalendar.rc_lang_data['<?php echo $_SESSION['locale']?>'] = text;

        window.setTimeout(init_text_fields, 500);
    }
    // ----- Ende LanguageSupport f�r Rich-Kalender -----


    // ----- Definition der Funktionen des Rich-Kalender -----
    var cal_obj = null;
    var format = '<?php echo lang('format_calendar_date');?>';

    // Addiert die minimale Zeit, die zwischen Reservervierung und Buchung sein muss auf die aktuelle Zeit und rundet auf die n�chste volle Stunde auf.
    /*	function round_hour(offset){
     return new Date(~~((new Date().getTime()+1000*(60+offset)*60) / (1000*60*60))*1000*60*60);
     }*/

    //	var format = '%j %M %Y %H:%i';
    // show calendar
    function show_cal(el, shown_text_field_id, hidden_text_field_id) {
        if (cal_obj) return;
        var shown_text_field = document.getElementById(shown_text_field_id);
        var hidden_text_field = document.getElementById(hidden_text_field_id);
        cal_obj = new RichCalendar();
        cal_obj.language = '<?php echo $_SESSION['locale'];?>';
        cal_obj.default_lang = '<?php echo $_SESSION['locale'];?>';
        cal_obj.start_week_day = 1;
        cal_obj.date = shown_text_field.value == "" ? new Date() : new Date(parseInt(hidden_text_field.value));
//		cal_obj.show_time = true;

        /*		if(shown_text_field_id == 'shown_from_date')
         cal_obj.date = text_field.value==""?new Date(new Date().getTime()+(future_Experiment_time+10)*1000*60):new Date(parseInt(text_field.value));*/
        /*		}else{
         cal_obj.date = text_field.value==""?new Date(new Date().getTime()+1000*60*60*24):new Date(parseInt(text_field.value));
         }*/
//		cal_obj.parse_date(shown_text_field.value, format);
        cal_obj.show_at_element(shown_text_field, "adj_right-top");

        // user defined onchange handler
        cal_obj.user_onchange_handler = function (cal, object_code) {
            if (object_code == 'day') {
                /*				var time = cal.date.getTime();
                 time -= time % (24*60*60*1000);
                 time += cal.date.getTimezoneOffset()*60*1000;
                 alert(cal.date.toUTCString());
                 cal.date = new Date(time);
                 alert(cal.date.toUTCString());*/
                shown_text_field.value = cal.get_formatted_date(format);
                hidden_text_field.value = cal.date.getTime();
                cal.hide();
                cal_obj = null;
                search();
            }
        };

        // user defined onclose handler (used in pop-up mode - when auto_close is true)
        cal_obj.user_onclose_handler = function (cal) {
            if (window.confirm('<?php echo lang('close_calendar');?>')) {
                cal.hide();
                cal_obj = null;
            }
        };

        // user defined onautoclose handler
        cal_obj.user_onautoclose_handler = function (cal) {
            cal_obj = null;
        };
    }


    // ----- Ende Definition der Funktionen des Rich-Kalender -----
    <?php //pop_locale_dir(); ?>
</script>