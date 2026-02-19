import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, TextField, Card, CardContent, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Tag } from '../tag/Tag';
import { Box, BoxTypes } from '../box/Box';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

/**
 * MuiThemeTest component - A simple component to test MUI theme integration
 * This component displays various MUI components to verify:
 * 1. Theme colors are correctly applied from tenant theming
 * 2. Components render with consistent styling
 * 3. Theme updates when tenant changes
 */
export const MuiThemeTest = () => {
	const theme = useTheme();

	return (
		<div style={{ padding: '20px' }}>
			<h2>MUI Theme Integration Test</h2>
			
			<Card style={{ marginBottom: '20px' }}>
				<CardContent>
					<h3>Current Theme Colors</h3>
					<div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
						<div>
							<strong>Primary Color:</strong>
							<div
								style={{
									width: '100px',
									height: '50px',
									backgroundColor: theme.palette.primary.main,
									border: '1px solid #ccc',
									marginTop: '5px'
								}}
							/>
							<span style={{ fontSize: '12px' }}>
								{theme.palette.primary.main}
							</span>
						</div>
						<div>
							<strong>Secondary Color:</strong>
							<div
								style={{
									width: '100px',
									height: '50px',
									backgroundColor: theme.palette.secondary.main,
									border: '1px solid #ccc',
									marginTop: '5px'
								}}
							/>
							<span style={{ fontSize: '12px' }}>
								{theme.palette.secondary.main}
							</span>
						</div>
					</div>
					
					<h3>Component Samples</h3>
					<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
						<Button variant="contained" color="primary">
							Primary Button
						</Button>
						<Button variant="contained" color="secondary">
							Secondary Button
						</Button>
						<Button variant="outlined" color="primary">
							Outlined Button
						</Button>
						<Tooltip title="This is a tooltip">
							<Button startIcon={<InfoIcon />}>
								With Icon
							</Button>
						</Tooltip>
					</div>
					
					<div style={{ marginTop: '20px' }}>
						<TextField
							label="Sample Input"
							variant="outlined"
							placeholder="Test input field"
							style={{ marginRight: '10px' }}
						/>
						<TextField
							label="Another Input"
							variant="outlined"
							defaultValue="With value"
						/>
					</div>
				</CardContent>
			</Card>

			<Card style={{ marginBottom: '20px' }}>
				<CardContent>
					<h3>Migrated Components (MUI-based)</h3>
					
					<div style={{ marginBottom: '20px' }}>
						<h4>Headline Component</h4>
						<Headline text="Headline Level 1" semanticLevel="1" />
						<Headline text="Headline Level 2" semanticLevel="2" />
						<Headline text="Headline Level 3" semanticLevel="3" />
						<Headline text="Headline Level 4" semanticLevel="4" />
						<Headline text="Headline Level 5" semanticLevel="5" />
					</div>

					<div style={{ marginBottom: '20px' }}>
						<h4>Text Component</h4>
						<Text type="standard" text="Standard text type" />
						<Text type="infoLargeStandard" text="Info large standard text" />
						<Text type="infoLargeAlternative" text="Info large alternative text" />
						<Text type="infoMedium" text="Info medium text" />
						<Text type="infoSmall" text="Info small text" />
						<Text type="divider" text="Divider text type" />
					</div>

					<div style={{ marginBottom: '20px' }}>
						<h4>Tag Component</h4>
						<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
							<Tag text="Yellow Tag" color="yellow" />
							<Tag text="Green Tag" color="green" />
							<Tag text="Red Tag" color="red" />
							<Tag text="Clickable Tag" color="yellow" link="/test" />
						</div>
					</div>

					<div style={{ marginBottom: '20px' }}>
						<h4>Box Component</h4>
						<Box type={BoxTypes.INFO} title="Info Box">
							This is an informational box with MUI Alert component.
						</Box>
						<Box type={BoxTypes.SUCCESS} title="Success Box">
							This is a success box with MUI Alert component.
						</Box>
						<Box type={BoxTypes.ERROR} title="Error Box">
							This is an error box with MUI Alert component.
						</Box>
						<Box title="Plain Box">
							This is a plain box without type, using MUI Box component.
						</Box>
					</div>
				</CardContent>
			</Card>
			
			<p style={{ fontSize: '12px', color: '#666' }}>
				This component demonstrates that MUI theme is integrated with tenant theming.
				The primary and secondary colors should match the tenant's configured colors.
			</p>
		</div>
	);
};
