import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetConsultingType } from '../../api';
import { Login } from '../login/Login';

export interface LoginLoaderProps {
	handleUnmatch: () => void;
}

export const LoginLoader = ({ handleUnmatch }: LoginLoaderProps) => {
	const [isValidResort, setIsValidResort] = useState<boolean>();
	const { consultingTypeSlug } = useParams();

	useEffect(() => {
		apiGetConsultingType({ consultingTypeSlug }).then((result) => {
			if (result) setIsValidResort(true);
			else handleUnmatch();
		});
	}, [consultingTypeSlug, handleUnmatch]);

	if (isValidResort) {
		return <Login />;
	} else {
		return null;
	}
};
