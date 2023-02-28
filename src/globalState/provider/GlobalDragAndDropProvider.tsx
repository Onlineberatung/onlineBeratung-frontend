/*
Global drag and drop provider to handle drag and drop events in the whole application.
 */
import * as React from 'react';
import { createContext, FC } from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';

export const GlobalDragAndDropContext = createContext<Omit<
	DropzoneState,
	'getRootProps'
> | null>(null);

export const GlobalDragAndDropProvider: FC = ({ children }) => {
	const { getRootProps, ...dropzoneState } = useDropzone({
		noClick: true,
		noKeyboard: true
	});

	return (
		<div {...getRootProps()}>
			<GlobalDragAndDropContext.Provider value={dropzoneState}>
				{children}
			</GlobalDragAndDropContext.Provider>
		</div>
	);
};
