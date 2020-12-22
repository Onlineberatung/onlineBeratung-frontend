declare namespace LiveService {
	namespace Schemas {
		export type EventType = 'directMessage';
	}
}
declare namespace Paths {
	namespace SendLiveEvent {
		namespace Parameters {
			export type UserIds = string[];
		}
		export interface QueryParameters {
			userIds: Parameters.UserIds;
		}
		export type RequestBody = LiveService.Schemas.EventType;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $500 {}
		}
	}
}
