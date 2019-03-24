<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json; charset=utf-8');

if(file_exists("BEASTExamples/".$_REQUEST["file"].".beast")){
    echo file_get_contents("BEASTExamples/".$_REQUEST["file"].".beast");
}else{
    echo json_encode(null);
}