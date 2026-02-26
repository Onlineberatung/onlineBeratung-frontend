import * as React from 'react';
import { useContext } from 'react';
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps
} from 'react-router-dom';
import { Stack, Divider, Link as MuiLink, SxProps, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { AgencySpecificContext } from '../../globalState';

/**
 * Adapter that maps MUI Link's `href` prop to React Router v5 Link's `to` prop.
 * This is the MUI-recommended approach for custom routing integration.
 */
const RouterLinkBehavior = React.forwardRef<
	HTMLAnchorElement,
	Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
	const { href, ...other } = props;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return <RouterLink ref={ref as any} to={href} {...other} />;
});
RouterLinkBehavior.displayName = 'RouterLinkBehavior';

interface FooterLinksProps {
	sx?: SxProps<Theme>;
}

export const FooterLinks = ({ sx }: FooterLinksProps) => {
	const { t: translate } = useTranslation();
	const legalLinks = useContext(LegalLinksContext);
	const agencyCtx = useContext(AgencySpecificContext);
	const specificAgency = agencyCtx?.specificAgency;

	if (!legalLinks.length) return null;

	return (
		<Stack
			component="nav"
			direction="row"
			spacing={1}
			divider={<Divider orientation="vertical" flexItem />}
			alignItems="center"
			flexWrap="wrap"
			sx={{ py: 1.5, px: 2, ...sx }}
		>
			{legalLinks.map(({ label, getUrl }) => {
				const url = getUrl({ aid: specificAgency?.id });
				return (
					<MuiLink
						key={url}
						component={RouterLinkBehavior}
						href={url}
						variant="caption"
						color="text.secondary"
						underline="always"
						data-cy-link={url}
						sx={{ '&:hover': { color: 'primary.main' } }}
					>
						{translate(label)}
					</MuiLink>
				);
			})}
		</Stack>
	);
};
