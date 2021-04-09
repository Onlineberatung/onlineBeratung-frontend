export const isVoluntaryInfoSet = (sessionData, resortData) => {
	if (sessionData && resortData) {
		const sessionDataCopy = Object.assign({}, sessionData);
		if (resortData.requiredComponents) {
			Object.keys(resortData.requiredComponents).forEach((key) => {
				delete sessionDataCopy[key];
			});
		}
		const values = Object.values(sessionDataCopy);
		return values.some((value) => !!value);
	}
};
