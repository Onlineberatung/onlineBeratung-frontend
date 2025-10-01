import React, {
	useCallback,
	useState,
	useRef,
	ReactElement,
	useMemo
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import './formAccordion.styles.scss';
import { FormAccordionItemProps } from './FormAccordionItem';
import { DebouncedState } from 'use-debounce/lib/useDebouncedCallback';

export interface FormAccordionChildProps {
	activePanel: FormAccordionItemProps['id'];
	handlePanelClick: DebouncedState<
		(
			panel: FormAccordionChildProps['activePanel'],
			isTabPressed?: boolean
		) => void
	>;
	handleNextStep: () => void;
}

interface FormAccordionProps {
	children: (
		props: FormAccordionChildProps
	) => ReactElement<FormAccordionItemProps>[];
	onComplete?: () => void;
}

const scrollOffset = 80;

export const FormAccordion = ({ children, onComplete }: FormAccordionProps) => {
	const childIds = useMemo(
		() =>
			children({} as FormAccordionChildProps).map(
				(child) => child.props.id
			),
		[children]
	);
	const [activePanel, setActivePanel] = useState<
		FormAccordionChildProps['activePanel']
	>(childIds[0]);
	const ref = useRef<HTMLDivElement>(null);

	const handleScroll = useCallback((panel) => {
		setTimeout(() => {
			const scrollContainer =
				document.getElementsByClassName(`stageLayout`)[0];
			const element = document.getElementById(`panel-${panel}`);
			const offsetPosition = element.offsetTop - scrollOffset;

			scrollContainer.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}, 50);
	}, []);

	const handleNextStep = useCallback(() => {
		const childIdIndex = childIds.indexOf(activePanel);
		setActivePanel(childIds?.[childIdIndex + 1]);
		// Call onComplete when next on last panel was clicked
		if (childIdIndex !== childIds.length - 1) {
			return handleScroll(childIds?.[childIdIndex + 1]);
		}
		onComplete?.();
	}, [activePanel, childIds, handleScroll, onComplete]);

	const handlePanelClick = useCallback(
		(
			panel: FormAccordionChildProps['activePanel'],
			isTabPressed?: boolean
		) => {
			setActivePanel(
				activePanel === panel && !isTabPressed ? undefined : panel
			);
			handleScroll(panel);
		},
		[activePanel, handleScroll]
	);
	const debouncedHandlePanelClick = useDebouncedCallback(
		handlePanelClick,
		200,
		{ leading: true, trailing: false }
	);

	return (
		<div className="formAccordionDigi" ref={ref}>
			{children({
				activePanel,
				handlePanelClick: debouncedHandlePanelClick,
				handleNextStep
			})}
		</div>
	);
};
