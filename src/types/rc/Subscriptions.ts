import { IUser } from './User';

export interface ISubscriptions {
	_id: string;
	E2EKey?: string;
	t: 'd' | 'c' | 'p' | 'l';
	ts: {
		$date: number;
	};
	ls: {
		$date: number;
	};
	name: string;
	rid: string;
	u: IUser;
	open: boolean;
	alert: boolean;
	roles?: any;
	unread: number;
	tunread?: number;
	tunreadGroup?: number;
	tunreadUser?: number;
	_updatedAt: {
		$date: number;
	};
	lr: {
		$date: number;
	};
	hideUnreadStatus: boolean;
	teamMain: boolean;
	teamId: string;
	userMentions: number;
	groupMentions: number;
	prid: string;
}
