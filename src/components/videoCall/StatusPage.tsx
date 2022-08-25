import * as React from 'react';
import './statusPage.styles.scss';

type TStatusPageProps = {
	closed: boolean;
};

const StatusPage = ({ closed }: TStatusPageProps) => {
	return (
		<div className="statusPage">
			{closed ? (
				<>
					<h1>Ihr Video-Call wurde erfolgreich beendet.</h1>
					<p>
						Bitte schließen Sie diesen Tab, um zu Beratung & Hilfe
						zurückzukehren.
					</p>
				</>
			) : (
				<>
					<h1>Kein Zutritt!</h1>
					<h3>
						Leider sind Sie nicht berechtigt diese Seite einzusehen.
					</h3>
					<p>
						Bitte schließen Sie diesen Tab, um zu Beratung & Hilfe
						zurückzukehren.
					</p>
				</>
			)}
		</div>
	);
};

export default StatusPage;
