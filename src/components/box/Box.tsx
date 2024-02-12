import * as React from 'react';
import { ReactNode } from 'react';
import styles from './box.module.scss';
import classNames from 'classnames';

export enum BoxTypes {
	ERROR = 'error',
	INFO = 'info',
	SUCCESS = 'success'
}

type BoxProps = {
	title?: string;
	type?: BoxTypes;
	children: ReactNode;
};

export const Box = ({ children, title, type }: BoxProps) => (
	<div
		className={classNames(styles.box, {
			[styles[`box--${type}`]]: !!type
		})}
	>
		{title && <div className={styles.box__title}>{title}</div>}
		<div className={styles.box__content}>{children}</div>
	</div>
);
