export const initNavigationHandler = () => {
	const navItems = document.querySelectorAll('.navigation__item');

	Array.from(navItems).forEach((navItem: Element) => {
		navItem.addEventListener('click', (e) =>
			activateNavigationItem(e, navItems)
		);
	});
};

const activateNavigationItem = (e: Event, navItems) => {
	mobileListView();
};

export const desktopView = () => {
	const contentWrapper = document.querySelector('.contentWrapper');
	const contentWrapperDetail = document.querySelector(
		'.contentWrapper__detail'
	);
	const contentWrapperList = document.querySelector('.contentWrapper__list');
	const navigationWrapper = document.querySelector('.navigation__wrapper');
	contentWrapperDetail?.classList.remove(
		'contentWrapper__detail--smallInactive'
	);
	contentWrapperList?.classList.remove('contentWrapper__list--smallInactive');
	navigationWrapper?.classList.remove('navigation__wrapper--inactive');
	contentWrapper?.classList.remove('contentWrapper--navInactive');
};

export const mobileListView = () => {
	if (window.innerWidth <= 900) {
		const contentWrapper = document.querySelector('.contentWrapper');
		const contentWrapperDetail = document.querySelector(
			'.contentWrapper__detail'
		);
		const contentWrapperList = document.querySelector(
			'.contentWrapper__list'
		);
		const navigationWrapper = document.querySelector(
			'.navigation__wrapper'
		);
		contentWrapperDetail?.classList.add(
			'contentWrapper__detail--smallInactive'
		);
		contentWrapperList?.classList.remove(
			'contentWrapper__list--smallInactive'
		);
		navigationWrapper?.classList.remove('navigation__wrapper--inactive');
		contentWrapper?.classList.remove('contentWrapper--navInactive');
	}
};

export const mobileDetailView = () => {
	if (window.innerWidth <= 900) {
		const contentWrapper = document.querySelector('.contentWrapper');
		const contentWrapperDetail = document.querySelector(
			'.contentWrapper__detail'
		);
		const contentWrapperList = document.querySelector(
			'.contentWrapper__list'
		);
		const navigationWrapper = document.querySelector(
			'.navigation__wrapper'
		);
		contentWrapperDetail?.classList.remove(
			'contentWrapper__detail--smallInactive'
		);
		contentWrapperList?.classList.add(
			'contentWrapper__list--smallInactive'
		);
		navigationWrapper?.classList.add('navigation__wrapper--inactive');
		contentWrapper?.classList.add('contentWrapper--navInactive');
	}
};

export const mobileUserProfileView = () => {
	if (window.innerWidth <= 900) {
		const contentWrapperList = document.querySelector(
			'.contentWrapper__list'
		);
		contentWrapperList?.classList.add(
			'contentWrapper__list--smallInactive'
		);
	}
};
