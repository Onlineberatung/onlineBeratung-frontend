import * as React from 'react';
import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Divider, SxProps, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { LegalLinksContext } from '../../globalState/provider/LegalLinksProvider';
import { AgencySpecificContext } from '../../globalState';

const FooterLink = styled(RouterLink)(({ theme }) => ({
	...theme.typography.caption,
	color: theme.palette.text.secondary,
	textDecoration: 'underline',
	lineHeight: 1.5,
	'&:hover': {
		color: theme.palette.primary.main
	},
	'&:focus': {
		outline: `2px solid ${theme.palette.primary.main}`,
		outlineOffset: 2,
		borderRadius: theme.shape.borderRadius
	},
	'&:focus:not(:focus-visible)': {
		outline: 'none'
	}
}));

interface FooterLinksProps {
	sx?: SxProps<Theme>;
}

export const FooterLinks = ({ sx }: FooterLinksProps) => {
	const { t: translate } = useTranslation();
	const legalLinks = useContext(LegalLinksContext);
	const { specificAgency } = useContext(AgencySpecificContext);

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
					<FooterLink key={url} to={url} data-cy-link={url}>
						{translate(label)}
					</FooterLink>
				);
			})}
		</Stack>
	);
};
