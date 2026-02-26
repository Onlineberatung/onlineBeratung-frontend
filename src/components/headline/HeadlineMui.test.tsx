import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeadlineMui } from './HeadlineMui';

describe('HeadlineMui', () => {
	it('should render with the correct text', () => {
		render(<HeadlineMui text="Test Headline" semanticLevel="1" />);
		expect(screen.getByText('Test Headline')).toBeInTheDocument();
	});

	it('should render as the correct semantic HTML element', () => {
		const { container } = render(
			<HeadlineMui text="Heading 2" semanticLevel="2" />
		);
		const h2 = container.querySelector('h2');
		expect(h2).toBeInTheDocument();
		expect(h2).toHaveTextContent('Heading 2');
	});

	it('should apply different style level', () => {
		const { container } = render(
			<HeadlineMui
				text="Styled Heading"
				semanticLevel="3"
				styleLevel="1"
			/>
		);
		// Should render as h3 element (semantic)
		const h3 = container.querySelector('h3');
		expect(h3).toBeInTheDocument();
	});

	it('should apply custom className', () => {
		const { container } = render(
			<HeadlineMui
				text="Custom Class"
				semanticLevel="1"
				className="custom-class"
			/>
		);
		const h1 = container.querySelector('h1');
		expect(h1).toHaveClass('custom-class');
	});

	it('should render all heading levels', () => {
		const levels = ['1', '2', '3', '4', '5'] as const;
		levels.forEach((level) => {
			const { container, unmount } = render(
				<HeadlineMui text={`Level ${level}`} semanticLevel={level} />
			);
			const heading = container.querySelector(`h${level}`);
			expect(heading).toBeInTheDocument();
			unmount();
		});
	});

	it('should render HTML content via dangerouslySetInnerHTML', () => {
		const { container } = render(
			<HeadlineMui text="Bold <strong>text</strong>" semanticLevel="1" />
		);
		const strong = container.querySelector('strong');
		expect(strong).toBeInTheDocument();
		expect(strong).toHaveTextContent('text');
	});
});
