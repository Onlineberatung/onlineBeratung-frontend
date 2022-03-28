import * as React from 'react';
import { ComponentType, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetConsultingType } from '../../api';
import { Login } from '../login/Login';
import { StageProps } from '../stage/stage';
import { APP_PATH } from '../../resources/scripts/config';
import { LegalLinkInterface } from '../../globalState';

// Avoid matching strings like "beratung-hilfe.html"
// where we already know it's not a consulting type.
const CONSULTING_TYPE_SLUG_PATTERN = /^[\w\d-]+$/;

// Make sure that the `APP_PATH` is not considered a consulting type
const isValidConsultingTypeSlug = (slug: string): boolean => {
	return slug !== APP_PATH && CONSULTING_TYPE_SLUG_PATTERN.test(slug);
};

export interface LoginLoaderProps {
	handleUnmatch: () => void;
	legalLinks: Array<LegalLinkInterface>;
	stageComponent: ComponentType<StageProps>;
}

export const LoginLoader = ({
	handleUnmatch,
	legalLinks,
	stageComponent
}: LoginLoaderProps) => {
	const [isValidConsultingType, setIsValidConsultingType] =
		useState<boolean>();
	const { consultingTypeSlug } = useParams();

	useEffect(() => {
		if (!consultingTypeSlug) {
			setIsValidConsultingType(true);
			return;
		}

		if (!isValidConsultingTypeSlug(consultingTypeSlug)) {
			handleUnmatch();
			return;
		}

		apiGetConsultingType({ consultingTypeSlug }).then((result) => {
			if (result) setIsValidConsultingType(true);
			else handleUnmatch();
		});
	}, [consultingTypeSlug, handleUnmatch]);

	if (isValidConsultingType) {
		return (
			<Login legalLinks={legalLinks} stageComponent={stageComponent} />
		);
	} else {
		return null;
	}
};
