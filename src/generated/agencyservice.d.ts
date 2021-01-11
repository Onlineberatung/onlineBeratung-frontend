declare namespace AgencyService {
	namespace Schemas {
		export interface AgencyResponseDTO {
			/**
			 * example:
			 * 684
			 */
			id?: number; // int64
			/**
			 * example:
			 * Suchtberatung Freiburg
			 */
			name?: string;
			/**
			 * example:
			 * 79106
			 */
			postcode?: string;
			/**
			 * example:
			 * Bonn
			 */
			city?: string;
			/**
			 * example:
			 * Our agency provides help for the following topics: Lorem ipsum..
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
			 * 0
			 */
			consultingType?: number;
		}
	}
}
declare namespace Paths {
	namespace GetAgencies {
		namespace Parameters {
			/**
			 * example:
			 * 5
			 */
			export type ConsultingType = number; // int32
			/**
			 * example:
			 * 56789
			 */
			export type Postcode = string;
		}
		export interface QueryParameters {
			postcode: /**
			 * example:
			 * 56789
			 */
			Parameters.Postcode;
			consultingType: /**
			 * example:
			 * 5
			 */
			Parameters.ConsultingType /* int32 */;
		}
		namespace Responses {
			export type $200 = AgencyService.Schemas.AgencyResponseDTO[];
			export interface $400 {}
			export interface $500 {}
		}
	}
	namespace GetAgenciesByIds {
		namespace Parameters {
			export type AgencyIds = number /* int64 */[];
		}
		export interface PathParameters {
			agencyIds: Parameters.AgencyIds;
		}
		namespace Responses {
			export type $200 = AgencyService.Schemas.AgencyResponseDTO[];
			export interface $400 {}
			export interface $401 {}
			export interface $500 {}
		}
	}
}
