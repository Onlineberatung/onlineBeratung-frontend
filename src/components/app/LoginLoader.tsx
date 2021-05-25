import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetConsultingType } from '../../api';
import { Login } from '../login/Login';

// Avoid matching strings like "beratung-hilfe.html"
// where we already know it's not a consulting type.
const CONSULTING_TYPE_SLUG_PATTERN = /^[\w\d-]+$/;

export interface LoginLoaderProps {
	handleUnmatch: () => void;
}

export const LoginLoader = ({ handleUnmatch }: LoginLoaderProps) => {
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
		return <Login />;
	} else {
		return null;
	}
};
