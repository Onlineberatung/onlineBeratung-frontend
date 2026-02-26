#!/usr/bin/env node

// Entry point for library consumers to run scripts

const path = require('path');

let userCommand = process.argv[2];
const cliName = path.basename(process.argv[1] || 'onlineberatung-frontend');

function throwUsageError(message) {
	throw new Error(
		(message ? message + '\n\n' : '') +
			`Usage: ${cliName} start` +
			'\n\nStarts the production server for the built application.' +
			'\n'
	);
}

if (!userCommand) {
	throwUsageError('No command provided');
}

userCommand = userCommand.trim();

if (userCommand === 'start') {
	try {
		require('./proxy/server.js');
	} catch (err) {
		console.error('Failed to start the server from ./proxy/server.js:');
		if (err && err.stack) {
			console.error(err.stack);
		} else {
			console.error(String(err));
		}
		process.exit(1);
	}
} else {
	throwUsageError(`Unknown command: ${userCommand}`);
}
