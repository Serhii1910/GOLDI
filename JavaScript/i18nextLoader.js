/**
 * Created by rehu7999 on 16.09.2015.
 */

/** lokal gespeicherte Sprache **/
var currentLocale;

function i18nValidate(){
    $(".tag").each(function(){
        $(this).attr("data-i18n", $(this).attr("data-i18n").toUpperCase());
    });
    $(".tag").i18n();
    if($("title").text().search("GOLDi") == -1)
        $("title").text("GOLDi - "+$("title").text());
    //$(".tag").hide();
}

function i18nInit(){
    if(localStorage.getItem("locale") == null)
        localStorage.setItem("locale","en_US");

    currentLocale = localStorage.getItem("locale");

    Modules = new Array();
    $(".i18next_modules").each(function(){
        Modules.push($(this).val());
    });
    ModuleText = "";
    if(Modules.length>0)
        ModuleText = "&Modules="+Modules.join(",");

    var option = {
        resGetPath: 'index.php?Function=i18nextGetLocales&Locale=__lng__'+ModuleText,
        lng: localStorage.getItem("locale"),
    };

    i18n.init(option).done(function(){
        i18nValidate();
        $(".languageSwitch").removeClass("btn-primary");
        $("#"+localStorage.getItem("locale")).addClass("btn-primary");
    });
}

$(document).ready(function(){
    i18nInit();

    $(".languageSwitch").click(function(){
        newLang = $(this).attr("id");

        localStorage.locale = newLang;

        $(".languageSwitch").removeClass("btn-primary");
        $("#"+newLang).addClass("btn-primary");

        i18n.setLng(newLang).done(function(){
            i18nValidate();
        });
    });

    setInterval(function(){
        if(localStorage.locale != currentLocale){
            newLang = localStorage.locale;
            currentLocale = localStorage.locale;
            i18n.setLng(newLang).done(function(){
                i18nValidate();
            });
        }
    },1000);
})