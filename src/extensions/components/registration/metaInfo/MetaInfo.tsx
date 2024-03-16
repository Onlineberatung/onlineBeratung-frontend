import { Box, Tooltip, Button, Typography, Drawer } from '@mui/material';
import * as React from 'react';
import { VFC, useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

export const MetaInfo: VFC<{
	description: string;
	onOverlayOpen(): void;
	onOverlayClose(): void;
	nextStepUrl: string;
	onNextClick(): void;
	backButtonLabel: string;
	nextButtonLabel: string;
	headline: string;
}> = ({
	description,
	onOverlayClose,
	onNextClick,
	nextStepUrl,
	onOverlayOpen,
	nextButtonLabel,
	backButtonLabel,
	headline
}) => {
	const [isInfoOverlayOpen, setIsInfoOverlayOpen] = useState<boolean>(false);
	const { t } = useTranslation();

	return (
		<>
			<Tooltip title={description} arrow>
				<InfoIcon
					sx={{
						display: {
							xs: 'none',
							md: 'inline'
						},
						p: '9px',
						width: '42px',
						height: '42px'
					}}
					tabIndex={0}
					aria-label={t('app.info')}
				/>
			</Tooltip>
			<InfoIcon
				aria-label={t('app.info')}
				onClick={() => {
					onOverlayOpen();
					setIsInfoOverlayOpen(true);
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						onOverlayOpen();
						setIsInfoOverlayOpen(true);
					}
				}}
				tabIndex={0}
				sx={{
					display: {
						xs: 'inline',
						md: 'none'
					},
					cursor: 'pointer',
					p: '9px',
					width: '42px',
					height: '42px'
				}}
			/>
			<Drawer
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
				anchor="left"
				open={isInfoOverlayOpen}
				onClose={() => {
					onOverlayClose();
					setIsInfoOverlayOpen(false);
				}}
			>
				<Box
					sx={{
						width: '100vw',
						height: '100vh',
						overflowY: 'scroll',
						backgroundColor: 'white',
						p: '22px'
					}}
				>
					<ArrowBackIosIcon
						aria-label={t('app.back')}
						sx={{
							mb: '26px',
							cursor: 'pointer',
							p: '9px',
							width: '42px',
							height: '42px'
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								onOverlayClose();
								setIsInfoOverlayOpen(false);
							}
						}}
						tabIndex={0}
						onClick={() => {
							onOverlayClose();
							setIsInfoOverlayOpen(false);
						}}
					/>
					<Typography variant="h3" sx={{ mb: '24px' }}>
						{headline}
					</Typography>
					<Typography>{description}</Typography>
					<Button
						fullWidth
						sx={{
							mt: '16px'
						}}
						variant="contained"
						component={RouterLink}
						to={nextStepUrl}
						onClick={onNextClick}
					>
						{nextButtonLabel}
					</Button>
					<Button
						fullWidth
						sx={{
							mt: '24px'
						}}
						variant="outlined"
						onClick={() => {
							onOverlayClose();
							setIsInfoOverlayOpen(false);
						}}
					>
						{backButtonLabel}
					</Button>
				</Box>
			</Drawer>
		</>
	);
};
