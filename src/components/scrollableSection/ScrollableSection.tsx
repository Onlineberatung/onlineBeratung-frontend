import React, { createRef, ReactElement, useCallback, useEffect } from 'react';
import './scrollableSection.styles.scss';

type ScrollableSectionProps = {
	children: ReactElement[];
	offset?: number;
};

export const ScrollableSection = ({
	children,
	offset = 0
}: ScrollableSectionProps) => {
	const headerRef = createRef<HTMLDivElement>();
	const bodyRef = createRef<HTMLDivElement>();
	const footerRef = createRef<HTMLDivElement>();

	const recalculateBody = useCallback(() => {
		if (!bodyRef.current) {
			return null;
		}

		let spacing = 0;

		if (headerRef.current) {
			const headerRect = headerRef.current.getBoundingClientRect();
			spacing = spacing + headerRect.top + headerRect.height;
		}

		if (footerRef.current) {
			const footerRect = footerRef.current.getBoundingClientRect();
			spacing = spacing + footerRect.height;
		}

		bodyRef.current.style.height = `calc(100vh - ${spacing + offset}px)`;
	}, [bodyRef, footerRef, headerRef, offset]);

	useEffect(() => {
		setTimeout(() => {
			recalculateBody();
		});
	}, [recalculateBody]);

	useEffect(() => {
		let timeoutId = null;
		const resizeListener = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => recalculateBody, 150);
		};
		window.addEventListener('resize', resizeListener);
		return () => {
			window.removeEventListener('resize', resizeListener);
		};
	});

	return (
		<div className="scrollableSection">
			{children.length >= 2 && (
				<div className="scrollableSection__header" ref={headerRef}>
					{children[0]}
				</div>
			)}
			<div className="scrollableSection__body" ref={bodyRef}>
				{children.length === 1 ? children[0] : children[1]}
			</div>
			{children.length === 3 && (
				<div className="scrollableSection__footer" ref={footerRef}>
					{children[2]}
				</div>
			)}
		</div>
	);
};
