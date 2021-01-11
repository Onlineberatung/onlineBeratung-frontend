declare namespace UploadService {
	namespace Schemas {
		export interface MasterKeyDto {
			/**
			 * example:
			 * sdj8wnFNASj324!ksldf9
			 */
			masterKey: string;
		}
	}
}
declare namespace Paths {
	namespace UpdateKey {
		export type RequestBody = UploadService.Schemas.MasterKeyDto;
		namespace Responses {
			export interface $202 {}
			export interface $401 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace UploadFileToFeedbackRoom {
		export interface HeaderParameters {
			RCToken: Parameters.RCToken;
			RCUserId: Parameters.RCUserId;
		}
		namespace Parameters {
			export type FeedbackRoomId = string;
			export type RCToken = string;
			export type RCUserId = string;
		}
		export interface PathParameters {
			feedbackRoomId: Parameters.FeedbackRoomId;
		}
		export interface RequestBody {
			/**
			 * A text message
			 */
			msg?: string;
			/**
			 * A description of the file
			 */
			description?: string;
			/**
			 * The thread message id (if you want upload a file to a thread)
			 */
			tmId?: string;
			/**
			 * File to upload
			 */
			file: string; // binary
			/**
			 * Flag, whether an email notification should be sent or not (true/false)
			 */
			sendNotification: string;
		}
		namespace Responses {
			export interface $201 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $413 {}
			export interface $415 {}
			export interface $500 {}
		}
	}
	namespace UploadFileToRoom {
		export interface HeaderParameters {
			RCToken: Parameters.RCToken;
			RCUserId: Parameters.RCUserId;
		}
		namespace Parameters {
			export type RCToken = string;
			export type RCUserId = string;
			export type RoomId = string;
		}
		export interface PathParameters {
			roomId: Parameters.RoomId;
		}
		export interface RequestBody {
			/**
			 * A text message
			 */
			msg?: string;
			/**
			 * A description of the file
			 */
			description?: string;
			/**
			 * The thread message id (if you want upload a file to a thread)
			 */
			tmId?: string;
			/**
			 * File to upload
			 */
			file: string; // binary
			/**
			 * Flag, whether an email notification should be sent or not (true/false)
			 */
			sendNotification: string;
		}
		namespace Responses {
			export interface $201 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $413 {}
			export interface $415 {}
			export interface $500 {}
		}
	}
}
