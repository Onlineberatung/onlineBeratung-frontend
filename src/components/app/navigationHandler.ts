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
	const contentDetail = document.querySelector('.contentWrapper__detail');
	contentDetail?.classList.remove('contentWrapper__detail--smallInactive');

	const contentList = document.querySelector('.contentWrapper__list');
	contentList?.classList.remove('contentWrapper__list--smallInactive');

	const navigation = document.querySelector('.navigation__wrapper');
	navigation?.classList.remove('navigation__wrapper--inactive');

	const contentWrapper = document.querySelector('.contentWrapper');
	contentWrapper?.classList.remove('contentWrapper--navInactive');
};

export const mobileListView = () => {
	if (window.innerWidth <= 900) {
		const contentDetail = document.querySelector('.contentWrapper__detail');
		contentDetail?.classList.add('contentWrapper__detail--smallInactive');

		const contentList = document.querySelector('.contentWrapper__list');
		contentList?.classList.remove('contentWrapper__list--smallInactive');

		const navigation = document.querySelector('.navigation__wrapper');
		navigation?.classList.remove('navigation__wrapper--inactive');

		const contentWrapper = document.querySelector('.contentWrapper');
		contentWrapper?.classList.remove('contentWrapper--navInactive');
	}
};

export const mobileDetailView = () => {
	if (window.innerWidth <= 900) {
		const contentDetail = document.querySelector('.contentWrapper__detail');
		contentDetail?.classList.remove(
			'contentWrapper__detail--smallInactive'
		);

		const contentList = document.querySelector('.contentWrapper__list');
		contentList?.classList.add('contentWrapper__list--smallInactive');

		const navigation = document.querySelector('.navigation__wrapper');
		navigation?.classList.add('navigation__wrapper--inactive');

		const contentWrapper = document.querySelector('.contentWrapper');
		contentWrapper?.classList.add('contentWrapper--navInactive');
	}
};

export const setProfileWrapperInactive = () => {
	document
		.querySelector('.contentWrapper__list')
		?.setAttribute('style', 'display: block');
	document
		.querySelector('.contentWrapper__detail')
		?.setAttribute('style', 'display: block');
	document
		.querySelector('.contentWrapper__profile')
		?.setAttribute('style', 'display: none');
};

export const setProfileWrapperActive = () => {
	document
		.querySelector('.contentWrapper__list')
		?.setAttribute('style', 'display: none');
	document
		.querySelector('.contentWrapper__detail')
		?.setAttribute('style', 'display: none');
	document
		.querySelector('.contentWrapper__profile')
		?.setAttribute('style', 'display: block');
};
