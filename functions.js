function getParam(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }       return(false);
}

/*var t1;
function send(vars, reload) {
    var xmlHttpObject = false;
    if (typeof XMLHttpRequest != 'undefined') {
        xmlHttpObject = new XMLHttpRequest();
    }
    if (!xmlHttpObject) {
        try {
            xmlHttpObject = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xmlHttpObject = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }

    xmlHttpObject.open("POST", window.location.href, true);
    xmlHttpObject.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


    xmlHttpObject.onreadystatechange = function setstate() {
        if (xmlHttpObject.readyState == 4 && xmlHttpObject.status == 200 && reload) {
            location.reload(true);
        }
    };

    t1 = new Date();
    xmlHttpObject.send('ajax=true&' + vars);
}

function getContent(vars) {
    var xmlHttpObject = false;
    if (typeof XMLHttpRequest != 'undefined') {
        xmlHttpObject = new XMLHttpRequest();
    }
    if (!xmlHttpObject) {
        try {
            xmlHttpObject = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xmlHttpObject = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }

    xmlHttpObject.open("POST", window.location.href, false);
    xmlHttpObject.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttpObject.send("ajax=true&" + vars);

    return xmlHttpObject.responseText;
}

function minute_to_hours(t) {
    if (t >= 60) {
        var m = t % 60;
        var h = (t - m) / 60;
        return h + ' h ' + m + ' min';
    } else {
        return t + ' min';
    }
}
*/
function SetCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function GetCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function SetTimestampLastAction() {
    SetCookie("TimeStampLastAction",(new Date()).getTime(),1);
}

function GetTimestampLastAction() {
    return GetCookie("TimeStampLastAction");
}

function GetNow(){
    return (new Date()).getTime();
}