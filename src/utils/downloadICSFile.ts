export const downloadICSFile = (filename: string, icsMSG: string) => {
	const link = document.createElement('a');
	link.download = `${filename}.ics`;
	link.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsMSG)}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
