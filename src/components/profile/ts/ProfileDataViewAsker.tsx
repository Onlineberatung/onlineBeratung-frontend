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
	// const preparedUserSessionsData = convertUserDataObjectToArray(
	// 	userSessionsData
	// );

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
            "name": "Sucht Freiburg",
            "postcode": "79102",
            "description": null,
            "teamAgency": true,
            "offline": false,
            "consultingType": 0
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

	// console.log('old data userSessData', userSessionsData);
	// console.log(
	// 	'old data preparedUserSessDat',
	// 	preparedUserSessionsData
	// );

	console.log('new data mock', userConsultingTypesData);

	const newDataArray = Object.keys(
		userConsultingTypesData.consultingTypes
	).map((key) => {
		return userConsultingTypesData.consultingTypes[key];
	});

	console.log('new data array', newDataArray);

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

			{newDataArray.map((resort, index) =>
				resort.isRegistered && resort.agency ? (
					<div className="profile__data__itemWrapper" key={index}>
						<p className="profile__content__title">
							{getResortTranslation(index)}
						</p>
						{resort.sessionData
							? Object.keys(resort.sessionData).map(
									(item, itemIndex) => (
										<div
											className="profile__data__item"
											key={itemIndex}
										>
											<p className="profile__data__label">
												{translate(
													'userProfile.data.' + item
												)}
											</p>
											<p
												className={
													resort.sessionData[item]
														? `profile__data__content`
														: `profile__data__content profile__data__content--empty`
												}
											>
												{resort.sessionData[item]
													? item === 'addictiveDrugs'
														? getAddictiveDrugsString(
																getAddictiveDrugsTranslatable(
																	resort
																		.sessionData[
																		item
																	]
																)
														  )
														: handleNumericTranslation(
																getUserDataTranslateBase(
																	parseInt(
																		resort.type
																	)
																),
																item,
																resort
																	.sessionData[
																	item
																]
														  )
													: translate(
															'profile.noContent'
													  )}
											</p>
										</div>
									)
							  )
							: null}
						<div className="profile__data__item">
							<p className="profile__data__label">
								{translate('profile.data.agency')}
							</p>
							<p className="profile__data__content">
								{resort.agency.name} <br />
								{resort.agency.postcode}
							</p>
						</div>
					</div>
				) : null
			)}
		</div>
	);
};
