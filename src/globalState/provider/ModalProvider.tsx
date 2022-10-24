import * as React from 'react';
import { createContext, useEffect, useState } from 'react';

export const ModalContext = createContext<any>(null);

export function ModalProvider(props) {
	const [closedTwoFactorNag, setClosedTwoFactorNag] = useState(false);
	const [closedReleaseNote, setClosedReleaseNote] = useState(false);

	useEffect(() => {
		setClosedTwoFactorNag(false);
		setClosedReleaseNote(false);
	}, []);

	return (
		<ModalContext.Provider
			value={{
				closedTwoFactorNag,
				setClosedTwoFactorNag,
				closedReleaseNote,
				setClosedReleaseNote
			}}
		>
			{props.children}
		</ModalContext.Provider>
	);
}
