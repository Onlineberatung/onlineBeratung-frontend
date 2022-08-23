import { AUTHORITIES, hasUserAuthority } from '../../globalState';
import { translate } from '../../utils/translate';
import { TabsType } from '../../utils/tabsHelper';
import { BookingEventsBooked } from './bookingEventsBooked';
import { BookingEventsCanceled } from './bookingEventsCanceled';
import { BookingEventsExpired } from './bookingEventsExpired';

const routes: TabsType = [
	{
		title: translate('booking.event.tab.booked'),
		url: '/gebuchte',
		elements: [
			{
				component: BookingEventsBooked,
				boxed: false,
				fullWidth: true
			}
		]
	},
	{
		title: translate('booking.event.tab.canceled'),
		url: '/storniert',
		condition: (userData) =>
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData),
		elements: [
			{
				component: BookingEventsCanceled,
				boxed: false,
				fullWidth: true
			}
		]
	},
	{
		title: translate('booking.event.tab.expired'),
		url: '/vergangen',
		condition: (userData) =>
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData),
		elements: [
			{
				component: BookingEventsExpired,
				boxed: false,
				fullWidth: true
			}
		]
	}
];

export default routes;
