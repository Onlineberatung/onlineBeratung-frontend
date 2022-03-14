import { useMediaQuery } from 'react-responsive';

export const useResponsive = () => {
	const s = 520;
	const m = 600;
	const l = 900;
	const xl = 1200;
	const xxl = 1600;

	return {
		fromS: useMediaQuery({ minWidth: s }),
		fromM: useMediaQuery({ minWidth: m }),
		fromL: useMediaQuery({ minWidth: l }),
		fromXL: useMediaQuery({ minWidth: xl }),
		fromXXL: useMediaQuery({ minWidth: xxl }),

		isXS: useMediaQuery({ maxWidth: s - 1 }),
		isS: useMediaQuery({ minWidth: s, maxWidth: m - 1 }),
		isM: useMediaQuery({ minWidth: m, maxWidth: l - 1 }),
		isL: useMediaQuery({ minWidth: l, maxWidth: xl - 1 }),
		isXL: useMediaQuery({ minWidth: xl, maxWidth: xxl - 1 }),
		isXXL: useMediaQuery({ minWidth: xxl }),

		untilXS: useMediaQuery({ maxWidth: s - 1 }),
		untilS: useMediaQuery({ maxWidth: m - 1 }),
		untilM: useMediaQuery({ maxWidth: l - 1 }),
		untilL: useMediaQuery({ maxWidth: xl - 1 }),
		untilXL: useMediaQuery({ maxWidth: xxl - 1 })
	};
};
