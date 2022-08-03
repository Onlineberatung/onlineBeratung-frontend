export const downloadICSFile = (filename: string, icsMSG: string) => {
	const link = document.createElement('a');
	link.download = `${filename}.ics`;
	link.href = `data:text/calendar;",${escape(icsMSG)}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
