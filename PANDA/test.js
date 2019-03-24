a =
{
    "version":"1.0.0",
    //"authority":{
    //    "objectType":"module",BD
    //    "name":"Moodle",
    //    "mbox":"mailto:ilab@tu-ilmenau.de"
    //},
    "actor":{
        "objectType":"Agent",
        "name":"$Vorname $Nachname",
        "mbox":"mailto:$Email"
    },
    "verb":{
        "id":"http://.../interacted",
        "display":{
            "en-US":"interacted",
            "de-DE":"interagierte"
        }
    },
    "object":{
        "objectType":"Activity",
        "id":"http://goldi-labs.net/",
        "definition":{
            "name":{
                "de-DE":"Experiment"
            },
            "description":{
                "de-DE":"Das Experiment besteht aus $Geraet und $Steuerung"
            },
            "type":"http://.../experiment",
                "extensions":{
                "http://../ExperimentID":"ExperimentID"
            }
        }
    },
    "context":{
        "extensions":{
            "http://../ValidierungsfehlerID":"ValidierungsfehlerID"
        }
    },
    "stored":"2015-03-30T11:26:35.017700+00:00",
    "timestamp":"2015-03-30T11:26:35.017700+00:00"
}
