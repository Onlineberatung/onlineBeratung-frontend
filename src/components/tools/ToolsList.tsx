import * as React from 'react';
import { useEffect, useState } from 'react';
import { ToolsListInterface } from '../../globalState/interfaces/ToolsInterface';
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
	const [toolList, setToolsList] = useState<ToolsListInterface[]>([]);

	useEffect(() => {
		setToolsWrapperActive();

		return () => {
			setToolsWrapperInactive();
		};
	}, []);

	useEffect(() => {
		//api call
		const fakeData = [
			{
				title: 'Konsumtagebuch',
				description:
					'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy.',
				buttonLink: '#',
				shared: false
			},
			{
				title: 'Einstiegsbefragung',
				description:
					'Für eine individuelle Beratung sind diese Informationen sehr hilfreich.',
				buttonLink: '#',
				shared: false
			},
			{
				title: 'Motivationswaage',
				description:
					'Die Motivationswaage hilft Ihnen dabei, sich über die Vor- und Nachteile einer Überwindung des Suchtverhaltens im Klaren zu sein. ',
				buttonLink: '#',
				shared: true
			}
		];
		setToolsList(fakeData);
	}, []);

	return (
		<div className="toolsList__wrapper">
			<div className="toolsList__header">
				<Headline
					text={translate('navigation.tools')}
					semanticLevel="2"
					className="toolsList__header--title"
				/>
			</div>
			<div className="toolsList__innerWrapper">
				<div className="toolsList__content">
					{toolList &&
						toolList.map((tool) => (
							<div className="toolsList__content__tool">
								<Box>
									<Tool
										title={tool.title}
										description={tool.description}
										buttonLink={tool.buttonLink}
										shared={tool.shared}
										key={tool.title}
									/>
								</Box>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};
