declare namespace LiveService {
	namespace Schemas {
		/**
		 * general used object for all possible incoming DTOs used for socket transfer
		 */
		export interface EventContent {}
		export type EventType =
			| 'anonymousEnquiryAccepted'
			| 'anonymousConversationFinished'
			| 'directMessage'
			| 'newAnonymousEnquiry'
			| 'videoCallRequest'
			| 'videoCallDeny';
		export interface LiveEventMessage {
			eventType: EventType;
			userIds: string[];
			eventContent?: /* general used object for all possible incoming DTOs used for socket transfer */ EventContent;
		}
		export interface StatusSource {
			/**
			 * represents the session status of the anonymous conversation where the anonymousConversationFinished event has been triggered
			 */
			finishConversationPhase: 'NEW' | 'IN_PROGRESS';
		}
		/**
		 * the request DTO for event type videoCallRequest
		 */
		export interface VideoCallRequestDTO {
			/**
			 * The url of the video server
			 * example:
			 * video.domain.com/44c7644a-5977-11eb-ae93-0242ac130002
			 */
			videoCallUrl: string;
			/**
			 * The username of the calling user
			 * example:
			 * consultant
			 */
			initiatorUsername: string;
			/**
			 * The Rocket.Chat user id of the calling user
			 * example:
			 * ag89h3tjkerg94t
			 */
			initiatorRcUserId: string;
			/**
			 * The Rocket.Chat room id of the session
			 * example:
			 * xGklslk2JJKK
			 */
			rcGroupId: string;
		}
	}
}
declare namespace Paths {
	namespace SendLiveEvent {
		export type RequestBody = LiveService.Schemas.LiveEventMessage;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $500 {}
		}
	}
}
