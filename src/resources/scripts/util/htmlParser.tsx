import parse, { Element } from 'html-react-parser';
import React from 'react';

const htmlParser = (input: string) =>
	parse(input, {
		replace: (domNode) => {
			if (
				domNode instanceof Element &&
				domNode.attribs.class === 'remove'
			) {
				return <></>;
			}
		}
	});

export default htmlParser;
