var https = require('http');
require('dotenv').config({ path: './.env' });

const postData = {
	username: 'technical',
	password: 'technical',
	client_id: 'app',
	grant_type: 'password'
};

const serialize = (obj) => {
	var str = '';
	for (var key in obj) {
		if (str !== '') {
			str += '&';
		}
		str += key + '=' + encodeURIComponent(obj[key]);
	}
	return str;
};

const options = {
	hostname: 'caritas.local',
	port: 80,
	path: '/auth/realms/caritas-online-beratung/protocol/openid-connect/token',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': serialize(postData).length
	}
};

const req = https.request(options, (res) => {
	console.log(`token requested -> statusCode: ${res.statusCode}`);

	res.on('data', (d) => {
		const access_token = JSON.parse(d).access_token;
		setMasterKey(access_token, '/service/messages/key');
		setMasterKey(access_token, '/service/users/messages/key');
		setMasterKey(access_token, '/service/uploads/messages/key');
	});
});
req.on('error', (error) => {
	console.error(error);
});
req.write(serialize(postData));
req.end();

function setMasterKey(access_token, url) {
	const json = JSON.stringify({
		masterKey: process.env.MASTERKEY ? process.env.MASTERKEY : 'no-key'
	});
	console.log(
		'master key is :',
		process.env.MASTERKEY
			? process.env.MASTERKEY
			: 'no key defined -> please define your key in .env `MASTERKEY=YOURKEY`'
	);
	const options = {
		hostname: 'caritas.local',
		port: 80,
		path: url,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(json, 'utf8'),
			'Authorization': ' Bearer ' + access_token,
			'X-CSRF-TOKEN': 'test',
			'Cookie': 'CSRF-TOKEN=test'
		}
	};
	const req = https.request(options, (res) => {
		console.log(
			`masterkey inserted to ${url} -> statusCode: ${res.statusCode}`
		);
	});

	req.on('error', (error) => {
		console.error(error);
	});
	req.write(json);
	req.end();
}
