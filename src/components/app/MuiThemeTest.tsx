import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, TextField, Card, CardContent, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

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
			
			<p style={{ fontSize: '12px', color: '#666' }}>
				This component demonstrates that MUI theme is integrated with tenant theming.
				The primary and secondary colors should match the tenant's configured colors.
			</p>
		</div>
	);
};
