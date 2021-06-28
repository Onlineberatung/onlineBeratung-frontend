import * as React from 'react';
import { translate } from '../../utils/translate';
import { ReactComponent as SendIcon } from '../../resources/img/icons/paper-plane.svg';

interface SendMessageButtonProps {
	clicked?: boolean;
	deactivated?: boolean;
	handleSendButton: Function;
}

export const SendMessageButton = (props: SendMessageButtonProps) => {
	return (
		<span
			onClick={() => props.handleSendButton()}
			className={`textarea__iconWrapper ${
				props.clicked ? 'textarea__iconWrapper--clicked' : ''
			} ${props.deactivated ? 'textarea__iconWrapper--deactivated' : ''}`}
			title={translate('enquiry.write.input.button.title')}
		>
			<SendIcon className="textarea__icon" />
		</span>
	);
};
