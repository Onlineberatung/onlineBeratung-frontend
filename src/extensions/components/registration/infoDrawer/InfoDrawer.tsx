import * as React from 'react';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, SwipeableDrawer, Typography } from '@mui/material';
import { RegistrationContext } from '../../../../globalState';
import { PreselectionError } from '../preselectionError/PreselectionError';
import { UrlParamsContext } from '../../../../globalState/provider/UrlParamsProvider';

interface InfoDrawerProps {
	trigger?: boolean;
}

export const InfoDrawer = ({ trigger }: InfoDrawerProps) => {
	const { t } = useTranslation();

	const { hasAgencyError, hasConsultantError, hasTopicError } =
		useContext(RegistrationContext);
	const {
		topic: preselectedTopic,
		agency: preselectedAgency,
		consultant: preselectedConsultant
	} = useContext(UrlParamsContext);

	const drawerBleeding = 92;
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event?.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
				(event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setIsDrawerOpen(!isDrawerOpen);
	};

	if (!preselectedTopic && !preselectedAgency && !preselectedConsultant) {
		return null;
	}

	return (
		<SwipeableDrawer
			sx={{
				'display': { md: 'none' },
				'> .MuiPaper-root': {
					top: -drawerBleeding,
					overflow: 'visible'
				},
				'top': 0
			}}
			anchor="top"
			onClose={() => setIsDrawerOpen(false)}
			onOpen={() => setIsDrawerOpen(true)}
			open={isDrawerOpen}
			ModalProps={{
				keepMounted: true
			}}
		>
			<Box
				onClick={toggleDrawer}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						toggleDrawer(e);
					}
				}}
				tabIndex={0}
				sx={{
					'px': '16px',
					'pt': '16px',
					'mt': trigger ? 0 : '48px',
					'position': 'relative',
					'borderBottomLeftRadius': 8,
					'borderBottomRightRadius': 8,
					'visibility': 'visible',
					'right': 0,
					'left': 0,
					'width': '100vw',
					'backgroundColor': 'primary.main',
					'color': 'white',
					'animationName': 'slideIn',
					'animationDuration': '0.8s',
					'animationDelay': '0.3s',
					'animationFillMode': 'forwards',
					'@keyframes slideIn': {
						'0%': {
							top: 0
						},
						'100%': {
							top: drawerBleeding
						}
					}
				}}
			>
				<Box
					sx={{
						opacity: isDrawerOpen ? 1 : 0,
						overflow: 'scroll',
						maxHeight: isDrawerOpen ? '75vh' : 0
					}}
				>
					{hasConsultantError ? (
						<PreselectionError
							errorMessage={t('registration.errors.cid')}
						></PreselectionError>
					) : (
						<>
							<Typography
								sx={{ color: 'white', fontWeight: '600' }}
							>
								{t('registration.topic.summary')}
							</Typography>
							{hasTopicError && !preselectedTopic ? (
								<PreselectionError
									errorMessage={t('registration.errors.tid')}
								></PreselectionError>
							) : (
								preselectedTopic && (
									<Typography
										sx={{ color: 'white', mt: '8px' }}
									>
										{preselectedTopic.name}
									</Typography>
								)
							)}
							<Typography
								sx={{
									color: 'white',
									fontWeight: '600',
									mt: '16px'
								}}
							>
								{t('registration.agency.summary')}
							</Typography>
							{hasAgencyError && !preselectedAgency ? (
								<PreselectionError
									errorMessage={t('registration.errors.aid')}
								></PreselectionError>
							) : (
								preselectedAgency && (
									<Typography
										sx={{ color: 'white', mt: '8px' }}
									>
										{preselectedAgency.name}
									</Typography>
								)
							)}
						</>
					)}
				</Box>
				<Box
					onClick={toggleDrawer}
					sx={{
						pt: '10px',
						pb: '10px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						pointerEvents: 'all',
						cursor: 'pointer'
					}}
				>
					{isDrawerOpen ? (
						<KeyboardArrowUpIcon
							sx={{ height: '24px', width: '24px' }}
						/>
					) : (
						<KeyboardArrowDownIcon
							sx={{ height: '24px', width: '24px' }}
						/>
					)}
				</Box>
			</Box>
		</SwipeableDrawer>
	);
};
