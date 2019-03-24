a =
{
	"version":"1.0.1",
	//"authority":{
	//	"objectType":"Agent",
	//	"name":"Moodle",
	//	"mbox":"mailto:ilab@tu-ilmenau.de"
	//},
	"actor":{
		"objectType":"Agent",
		"name":"$Vorname $Nachname",
		"mbox":"mailto:$EMail"
	},
	"verb":{
		"id":"http://adlnet.gov/expapi/verbs/launched",
		"display":{
			"en-US":"launched"
		}
	},
	"object":{
		"objectType":"Activity",
		"id":"http://141.24.211.89/moodleIKS/",
		"definition":{
			"type":"http://adlnet.gov/expapi/activities/module",
			"name":{
				"en-US":"moodle chapter"
			},
			"description":{
				"en-US":"User started to read a chapter in MoodleIKS."
			},
			"extensions":{
				"http://goldi-labs.net/statements/chapterstatement":{
					"bookID":"$bookID",
					"bookTitle":"$bookTitle",
					"chapterID":"$chapterID",
					"chapterTitle":"$chapterTitle"
				}
			}
		}
	},
	"stored":"$TimeSendedToLRS",
	"timestamp":"$TimeAktivityDone"
}
;