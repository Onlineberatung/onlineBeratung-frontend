import clsx from 'clsx';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Stage } from '../stage/stage';
import htmlParser from '../../resources/scripts/util/htmlParser';
import './legalPageWrapper.styles.scss';
import { useTranslation } from 'react-i18next';
import ArrowLeftIcon from '../../resources/img/icons/arrow-left.svg?react';

export interface LegalPageWrapperProps {
	className?: string;
	content: string;
	showBackButton?: boolean;
}
export const LegalPageWrapper = ({
	className,
	content,
	showBackButton = true
}: LegalPageWrapperProps) => {
	const history = useHistory();
	const { t } = useTranslation();

	const handleBack = () => {
		history.goBack();
	};

	const backButton: ButtonItem = {
		label: t('legal.back'),
		type: BUTTON_TYPES.SECONDARY,
		smallIconBackgroundColor: 'transparent'
	};

	return (
		<div className={clsx('legalPageWrapper stageLayout', className)}>
			<Stage className="stageLayout__stage" />
			<div className={clsx('stageLayout__content', className)}>
				{showBackButton && (
					<div className="legalPageWrapper__backButton">
						<Button
							item={backButton}
							buttonHandle={handleBack}
							customIcon={<ArrowLeftIcon />}
						/>
					</div>
				)}
				<section className="template">
					{typeof content === 'string' && htmlParser(content)}
				</section>
			</div>
		</div>
	);
};
