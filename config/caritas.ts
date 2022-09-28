export default {
	color: {
		//Interactive Colors
		interactive_primary: '#CC1E1C', // ${theme.color.interactive_primary ?? '#CC1E1C'}
		interactive_secondary: '#000000E5', // ${theme.color.interactive_secondary ?? '#000000E5'}
		interactive_tertiary: '#000000A6', // ${theme.color.interactive_tertiary ?? '#000000A6'}
		interactive_hover: '#A31816', // ${theme.color.interactive_hover ?? '#A31816'}
		interactive_onDark: '#FFFFFF', // ${theme.color.interactive_onDark ?? '#FFFFFF'}
		interactive_onDark_hover: '#FFFFFF99', // ${theme.color.interactive_onDark_hover ?? '#FFFFFF99'}
		interactive_disabled_background_black: '#0000000D', // ${theme.color.interactive_disabled_background_black ?? '#0000000D'}
		interactive_disabled_background_white: '#FFFFFF99', // ${theme.color.interactive_disabled_background_white ?? '#FFFFFF99'}
		interactive_disabled_background: '#FFFFFF66', // ${theme.color.interactive_disabled_background ?? '#FFFFFF66'}

		//Text colors
		text_emphasisHigh: '#000000E5', // ${theme.color.text_emphasisHigh ?? '#000000E5'}
		text_emphasisLow: '#000000A6', // ${theme.color.text_emphasisLow ?? '#000000A6'}
		text_disabled: '#00000066', // ${theme.color.text_disabled ?? '#00000066'}
		text_placeholder: '#00000066', // ${theme.color.text_placeholder ?? '#00000066'}
		text_onDark: '#FFFFFF', // ${theme.color.text_onDark ?? '#FFFFFF'}

		//Background
		background_neutral1: '#FAF6F3', // ${theme.color.background_neutral1 ?? '#FAF6F3'}
		background_neutral2: '#F4F0EE', // ${theme.color.background_neutral2 ?? '#F4F0EE'}
		background_neutral3: '#E7E3E1', // ${theme.color.background_neutral3 ?? '#E7E3E1'}
		background_neutral4: '#C9C5C2', // ${theme.color.background_neutral4 ?? '#C9C5C2'}

		background_feedback1: '#DE8A00', // ${theme.color.background_feedback1 ?? '#DE8A00'}
		background_feedback2: '#FF9F00', // ${theme.color.background_feedback2 ?? '#FF9F00'}
		background_feedback3: '#FEBD50', // ${theme.color.background_feedback3 ?? '#FEBD50'}
		background_feedback4: '#FFDCA3', // ${theme.color.background_feedback4 ?? '#FFDCA3'}
		background_feedback5: '#FFE7BF', // ${theme.color.background_feedback5 ?? '#FFE7BF'}
		background_feedback6: '#FFEED2', // ${theme.color.background_feedback6 ?? '#FFEED2'}

		background_red1: '#F8DEDD', // ${theme.color.background_red1 ?? '#F8DEDD'}
		background_red2: '#F4D2D1', // ${theme.color.background_red2 ?? '#F4D2D1'}
		background_red3: '#EAA5A4', // ${theme.color.background_red3 ?? '#EAA5A4'}
		background_red4: '#E07876', // ${theme.color.background_red4 ?? '#E07876'}
		background_red5: '#D64B49', // ${theme.color.background_red5 ?? '#D64B49'}

		//Outline
		outline: '#00000033', //${theme.color.outline ?? '#00000033'};


		//Status colors
		status_success_foreground: '#4FCC5C', // ${theme.color.status_success_foreground ?? '#4FCC5C'}
		status_success_background: '#4FCC5C4D', // ${theme.color.status_success_background ?? '#4FCC5C4D'}
		status_attention_foreground: '#FF9F00', // ${theme.color.status_attention_foreground ?? '#FF9F00'}
		status_attention_background: '#FF9F004D', // ${theme.color.status_attention_background ?? '#FF9F004D'}
		status_error_foreground: '#FF0000', // ${theme.color.status_error_foreground ?? '#FF0000'}
		status_error_background: '#FF00004D' // ${theme.color.status_error_background ?? '#FF00004D'}
	},

	font: {
		family_sans_serif: 'Roboto, sans-serif', // ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};
		family_divider: 'Roboto Slab, serif', // ${theme.font.family_sans_serif ?? 'Roboto, sans-serif'};

		weight_light: '300', // ${theme.font.weight_light ?? '300'};
		weight_regular: '400', // ${theme.font.weight_regular ?? '400'};
		weight_medium: '500', // ${theme.font.weight_medium ?? '500'};
		weight_bold: '700', // ${theme.font.weight_bold ?? '700'};

		size_h1: '40px', // ${theme.font.size_h1 ?? '40px'};
		size_h2: '30px', // ${theme.font.size_h2 ?? '30px'};
		size_h3: '24px', // ${theme.font.size_h3 ?? '24px'};
		size_h4: '20px', // ${theme.font.size_h4 ?? '20px'};
		size_h5: '16px', // ${theme.font.size_h5 ?? '16px'};

		size_super_large: '60px', // ${theme.font.size_super_large ?? '60px'};

		size_super_mobile: '40px', // ${theme.font.size_super_mobile ?? '40px'};
		size_h1_mobile: '32px', // ${theme.font.size_h1_mobile ?? '32px'};

		size_primary: '16px', // ${theme.font.size_primary ?? '16px'};
		size_secondary: '12px', // ${theme.font.size_secondary ?? '12px'};
		size_tertiary: '14px', // ${theme.font.size_tertiary ?? '14px'};
		size_subheadline: '20px', // ${theme.font.size_subheadline ?? '20px'};

		line_height_primary: '21px', // ${theme.font.line_height_primary ?? '21px'};
		line_height_secondary: '16px', // ${theme.font.line_height_secondary ?? '16px'};
		line_height_tertiary: '32px', // ${theme.font.line_height_tertiary ?? '32px'};
		line_height_quaternary: '26px', // ${theme.font.line_height_quaternary ?? '26px'};
		line_height_quinary: '28px', // ${theme.font.line_height_quinary ?? '28px'};
		line_height_senary: '24px' // ${theme.font.line_height_senary ?? '24px'};

	},

	grid: {
		base: '8px',
		base_two: '16px',
		base_three: '24px',
		base_four: '32px',
		base_five: '40px',
		base_six: '48px',
		base_seven: '56px',
		base_eight: '64px',
		base_nine: '72px',
		base_ten: '80px',
		base_eleven: '88px',
		base_twelve: '96px',
	},

	border: {
		radius: '4px', //${theme.border.radius ?? '4px'}
		style: '1px solid', //${theme.border.style ?? '1px solid'}
		style_bold: '2px solid', // ${theme.border.style_bold ?? '2px solid'}
	}
}