import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { apiGetTools } from '../../api/apiGetTools';
import { UserDataContext } from '../../globalState';
import { APIToolsInterface } from '../../globalState/interfaces/ToolsInterface';
import { Box } from '../box/Box';
import { Headline } from '../headline/Headline';
import { Tool } from './Tool';
import './tools.styles';
import { useTranslation } from 'react-i18next';

export const ToolsList = () => {
	const { t: translate } = useTranslation();
	const [toolList, setToolsList] = useState<APIToolsInterface[]>([]);
	const { userData } = useContext(UserDataContext);

	useEffect(() => {
		apiGetTools(userData.userId).then((resp: APIToolsInterface[]) =>
			setToolsList(resp)
		);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="toolsList__wrapper">
			<div className="toolsList__header">
				<Headline
					text={translate('navigation.tools')}
					semanticLevel="2"
					className="toolsList__header__title"
				/>
			</div>
			<div className="toolsList__innerWrapper">
				<div className="toolsList__content">
					{toolList &&
						toolList
							.filter((tool) => tool.sharedWithAdviceSeeker)
							.map((tool) => (
								<div
									className="toolsList__content__tool"
									key={tool.title}
								>
									<Box>
										<Tool
											title={tool.title}
											description={tool.description}
											buttonLink={tool.url}
											shared={tool.sharedWithConsultant}
										/>
									</Box>
								</div>
							))}
				</div>
			</div>
		</div>
	);
};
