#!/usr/bin/env node

// Entry point for library consumers to run scripts

let command = process.argv[2];

function throwUsageError(message) {
	throw new Error(
		(message ? message + '\n\n' : '') +
			'Please call `onlineberatung-frontend` with one of the available commands:' +
			'\n - `start`: Start the development server' +
			'\n - `build`: Build the app for production' +
			'\n'
	);
}

if (!command) {
	throwUsageError('No command provided');
}

command = command.trim();

if (command === 'start') {
	require('./proxy/server.js');
} else if (command === 'dev') {
	require('./scripts/start');
} else if (command === 'build') {
	require('./scripts/build');
} else {
	throwUsageError(`Unknown command: ${command}`);
}
