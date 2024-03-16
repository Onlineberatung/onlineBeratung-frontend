import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { apiGetConsultingTypeGroups } from '../../api/apiGetConsultingTypeGroups';
import { ConsultingTypeGroupInterface } from '../../globalState/interfaces/ConsultingTypeGroupInterface';
import { Stage } from '../stage/stage';
import { ConsultingTypesGroupChild } from './ConsultingTypesGroupChild';
import { ConsultingTypesOverlay } from './ConsultingTypesOverlay';
import './ConsultingTypes.styles.scss';
import useIsFirstVisit from '../../../utils/useIsFirstVisit';
import { Headline } from '../../../components/headline/Headline';
import { InfoIcon } from '../../../resources/img/icons';
import { LoadingIndicator } from '../../../components/loadingIndicator/LoadingIndicator';
import { SelectDropdown } from '../../../components/select/SelectDropdown';
import { StageLayout } from '../../../components/stageLayout/StageLayout';
import { Text } from '../../../components/text/Text';

export const ConsultingTypes = () => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);

	const [loadedConsultingTypeGroups, setLoadedConsultingTypeGroups] =
		useState<ConsultingTypeGroupInterface[]>([]);

	const [consultingTypeGroups, setConsultingTypeGroups] = useState<
		(ConsultingTypeGroupInterface & {
			id: string;
		})[]
	>([]);

	const [loading, setLoading] = useState(true);
	const [selectedGroupId, setSelectedGroupId] = useState<string>(null);
	const [expandedConsultingTypeId, setExpandedConsultingTypeId] =
		useState(null);
	const [isExplanationOverlayOpen, setIsExplanationOverlayOpen] =
		useState(false);
	const [selectedGroup, setSelectedGroup] = useState(null);

	useEffect(() => {
		if (selectedGroupId === null) {
			return;
		}
		setSelectedGroup(
			consultingTypeGroups.find((group) => group.id === selectedGroupId)
		);
	}, [selectedGroupId, consultingTypeGroups]);

	const handleGroupSelect = useCallback((item) => {
		setSelectedGroupId(item.value);
		setExpandedConsultingTypeId(undefined);
	}, []);

	const handleConsultingTypeToggle = useCallback(
		(consultingTypeId) => {
			setExpandedConsultingTypeId(
				consultingTypeId === expandedConsultingTypeId
					? undefined
					: consultingTypeId
			);
		},
		[expandedConsultingTypeId]
	);

	const handleExplanationOverlayToggle = () => {
		setIsExplanationOverlayOpen(!isExplanationOverlayOpen);
	};

	const sortConsultingTypeGroups = useCallback(
		(groups: ConsultingTypeGroupInterface[]) =>
			groups
				// Translate titles before sorting
				.map(
					(
						group
					): ConsultingTypeGroupInterface & {
						id: string;
					} => ({
						...group,
						id: group.consultingTypes
							.map((consultingType) => consultingType.id)
							.sort()
							.join('-'),
						title: translate(
							[
								`consultingTypeGroup.${group.title}.title`,
								group.title
							],
							{ ns: 'consultingTypes' }
						)
					})
				)
				.sort((a, b) => (a.title < b.title ? -1 : 1))
				.map((group) => ({
					...group,
					consultingTypes: group.consultingTypes
						.slice()
						// Translate titles before sorting
						.map((consultingType) => ({
							...consultingType,
							titles: {
								...consultingType.titles,
								long: translate(
									[
										`consultingType.${consultingType.id}.titles.long`,
										consultingType.titles.long
									],
									{ ns: 'consultingTypes' }
								),
								default: translate(
									[
										`consultingType.${consultingType.id}.titles.default`,
										consultingType.titles.default
									],
									{ ns: 'consultingTypes' }
								)
							}
						}))
						.sort((a, b) =>
							a.titles.long < b.titles.long ? -1 : 1
						)
				})),
		[translate]
	);

	useEffect(() => {
		apiGetConsultingTypeGroups()
			.then(setLoadedConsultingTypeGroups)
			.catch((error) => {
				console.log(error);
			});
	}, []);

	useEffect(() => {
		if (!loadedConsultingTypeGroups) {
			return;
		}

		setConsultingTypeGroups(
			sortConsultingTypeGroups(loadedConsultingTypeGroups)
		);
		setLoading(false);

		return () => {
			setLoading(true);
		};
	}, [loadedConsultingTypeGroups, sortConsultingTypeGroups]);

	const isFirstVisit = useIsFirstVisit();

	if (loading) {
		return null;
	}

	return (
		<StageLayout
			showLegalLinks
			showLoginLink
			stage={
				<Stage
					hasAnimation={isFirstVisit}
					isReady={consultingTypeGroups !== null}
				/>
			}
		>
			{consultingTypeGroups == null ? (
				<LoadingIndicator />
			) : (
				<div className="consultingTypes">
					<Headline
						semanticLevel="2"
						text={translate('consultingTypes.title')}
					/>
					<Text
						className="consultingTypes__intro"
						type="standard"
						text={translate('consultingTypes.intro')}
					/>
					<SelectDropdown
						className="consultingTypes__groupSelect"
						id="consultingTypeGroup"
						defaultValue={
							selectedGroup
								? {
										value: selectedGroupId,
										label: selectedGroup.title
									}
								: undefined
						}
						selectedOptions={consultingTypeGroups.map((group) => ({
							value: group.id,
							label: group.title
						}))}
						selectInputLabel={translate(
							'consultingTypes.selectGroup'
						)}
						handleDropdownSelect={handleGroupSelect}
						useIconOption={false}
						isSearchable={false}
						menuPlacement="bottom"
					/>
					<div className="consultingTypes__children">
						{selectedGroup !== null &&
							selectedGroup.consultingTypes.map(
								(consultingType) => (
									<ConsultingTypesGroupChild
										key={consultingType.id}
										isExpanded={
											expandedConsultingTypeId ===
											consultingType.id
										}
										handleToggleExpanded={() =>
											handleConsultingTypeToggle(
												consultingType.id
											)
										}
										groupChild={consultingType}
									/>
								)
							)}
					</div>
					<button
						onClick={handleExplanationOverlayToggle}
						type="button"
						className="button-as-link consultingTypes__learnMore"
					>
						<InfoIcon
							title={translate('consultingTypes.info')}
							aria-label={translate('consultingTypes.info')}
							className="consultingTypes__learnMoreIcon"
						/>
						<Text
							className="consultingTypes__learnMoreText"
							text={translate('consultingTypes.learnMore')}
							type="infoLargeStandard"
						/>
					</button>
				</div>
			)}

			{isExplanationOverlayOpen && (
				<ConsultingTypesOverlay
					handleOverlay={handleExplanationOverlayToggle}
				/>
			)}
		</StageLayout>
	);
};
