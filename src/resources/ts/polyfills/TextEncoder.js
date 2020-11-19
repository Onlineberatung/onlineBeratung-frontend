import { TextEncoder, TextDecoder } from 'text-encoding';

if (!window['TextEncoder']) {
	window['TextEncoder'] = TextEncoder;
}

if (!window['TextDecoder']) {
	window['TextDecoder'] = TextDecoder;
}
