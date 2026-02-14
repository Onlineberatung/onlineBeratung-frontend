#!/usr/bin/env node

// Entry point for library consumers to run scripts

let command = process.argv[2];

function throwUsageError(message) {
	throw new Error(
		(message ? message + '\n\n' : '') +
			'Usage: onlineberatung-frontend start' +
			'\n\nStarts the production server for the built application.' +
			'\n'
	);
}

if (!command) {
	throwUsageError('No command provided');
}

command = command.trim();

if (command === 'start') {
	require('./proxy/server.js');
} else {
	throwUsageError(`Unknown command: ${command}`);
}
