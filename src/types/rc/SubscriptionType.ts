export type SubscriptionType = {
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
	u: {
		_id: string;
		username: string;
	};
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
	_id: string;
	lr: {
		$date: number;
	};
	hideUnreadStatus: boolean;
	teamMain: boolean;
	teamId: string;
	userMentions: number;
	groupMentions: number;
	prid: string;
};
