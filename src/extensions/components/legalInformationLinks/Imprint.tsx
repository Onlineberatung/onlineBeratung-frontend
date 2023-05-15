import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as BMILogo } from './bmi-foerder-logo.svg';
import { ReactComponent as MBELogo } from './mbe-logo.svg';
import { ReactComponent as GluecksspiraleLogo } from './gluecksspirale-logo.svg';
import useDocumentTitle from '../../resources/utils/useDocumentTitle';
import { Stage } from '../stage/Stage';
import './legalPage.styles';
import { Headline } from '../../../components/headline/Headline';
import { Text } from '../../../components/text/Text';

export const Imprint = () => {
	const { t: translate } = useTranslation();
	useDocumentTitle(translate('profile.footer.imprint'));
	return (
		<div className="legalPageWrapper stageLayout">
			<Stage className="stageLayout__stage" />
			<div className="stageLayout__content">
				<Headline semanticLevel="3" text={translate('imprint.title')} />
				<Headline
					semanticLevel="4"
					text={translate('imprint.title1')}
				/>
				<Text text={translate('imprint.text1')} type="standard" />
				<Headline
					semanticLevel="4"
					text={translate('imprint.title2')}
				/>
				<Text text={translate('imprint.text2')} type="standard" />
				<Headline
					semanticLevel="4"
					text={translate('imprint.title3')}
				/>
				<Text text={translate('imprint.text3')} type="standard" />
				<Headline
					semanticLevel="4"
					text={translate('imprint.title4')}
				/>
				<Text text={translate('imprint.text4')} type="standard" />
				<Headline
					semanticLevel="4"
					text={translate('imprint.title5')}
				/>
				<Text text={translate('imprint.text5')} type="standard" />
				<Headline
					semanticLevel="4"
					text={translate('imprint.title6')}
				/>
				<Text text={translate('imprint.text6')} type="standard" />
				<div className="legalInformation__logos flex flex--ai-c">
					<div className="flex__col--1">
						<BMILogo />
					</div>
					<div className="flex__col--1 mx--3">
						<MBELogo />
					</div>
					<div className="flex__col--1">
						<GluecksspiraleLogo />
					</div>
				</div>
			</div>
		</div>
	);
};
