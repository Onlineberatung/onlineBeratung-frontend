import * as React from 'react';
import clsx from 'clsx';
import './stage.styles';
import Spinner from '../spinner/Spinner';
import { useContext } from 'react';
import { TenantContext } from '../../globalState';

export interface StageProps {
	className?: string;
	hasAnimation?: boolean;
	isReady?: boolean;
}

export const Stage = ({
	className,
	hasAnimation,
	isReady = true
}: StageProps) => {
	const { tenant } = useContext(TenantContext);
	return (
		<div
			id="loginLogoWrapper"
			className={clsx(className, 'stage', {
				'stage--animated': hasAnimation,
				'stage--ready': isReady
			})}
		>
			<div className="stage__headline">
				<h1>{tenant.name}</h1>
				<h4>{tenant.slogan}</h4>
			</div>

			{hasAnimation ? <Spinner className="stage__spinner" /> : null}
			<div className="stage__logos">
				<div className="logo" />
			</div>
		</div>
	);
};
