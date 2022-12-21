import * as React from 'react';
import { SendMessageButton } from './SendMessageButton';
import { ReactComponent as EmojiIcon } from '../../resources/img/icons/smiley-positive.svg';
import { ReactComponent as RichtextToggleIcon } from '../../resources/img/icons/richtext-toggle.svg';
import './messageSubmitInterface.styles';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Loading } from '../app/Loading';

export interface MessageSubmitInterfaceComponentProps {
	className?: string;
	placeholder: string;
}

export const MessageSubmitInterfaceSkeleton = ({
	className,
	placeholder
}: MessageSubmitInterfaceComponentProps) => {
	const { t: translate } = useTranslation();

	return (
		<div
			className={clsx(className, 'messageSubmit__wrapper')}
			style={{
				position: 'relative'
			}}
		>
			<div
				style={{
					position: 'absolute',
					zIndex: 101,
					width: '100%',
					height: '100%',
					backdropFilter: 'blur(3px)',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center'
				}}
			>
				<Loading />
			</div>
			<form className={'textarea'}>
				<div className={'textarea__wrapper'}>
					<div className="textarea__wrapper-send-message">
						<span className="textarea__featureWrapper">
							<span className="textarea__richtextToggle">
								<RichtextToggleIcon
									width="20"
									height="20"
									onClick={() => null}
									title={translate(
										'enquiry.write.input.format'
									)}
									aria-label={translate(
										'enquiry.write.input.format'
									)}
								/>
							</span>
							<div className="emoji__select">
								<button
									className="emoji__selectButton"
									type="button"
								>
									<EmojiIcon
										aria-label={translate(
											'enquiry.write.input.emojies'
										)}
										title={translate(
											'enquiry.write.input.emojies'
										)}
									/>
								</button>
							</div>
						</span>
						<span className="textarea__inputWrapper">
							<div className="textarea__input">
								<div
									style={{
										padding: '14px 40px 14px 8px',
										color: '#787378'
									}}
								>
									{placeholder}
								</div>
							</div>
						</span>
						<div className="textarea__buttons">
							<SendMessageButton
								handleSendButton={() => null}
								clicked={false}
								deactivated={false}
							/>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};
