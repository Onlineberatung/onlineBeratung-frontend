import monitoringAddiction from './monitoringAddiction';
import monitoringU25 from './monitoringU25';

const monitoring = {
	title: 'Monitoring',
	empty: 'Keine Angabe',
	...monitoringAddiction,
	...monitoringU25
};

export default monitoring;
