const isUndefined = (obj: any) => obj === undefined;

const setNestedVal = (obj: any, path: any, value: any) => {
	const pathLength = path.length;
	switch (pathLength) {
		case 1:
			obj[path[0]] = value;
			break;
		case 2:
			if (isUndefined(obj[path[0]])) {
				obj[path[0]] = {};
			}
			obj[path[0]][path[1]] = value;
			break;
		case 3:
			if (isUndefined(obj[path[0]])) {
				obj[path[0]] = {};
			}
			if (isUndefined(obj[path[0]][path[1]])) {
				obj[path[0]][path[1]] = {};
			}
			obj[path[0]][path[1]][path[2]] = value;
			break;
		case 4:
			if (isUndefined(obj[path[0]])) {
				obj[path[0]] = {};
			}
			if (isUndefined(obj[path[0]][path[1]])) {
				obj[path[0]][path[1]] = {};
			}
			if (isUndefined(obj[path[0]][path[1]][path[2]])) {
				obj[path[0]][path[1]][path[2]] = {};
			}
			obj[path[0]][path[1]][path[2]][path[3]] = value;
			break;
		default:
			break;
	}
	return obj;
};

const deleteNestedProperty = (obj: any, path: any) => {
	const pathLength = path.length;
	switch (pathLength) {
		case 1:
			delete obj[path[0]];
			break;
		case 2:
			delete obj[path[0]][path[1]];
			break;
		case 3:
			delete obj[path[0]][path[1]][path[2]];
			break;
		case 4:
			delete obj[path[0]][path[1]][path[2]][path[3]];
			break;
		default:
			break;
	}
	return obj;
};

const undottifyPath = (path: any) =>
	path.map((el: any) => {
		const splitted = el.split('.');
		return splitted[splitted.length - 1];
	});

export const unPathifyObject = (obj: any) => {
	let unpathyfied = {};
	const po = (obj: any, path: any = []) => {
		if (!obj) return null;
		const keys = Object.keys(obj);
		keys.forEach((key) => {
			const val = obj[key];
			if (typeof val === 'object') {
				return po(val, [...path, key]);
			}
			const undottedPath = undottifyPath([...path, key]);
			unpathyfied = setNestedVal(unpathyfied, undottedPath, val);
		});
	};
	po(obj);
	return unpathyfied;
};

export const deleteKeyFromObject = (obj: any, searchKey: string) => {
	let newObj = obj;
	const deleter = (o: any, path: any = []) => {
		if (!o) return null;
		Object.keys(o).forEach((key: any) => {
			const val = o[key];
			if (key === searchKey) {
				newObj = deleteNestedProperty(newObj, [...path, key]);
			}
			if (typeof val === 'object') {
				return deleter(val, [...path, key]);
			}
		});
	};
	deleter(obj);
	return newObj;
};

export const hasMonitoringData = (data: any) => {
	if (data) {
		const myStringObject = JSON.stringify(data);
		const matches = myStringObject.match('true');
		if (matches) {
			return true;
		}
		return false;
	}
	return false;
};
