Locations = new Object();
WebSocketClient = new Object();

$(document).ready(function(){
    $(".sidebar").css({"color":"black"});

    $("button[data-i18n='SiteStartLocations']").css({"color":"white"});
    $("button[data-i18n='SiteViewMyBookings']").css({"color":"white"});

    $(".URL").each(function(){
        if(
            $(this).attr("url") != "" &&
            (
                window.location.href.startsWith("http://") ||
                $(this).attr("url").startsWith("wss:")
            )
        ){
            URL = $(this).attr("url");
            Location = $(this).attr("location");
            Locations[URL] = Location;
            console.log("Try to open WebSocket to "+Location+" : "+URL);
            WebSocketClient[Location] = new WebSocket(URL);
            WebSocketClient[Location].onopen = function(ev){
                Location = Locations[this.url];
                console.log("WebSocket successfully opened to "+Location+" : "+this.url);

                Banner = $("#"+Location);
                if(Banner.length != 0){
                    Banner[0].src = "Images/Locations/Banner/"+Location+".png";
                    Banner[0].title = Location;
                    Link = $("#"+Location+"_link");
                    Link.attr("href",Link.attr("link"));
                    WebSocketClient[Location].close();
                }

                TMP = "button[data-i18n='SITESTART"+Location.toUpperCase()+"']";
                Button = $(TMP);
                if(Button.length == 0){
                    TMP = "button[data-i18n='SiteStart"+Location+"']";
                    Button = $(TMP);
                }
                Button.css({/*"border":"2px solid black", */"color":"white"});

                WebSocketClient[Location].close();
            };
            WebSocketClient[Location].onclose = function(ev){
                Location = Locations[this.url];
                console.log("WebSocket closed to "+Location+" : "+this.url);
            };
        };
    });
});