import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Overlay } from '../overlay/Overlay';
import { ReactComponent as QRCodeIcon } from '../../resources/img/icons/qr-code.svg';
import { ReactComponent as DownloadIcon } from '../../resources/img/icons/download.svg';
import './generateQrCode.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { useTranslation } from 'react-i18next';

interface GenerateQrCodeProps {
	url: string;
	headline: string;
	text?: string;
	filename: string;
}

export const GenerateQrCode: React.FC<GenerateQrCodeProps> = ({
	url,
	headline,
	text,
	filename
}) => {
	const { t: translate } = useTranslation();
	const [qr, setQr] = useState('');
	const [qrDownload, setQrDownload] = useState('');
	const [overlayActive, setOverlayActive] = useState(false);
	const generateQrCodeRef = useRef();

	useEffect(() => {
		QRCode.toDataURL(url, {
			errorCorrectionLevel: 'L',
			width: 360,
			color: {
				dark: '#00000099',
				light: '#ffffff00'
			}
		}).then((url) => {
			setQr(url);
		});

		QRCode.toDataURL(url, {
			errorCorrectionLevel: 'L',
			width: 360,
			color: {
				dark: '#000000',
				light: '#ffffff00'
			}
		}).then((url) => {
			setQrDownload(url);
		});
	}, [url]);

	const qrCodeNested = (): JSX.Element => {
		return (
			<div className="generateQrCode__overlayContent">
				<img alt={translate('qrCode.overlay.image.alt')} src={qr} />
				<Headline semanticLevel="3" text={headline} />
				{text && <Text text={text} type="standard" />}
				<a
					download={
						translate(`qrCode.download.filename`, {
							filename
						}) + '.png'
					}
					href={qrDownload}
				>
					<DownloadIcon />
					{translate(`qrCode.overlay.download`)}
				</a>
			</div>
		);
	};

	const overlayItem = {
		nestedComponent: qrCodeNested(),
		handleOverlay: () => {
			setOverlayActive(false);
		}
	};

	return (
		<div className="generateQrCode" ref={generateQrCodeRef}>
			<button
				className="button-as-link"
				onClick={() => {
					setOverlayActive(true);
				}}
			>
				<QRCodeIcon
					title={translate('qrCode.iconTitle')}
					aria-label={translate('qrCode.iconTitle')}
				/>
				{translate('qrCode.link.text')}
			</button>
			{overlayActive ? (
				<Overlay
					className="generateQrCode__overlay"
					item={overlayItem}
					handleOverlayClose={() => {
						setOverlayActive(false);
					}}
				/>
			) : null}
		</div>
	);
};
