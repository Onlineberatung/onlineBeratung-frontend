import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { apiGetBudibaseTools } from '../../api/apiGetBudibaseTools';
import { UserDataContext } from '../../globalState';
import { APIToolsInterface } from '../../globalState/interfaces/ToolsInterface';
import { translate } from '../../utils/translate';
import {
	setToolsWrapperActive,
	setToolsWrapperInactive
} from '../app/navigationHandler';
import { Box } from '../box/Box';
import { Headline } from '../headline/Headline';
import { Tool } from './Tool';
import './tools.styles';

export const ToolsList = () => {
	const [toolList, setToolsList] = useState<APIToolsInterface[]>([]);
	const { userData } = useContext(UserDataContext);

	useEffect(() => {
		setToolsWrapperActive();

		return () => {
			setToolsWrapperInactive();
		};
	}, []);

	useEffect(() => {
		apiGetBudibaseTools(userData.userId).then((resp: APIToolsInterface[]) =>
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
						toolList.map((tool) => (
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
