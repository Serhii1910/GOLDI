<?php
include "../Modules/PHPCrawler/libs/PHPCrawler.class.php";

// It may take a whils to crawl a site ...
set_time_limit(0);



// Extend the class and override the handleDocumentInfo()-method
class PANDACrawler extends PHPCrawler
{
    public $wordCount = array();
    function handleDocumentInfo(PHPCrawlerDocumentInfo $DocInfo)
    {
        // Just detect linebreak for output ("\n" in CLI-mode, otherwise "<br>").
        if (PHP_SAPI == "cli") $lb = "\n";
        else $lb = "<br />";

        if ($DocInfo->received == true)
        {
            $tmp = $DocInfo->content;

            //HTMl-Umlaute in Umlaute umwandeln
            $tmp = str_replace("&szlig;","ß",$tmp);
            $tmp = str_replace("&ouml;","ö",$tmp);
            $tmp = str_replace("&auml;","ä",$tmp);
            $tmp = str_replace("&uuml;","ü",$tmp);
            $tmp = str_replace("&Ouml;","Ö",$tmp);
            $tmp = str_replace("&Auml;","Ä",$tmp);
            $tmp = str_replace("&Uuml;","Ü",$tmp);
            $tmp = str_replace("&nbsp;"," ",$tmp);
            $tmp = str_replace("&amp;"," ",$tmp);
            $tmp = str_replace("&lt;"," ",$tmp);
            $tmp = str_replace("&gt;"," ",$tmp);
            $tmp = str_replace("“"," ",$tmp);
            $tmp = str_replace("„"," ",$tmp);


            //Script- und Stylebreiche entfernen
            $tmp = preg_replace('/<script.*<\/script>/U',' ',$tmp);
            $tmp = preg_replace('/<style.*<\/style>/',' ',$tmp);

               //Alle Tags und deren Inhalte entfernen
            $tmp = preg_replace('/<[^>]*>/',' ',$tmp);

            //Bindestriche entfernen, welche nicht Wörter direkt verbinden
            $tmp = preg_replace('/\s-\s/',' ',$tmp);

            //Alle Zeichen außer Buchstaben und Zahlen löschen
            $tmp = preg_replace('/[^A-Za-z0-9äöüßÄÖÜß\- ]/',' ',$tmp);

            //Vordere und hintere Leerzeichen löschen
            $tmp = trim($tmp);

            //Mehrere Leerzeichen durch eins ersetzen
            $tmp = preg_replace('/\s\s+/'," ",$tmp);

            $words = explode(" ",$tmp);
            foreach($words as $word)
                if(isset($this->wordCount[$word])){
                    $this->wordCount[$word]++;
                }else{
                    $this->wordCount[$word] = 1;
                }

            echo "Page requested: ".$DocInfo->url." (".$DocInfo->http_status_code.")".$lb;
            echo "Referer-page: ".$DocInfo->referer_url.$lb;
            echo "Content received: ".$DocInfo->bytes_received." bytes".$lb;
            echo $lb;
        }

        flush();
    }
}

// Now, create a instance of your class, define the behaviour
// of the crawler (see class-reference for more options and details)
// and start the crawling-process.

$crawler = new PANDACrawler();

// URL to crawl
$crawler->setURL("goldi-labs.net");
$crawler->setURL("ebay.de");

// Only receive content of files with content-type "text/html"
$crawler->addContentTypeReceiveRule("#text/html#");

// Ignore links to pictures, dont even request pictures
$crawler->addURLFilterRule("#\.(jpg|jpeg|gif|png)$# i");

// Store and send cookie-data like a browser does
$crawler->enableCookieHandling(true);

// Set the traffic-limit to 1 MB (in bytes,
// for testing we dont want to "suck" the whole site)
$crawler->setTrafficLimit(1000 * 1024 * 1);

// Thats enough, now here we go
$crawler->go();

// At the end, after the process is finished, we print a short
// report (see method getProcessReport() for more information)
$report = $crawler->getProcessReport();

asort($crawler->wordCount);
print_r($crawler->wordCount);

exit;

if (PHP_SAPI == "cli") $lb = "\n";
else $lb = "<br />";

echo "Summary:".$lb;
echo "Links followed: ".$report->links_followed.$lb;
echo "Documents received: ".$report->files_received.$lb;
echo "Bytes received: ".$report->bytes_received." bytes".$lb;
echo "Process runtime: ".$report->process_runtime." sec".$lb;