import * as React from 'react';
import { useContext } from 'react';
import { UserDataContext } from '../../globalState';
import { useConsultingTypes } from '../../globalState/provider/ConsultingTypesProvider';
import {
	getAddictiveDrugsString,
	handleNumericTranslation,
	translate
} from '../../utils/translate';
import { Text } from '../text/Text';
import {
	getAddictiveDrugsTranslatable,
	getUserDataTranslateBase
} from './profileHelpers';

export const AskerConsultingTypeData = () => {
	const { userData } = useContext(UserDataContext);
	const consultingTypes = useConsultingTypes();

	const preparedUserData = Object.keys(userData.consultingTypes).map(
		(key) => {
			return userData.consultingTypes[key];
		}
	);

	return (
		<>
			{preparedUserData.map(
				(resort, index) =>
					resort.isRegistered &&
					resort.agency && (
						<div className="profile__data__itemWrapper" key={index}>
							<Text
								text={
									consultingTypes.find(
										(cur) =>
											cur.id ===
											resort.agency.consultingType
									)?.titles.default
								}
								type="divider"
							/>
							{resort.sessionData &&
								Object.keys(resort.sessionData).map(
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
																		resort
																			.agency
																			.consultingType
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
								)}
							<div className="profile__data__item">
								<p className="profile__data__label">
									{translate('profile.data.agency')}
								</p>
								<p className="profile__data__content">
									{resort.agency.name} <br />
									{resort.agency.postcode}
									{resort.agency.city
										? ' ' + resort.agency.city
										: ''}
								</p>
							</div>
						</div>
					)
			)}
		</>
	);
};
