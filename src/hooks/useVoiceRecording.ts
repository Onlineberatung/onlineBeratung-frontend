import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_RECORDING_DURATION_MS = 2 * 60 * 1000; // 2 minutes
const MIN_RECORDING_DURATION_MS = 1000; // 1 second minimum hold

export type VoiceRecordingError =
	| 'permission_denied'
	| 'not_supported'
	| 'no_mime_type';

function getSupportedMimeType(): string {
	const types = [
		'audio/webm;codecs=opus',
		'audio/webm',
		'audio/ogg;codecs=opus',
		'audio/ogg',
		'audio/mp4'
	];
	for (const type of types) {
		if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
			return type;
		}
	}
	return '';
}

function getFileExtension(mimeType: string): string {
	if (mimeType.startsWith('audio/webm')) return '.webm';
	if (mimeType.startsWith('audio/ogg')) return '.ogg';
	if (mimeType.startsWith('audio/mp4')) return '.m4a';
	return '.webm';
}

function formatTimestamp(): string {
	const now = new Date();
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

interface UseVoiceRecordingOptions {
	onRecordingComplete: (file: File) => void;
	onMaxDurationReached: () => void;
	onError: (error: VoiceRecordingError) => void;
	onPermissionGranted?: () => void;
}

export const useVoiceRecording = ({
	onRecordingComplete,
	onMaxDurationReached,
	onError,
	onPermissionGranted
}: UseVoiceRecordingOptions) => {
	const [isRecording, setIsRecording] = useState(false);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const streamRef = useRef<MediaStream | null>(null);
	const maxDurationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);
	const mimeTypeRef = useRef<string>('');
	const recordingStartTimeRef = useRef<number>(0);
	const discardRef = useRef<boolean>(false);

	// Use refs for callbacks to avoid stale closures in MediaRecorder event handlers
	const onRecordingCompleteRef = useRef(onRecordingComplete);
	const onMaxDurationReachedRef = useRef(onMaxDurationReached);
	const onErrorRef = useRef(onError);
	const onPermissionGrantedRef = useRef(onPermissionGranted);
	const permissionListenerCleanupRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		onRecordingCompleteRef.current = onRecordingComplete;
	}, [onRecordingComplete]);

	useEffect(() => {
		onMaxDurationReachedRef.current = onMaxDurationReached;
	}, [onMaxDurationReached]);

	useEffect(() => {
		onErrorRef.current = onError;
	}, [onError]);

	useEffect(() => {
		onPermissionGrantedRef.current = onPermissionGranted;
	}, [onPermissionGranted]);

	const watchPermission = useCallback(() => {
		// Clean up any existing listener
		if (permissionListenerCleanupRef.current) {
			permissionListenerCleanupRef.current();
			permissionListenerCleanupRef.current = null;
		}

		if (!navigator.permissions) return;

		navigator.permissions
			.query({ name: 'microphone' as PermissionName })
			.then((status) => {
				const handleChange = () => {
					if (status.state === 'granted') {
						onPermissionGrantedRef.current?.();
						status.removeEventListener('change', handleChange);
						permissionListenerCleanupRef.current = null;
					}
				};
				status.addEventListener('change', handleChange);
				permissionListenerCleanupRef.current = () => {
					status.removeEventListener('change', handleChange);
				};
			})
			.catch(() => {
				// navigator.permissions.query not supported for microphone
			});
	}, []);

	const cleanupStream = useCallback(() => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
	}, []);

	const stopRecording = useCallback(() => {
		if (maxDurationTimeoutRef.current) {
			clearTimeout(maxDurationTimeoutRef.current);
			maxDurationTimeoutRef.current = null;
		}

		const elapsed = Date.now() - recordingStartTimeRef.current;
		if (elapsed < MIN_RECORDING_DURATION_MS) {
			discardRef.current = true;
		}

		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state === 'recording'
		) {
			mediaRecorderRef.current.stop();
		} else {
			cleanupStream();
		}

		setIsRecording(false);
	}, [cleanupStream]);

	const startRecording = useCallback(async () => {
		if (
			!navigator.mediaDevices ||
			!navigator.mediaDevices.getUserMedia
		) {
			onErrorRef.current('not_supported');
			return;
		}

		const mimeType = getSupportedMimeType();
		if (!mimeType) {
			onErrorRef.current('no_mime_type');
			return;
		}
		mimeTypeRef.current = mimeType;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true
			});
			streamRef.current = stream;
			chunksRef.current = [];
			discardRef.current = false;
			recordingStartTimeRef.current = Date.now();

			const mediaRecorder = new MediaRecorder(stream, { mimeType });
			mediaRecorderRef.current = mediaRecorder;

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				cleanupStream();

				if (discardRef.current) {
					chunksRef.current = [];
					discardRef.current = false;
					return;
				}

				const recordedMimeType = mimeTypeRef.current;
				const blob = new Blob(chunksRef.current, {
					type: recordedMimeType
				});
				const extension = getFileExtension(recordedMimeType);
				const fileName = `${formatTimestamp()} Audio-Message${extension}`;
				const file = new File([blob], fileName, {
					type: recordedMimeType
				});

				chunksRef.current = [];
				onRecordingCompleteRef.current(file);
			};

			mediaRecorder.start();
			setIsRecording(true);

			// Auto-stop after 2 minutes
			maxDurationTimeoutRef.current = setTimeout(() => {
				onMaxDurationReachedRef.current();
				stopRecording();
			}, MAX_RECORDING_DURATION_MS);
		} catch {
			cleanupStream();
			onErrorRef.current('permission_denied');
			watchPermission();
		}
	}, [cleanupStream, stopRecording, watchPermission]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (maxDurationTimeoutRef.current) {
				clearTimeout(maxDurationTimeoutRef.current);
			}
			if (
				mediaRecorderRef.current &&
				mediaRecorderRef.current.state === 'recording'
			) {
				mediaRecorderRef.current.stop();
			}
			if (streamRef.current) {
				streamRef.current
					.getTracks()
					.forEach((track) => track.stop());
			}
			if (permissionListenerCleanupRef.current) {
				permissionListenerCleanupRef.current();
			}
		};
	}, []);

	return {
		isRecording,
		startRecording,
		stopRecording
	};
};
