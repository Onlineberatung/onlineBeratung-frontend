import { useEffect, useState } from 'react';

import EmbedSnippet from '@calcom/embed-snippet';

export default function useEmbed(embedJsUrl?: string) {
	const [globalCal, setGlobalCal] =
		useState<ReturnType<typeof EmbedSnippet>>();
	useEffect(() => {
		setGlobalCal(() => {
			return EmbedSnippet(embedJsUrl);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return globalCal;
}
