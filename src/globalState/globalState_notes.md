# Data in global State

## UserData (global)

```json
{
	"absent": true,
	"inTeamAgency": true,
	"userId": "ajsd89-sdf9-sadk-as8j-asdf8jo",
	"userName": "max.muster",
	"firstName": "Max",
	"lastName": "Mustermann",
	"email": "maxmuster@mann.com",
	"absenceMessage": "Bin mal weg...",
	"agencies": [
		{
			"id": 153918,
			"name": "Alkohol-Beratung",
			"postcode": 53113,
			"description": "Our agency provides help for the following topics: Lorem ipsum..",
			"teamAgency": false
		}
	],
	"grantedAuthorities": ["string"]
}
```

## AuthData

```json
{
	"rocketchatToken": "string",
	"rocketchatUserId": "string",
	"keycloakToken": "string",
	"keycloakRefreshToken": "string"
}
```

## SessionsData

Example json object for userRole consultant

```json
{
	"enquiries": [
		{
			"session": {
				"id": 153918,
				"teamSession": true,
				"agencyId": 100,
				"consultingType": 0,
				"status": 1,
				"postcode": 88046,
				"groupId": "xGklslk2JJKK",
				"askerRcId": "8ertjlasdKJA",
				"messageDate": 1539184948,
				"messagesRead": false
			},
			"user": {
				"username": "Username",
				"gender": 0,
				"age": 3,
				"addictiveDrugs": "1,2,4",
				"relation": 1
			}
		}
	],
	"mySessions": [
		// ...
	],
	"teamSessions": [
		// ...
	]
}
```

Example json object for userRole user

```json
{
	"enquires": null,
	"mySessions": [
		{
			"session": {
				"id": 1620,
				"agencyId": 101,
				"consultingType": 1,
				"status": 2,
				"postcode": "25252",
				"groupId": "upncZaeACtWErNACh",
				"askerRcId": "qQ6EvvxoXS2ERMz77",
				"messageDate": 1558593730,
				"messagesRead": true,
				"teamSession": true
			},
			"agency": {
				"id": 101,
				"name": "U25 Beratungsstelle",
				"postcode": "25252",
				"description": "U25 DEV Test-Beratungsstelle",
				"teamAgency": true
			},
			"consultant": {
				"username": "u25main",
				"absenceMessage": null,
				"absent": false
			}
		}
	],
	"teamSessions": null
}
```

##ActiveSessionId

´´´
id: number
´´´

//TODO: helper function to get session object with id
//TODO: global state helpers (sessionId, isRole, getRCid?, ...)
