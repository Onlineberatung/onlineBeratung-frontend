import clsx from 'clsx';
import * as React from 'react';

import { Stage } from '../stage/stage';
import htmlParser from '../../resources/scripts/util/htmlParser';
import './legalPageWrapper.styles.scss';

export interface LegalPageWrapperProps {
	className?: string;
	content: string;
}
export const LegalPageWrapper = ({
	className,
	content
}: LegalPageWrapperProps) => {
	return (
		<div className={clsx('legalPageWrapper stageLayout', className)}>
			<Stage className="stageLayout__stage" />
			<div className={clsx('stageLayout__content', className)}>
				<section className="template">
					{typeof content === 'string' && htmlParser(content)}
				</section>
			</div>
		</div>
	);
};
