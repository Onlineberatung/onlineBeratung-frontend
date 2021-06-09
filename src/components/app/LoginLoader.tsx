import * as React from 'react';
import { ComponentType, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetConsultingType } from '../../api';
import { Login } from '../login/Login';
import { StageProps } from '../stage/stage';

// Avoid matching strings like "beratung-hilfe.html"
// where we already know it's not a consulting type.
const CONSULTING_TYPE_SLUG_PATTERN = /^[\w\d-]+$/;

export interface LoginLoaderProps {
	handleUnmatch: () => void;
	stageComponent: ComponentType<StageProps>;
}

export const LoginLoader = ({
	handleUnmatch,
	stageComponent
}: LoginLoaderProps) => {
	const [isValidResort, setIsValidResort] = useState<boolean>();
	const { consultingTypeSlug } = useParams();

	useEffect(() => {
		if (!consultingTypeSlug.match(CONSULTING_TYPE_SLUG_PATTERN)) {
			handleUnmatch();
			return;
		}

		apiGetConsultingType({ consultingTypeSlug }).then((result) => {
			if (result) setIsValidResort(true);
			else handleUnmatch();
		});
	}, [consultingTypeSlug, handleUnmatch]);

	if (isValidResort) {
		return <Login stageComponent={stageComponent} />;
	} else {
		return null;
	}
};
