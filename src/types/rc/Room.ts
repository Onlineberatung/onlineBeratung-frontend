import { IUser } from './User';

export interface IRoom {
	_id: string;
	t: 'd' | 'l' | 'c' | 'p';
}

export interface IDirectChat extends IRoom {
	t: 'd';
}

export interface IChat extends IRoom {
	_id: string;
	t: 'c' | 'l';
	name: string;
	u: IUser;
	topic?: string;
	muted?: string[];
	jitsiTimeout?: any;
}

export interface IPrivateChat extends IRoom {
	_id: string;
	t: 'p';
	name: string;
	u: IUser;
	topic?: string;
	ro?: boolean;
	jitsiTimeout?: any;
}
