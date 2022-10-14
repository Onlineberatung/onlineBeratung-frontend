import { AUTHORITIES, hasUserAuthority } from '../../globalState';
import { TabsType } from '../../utils/tabsHelper';
import { BookingEventsBooked } from './components/BookingEventsBooked/bookingEventsBooked';
import { BookingEventsCanceled } from './components/BookingEventsCanceled/bookingEventsCanceled';
import { BookingEventsExpired } from './components/BookingEventsExpired/bookingEventsExpired';
import { BookingSettings } from './components/BookingSettings/bookingSettings';

const bookingRoutes: TabsType = [
	{
		title: 'booking.event.tab.booked',
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
		title: 'booking.event.tab.canceled',
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
		title: 'booking.event.tab.expired',
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
	},
	{
		title: 'booking.event.tab.settings',
		url: '/settings',
		condition: (userData) =>
			hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData),
		elements: [
			{
				component: BookingSettings,
				boxed: false,
				fullWidth: true
			}
		]
	}
];

export default bookingRoutes;
