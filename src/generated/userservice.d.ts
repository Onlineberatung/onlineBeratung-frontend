declare namespace UserService {
	namespace Schemas {
		export interface AbsenceDTO {
			/**
			 * example:
			 * true
			 */
			absent: boolean;
			/**
			 * example:
			 * Ich bin abwesend vom...bis.
			 */
			message?: string;
		}
		export interface AgencyDTO {
			/**
			 * example:
			 * 153918
			 */
			id?: number; // int64
			/**
			 * example:
			 * Alkohol-Beratung
			 */
			name?: string;
			/**
			 * example:
			 * 53113
			 */
			postcode?: string;
			/**
			 * example:
			 * Bonn
			 */
			city?: string;
			/**
			 * example:
			 * Our agency provides help for the following topics..
			 */
			description?: string;
			/**
			 * example:
			 * false
			 */
			teamAgency?: boolean;
			/**
			 * example:
			 * false
			 */
			offline?: boolean;
			/**
			 * example:
			 * 1
			 */
			consultingType?: number;
		}
		export interface AliasMessageDTO {
			forwardMessageDTO?: ForwardMessageDTO;
			videoCallMessageDTO?: VideoCallMessageDTO;
			messageType?: MessageType;
		}
		export interface ChatDTO {
			/**
			 * example:
			 * Wöchentliche Drogenberatung
			 */
			topic: string;
			/**
			 * example:
			 * 2019-10-23T00:00:00.000Z
			 */
			startDate: string; // date
			/**
			 * example:
			 * 725
			 */
			startTime: string; // time
			/**
			 * example:
			 * 120
			 */
			duration: number;
			/**
			 * example:
			 * false
			 */
			repetitive: boolean;
		}
		export interface ChatInfoResponseDTO {
			/**
			 * example:
			 * 153918
			 */
			id: number; // int64
			/**
			 * example:
			 * xGklslk2JJKK
			 */
			groupId: string;
			/**
			 * example:
			 * false
			 */
			active: boolean;
		}
		export interface ChatMemberResponseDTO {
			_id?: string;
			status?: string;
			username?: string;
			name?: string;
			utcOffset?: string;
		}
		export interface ChatMembersResponseDTO {
			members?: ChatMemberResponseDTO[];
		}
		export interface ConsultantResponseDTO {
			/**
			 * example:
			 * aadc0ecf-c048-4bfc-857d-8c9b2e425500
			 */
			consultantId?: string;
			/**
			 * example:
			 * Max
			 */
			firstName?: string;
			/**
			 * example:
			 * Mustermann
			 */
			lastName?: string;
		}
		export interface ConsultantSessionDTO {
			/**
			 * example:
			 * 153918
			 */
			id?: number; // int64
			/**
			 * example:
			 * 100
			 */
			agencyId?: number; // int64
			/**
			 * example:
			 * 1
			 */
			consultingType?: number;
			/**
			 * example:
			 * 0
			 */
			status?: number;
			/**
			 * example:
			 * 79098
			 */
			postcode?: string;
			/**
			 * Rocket.Chat room ID
			 * example:
			 * xGklslk2JJKK
			 */
			groupId?: string;
			/**
			 * Rocket.Chat feedback room ID
			 * example:
			 * 8ertjlasdKJA
			 */
			feedbackGroupId?: string;
			/**
			 * keycloak id of assigned consultant
			 * example:
			 * 926b9777-4eef-443d-925a-4aa534797bd7
			 */
			consultantId?: string;
			/**
			 * Rocket.Chat ID of assigned consultant
			 * example:
			 * 8ertjlasdKJA
			 */
			consultantRcId?: string;
			/**
			 * asker keycloak id
			 * example:
			 * 926b9777-4eef-443d-925a-4aa534797bd7
			 */
			askerId?: string;
			/**
			 * asker Rocket.Chat ID
			 * example:
			 * 8ertjlasdKJA
			 */
			askerRcId?: string;
			/**
			 * asker username
			 * example:
			 * asker123
			 */
			askerUserName?: string;
			/**
			 * example:
			 * false
			 */
			isTeamSession?: boolean;
			/**
			 * example:
			 * true
			 */
			isMonitoring?: boolean;
		}
		export interface ConsultantSessionListResponseDTO {
			sessions: ConsultantSessionResponseDTO[];
			/**
			 * Session value where to start from in the query (0 = first item)
			 */
			offset: number;
			/**
			 * Number of sessions which are being returned
			 */
			count: number;
			/**
			 * Total amount of sessions the consultant has
			 */
			total: number;
		}
		export interface ConsultantSessionResponseDTO {
			session?: SessionDTO;
			chat?: UserChatDTO;
			user?: SessionUserDTO;
			consultant?: SessionConsultantForConsultantDTO;
			latestMessage?: Date;
		}
		export interface ConsultingTypeMap {
			value?: unknown;
		}
		export interface CreateChatResponseDTO {
			/**
			 * example:
			 * WCET6GWir78pNMyyD
			 */
			groupId: string;
			/**
			 * example:
			 * https://{baseUrl}}/{consultingTypeName}/GEYDA
			 */
			chatLink: string;
		}
		export interface Date {}
		export interface DeleteUserAccountDTO {
			/**
			 * example:
			 * p@ssw0rd
			 */
			password: string;
		}
		export interface EnquiryMessageDTO {
			/**
			 * example:
			 * Lorem ipsum dolor sit amet, consetetur...
			 */
			message: string;
		}
		export interface ForwardMessageDTO {
			/**
			 * example:
			 * Lorem ipsum dolor sit amet, consetetur...
			 */
			message: string;
			/**
			 * Full qualified timestamp
			 * example:
			 * 2018-11-15T09:33:00.057Z
			 */
			timestamp: string;
			/**
			 * example:
			 * asker23
			 */
			username: string;
			/**
			 * example:
			 * ag89h3tjkerg94t
			 */
			rcUserId: string;
		}
		export interface HttpStatus {}
		export interface MandatorySessionDataDTO {
			/**
			 * mandatory depending on the consulting type
			 * example:
			 * 17
			 */
			age?: string;
			/**
			 * mandatory depending on the consulting type
			 * example:
			 * 8
			 */
			state?: string;
		}
		export interface MasterKeyDTO {
			/**
			 * example:
			 * sdj8wnFNASj324!ksldf9
			 */
			masterKey: string;
		}
		export type MessageType =
			| 'FURTHER_STEPS'
			| 'UPDATE_SESSION_DATA'
			| 'FORWARD'
			| 'VIDEOCALL';
		export interface MobileTokenDTO {
			/**
			 * example:
			 * 8cc2058
			 */
			token?: string;
		}
		export interface MonitoringDTO {
			additionalProperties?: Properties;
		}
		export interface NewMessageNotificationDTO {
			/**
			 * example:
			 * fR2Rz7dmWmHdXE8uz
			 */
			rcGroupId: string;
		}
		export interface NewRegistrationDto {
			/**
			 * example:
			 * 79098
			 */
			postcode: string;
			/**
			 * example:
			 * 232
			 */
			agencyId: number; // int64
			/**
			 * example:
			 * 1
			 */
			consultingType: string;
		}
		export interface NewRegistrationResponseDto {
			sessionId?: number; // int64
			status?: HttpStatus;
		}
		export interface PasswordDTO {
			/**
			 * example:
			 * oldpass@w0rd
			 */
			oldPassword: string;
			/**
			 * example:
			 * newpass@w0rd
			 */
			newPassword: string;
		}
		export interface Properties {
			value?: unknown;
		}
		export interface SessionAttachmentDTO {
			/**
			 * example:
			 * image/png
			 */
			fileType?: string;
			/**
			 * example:
			 * /9j/2wBDAAYEBQYFBAYGBQY
			 */
			imagePreview?: string;
			/**
			 * example:
			 * true
			 */
			fileReceived?: boolean;
		}
		export interface SessionConsultantForConsultantDTO {
			/**
			 * example:
			 * 153918
			 */
			id?: string;
			/**
			 * example:
			 * Max
			 */
			firstName?: string;
			/**
			 * example:
			 * Mustermann
			 */
			lastName?: string;
		}
		export interface SessionConsultantForUserDTO {
			/**
			 * example:
			 * beraterXYZ
			 */
			username?: string;
			/**
			 * example:
			 * true
			 */
			isAbsent?: boolean;
			/**
			 * example:
			 * Bin nicht da
			 */
			absenceMessage?: string;
		}
		export interface SessionDTO {
			/**
			 * example:
			 * 153918
			 */
			id: number; // int64
			/**
			 * example:
			 * 100
			 */
			agencyId: number; // int64
			/**
			 * example:
			 * 1
			 */
			consultingType: number;
			/**
			 * 0 = INITIAL, 1 = NEW, 2 = IN PROGRESS, 3 = DONE
			 * example:
			 * 0
			 */
			status: number;
			/**
			 * example:
			 * 79098
			 */
			postcode?: string;
			/**
			 * Rocket.Chat room ID
			 * example:
			 * xGklslk2JJKK
			 */
			groupId?: string;
			/**
			 * Rocket.Chat feedback room ID
			 * example:
			 * 8ertjlasdKJA
			 */
			feedbackGroupId?: string;
			/**
			 * asker Rocket.Chat ID
			 * example:
			 * 8ertjlasdKJA
			 */
			askerRcId?: string;
			/**
			 * example:
			 * Thanks for the answer
			 */
			lastMessage?: string;
			/**
			 * example:
			 * 1539184948
			 */
			messageDate?: number; // int64
			/**
			 * example:
			 * false
			 */
			messagesRead?: boolean;
			/**
			 * example:
			 * true
			 */
			feedbackRead?: boolean;
			/**
			 * example:
			 * false
			 */
			isTeamSession?: boolean;
			/**
			 * example:
			 * true
			 */
			monitoring?: boolean;
			/**
			 * example:
			 * ANONYMOUS
			 */
			registrationType: string;
			/**
			 * example:
			 * 2021-05-11T15:29:37.000Z
			 */
			createDate?: string;
			attachment?: SessionAttachmentDTO;
			videoCallMessageDTO?: VideoCallMessageDTO;
		}
		export interface SessionDataDTO {
			/**
			 * mandatory depending on the consulting type
			 * example:
			 * 17
			 */
			age?: string;
			/**
			 * mandatory depending on the consulting type
			 * example:
			 * 8
			 */
			state?: string;
			/**
			 * comma separated list of addictive drug IDs
			 * example:
			 * 2,4
			 */
			addictiveDrugs?: string;
			/**
			 * example:
			 * 2
			 */
			relation?: string;
			/**
			 * example:
			 * 0
			 */
			gender?: string;
		}
		export interface SessionUserDTO {
			/**
			 * example:
			 * max94
			 */
			username?: string;
			/**
			 * LinkedHashMap<String, Object>
			 */
			sessionData?: string;
		}
		export interface UpdateChatResponseDTO {
			/**
			 * example:
			 * WCET6GWir78pNMyyD
			 */
			groupId: string;
			/**
			 * example:
			 * https://{baseUrl}}/{consultingTypeName}/GEYDA
			 */
			chatLink: string;
		}
		export interface UpdateConsultantDTO {
			/**
			 * example:
			 * Max
			 */
			firstname: string;
			/**
			 * example:
			 * Mustermann
			 */
			lastname: string;
			/**
			 * example:
			 * maxmuster@mann.com
			 */
			email: string; // email
			/**
			 * Added this manually since generator is not working at the moment
			 * example:
			 * ['de','en']
			 */
			languages: string[];
		}
		export interface UserChatDTO {
			/**
			 * example:
			 * 153918
			 */
			id: number; // int64
			/**
			 * example:
			 * Drugs
			 */
			topic: string;
			/**
			 * example:
			 * 2019-10-23T00:00:00.000Z
			 */
			startDate: string; // date
			/**
			 * example:
			 * 725
			 */
			startTime: string; // time
			/**
			 * example:
			 * 120
			 */
			duration: number;
			/**
			 * example:
			 * false
			 */
			repetitive: boolean;
			/**
			 * example:
			 * false
			 */
			active: boolean;
			/**
			 * example:
			 * 0
			 */
			consultingType: number;
			/**
			 * example:
			 * Thanks for the answer
			 */
			lastMessage?: string;
			/**
			 * example:
			 * 1539184948
			 */
			messageDate?: number; // int64
			/**
			 * example:
			 * false
			 */
			messagesRead?: boolean;
			/**
			 * example:
			 * xGklslk2JJKK
			 */
			groupId: string;
			attachment?: SessionAttachmentDTO;
			/**
			 * example:
			 * false
			 */
			subscribed?: boolean;
			moderators?: string[];
			startDateWithTime?: string; // date-time
		}
		export interface UserDTO {
			/**
			 * mandatory depending on the consulting type
			 * example:
			 * 17
			 */
			age?: string;
			/**
			 * mandatory depending on the consulting type
			 * example:
			 * 8
			 */
			state?: string;
			/**
			 * example:
			 * max94
			 */
			username: string;
			/**
			 * example:
			 * 79098
			 */
			postcode: string;
			/**
			 * example:
			 * 15
			 */
			agencyId: number; // int64
			/**
			 * example:
			 * pass@w0rd
			 */
			password: string; // password
			/**
			 * example:
			 * true
			 */
			termsAccepted: string;
			/**
			 * example:
			 * 3
			 */
			consultingType: string;
		}
		export interface UserDataResponseDTO {
			/**
			 * example:
			 * ajsd89-sdf9-sadk-as8j-asdf8jo
			 */
			userId?: string;
			/**
			 * example:
			 * max.muster
			 */
			userName?: string;
			/**
			 * example:
			 * Max
			 */
			firstName?: string;
			/**
			 * example:
			 * Mustermann
			 */
			lastName?: string;
			/**
			 * example:
			 * maxmuster@mann.com
			 */
			email?: string; // email
			/**
			 * example:
			 * false
			 */
			isAbsent?: boolean;
			/**
			 * example:
			 * true
			 */
			isFormalLanguage?: boolean;
			/**
			 * example:
			 * Bin mal weg...
			 */
			absenceMessage?: string;
			/**
			 * example:
			 * true
			 */
			isInTeamAgency?: boolean;
			agencies?: AgencyDTO[];
			userRoles?: string[];
			grantedAuthorities?: string[];
			consultingTypes?: ConsultingTypeMap;
			/**
			 * Is true if consultant has at least one consulting type containing anonymous conversations active
			 * example:
			 * true
			 */
			hasAnonymousConversations?: boolean;
		}
		export interface UserSessionListResponseDTO {
			sessions?: UserSessionResponseDTO[];
		}
		export interface UserSessionResponseDTO {
			session?: SessionDTO;
			chat?: UserChatDTO;
			agency?: AgencyDTO;
			consultant?: SessionConsultantForUserDTO;
			latestMessage?: Date;
		}
		export interface VideoCallMessageDTO {
			eventType: 'IGNORED_CALL';
			/**
			 * example:
			 * consultant23
			 */
			initiatorUserName: string;
			/**
			 * example:
			 * ag89h3tjkerg94t
			 */
			initiatorRcUserId: string;
		}
	}
}
declare namespace Paths {
	namespace AcceptEnquiry {
		export interface HeaderParameters {
			RCUserId: Parameters.RCUserId;
		}
		namespace Parameters {
			export type RCUserId = string;
			export type SessionId = number; // int64
		}
		export interface PathParameters {
			sessionId: Parameters.SessionId /* int64 */;
		}
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace AssignSession {
		namespace Parameters {
			export type ConsultantId = string;
			export type SessionId = number; // int64
		}
		export interface PathParameters {
			sessionId: Parameters.SessionId /* int64 */;
			consultantId: Parameters.ConsultantId;
		}
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace CreateChat {
		export type RequestBody = UserService.Schemas.ChatDTO;
		namespace Responses {
			export type $201 = UserService.Schemas.CreateChatResponseDTO;
			export interface $400 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace CreateEnquiryMessage {
		export interface HeaderParameters {
			RCToken: Parameters.RCToken;
			RCUserId: Parameters.RCUserId;
		}
		namespace Parameters {
			export type RCToken = string;
			export type RCUserId = string;
			export type SessionId = number; // int64
		}
		export interface PathParameters {
			sessionId: Parameters.SessionId /* int64 */;
		}
		export type RequestBody = UserService.Schemas.EnquiryMessageDTO;
		namespace Responses {
			export interface $201 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace DeactivateAndFlagUserAccountForDeletion {
		export type RequestBody = UserService.Schemas.DeleteUserAccountDTO;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
	namespace FetchSessionForConsultant {
		namespace Parameters {
			export type SessionId = number; // int64
		}
		export interface PathParameters {
			sessionId: Parameters.SessionId /* int64 */;
		}
		namespace Responses {
			export type $200 = UserService.Schemas.ConsultantSessionDTO;
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $404 {}
			export interface $500 {}
		}
	}
	namespace GetChat {
		namespace Parameters {
			export type ChatId = number; // int64
		}
		export interface PathParameters {
			chatId: Parameters.ChatId /* int64 */;
		}
		namespace Responses {
			export type $200 = UserService.Schemas.ChatInfoResponseDTO;
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $404 {}
			export interface $500 {}
		}
	}
	namespace GetChatMembers {
		namespace Parameters {
			export type ChatId = number; // int64
		}
		export interface PathParameters {
			chatId: Parameters.ChatId /* int64 */;
		}
		namespace Responses {
			export type $200 = UserService.Schemas.ChatMembersResponseDTO;
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $404 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace GetConsultants {
		namespace Parameters {
			export type AgencyId = number; // int64
		}
		export interface QueryParameters {
			agencyId: Parameters.AgencyId /* int64 */;
		}
		namespace Responses {
			export type $200 = UserService.Schemas.ConsultantResponseDTO[];
			export interface $204 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
	namespace GetMonitoring {
		namespace Parameters {
			export type SessionId = number; // int64
		}
		export interface PathParameters {
			sessionId: Parameters.SessionId /* int64 */;
		}
		namespace Responses {
			export type $200 = UserService.Schemas.MonitoringDTO;
			export interface $204 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
	namespace GetSessionsForAuthenticatedConsultant {
		export interface HeaderParameters {
			RCToken: Parameters.RCToken;
		}
		namespace Parameters {
			export type Count = number;
			export type Filter = string;
			export type Offset = number;
			export type RCToken = string;
			export type Status = number;
		}
		export interface QueryParameters {
			status?: Parameters.Status;
			offset: Parameters.Offset;
			count: Parameters.Count;
			filter: Parameters.Filter;
		}
		namespace Responses {
			export type $200 =
				UserService.Schemas.ConsultantSessionListResponseDTO;
			export interface $204 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
	namespace GetSessionsForAuthenticatedUser {
		export interface HeaderParameters {
			RCToken: Parameters.RCToken;
		}
		namespace Parameters {
			export type RCToken = string;
		}
		namespace Responses {
			export type $200 = UserService.Schemas.UserSessionListResponseDTO;
			export interface $204 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
	namespace GetTeamSessionsForAuthenticatedConsultant {
		export interface HeaderParameters {
			RCToken: Parameters.RCToken;
		}
		namespace Parameters {
			export type Count = number;
			export type Filter = string;
			export type Offset = number;
			export type RCToken = string;
		}
		export interface QueryParameters {
			offset: Parameters.Offset;
			count: Parameters.Count;
			filter: Parameters.Filter;
		}
		namespace Responses {
			export type $200 =
				UserService.Schemas.ConsultantSessionListResponseDTO;
			export interface $204 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
	namespace GetUserData {
		namespace Responses {
			export type $200 = UserService.Schemas.UserDataResponseDTO;
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
	namespace ImportAskers {
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $500 {}
		}
	}
	namespace ImportAskersWithoutSession {
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $500 {}
		}
	}
	namespace ImportConsultants {
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $500 {}
		}
	}
	namespace JoinChat {
		namespace Parameters {
			export type ChatId = number; // int64
		}
		export interface PathParameters {
			chatId: Parameters.ChatId /* int64 */;
		}
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $404 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace LeaveChat {
		namespace Parameters {
			export type ChatId = number; // int64
		}
		export interface PathParameters {
			chatId: Parameters.ChatId /* int64 */;
		}
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $404 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace RegisterNewConsultingType {
		export interface HeaderParameters {
			RCToken: Parameters.RCToken;
			RCUserId: Parameters.RCUserId;
		}
		namespace Parameters {
			export type RCToken = string;
			export type RCUserId = string;
		}
		export type RequestBody = UserService.Schemas.NewRegistrationDto;
		namespace Responses {
			export type $201 = UserService.Schemas.NewRegistrationResponseDto;
			export interface $400 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace RegisterUser {
		export type RequestBody = UserService.Schemas.UserDTO;
		namespace Responses {
			export interface $201 {}
			export interface $400 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace SendLiveEvent {
		namespace Parameters {
			export type RcGroupId = string;
		}
		export interface QueryParameters {
			rcGroupId: Parameters.RcGroupId;
		}
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace SendNewFeedbackMessageNotification {
		export type RequestBody = UserService.Schemas.NewMessageNotificationDTO;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace SendNewMessageNotification {
		export type RequestBody = UserService.Schemas.NewMessageNotificationDTO;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace StartChat {
		namespace Parameters {
			export type ChatId = number; // int64
		}
		export interface PathParameters {
			chatId: Parameters.ChatId /* int64 */;
		}
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace StopChat {
		namespace Parameters {
			export type ChatId = number; // int64
		}
		export interface PathParameters {
			chatId: Parameters.ChatId /* int64 */;
		}
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace UpdateAbsence {
		export type RequestBody = UserService.Schemas.AbsenceDTO;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
	namespace UpdateChat {
		namespace Parameters {
			export type ChatId = number; // int64
		}
		export interface PathParameters {
			chatId: Parameters.ChatId /* int64 */;
		}
		export type RequestBody = UserService.Schemas.ChatDTO;
		namespace Responses {
			export type $200 = UserService.Schemas.UpdateChatResponseDTO;
			export interface $400 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace UpdateConsultantData {
		export type RequestBody = UserService.Schemas.UpdateConsultantDTO;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace UpdateEmailAddress {
		export type RequestBody = string;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace UpdateKey {
		export type RequestBody = UserService.Schemas.MasterKeyDTO;
		namespace Responses {
			export interface $202 {}
			export interface $401 {}
			export interface $403 {}
			export interface $409 {}
			export interface $500 {}
		}
	}
	namespace UpdateMobileToken {
		export type RequestBody = UserService.Schemas.MobileTokenDTO;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
	namespace UpdateMonitoring {
		namespace Parameters {
			export type SessionId = number; // int64
		}
		export interface PathParameters {
			sessionId: Parameters.SessionId /* int64 */;
		}
		export type RequestBody = UserService.Schemas.MonitoringDTO;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
	namespace UpdatePassword {
		export type RequestBody = UserService.Schemas.PasswordDTO;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $500 {}
		}
	}
	namespace UpdateSessionData {
		namespace Parameters {
			export type SessionId = number; // int64
		}
		export interface PathParameters {
			sessionId: Parameters.SessionId /* int64 */;
		}
		export type RequestBody = UserService.Schemas.SessionDataDTO;
		namespace Responses {
			export interface $200 {}
			export interface $400 {}
			export interface $401 {}
			export interface $403 {}
			export interface $404 {}
			export interface $500 {}
		}
	}
}
