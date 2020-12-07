type EaseInOutQuadOptions = {
	currentTime: number;
	start: number;
	change: number;
	duration: number;
};

const easeInOutQuad = ({
	currentTime,
	start,
	change,
	duration
}: EaseInOutQuadOptions) => {
	let newCurrentTime = currentTime;
	newCurrentTime /= duration / 2;

	if (newCurrentTime < 1) {
		return (change / 2) * newCurrentTime * newCurrentTime + start;
	}

	newCurrentTime -= 1;
	return (-change / 2) * (newCurrentTime * (newCurrentTime - 2) - 1) + start;
};

type SmoothScrollOptions = {
	duration: number;
	element: HTMLElement;
	to: number;
};
export default function smoothScroll({
	duration,
	element,
	to
}: SmoothScrollOptions) {
	const start = element.scrollTop;
	const change = to - start;
	const startDate = new Date().getTime();

	const animateScroll = () => {
		const currentDate = new Date().getTime();
		const currentTime = currentDate - startDate;
		element.scrollTop = easeInOutQuad({
			currentTime,
			start,
			change,
			duration
		});

		if (currentTime < duration) {
			requestAnimationFrame(animateScroll);
		} else {
			element.scrollTop = to;
		}
	};
	animateScroll();
}
