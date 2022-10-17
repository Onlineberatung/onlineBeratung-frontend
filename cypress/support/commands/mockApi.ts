import {
	generateAskerSession,
	generateConsultantSession,
	generateMessagesReply,
	sessionsReply
} from '../sessions';
import { config } from '../../../src/resources/scripts/config';
import {
	getAskerSessions,
	setAskerSessions,
	updateAskerSession
} from './askerSessions';
import {
	getConsultantSessions,
	setConsultantSessions,
	updateConsultantSession
} from './consultantSessions';
import { LoginArgs, USER_ASKER } from './login';
import { deepMerge } from '../helpers';
import { decodeUsername } from '../../../src/utils/encryptionHelpers';
import { getMessages, setMessages } from './messages';
import apiAppointments from './api/appointments';
import apiVideocalls from './api/videocalls';
import { SETTING_E2E_ENABLE } from '../../../src/api/apiRocketChatSettingsPublic';

let overrides = {};

const defaultReturns = {
	attachmentUpload: {
		statusCode: 201
	},
	userData: {},
	consultingTypes: [],
	releases: {
		statusCode: 404
	},
	releases_markup: {
		statusCode: 404
	},
	sessionRooms: {
		statusCode: 200,
		body: {
			sessions: []
		}
	},
	agencyConsultants: []
};

Cypress.Commands.add('willReturn', (name: string, data: any) => {
	overrides[name] = data;
});

let username = null;

Cypress.Commands.add('mockApi', () => {
	// Empty overrides
	overrides = {};

	setAskerSessions([]);
	cy.askerSession(generateAskerSession());

	setConsultantSessions([]);
	cy.consultantSession(generateConsultantSession());
	cy.consultantSession(generateConsultantSession());
	cy.consultantSession(generateConsultantSession());

	setMessages([]);
	cy.addMessage({}, 0);
	cy.addMessage({}, 1);
	cy.addMessage({}, 2);

	// ConsultingTypes
	cy.fixture('service.consultingtypes.emigration.json').then(
		(consultingType) => {
			defaultReturns['consultingTypes'].push(consultingType);
		}
	);
	cy.fixture('service.consultingtypes.addiction.json').then(
		(consultingType) => {
			defaultReturns['consultingTypes'].push(consultingType);
		}
	);
	cy.fixture('service.consultingtypes.pregnancy.json').then(
		(consultingType) => {
			defaultReturns['consultingTypes'].push(consultingType);
		}
	);
	cy.fixture('service.consultingtypes.u25.json').then((consultingType) => {
		defaultReturns['consultingTypes'].push(consultingType);
	});

	cy.fixture('api.v1.login').then((data) => {
		cy.intercept('POST', config.endpoints.rc.accessToken, (req) => {
			username = decodeUsername(req.body.username);
			req.reply(
				deepMerge(data, {
					data: { userId: decodeUsername(req.body.username) }
				})
			);
		});
	});

	cy.fixture('service.users.sessions.room.json').then((session) => {
		defaultReturns['sessionRooms'].body.sessions.push(session);
	});

	cy.fixture('service.agency.consultants.json').then((agencyConsultants) => {
		defaultReturns['agencyConsultants'].push(agencyConsultants);
	});

	cy.fixture('auth.token').then((auth) => {
		defaultReturns['auth'] = auth;
	});

	cy.fixture('service.users.data.consultants').then((usersData) => {
		usersData.forEach((userData) => {
			defaultReturns['userData'][userData.userId] = userData;
		});
	});
	cy.fixture('service.users.data.askers').then((userData) => {
		defaultReturns['userData'][USER_ASKER] = userData;
	});

	cy.intercept('GET', `${config.endpoints.consultantSessions}*`, (req) => {
		if (overrides['consultantSessions']) {
			return req.reply(overrides['consultantSessions']);
		}

		const url = new URL(req.url);

		const offset = parseInt(url.searchParams.get('offset')) || 0;
		const count = parseInt(url.searchParams.get('count')) || 15;

		req.reply(
			sessionsReply({
				sessions: getConsultantSessions(),
				offset,
				count
			})
		);
	}).as('consultantSessions');

	cy.intercept('GET', config.endpoints.askerSessions, (req) => {
		if (overrides['askerSessions']) {
			return req.reply(overrides['askerSessions']);
		}

		req.reply({
			sessions: getAskerSessions()
		});
	}).as('askerSessions');

	cy.intercept('GET', config.endpoints.messages, (req) => {
		if (overrides['messages']) {
			return req.reply(overrides['messages']);
		}

		const url = new URL(req.url);

		req.reply(
			generateMessagesReply(
				getMessages().filter(
					(message) =>
						message.rid === url.searchParams.get('rcGroupId')
				)
			)
		);
	}).as('messages');

	cy.intercept('POST', config.endpoints.rc.subscriptions.read, (req) => {
		getAskerSessions().forEach((session, index) => {
			if (session.session.groupId === req.body.rid) {
				updateAskerSession({ session: { messagesRead: true } }, index);
			}
		});

		getConsultantSessions().forEach((session, index) => {
			if (session.session.groupId === req.body.rid) {
				updateConsultantSession(
					{ session: { messagesRead: true } },
					index
				);
			}
		});

		req.reply('{}');
	}).as('sessionRead');

	cy.intercept('GET', `${config.endpoints.consultantEnquiriesBase}*`, {}).as(
		'consultantEnquiriesBase'
	);

	cy.intercept('GET', `${config.endpoints.rc.settings.public}*`, {
		settings: [{ _id: SETTING_E2E_ENABLE, value: true, enterprise: false }],
		count: 1,
		offset: 0,
		total: 1,
		success: true
	});

	cy.intercept('POST', config.endpoints.keycloakLogout, {}).as('authLogout');

	cy.intercept('POST', config.endpoints.rc.logout, {}).as('apiLogout');

	cy.intercept(
		`${config.endpoints.liveservice}/**/*`,
		JSON.stringify({
			entropy: '-1197552011',
			origins: ['*:*'],
			cookie_needed: false,
			websocket: true
		})
	);

	cy.intercept('GET', config.endpoints.draftMessages, {}).as('draftMessages');

	cy.intercept('POST', config.endpoints.startVideoCall, {
		fixture: 'service.videocalls.new'
	}).as('startVideoCall');

	cy.intercept('POST', config.endpoints.rejectVideoCall, {}).as(
		'rejectVideoCall'
	);

	cy.intercept('POST', config.endpoints.attachmentUpload, (req) =>
		req.reply({
			...defaultReturns['attachmentUpload'],
			...(overrides['attachmentUpload'] || {})
		})
	).as('attachmentUpload');

	cy.intercept('POST', config.endpoints.keycloakAccessToken, (req) => {
		req.reply({
			...defaultReturns['auth'],
			...(overrides['auth'] || {})
		});
	}).as('authToken');

	cy.intercept('GET', config.endpoints.userData, (req) => {
		req.reply({
			...defaultReturns['userData'][username],
			...(overrides['userData'] || {})
		});
	}).as('usersData');

	cy.intercept('GET', config.endpoints.agencyConsultants, (req) => {
		req.reply(
			...defaultReturns['agencyConsultants'],
			...(overrides['agencyConsultants'] || [])
		);
	}).as('agencyConsultants');

	cy.intercept(
		`${config.endpoints.consultingTypeServiceBase}/byslug/*/full`,
		(req) => {
			const slug = new URL(req.url).pathname.split('/')[4];

			req.reply({
				...(defaultReturns['consultingTypes'].find(
					(consultingType) => consultingType.slug === slug
				) || {}),
				...(overrides['consultingType'] || {})
			});
		}
	).as('consultingTypeServiceBySlugFull');

	cy.intercept(
		`${config.endpoints.consultingTypeServiceBase}/*/full`,
		(req) => {
			const id = parseInt(new URL(req.url).pathname.split('/')[3]);

			req.reply({
				...(defaultReturns['consultingTypes'].find(
					(consultingType) => consultingType.id === id
				) || {}),
				...(overrides['consultingType'] || {})
			});
		}
	).as('consultingTypeServiceBaseFull');

	cy.intercept(
		`${config.endpoints.consultingTypeServiceBase}/basic`,
		(req) => {
			req.reply([
				...defaultReturns['consultingTypes'],
				...(overrides['consultingTypes'] || [])
			]);
		}
	).as('consultingTypeServiceBaseBasic');

	cy.intercept('GET', '/releases/*.json', (req) => {
		req.reply({
			...defaultReturns['releases'],
			...(overrides['releases'] || {})
		});
	}).as('releases');

	cy.intercept('GET', '/releases/*.md', (req) => {
		req.reply({
			...defaultReturns['releases_markup'],
			...(overrides['releases_markup'] || {})
		});
	}).as('releases_markup');

	apiAppointments(cy);
	apiVideocalls(cy);

	cy.intercept('GET', '/api/v1/e2e.fetchMyKeys', (req) => {
		// keys from dev user pregnancy
		req.reply({
			public_key:
				'{"alg":"RSA-OAEP-256","e":"AQAB","ext":true,"key_ops":["encrypt"],"kty":"RSA","n":"o1hPIUjtf_kN1vHPfjq-LxXOkqycRbJp9UT8WNjA9c_z3hswAje3NC3E0QJG1eIe_yOwAYhjPtvEZ5aUfYQhPx1dlBL-vnaN4L_TsimgWBIpTpG4rQTY0X8eAF5nVBCBPKne70X4MH32Ol1RLP6Y7d7k9BiDYaJj0XYF_3HZKOfcAUGb34tWJy6dg3kg7pOEjKoHLHHbMn11VHwenMHnhh9JYltkixTy1BO0rRlORkXo680TQIPxEm9y8rsZWEccATu0ZKSlDSr4dYE09sCG_xUH5AGNGECbpnC_Ze7zUk1RRGFAWF6nmLaAPO7hMlVmQ802eF7HTtDdOexqwaIY7Q"}',
			private_key:
				'{"0":2,"1":107,"2":187,"3":21,"4":27,"5":7,"6":21,"7":97,"8":208,"9":87,"10":240,"11":132,"12":168,"13":122,"14":207,"15":152,"16":128,"17":197,"18":38,"19":181,"20":168,"21":237,"22":223,"23":203,"24":39,"25":255,"26":193,"27":80,"28":34,"29":201,"30":111,"31":236,"32":182,"33":89,"34":214,"35":178,"36":119,"37":187,"38":222,"39":165,"40":194,"41":155,"42":137,"43":214,"44":69,"45":145,"46":32,"47":9,"48":159,"49":83,"50":192,"51":193,"52":191,"53":33,"54":83,"55":18,"56":81,"57":243,"58":70,"59":223,"60":101,"61":8,"62":184,"63":180,"64":187,"65":33,"66":72,"67":220,"68":99,"69":48,"70":255,"71":107,"72":12,"73":174,"74":41,"75":27,"76":77,"77":155,"78":55,"79":110,"80":227,"81":76,"82":43,"83":255,"84":194,"85":216,"86":73,"87":172,"88":4,"89":217,"90":24,"91":183,"92":61,"93":94,"94":235,"95":177,"96":52,"97":103,"98":171,"99":156,"100":177,"101":146,"102":218,"103":204,"104":198,"105":79,"106":170,"107":152,"108":124,"109":16,"110":11,"111":224,"112":237,"113":81,"114":141,"115":53,"116":247,"117":113,"118":98,"119":113,"120":56,"121":37,"122":221,"123":171,"124":200,"125":20,"126":253,"127":66,"128":249,"129":244,"130":194,"131":100,"132":101,"133":141,"134":225,"135":32,"136":172,"137":60,"138":97,"139":74,"140":30,"141":153,"142":237,"143":25,"144":190,"145":84,"146":175,"147":245,"148":83,"149":102,"150":126,"151":92,"152":41,"153":162,"154":148,"155":147,"156":151,"157":253,"158":166,"159":227,"160":209,"161":161,"162":54,"163":189,"164":204,"165":57,"166":98,"167":248,"168":2,"169":162,"170":77,"171":61,"172":161,"173":73,"174":190,"175":144,"176":10,"177":57,"178":73,"179":120,"180":113,"181":185,"182":13,"183":101,"184":201,"185":128,"186":222,"187":82,"188":205,"189":52,"190":129,"191":97,"192":144,"193":128,"194":238,"195":146,"196":84,"197":13,"198":86,"199":1,"200":73,"201":25,"202":67,"203":223,"204":40,"205":50,"206":92,"207":250,"208":190,"209":94,"210":17,"211":100,"212":75,"213":100,"214":0,"215":106,"216":107,"217":82,"218":168,"219":185,"220":101,"221":65,"222":167,"223":1,"224":94,"225":42,"226":147,"227":47,"228":104,"229":2,"230":68,"231":171,"232":129,"233":32,"234":149,"235":154,"236":216,"237":179,"238":65,"239":242,"240":72,"241":30,"242":90,"243":147,"244":186,"245":148,"246":96,"247":129,"248":189,"249":56,"250":179,"251":0,"252":0,"253":63,"254":147,"255":28,"256":136,"257":248,"258":79,"259":33,"260":235,"261":156,"262":13,"263":236,"264":77,"265":237,"266":216,"267":164,"268":191,"269":164,"270":218,"271":104,"272":178,"273":55,"274":10,"275":65,"276":118,"277":164,"278":183,"279":130,"280":39,"281":187,"282":21,"283":194,"284":144,"285":113,"286":208,"287":181,"288":27,"289":112,"290":163,"291":146,"292":173,"293":93,"294":218,"295":161,"296":246,"297":210,"298":36,"299":140,"300":201,"301":1,"302":175,"303":160,"304":17,"305":254,"306":17,"307":82,"308":107,"309":31,"310":104,"311":161,"312":33,"313":67,"314":81,"315":162,"316":118,"317":196,"318":32,"319":255,"320":63,"321":54,"322":69,"323":98,"324":4,"325":104,"326":123,"327":68,"328":96,"329":28,"330":197,"331":47,"332":139,"333":141,"334":217,"335":194,"336":156,"337":156,"338":23,"339":90,"340":44,"341":205,"342":131,"343":95,"344":227,"345":26,"346":139,"347":161,"348":200,"349":91,"350":201,"351":36,"352":145,"353":62,"354":163,"355":229,"356":211,"357":164,"358":65,"359":131,"360":170,"361":146,"362":109,"363":177,"364":43,"365":19,"366":185,"367":223,"368":137,"369":229,"370":82,"371":43,"372":100,"373":69,"374":69,"375":114,"376":252,"377":98,"378":218,"379":66,"380":36,"381":178,"382":252,"383":171,"384":229,"385":187,"386":209,"387":27,"388":32,"389":172,"390":29,"391":49,"392":26,"393":4,"394":212,"395":172,"396":80,"397":201,"398":202,"399":108,"400":4,"401":124,"402":190,"403":189,"404":218,"405":223,"406":22,"407":87,"408":4,"409":238,"410":243,"411":22,"412":178,"413":59,"414":168,"415":133,"416":13,"417":72,"418":216,"419":124,"420":202,"421":70,"422":153,"423":169,"424":17,"425":29,"426":72,"427":19,"428":73,"429":225,"430":175,"431":87,"432":178,"433":115,"434":105,"435":56,"436":158,"437":128,"438":23,"439":86,"440":239,"441":102,"442":211,"443":110,"444":197,"445":99,"446":193,"447":239,"448":117,"449":236,"450":211,"451":31,"452":222,"453":91,"454":140,"455":154,"456":24,"457":137,"458":216,"459":204,"460":203,"461":164,"462":60,"463":53,"464":118,"465":222,"466":173,"467":64,"468":187,"469":105,"470":10,"471":85,"472":161,"473":197,"474":244,"475":18,"476":251,"477":212,"478":187,"479":8,"480":217,"481":194,"482":24,"483":174,"484":224,"485":85,"486":218,"487":218,"488":9,"489":54,"490":204,"491":117,"492":150,"493":60,"494":172,"495":57,"496":153,"497":184,"498":215,"499":86,"500":53,"501":88,"502":70,"503":148,"504":25,"505":20,"506":98,"507":22,"508":234,"509":201,"510":118,"511":34,"512":55,"513":129,"514":97,"515":35,"516":82,"517":118,"518":143,"519":230,"520":140,"521":246,"522":86,"523":189,"524":148,"525":233,"526":10,"527":56,"528":224,"529":187,"530":37,"531":140,"532":97,"533":108,"534":6,"535":47,"536":55,"537":158,"538":230,"539":141,"540":83,"541":211,"542":221,"543":200,"544":217,"545":238,"546":222,"547":135,"548":153,"549":224,"550":219,"551":173,"552":82,"553":23,"554":92,"555":148,"556":107,"557":51,"558":1,"559":23,"560":1,"561":10,"562":12,"563":224,"564":140,"565":1,"566":117,"567":68,"568":168,"569":196,"570":153,"571":82,"572":225,"573":143,"574":188,"575":136,"576":56,"577":110,"578":122,"579":246,"580":160,"581":180,"582":118,"583":131,"584":38,"585":2,"586":188,"587":250,"588":207,"589":190,"590":48,"591":192,"592":193,"593":47,"594":236,"595":255,"596":254,"597":98,"598":60,"599":218,"600":232,"601":38,"602":6,"603":163,"604":203,"605":135,"606":95,"607":130,"608":130,"609":2,"610":189,"611":100,"612":173,"613":60,"614":73,"615":172,"616":3,"617":221,"618":23,"619":22,"620":133,"621":170,"622":240,"623":127,"624":161,"625":82,"626":124,"627":54,"628":77,"629":178,"630":225,"631":77,"632":147,"633":28,"634":181,"635":57,"636":227,"637":231,"638":247,"639":231,"640":170,"641":250,"642":218,"643":43,"644":243,"645":160,"646":103,"647":55,"648":75,"649":131,"650":251,"651":9,"652":48,"653":8,"654":65,"655":152,"656":69,"657":29,"658":251,"659":13,"660":95,"661":123,"662":42,"663":75,"664":227,"665":152,"666":196,"667":245,"668":236,"669":172,"670":80,"671":220,"672":80,"673":205,"674":32,"675":135,"676":60,"677":253,"678":194,"679":6,"680":6,"681":28,"682":239,"683":160,"684":227,"685":229,"686":16,"687":2,"688":42,"689":129,"690":130,"691":232,"692":145,"693":183,"694":4,"695":129,"696":64,"697":123,"698":2,"699":71,"700":199,"701":13,"702":174,"703":228,"704":135,"705":188,"706":250,"707":201,"708":137,"709":247,"710":220,"711":244,"712":199,"713":247,"714":176,"715":124,"716":53,"717":69,"718":58,"719":85,"720":172,"721":182,"722":228,"723":57,"724":196,"725":35,"726":177,"727":104,"728":199,"729":58,"730":193,"731":155,"732":88,"733":203,"734":228,"735":12,"736":14,"737":85,"738":115,"739":234,"740":35,"741":114,"742":181,"743":247,"744":119,"745":226,"746":5,"747":250,"748":195,"749":201,"750":211,"751":100,"752":89,"753":180,"754":26,"755":112,"756":234,"757":125,"758":208,"759":29,"760":106,"761":244,"762":127,"763":13,"764":38,"765":250,"766":231,"767":237,"768":86,"769":168,"770":126,"771":69,"772":28,"773":229,"774":228,"775":93,"776":153,"777":166,"778":177,"779":171,"780":108,"781":157,"782":62,"783":145,"784":199,"785":10,"786":146,"787":42,"788":177,"789":33,"790":116,"791":96,"792":200,"793":157,"794":121,"795":64,"796":154,"797":12,"798":63,"799":22,"800":93,"801":232,"802":181,"803":62,"804":186,"805":5,"806":66,"807":95,"808":6,"809":195,"810":122,"811":151,"812":116,"813":51,"814":11,"815":248,"816":37,"817":94,"818":16,"819":34,"820":174,"821":218,"822":162,"823":204,"824":167,"825":228,"826":232,"827":108,"828":154,"829":225,"830":61,"831":106,"832":134,"833":205,"834":209,"835":9,"836":85,"837":64,"838":186,"839":23,"840":154,"841":135,"842":150,"843":101,"844":218,"845":132,"846":135,"847":174,"848":102,"849":105,"850":135,"851":184,"852":254,"853":250,"854":185,"855":29,"856":204,"857":77,"858":227,"859":34,"860":38,"861":253,"862":50,"863":26,"864":217,"865":176,"866":172,"867":88,"868":47,"869":146,"870":43,"871":204,"872":92,"873":154,"874":71,"875":63,"876":192,"877":47,"878":156,"879":116,"880":158,"881":126,"882":130,"883":123,"884":133,"885":101,"886":79,"887":76,"888":224,"889":134,"890":202,"891":121,"892":94,"893":164,"894":210,"895":130,"896":21,"897":129,"898":69,"899":135,"900":74,"901":174,"902":180,"903":126,"904":10,"905":187,"906":231,"907":113,"908":64,"909":222,"910":16,"911":40,"912":23,"913":133,"914":219,"915":2,"916":170,"917":54,"918":155,"919":49,"920":165,"921":95,"922":148,"923":31,"924":151,"925":12,"926":141,"927":175,"928":57,"929":232,"930":186,"931":3,"932":48,"933":61,"934":38,"935":8,"936":238,"937":203,"938":230,"939":62,"940":155,"941":43,"942":150,"943":207,"944":195,"945":221,"946":94,"947":17,"948":0,"949":250,"950":176,"951":240,"952":50,"953":50,"954":176,"955":89,"956":183,"957":173,"958":253,"959":15,"960":82,"961":9,"962":162,"963":198,"964":30,"965":18,"966":178,"967":14,"968":65,"969":182,"970":235,"971":110,"972":250,"973":152,"974":145,"975":150,"976":237,"977":77,"978":144,"979":167,"980":116,"981":114,"982":180,"983":44,"984":38,"985":226,"986":191,"987":39,"988":175,"989":145,"990":198,"991":130,"992":185,"993":118,"994":95,"995":222,"996":37,"997":44,"998":138,"999":101,"1000":211,"1001":31,"1002":155,"1003":214,"1004":143,"1005":225,"1006":96,"1007":69,"1008":79,"1009":180,"1010":171,"1011":124,"1012":40,"1013":253,"1014":162,"1015":134,"1016":118,"1017":40,"1018":216,"1019":2,"1020":164,"1021":165,"1022":94,"1023":34,"1024":122,"1025":86,"1026":16,"1027":209,"1028":213,"1029":84,"1030":91,"1031":184,"1032":120,"1033":111,"1034":200,"1035":162,"1036":239,"1037":214,"1038":151,"1039":226,"1040":117,"1041":137,"1042":177,"1043":182,"1044":112,"1045":192,"1046":46,"1047":213,"1048":216,"1049":117,"1050":64,"1051":149,"1052":95,"1053":237,"1054":217,"1055":77,"1056":111,"1057":69,"1058":109,"1059":118,"1060":255,"1061":64,"1062":222,"1063":134,"1064":124,"1065":34,"1066":100,"1067":191,"1068":92,"1069":197,"1070":182,"1071":59,"1072":20,"1073":218,"1074":168,"1075":27,"1076":193,"1077":193,"1078":151,"1079":4,"1080":26,"1081":164,"1082":48,"1083":83,"1084":45,"1085":95,"1086":218,"1087":134,"1088":65,"1089":107,"1090":207,"1091":118,"1092":5,"1093":175,"1094":76,"1095":47,"1096":70,"1097":179,"1098":219,"1099":230,"1100":130,"1101":30,"1102":225,"1103":3,"1104":142,"1105":120,"1106":141,"1107":89,"1108":37,"1109":228,"1110":95,"1111":167,"1112":153,"1113":47,"1114":169,"1115":36,"1116":235,"1117":41,"1118":213,"1119":163,"1120":19,"1121":14,"1122":67,"1123":19,"1124":190,"1125":14,"1126":89,"1127":126,"1128":22,"1129":60,"1130":185,"1131":64,"1132":211,"1133":138,"1134":149,"1135":242,"1136":229,"1137":76,"1138":36,"1139":29,"1140":163,"1141":209,"1142":100,"1143":189,"1144":159,"1145":43,"1146":157,"1147":167,"1148":203,"1149":200,"1150":201,"1151":71,"1152":37,"1153":249,"1154":73,"1155":10,"1156":201,"1157":87,"1158":72,"1159":0,"1160":145,"1161":139,"1162":92,"1163":246,"1164":224,"1165":125,"1166":125,"1167":186,"1168":71,"1169":236,"1170":246,"1171":68,"1172":172,"1173":61,"1174":159,"1175":106,"1176":105,"1177":108,"1178":186,"1179":53,"1180":220,"1181":73,"1182":76,"1183":9,"1184":149,"1185":244,"1186":247,"1187":15,"1188":43,"1189":27,"1190":238,"1191":190,"1192":203,"1193":199,"1194":203,"1195":204,"1196":94,"1197":212,"1198":114,"1199":243,"1200":179,"1201":71,"1202":205,"1203":125,"1204":194,"1205":207,"1206":161,"1207":199,"1208":157,"1209":109,"1210":197,"1211":33,"1212":164,"1213":21,"1214":69,"1215":68,"1216":188,"1217":252,"1218":6,"1219":107,"1220":90,"1221":89,"1222":219,"1223":21,"1224":159,"1225":40,"1226":131,"1227":198,"1228":252,"1229":199,"1230":147,"1231":36,"1232":116,"1233":20,"1234":111,"1235":19,"1236":156,"1237":82,"1238":145,"1239":189,"1240":24,"1241":186,"1242":208,"1243":3,"1244":159,"1245":8,"1246":67,"1247":72,"1248":82,"1249":93,"1250":225,"1251":55,"1252":137,"1253":119,"1254":85,"1255":238,"1256":3,"1257":188,"1258":255,"1259":102,"1260":50,"1261":163,"1262":148,"1263":109,"1264":203,"1265":188,"1266":109,"1267":99,"1268":49,"1269":247,"1270":53,"1271":217,"1272":236,"1273":90,"1274":74,"1275":80,"1276":3,"1277":175,"1278":126,"1279":33,"1280":97,"1281":254,"1282":193,"1283":54,"1284":185,"1285":68,"1286":68,"1287":165,"1288":214,"1289":56,"1290":119,"1291":174,"1292":1,"1293":137,"1294":124,"1295":231,"1296":122,"1297":118,"1298":77,"1299":170,"1300":125,"1301":210,"1302":53,"1303":104,"1304":99,"1305":157,"1306":45,"1307":7,"1308":30,"1309":80,"1310":194,"1311":230,"1312":26,"1313":255,"1314":123,"1315":143,"1316":107,"1317":139,"1318":126,"1319":119,"1320":52,"1321":178,"1322":124,"1323":29,"1324":200,"1325":65,"1326":87,"1327":183,"1328":35,"1329":133,"1330":10,"1331":233,"1332":58,"1333":129,"1334":252,"1335":203,"1336":191,"1337":252,"1338":3,"1339":34,"1340":132,"1341":45,"1342":221,"1343":195,"1344":232,"1345":186,"1346":183,"1347":61,"1348":17,"1349":47,"1350":26,"1351":80,"1352":62,"1353":199,"1354":247,"1355":154,"1356":244,"1357":248,"1358":167,"1359":128,"1360":190,"1361":231,"1362":168,"1363":219,"1364":165,"1365":6,"1366":136,"1367":178,"1368":83,"1369":156,"1370":209,"1371":98,"1372":200,"1373":113,"1374":235,"1375":234,"1376":61,"1377":213,"1378":53,"1379":117,"1380":108,"1381":73,"1382":193,"1383":158,"1384":37,"1385":136,"1386":106,"1387":251,"1388":187,"1389":44,"1390":105,"1391":185,"1392":232,"1393":96,"1394":209,"1395":58,"1396":18,"1397":149,"1398":25,"1399":37,"1400":42,"1401":118,"1402":243,"1403":7,"1404":58,"1405":214,"1406":177,"1407":62,"1408":248,"1409":201,"1410":5,"1411":11,"1412":61,"1413":104,"1414":176,"1415":71,"1416":169,"1417":233,"1418":147,"1419":98,"1420":144,"1421":65,"1422":12,"1423":7,"1424":88,"1425":159,"1426":177,"1427":176,"1428":123,"1429":36,"1430":45,"1431":127,"1432":140,"1433":108,"1434":167,"1435":190,"1436":212,"1437":68,"1438":99,"1439":221,"1440":75,"1441":42,"1442":103,"1443":246,"1444":6,"1445":220,"1446":148,"1447":137,"1448":12,"1449":212,"1450":35,"1451":38,"1452":140,"1453":186,"1454":2,"1455":83,"1456":38,"1457":236,"1458":75,"1459":241,"1460":183,"1461":183,"1462":17,"1463":67,"1464":39,"1465":5,"1466":58,"1467":109,"1468":160,"1469":12,"1470":89,"1471":196,"1472":73,"1473":76,"1474":69,"1475":30,"1476":211,"1477":243,"1478":79,"1479":248,"1480":189,"1481":232,"1482":206,"1483":39,"1484":116,"1485":223,"1486":65,"1487":66,"1488":17,"1489":16,"1490":95,"1491":228,"1492":125,"1493":235,"1494":197,"1495":179,"1496":200,"1497":98,"1498":7,"1499":96,"1500":253,"1501":100,"1502":10,"1503":188,"1504":62,"1505":102,"1506":91,"1507":124,"1508":188,"1509":148,"1510":172,"1511":156,"1512":50,"1513":144,"1514":57,"1515":89,"1516":57,"1517":131,"1518":220,"1519":57,"1520":236,"1521":203,"1522":71,"1523":130,"1524":101,"1525":244,"1526":129,"1527":155,"1528":19,"1529":12,"1530":45,"1531":194,"1532":160,"1533":37,"1534":89,"1535":198,"1536":215,"1537":175,"1538":46,"1539":100,"1540":13,"1541":73,"1542":212,"1543":57,"1544":19,"1545":33,"1546":143,"1547":251,"1548":148,"1549":155,"1550":165,"1551":194,"1552":160,"1553":129,"1554":213,"1555":21,"1556":55,"1557":49,"1558":65,"1559":126,"1560":145,"1561":108,"1562":37,"1563":194,"1564":98,"1565":115,"1566":4,"1567":43,"1568":124,"1569":131,"1570":163,"1571":58,"1572":235,"1573":198,"1574":155,"1575":102,"1576":50,"1577":211,"1578":186,"1579":199,"1580":220,"1581":34,"1582":108,"1583":54,"1584":204,"1585":101,"1586":166,"1587":76,"1588":178,"1589":248,"1590":177,"1591":60,"1592":89,"1593":251,"1594":170,"1595":2,"1596":77,"1597":43,"1598":128,"1599":171,"1600":133,"1601":57,"1602":197,"1603":203,"1604":131,"1605":181,"1606":227,"1607":98,"1608":229,"1609":234,"1610":184,"1611":4,"1612":142,"1613":65,"1614":191,"1615":41,"1616":93,"1617":32,"1618":242,"1619":93,"1620":229,"1621":94,"1622":9,"1623":122,"1624":38,"1625":122,"1626":40,"1627":165,"1628":177,"1629":4,"1630":50,"1631":56,"1632":205,"1633":212,"1634":159,"1635":88,"1636":192,"1637":97,"1638":15,"1639":82,"1640":132,"1641":105,"1642":54,"1643":71,"1644":167,"1645":75,"1646":46,"1647":169,"1648":56,"1649":21,"1650":57,"1651":74,"1652":14,"1653":97,"1654":214,"1655":223,"1656":205,"1657":21,"1658":141,"1659":33,"1660":32,"1661":55,"1662":5,"1663":97,"1664":178,"1665":96,"1666":248,"1667":203,"1668":255,"1669":199,"1670":14,"1671":124,"1672":75,"1673":193,"1674":96,"1675":243,"1676":205,"1677":8,"1678":80,"1679":20,"1680":246,"1681":57,"1682":25,"1683":163,"1684":244,"1685":137,"1686":21,"1687":175,"1688":199,"1689":2,"1690":96,"1691":246,"1692":253,"1693":212,"1694":14,"1695":179}',
			success: true
		});
	}).as('fetchMyKeys');

	cy.intercept('POST', '/api/v1/e2e.setUserPublicAndPrivateKeys', (req) => {
		req.reply({
			success: true
		});
	}).as('setUserPublicAndPrivateKeys');

	cy.intercept('POST', '/api/v1/users.resetE2EKey', (req) => {
		req.reply({
			success: true
		});
	}).as('resetE2EKey');

	cy.intercept('PUT', '/service/users/chat/e2e', {
		statusCode: 200
	});

	cy.intercept('GET', `${config.endpoints.sessionRooms}*`, (req) => {
		const data = { ...defaultReturns['sessionRooms'] };
		const rcGroupId = new URL(req.url).searchParams.get('rcGroupIds');
		let foundSession = null;
		getAskerSessions().forEach((session, index) => {
			if (session.session.groupId === rcGroupId) {
				foundSession = session;
			}
		});

		getConsultantSessions().forEach((session, index) => {
			if (session.session.groupId === rcGroupId) {
				foundSession = session;
			}
		});

		data.body.sessions[0].session = {
			...foundSession,
			...overrides['sessionRooms']
		};

		req.reply(data);
	}).as('sessionRooms');
});

Cypress.Commands.add(
	'fastLogin',
	(
		args: LoginArgs = {
			username: USER_ASKER
		}
	) => {
		username = args.username || USER_ASKER;

		cy.fixture('api.v1.login').then((res) => {
			if (res.data.authToken) {
				cy.setCookie('rc_token', res.data.authToken);
			}
			if (res.data.userId) {
				cy.setCookie('rc_uid', res.data.userId);
				// masterkey dev user pregnancy
				window.localStorage.setItem(
					`mk_${res.data.userId}`,
					'[225,59,174,132,235,143,199,190,136,68,11,58,123,91,159,241,78,226,65,110,22,100,84,127,59,84,180,138,210,94,176,144]'
				);
			}
		});

		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		window.localStorage.setItem(
			'auth.access_token_valid_until',
			tomorrow.getTime().toString()
		);
		window.localStorage.setItem(
			'auth.refresh_token_valid_until',
			tomorrow.getTime().toString()
		);

		cy.visit('/app');
		cy.wait('@usersData');
		if (username === USER_ASKER) {
			cy.wait('@askerSessions');
		} else {
			cy.wait('@consultantEnquiriesBase');
		}
	}
);
