import * as React from 'react';
import { ReactNode, useCallback } from 'react';
import './notice.styles.scss';

import ExclamationIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import {
	NOTICE_TYPE_ERROR,
	NOTICE_TYPE_INFO,
	NOTICE_TYPE_SUCCESS,
	NOTICE_TYPE_WARNING,
	NoticeTypes
} from './types';

type NoticeProps = {
	title: string;
	children: ReactNode;
	className?: string;
	type?: NoticeTypes;
};

export const Notice = ({
	title,
	children,
	className,
	type = NOTICE_TYPE_INFO
}: NoticeProps) => {
	const getIcon = useCallback(() => {
		switch (type) {
			case NOTICE_TYPE_SUCCESS:
				return <CheckIcon />;
			case NOTICE_TYPE_WARNING:
				return <ExclamationIcon />;
			case NOTICE_TYPE_ERROR:
				return <ErrorIcon />;
			case NOTICE_TYPE_INFO:
			default:
				return <InfoIcon />;
		}
	}, [type]);

	return (
		<div className={`notice notice--${type} ${className}`}>
			<div className="notice__header">
				<div className="notice__icon">{getIcon()}</div>
				<div className="notice__title">{title}</div>
			</div>
			<div className="notice__text">{children}</div>
		</div>
	);
};
