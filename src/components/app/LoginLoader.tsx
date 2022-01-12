import * as React from 'react';
import { ComponentType, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetConsultingType } from '../../api';
import { Login } from '../login/Login';
import { StageProps } from '../stage/stage';
import { APP_PATH } from '../../resources/scripts/config';
import { LegalInformationLinksProps } from '../login/LegalInformationLinks';

// Avoid matching strings like "beratung-hilfe.html"
// where we already know it's not a consulting type.
const CONSULTING_TYPE_SLUG_PATTERN = /^[\w\d-]+$/;

// Make sure that the `APP_PATH` is not considered a consulting type
const isValidConsultingTypeSlug = (slug: string): boolean => {
	return slug !== APP_PATH && CONSULTING_TYPE_SLUG_PATTERN.test(slug);
};

export interface LoginLoaderProps {
	handleUnmatch: () => void;
	legalComponent: ComponentType<LegalInformationLinksProps>;
	stageComponent: ComponentType<StageProps>;
	showAnimation: boolean;
}

export const LoginLoader = ({
	handleUnmatch,
	legalComponent,
	stageComponent,
	showAnimation = true
}: LoginLoaderProps) => {
	const [isValidResort, setIsValidResort] = useState<boolean>();
	const { consultingTypeSlug } = useParams();

	useEffect(() => {
		if (consultingTypeSlug === 'login') {
			setIsValidResort(true);
			return;
		}

		if (!isValidConsultingTypeSlug(consultingTypeSlug)) {
			handleUnmatch();
			return;
		}

		apiGetConsultingType({ consultingTypeSlug }).then((result) => {
			if (result) setIsValidResort(true);
			else handleUnmatch();
		});
	}, [consultingTypeSlug, handleUnmatch]);

	if (isValidResort) {
		return (
			<Login
				legalComponent={legalComponent}
				stageComponent={stageComponent}
				showAnimation={showAnimation}
			/>
		);
	} else {
		return null;
	}
};
