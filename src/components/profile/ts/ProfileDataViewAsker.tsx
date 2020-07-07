import * as React from 'react';
import { useContext } from 'react';
import {
	translate,
	getResortTranslation,
	getAddictiveDrugsString,
	handleNumericTranslation
} from '../../../resources/ts/i18n/translate';
import { UserDataContext } from '../../../globalState';
import {
	convertUserDataObjectToArray,
	getAddictiveDrugsTranslatable,
	getUserDataTranslateBase
} from './profileHelpers';

export const ProfileDataViewAsker = () => {
	const { userData } = useContext(UserDataContext);
	const userSessionsData = userData.sessionData;
	const preparedUserSessionsData = convertUserDataObjectToArray(
		userSessionsData
	);

	const userConsultingTypesData = JSON.parse(
		`{
   "userId": "1de5282d-0a06-4152-aed8-1bcec95a3d0d",
   "userName": "u25asker17",
   "firstName": null,
   "lastName": null,
   "email": null,
   "absenceMessage": null,
   "agencies": null,
   "userRoles": [
      "offline_access",
      "uma_authorization",
      "user"
   ],
   "grantedAuthorities": [
      "AUTHORIZATION_USER_DEFAULT"
   ],
   "consultingTypes": {
      "0": {
         "isRegistered": true,
         "sessionData": {
            "addictiveDrugs": null,
            "age": null,
            "gender": null,
            "relation": null
         },
         "agency": {
            "id": 110,
            "name": "[U25] Freiburg",
            "postcode": "79102",
            "description": null,
            "teamAgency": true,
            "offline": false,
            "consultingType": 1
         }
      },
      "1": {
         "isRegistered": true,
         "sessionData": {
            "age": "3",
            "gender": "0",
            "state": "3"
         },
         "agency": {
            "id": 110,
            "name": "[U25] Freiburg",
            "postcode": "79102",
            "description": null,
            "teamAgency": true,
            "offline": false,
            "consultingType": 1
         }
      },
      "2": {
         "isRegistered": true,
         "sessionData": null,
         "agency": null
      },
      "3": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "4": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "5": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "6": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "7": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "8": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "9": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "10": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "11": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "12": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "13": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "14": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "15": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "16": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "17": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "18": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      },
      "19": {
         "isRegistered": false,
         "sessionData": null,
         "agency": null
      }
	},
	"inTeamAgency": false,
	"absent": false,
	"formalLanguage": false
}`
	);

	console.log('ProfileDataViewAsker userSessData', userSessionsData);
	console.log(
		'ProfileDataViewAsker preparedUserSessDat',
		preparedUserSessionsData
	);

	const newData = Object.keys(userConsultingTypesData.consultingTypes).map(
		function (key, value) {
			return userConsultingTypesData.consultingTypes[key].sessionData;
			// console.log(
			// 	'iterate',
			// 	key,
			// 	userConsultingTypesData.consultingTypes[key].sessionData
			// );
		}
	);
	console.log(
		'ProfileDataViewAsker new types',
		userConsultingTypesData,
		newData
	);

	return (
		<div className="profile__content__item profile__data">
			<p className="profile__content__title">
				{translate('profile.data.title')}
			</p>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.userName')}
				</p>
				<p className="profile__data__content">{userData.userName}</p>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.email')}
				</p>
				<p
					className={
						userData.email
							? `profile__data__content`
							: `profile__data__content profile__data__content--empty`
					}
				>
					{userData.email
						? userData.email
						: translate('profile.noContent')}
				</p>
			</div>

			{preparedUserSessionsData.map((resort, index) =>
				resort.value && Object.keys(resort.value).length > 0 ? (
					<div className="profile__data__itemWrapper" key={index}>
						<p className="profile__content__title">
							{getResortTranslation(parseInt(resort.type))}
						</p>
						{resort.value.map((item, index) => (
							<div className="profile__data__item" key={index}>
								<p className="profile__data__label">
									{translate('userProfile.data.' + item.type)}
								</p>
								<p
									className={
										item.value
											? `profile__data__content`
											: `profile__data__content profile__data__content--empty`
									}
								>
									{item.value
										? item.type === 'addictiveDrugs'
											? getAddictiveDrugsString(
													getAddictiveDrugsTranslatable(
														item.value
													)
											  )
											: handleNumericTranslation(
													getUserDataTranslateBase(
														parseInt(resort.type)
													),
													item.type,
													item.value
											  )
										: translate('profile.noContent')}
								</p>
							</div>
						))}
					</div>
				) : null
			)}
		</div>
	);
};
