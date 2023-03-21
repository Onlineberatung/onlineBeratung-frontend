import * as React from 'react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, generatePath } from 'react-router-dom';
import { ReactComponent as ForwardIcon } from '../../../resources/img/icons/arrow-right.svg';
import { ReactComponent as NewWindowIcon } from '../../../resources/img/icons/new-window.svg';
import './link_menu.styles';

export type LinkMenuComponentType = {
	component: ReactNode;
};

export type LinkMenuItemType = {
	title: string;
	url: string;
	showBadge?: boolean;
	externalLink?: boolean;
};

export type LinkMenuGroupType = {
	title: string;
	items: (LinkMenuItemType | LinkMenuComponentType)[];
};

type LinkMenuProps = {
	items: (LinkMenuGroupType | LinkMenuItemType | LinkMenuComponentType)[];
	className?: string;
};

export const isLinkMenuGroup = (
	item: LinkMenuGroupType | LinkMenuItemType | LinkMenuComponentType
): item is LinkMenuGroupType => {
	return item.hasOwnProperty('items');
};

export const isLinkMenuComponent = (
	item: LinkMenuGroupType | LinkMenuItemType | LinkMenuComponentType
): item is LinkMenuComponentType => {
	return item.hasOwnProperty('component');
};

export const isLinkMenuItem = (
	item: LinkMenuGroupType | LinkMenuItemType | LinkMenuComponentType
): item is LinkMenuItemType => {
	return !item.hasOwnProperty('component') && !item.hasOwnProperty('items');
};

export const LinkMenu = ({ items, className }: LinkMenuProps) => {
	return (
		<div className={`link_menu ${className}`}>
			{items.map((item) =>
				isLinkMenuGroup(item) ? (
					<LinkMenuGroup item={item} key={item.title} />
				) : isLinkMenuComponent(item) ? (
					<LinkMenuComponent item={item} />
				) : (
					<LinkMenuItem item={item} key={item.title} />
				)
			)}
		</div>
	);
};

const LinkMenuGroup = ({ item }: { item: LinkMenuGroupType }) => {
	return (
		<div className="link_menu__group">
			<div className="title">{item.title}</div>
			{item.items.map((i) =>
				isLinkMenuComponent(i) ? (
					<LinkMenuComponent item={i} />
				) : (
					<LinkMenuItem item={i} key={item.title + i.title} />
				)
			)}
		</div>
	);
};

const LinkMenuItem = ({ item }: { item: LinkMenuItemType }) => {
	const { t: translate } = useTranslation();
	return (
		<div className="link_menu__item">
			<Link
				to={generatePath(item.url)}
				target={item.externalLink ? '_blank' : '_self'}
			>
				<div className="link_menu__item__container">
					{item.title}
					{item?.showBadge && (
						<span className="link_menu__item__badge" />
					)}
				</div>
				{item.externalLink && (
					<NewWindowIcon title={item.title} aria-label={item.title} />
				)}
				{!item.externalLink && (
					<ForwardIcon
						title={translate('app.next')}
						aria-label={translate('app.next')}
					/>
				)}
			</Link>
		</div>
	);
};

const LinkMenuComponent = ({ item }: { item: LinkMenuComponentType }) => {
	return <div className="link_menu__item">{item.component}</div>;
};
