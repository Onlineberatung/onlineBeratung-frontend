import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetResortData } from '../../api';
import { Login } from '../login/Login';

export interface LoginLoaderProps {
	handleUnmatch: () => void;
}

export const LoginLoader = ({ handleUnmatch }: LoginLoaderProps) => {
	const [isValidResort, setIsValidResort] = useState<boolean>();
	const { resortName } = useParams();

	useEffect(() => {
		apiGetResortData({ resortName }).then((result) => {
			if (result) setIsValidResort(true);
			else handleUnmatch();
		});
	}, [resortName, handleUnmatch]);

	if (isValidResort) {
		return <Login />;
	} else {
		return null;
	}
};
