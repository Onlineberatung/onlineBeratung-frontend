import * as React from 'react';
import { ComponentType, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetConsultingType } from '../../api';
import { Login } from '../login/Login';
import { StageProps } from '../stage/stage';

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
