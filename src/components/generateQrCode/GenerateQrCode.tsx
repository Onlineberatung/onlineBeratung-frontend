import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Overlay, OverlayWrapper } from '../overlay/Overlay';
import { ReactComponent as QRCodeIcon } from '../../resources/img/icons/qr-code.svg';
import { ReactComponent as DownloadIcon } from '../../resources/img/icons/download.svg';
import './generateQrCode.styles';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

interface GenerateQrCodeProps {
	filename?: string;
	url: string;
}

export const GenerateQrCode: React.FC<GenerateQrCodeProps> = ({
	filename = 'qrCode',
	url
}) => {
	const [qr, setQr] = useState('');
	const [qrDownload, setQrDownload] = useState('');
	const [overlayActive, setOverlayActive] = useState(false);
	const generateQrCodeRef = useRef();

	useEffect(() => {
		const codeColor = getComputedStyle(
			generateQrCodeRef.current
		).getPropertyValue('--code-color');

		QRCode.toDataURL(url, {
			errorCorrectionLevel: 'L',
			color: {
				dark: codeColor.trim(),
				light: '#ffffff00'
			}
		}).then((url) => {
			setQr(url);
		});

		QRCode.toDataURL(url, {
			errorCorrectionLevel: 'L',
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
				<img alt="QR Code" src={qr} />
				<Headline
					semanticLevel="3"
					text={translate('qrCode.overlay.headline')}
				/>
				<Text text={translate('qrCode.overlay.info')} type="standard" />
				<a download={filename + '.png'} href={qrDownload}>
					<DownloadIcon />
					{translate('qrCode.overlay.download')}
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
				onClick={() => {
					setOverlayActive(true);
				}}
			>
				<QRCodeIcon />
				{translate('qrCode.link.text')}
			</button>
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						className="generateQrCode__overlay"
						item={overlayItem}
						handleOverlayClose={() => {
							setOverlayActive(false);
						}}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
