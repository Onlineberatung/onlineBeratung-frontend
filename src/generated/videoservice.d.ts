declare namespace VideoService {
	namespace Schemas {
		export interface CreateVideoCallDTO {
			sessionId: number; // int64
		}
		export interface CreateVideoCallResponseDTO {
			/**
			 * Moderator video call URL containing moderator role and guest join link
			 * example:
			 * https://video.call/332a573d-7c74-4080-8353-7954eca066f9?jwt={moderatorToken}
			 */
			moderatorVideoCallUrl: string;
		}
		export interface RejectVideoCallDTO {
			/**
			 * example:
			 * tb89h3tjkerg967
			 */
			rcGroupId: string;
			/**
			 * example:
			 * ag89h3tjkerg94t
			 */
			initiatorRcUserId: string;
			/**
			 * example:
			 * consultant23
			 */
			initiatorUsername: string;
		}
	}
}
declare namespace Paths {
	namespace CreateVideoCall {
		export interface HeaderParameters {
			RCUserId: Parameters.RCUserId;
		}
		namespace Parameters {
			export type RCUserId = string;
		}
		export type RequestBody = VideoService.Schemas.CreateVideoCallDTO;
		namespace Responses {
			export type $201 = VideoService.Schemas.CreateVideoCallResponseDTO;
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $404 {}
			export interface $500 {}
		}
	}
	namespace RejectVideoCall {
		export type RequestBody = VideoService.Schemas.RejectVideoCallDTO;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
}
