import { promises as fs } from 'fs';
import path from 'path';
import dtsgenerator, { readSchemaFromUrl } from 'dtsgenerator';
import prettier from 'prettier';

const rawOrgUrl = 'https://raw.githubusercontent.com/CaritasDeutschland';
const services = [
	{
		path: 'caritas-onlineBeratung-userService/develop/api/userservice.yaml',
		namespace: 'UserService',
		out: 'userservice.d.ts'
	},
	{
		path: 'caritas-onlineBeratung-agencyService/develop/api/agencyservice.yaml',
		namespace: 'AgencyService',
		out: 'agencyservice.d.ts'
	},
	{
		path: 'caritas-onlineBeratung-uploadService/develop/api/uploadservice.yaml',
		namespace: 'UploadService',
		out: 'uploadservice.d.ts'
	},
	{
		path: 'caritas-onlineBeratung-messageService/develop/api/messageservice.yaml',
		namespace: 'MessageService',
		out: 'messageservice.d.ts'
	},
	{
		path: 'caritas-onlineBeratung-mailService/develop/api/mailservice.yaml',
		namespace: 'MailService',
		out: 'mailservice.d.ts'
	},
	{
		path: 'caritas-onlineBeratung-liveService/develop/api/liveservice.yaml',
		namespace: 'LiveService',
		out: 'liveservice.d.ts'
	},
	{
		path: 'caritas-onlineBeratung-videoService/develop/api/videoservice.yaml',
		namespace: 'VideoService',
		out: 'videoservice.d.ts'
	}
];

(async () => {
	try {
		const prettierConfigFile = await prettier.resolveConfigFile();
		const prettierConfig = await prettier.resolveConfig(prettierConfigFile);

		for (const service of services) {
			const schema = await readSchemaFromUrl(
				`${rawOrgUrl}/${service.path}`
			);
			const content = await dtsgenerator({
				contents: [schema],
				config: {
					plugins: {
						'@dtsgenerator/replace-namespace': {
							map: [
								{
									from: ['Components', 'Schema'],
									to: [service.namespace]
								}
							]
						}
					}
				}
			});

			await fs.writeFile(
				path.join('src', 'generated', service.out),
				prettier.format(content, {
					parser: 'typescript',
					...prettierConfig
				})
			);
		}
	} catch (err) {
		console.error(`Something went wrong: ${err}`);
		process.exit(1);
	}
})();
