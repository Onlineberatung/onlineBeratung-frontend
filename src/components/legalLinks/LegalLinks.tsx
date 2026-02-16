import { TProvidedLegalLink } from '../../globalState/provider/LegalLinksProvider';
import { useTranslation } from 'react-i18next';
import { Fragment, ReactNode } from 'react';
import * as React from 'react';
import { Link } from 'react-router-dom';

const LegalLinks = ({
	legalLinks,
	prefix,
	suffix,
	delimiter,
	lastDelimiter,
	children,
	params,
	filter
}: {
	legalLinks: TProvidedLegalLink[];
	prefix?: ReactNode;
	suffix?: ReactNode;
	delimiter?: ReactNode;
	lastDelimiter?: string;
	params?: { [key: string]: string | number };
	children?: (label: string, url: string) => ReactNode;
	filter?: (legalLink: TProvidedLegalLink) => boolean;
}) => {
	const { t: translate } = useTranslation();

	const getPrefix = (i: number, lastIndex: number) => {
		if (i === 0) {
			return prefix;
		} else if (i === lastIndex && lastDelimiter) {
			return lastDelimiter;
		}

		return delimiter;
	};
	const getSuffix = (i: number, lastIndex: number) =>
		i === lastIndex && suffix;

	const links = legalLinks
		.filter(filter || (() => true))
		.map(({ label, getUrl }) => ({
			label: translate(label),
			url: getUrl(params || {})
		}))
		.reduce((links, { label, url }, i, b) => {
			links.push(
				<Fragment key={url}>
					{getPrefix(i, b.length - 1)}
					{children ? (
						children(label, url)
					) : (
						<Link to={url}>{label}</Link>
					)}
					{getSuffix(i, b.length - 1)}
				</Fragment>
			);
			return links;
		}, [] as ReactNode[]);

	return <>{links}</>;
};

export default LegalLinks;
