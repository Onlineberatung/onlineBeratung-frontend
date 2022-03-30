import * as React from 'react';
import { useContext } from 'react';
import { useConsultingTypes, UserDataContext } from '../../globalState';
import {
	getAddictiveDrugsString,
	handleNumericTranslation,
	translate
} from '../../utils/translate';
import {
	getAddictiveDrugsTranslatable,
	getUserDataTranslateBase
} from './profileHelpers';
import { Headline } from '../headline/Headline';
import { Box } from '../box/Box';

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
						<Box>
							<div
								className="profile__data__itemWrapper"
								key={index}
							>
								<div className="profile__content__title">
									<Headline
										className="pr--3"
										text={
											consultingTypes.find(
												(cur) =>
													cur.id ===
													resort.agency.consultingType
											)?.titles.default
										}
										semanticLevel="5"
									/>
								</div>
								{resort.sessionData &&
									Object.keys(resort.sessionData).map(
										(item, itemIndex) => (
											<div
												className="profile__data__item"
												key={itemIndex}
											>
												<p className="profile__data__label">
													{translate(
														'userProfile.data.' +
															item
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
														? item ===
														  'addictiveDrugs'
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
						</Box>
					)
			)}
		</>
	);
};
