import * as React from 'react';
import { useContext } from 'react';
import { useConsultingTypes, UserDataContext } from '../../globalState';
import { handleNumericTranslation } from '../../utils/translate';
import { getUserDataTranslateBase } from './profileHelpers';
import { Headline } from '../headline/Headline';
import { Box } from '../box/Box';
import { useTranslation } from 'react-i18next';

export const AskerConsultingTypeData = () => {
	const { t: translate } = useTranslation([
		'common',
		'consultingTypes',
		'agencies'
	]);
	const { userData } = useContext(UserDataContext);
	const consultingTypes = useConsultingTypes();

	return (
		<>
			{Object.values(userData.consultingTypes).map(
				(resort: any, index) =>
					resort.isRegistered &&
					resort.agency && (
						<Box key={index}>
							<div
								className="profile__data__itemWrapper"
								key={index}
							>
								<div className="profile__content__title">
									<Headline
										className="pr--3"
										text={translate(
											[
												`consultingType.${resort.agency.consultingType}.titles.default`,
												`consultingType.fallback.titles.default`,
												consultingTypes.find(
													(cur) =>
														cur.id ===
														resort.agency
															.consultingType
												)?.titles.default
											],
											{ ns: 'consultingTypes' }
										)}
										semanticLevel="5"
									/>
								</div>
								{resort.sessionData &&
									Object.keys(resort.sessionData).map(
										(item, itemIndex) =>
											item === 'age' &&
											resort.sessionData[item] ===
												'null' ? null : (
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
															resort.sessionData[
																item
															]
																? `profile__data__content`
																: `profile__data__content profile__data__content--empty`
														}
													>
														{resort.sessionData[
															item
														]
															? translate(
																	handleNumericTranslation(
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
										{translate('profile.data.agency.label')}
									</p>
									<p className="profile__data__content">
										{translate(
											[
												`agency.${resort.agency.id}.name`,
												resort.agency.name
											],
											{ ns: 'agencies' }
										)}{' '}
										<br />
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
