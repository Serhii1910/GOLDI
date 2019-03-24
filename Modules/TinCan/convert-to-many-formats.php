<?php
$xmlstring = <<<XML
<?xml version="1.0" encoding="ISO-8859-1"?>
<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body>Don't forget me this weekend!</body>
</note>
XML;

$xml = new SimpleXMLElement($xmlstring);
echo $xml->body[0];
print_r('</br> </br>'. '------wassim -----'.'</br>'); 

 // student_4_teacher_rdf_descripers
$filename='1day-input.xml';
$inputfile= 'clf-workflow-formal/sites/default/files/Multimedia-Course/'.$filename;  
$simpleXMLOb = simplexml_load_file($inputfile); 
$titles_array_of_simpleXMLObs=$simpleXMLOb->xpath("/searchresult/document/title");
$urls_array_of_simpleXMLObs=$simpleXMLOb->xpath("/searchresult/document/url");
$snippets_array_of_simpleXMLObs=$simpleXMLOb->xpath("/searchresult/document/snippet"); 

//bring back the xml files 

print_r('</br> </br>'. '------------'.'</br>');
$xml=$simpleXMLOb->asXML();  
print_r('</br> </br>'. '------------'.'</br>');
print_r($xml);

//generating the 1 day file as 1day.xml  
fopen("1day.xml","w"); 
$file = '1day.xml';
$current = file_get_contents($file); // it will be empty because we open the file for overwriting 
$current .= "<!--  ---edit by wassim---  -->".PHP_EOL;
$current .=$xml;
$current .=PHP_EOL."<!-- ----end of the file----  -->".PHP_EOL; 
file_put_contents($file, $current);


// generating the 1 day as 1day.json file 
$day_json=json_encode((array)$simpleXMLOb);
fopen("1day.json", "w");
$file="1day.json";
$current = file_get_contents($file);
$current .= "<!--  ---edit by wassim---  -->".PHP_EOL;
$current .=$day_json;
$current .=PHP_EOL."<!-- ----end of the file----  -->".PHP_EOL; 
file_put_contents($file, $current);

// generating the titles of 1 day as 1day_titles.json file 
$tit_json=json_encode((array)$titles_array_of_simpleXMLObs);
fopen("1day_titles.json", "w");
$file="1day_titles.json";
$current = file_get_contents($file);
$current .= "<!--  ---edit by wassim---  -->".PHP_EOL;
$current .=$tit_json;
$current .=PHP_EOL."<!-- ----end of the file----  -->".PHP_EOL; 
file_put_contents($file, $current);

// generating the urls of 1 day as 1day_urls.json  file 
$urls_json=json_encode((array)$urls_array_of_simpleXMLObs);
fopen("1day_urls.json", "w");
$file="1day_urls.json";
$current = file_get_contents($file);
$current .= "<!--  ---edit by wassim---  -->".PHP_EOL;
$current .=$urls_json;
$current .=PHP_EOL."<!-- ----end of the file----  -->".PHP_EOL; 
file_put_contents($file, $current);

// generating the snippets of 1 day as 1day_snippets.json  file 
$snippet_json=json_encode((array)$snippets_array_of_simpleXMLObs);
fopen("1day_snippet.json", "w");
$file="1day_snippet.json";
$current = file_get_contents($file);
$current .= "<!--  ---edit by wassim---  -->".PHP_EOL;
$current .=$snippet_json;
$current .=PHP_EOL."<!-- ----end of the file----  -->".PHP_EOL; 
file_put_contents($file, $current); 

                      // out put as php array 
//$day_json=json_encode((array)$simpleXMLOb);                   
print_r('</br> </br>'. '-----$day_json as php object-------'.'</br>');
print_r(json_decode($day_json,1));
                      
print_r('</br> </br>'. '-----$titles_json as php object-------'.'</br>');
print_r(json_decode(json_encode((array)$titles_array_of_simpleXMLObs), 1));
// $simpleXMLOb 
print_r('</br> </br>'. '-----$urls_json as php object-------'.'</br>');
print_r(json_decode(json_encode((array)$urls_array_of_simpleXMLObs),1));

// $snippet_json=json_encode((array)$snippets_array_of_simpleXMLObs); 
print_r('</br> </br>'. '-----$snippet_json as php object-------'.'</br>');
print_r(json_decode($snippet_json,1));

  // print_r($xml->asXML());
  // definining XML file

?>