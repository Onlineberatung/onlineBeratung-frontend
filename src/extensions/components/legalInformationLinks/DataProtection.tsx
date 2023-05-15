import * as React from 'react';
import { Stage } from '../stage/Stage';
import useDocumentTitle from '../../resources/utils/useDocumentTitle';
import './legalPage.styles';
import { useTranslation } from 'react-i18next';
import { legalLinks } from '../../resources/scripts/config';
import { Headline } from '../../../components/headline/Headline';
import { Text } from '../../../components/text/Text';

export const DataProtection = () => {
	const { t: translate } = useTranslation();
	useDocumentTitle(translate('profile.footer.dataprotection'));
	return (
		<div className="legalPageWrapper stageLayout">
			<Stage className="stageLayout__stage" />
			<div className="stageLayout__content">
				<Headline
					semanticLevel="3"
					text={translate('dataProtection.title')}
				/>
				<Headline
					semanticLevel="4"
					text={translate('dataProtection.subtitle1')}
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.title1')}
				/>
				<Text
					text={translate('dataProtection.text1', {
						url: legalLinks.imprint
					})}
					type="standard"
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.title2')}
				/>
				<Text
					text={translate('dataProtection.text2')}
					type="standard"
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.title3')}
				/>
				<Text
					text={translate('dataProtection.text3')}
					type="standard"
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.title4')}
				/>
				<Text
					text={translate('dataProtection.text4')}
					type="standard"
				/>
				<Headline
					semanticLevel="4"
					text={translate('dataProtection.title5')}
				/>
				<Text
					text={translate('dataProtection.text5', {
						url: legalLinks.imprint
					})}
					type="standard"
				/>
				<Headline
					semanticLevel="4"
					text={translate('dataProtection.title6')}
				/>
				<Text
					text={translate('dataProtection.text6')}
					type="standard"
				/>
				<Headline
					semanticLevel="4"
					text={translate('dataProtection.subtitle2')}
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.title7')}
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.subtitle7')}
				/>
				<Text
					text={translate('dataProtection.text7')}
					type="standard"
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.title8')}
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.subtitle8')}
				/>
				<Text
					text={translate('dataProtection.text8')}
					type="standard"
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.title9')}
				/>
				<Text
					text={translate('dataProtection.text9')}
					type="standard"
				/>
				<Headline
					semanticLevel="4"
					text={translate('dataProtection.title10')}
				/>
				<Text
					text={translate('dataProtection.text10')}
					type="standard"
				/>
				<Headline
					semanticLevel="4"
					text={translate('dataProtection.title11')}
				/>
				<Text
					text={translate('dataProtection.text11')}
					type="standard"
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.title12')}
				/>
				<Text
					text={translate('dataProtection.text12')}
					type="standard"
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.title13')}
				/>
				<Text
					text={translate('dataProtection.text13')}
					type="standard"
				/>
				<Headline
					semanticLevel="5"
					text={translate('dataProtection.title14')}
				/>
				<Text
					text={translate('dataProtection.text14')}
					type="standard"
				/>
				<Text
					text={translate('dataProtection.text15')}
					type="standard"
				/>
			</div>
		</div>
	);
};
