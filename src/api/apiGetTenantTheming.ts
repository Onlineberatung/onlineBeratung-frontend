import { TenantDataInterface } from '../globalState/interfaces/TenantDataInterface';

export const apiGetTenantTheming = async (params: {
	subdomain: string;
}): Promise<TenantDataInterface> =>
	// TODO: Needs to be replaced with backend call later
	fetch(`/themes/${params.subdomain}.json`).then((response) =>
		response.json()
	);
