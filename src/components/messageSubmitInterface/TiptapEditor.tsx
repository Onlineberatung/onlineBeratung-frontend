import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import { Box, IconButton, useTheme } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import clsx from 'clsx';

export const INPUT_MAX_LENGTH = 7500;

interface TiptapEditorProps {
	placeholder: string;
	content?: string;
	onChange?: (markdown: string) => void;
	onSubmit?: () => void;
	onEditorReady?: (editor: any) => void;
	onInsertEmoji?: (insertEmoji: (emoji: string) => void) => void;
	className?: string;
	disabled?: boolean;
	isRichtextActive: boolean;
}

export const TiptapEditor = React.memo(
	({
		placeholder,
		content = '',
		onChange,
		onSubmit,
		onEditorReady,
		onInsertEmoji,
		className,
		disabled = false,
		isRichtextActive
	}: TiptapEditorProps) => {
		const theme = useTheme();
		const editorRef = useRef<HTMLDivElement>(null);

		const extensions = useMemo(
			() => [
				StarterKit.configure({
					heading: false,
					blockquote: false,
					code: false,
					codeBlock: false,
					horizontalRule: false,
					hardBreak: {
						keepMarks: true
					}
				}),
				Underline,
				Link.configure({
					openOnClick: false,
					autolink: true,
					linkOnPaste: true
				}),
				Placeholder.configure({
					placeholder
				}),
				Markdown.configure({
					html: true,
					transformPastedText: true,
					transformCopiedText: true
				})
			],
			[placeholder]
		);

		const editor = useEditor({
			extensions,
			content,
			editorProps: {
				attributes: {
					class: 'tiptap-editor',
					'aria-label': placeholder
				},
				handleKeyDown: (view, event) => {
					if (event.key === 'Enter' && !event.shiftKey) {
						event.preventDefault();
						onSubmit?.();
						return true;
					}
					return false;
				}
			},
			onUpdate: ({ editor }) => {
				const text = editor.getText();
				if (text.length > INPUT_MAX_LENGTH) {
					// Prevent input beyond max length
					return;
				}
				// The tiptap-markdown extension stores content as markdown internally
				// getText() returns the plain text representation
				onChange?.(text);
			}
		});

		// Notify parent when editor is ready
		useEffect(() => {
			if (editor && onEditorReady) {
				onEditorReady(editor);
			}
		}, [editor, onEditorReady]);

		// Expose insertEmoji function to parent
		useEffect(() => {
			if (editor && onInsertEmoji) {
				const insertEmoji = (emoji: string) => {
					editor.chain().focus().insertContent(emoji).run();
				};
				onInsertEmoji(insertEmoji);
			}
		}, [editor, onInsertEmoji]);

		// Update content when it changes externally
		useEffect(() => {
			if (editor && content !== undefined) {
				const currentText = editor.getText();
				// Clear editor if content is empty
				if (content === '' && currentText !== '') {
					editor.commands.clearContent();
				}
				// Only update if content actually changed and has content
				else if (content.trim() && currentText.trim() !== content.trim()) {
					editor.commands.setContent(content);
				}
			}
		}, [content, editor]);

		// Handle disabled state
		useEffect(() => {
			if (editor) {
				editor.setEditable(!disabled);
			}
		}, [disabled, editor]);

		const toggleFormat = useCallback(
			(format: string) => {
				if (!editor) return;

				switch (format) {
					case 'bold':
						editor.chain().focus().toggleBold().run();
						break;
					case 'italic':
						editor.chain().focus().toggleItalic().run();
						break;
					case 'underline':
						editor.chain().focus().toggleUnderline().run();
						break;
					case 'strike':
						editor.chain().focus().toggleStrike().run();
						break;
					case 'bulletList':
						editor.chain().focus().toggleBulletList().run();
						break;
					case 'orderedList':
						editor.chain().focus().toggleOrderedList().run();
						break;
				}
			},
			[editor]
		);

		if (!editor) {
			return null;
		}

		return (
			<Box className={clsx('textarea__input', className)} ref={editorRef}>
				{isRichtextActive && (
					<Box
						className="textarea__toolbar textarea__toolbar--active"
						sx={{
							display: 'flex',
							gap: 0.5,
							padding: '8px 12px',
							borderBottom: `1px solid ${theme.palette.divider}`,
							backgroundColor: theme.palette.background.paper
						}}
					>
						<IconButton
							size="small"
							onClick={() => toggleFormat('bold')}
							className={clsx('textarea__toolbar__button', {
								'textarea__toolbar__button--active':
									editor.isActive('bold')
							})}
							aria-label="Bold"
							sx={{
								color: editor.isActive('bold')
									? theme.palette.primary.main
									: 'inherit'
							}}
						>
							<FormatBoldIcon fontSize="small" />
						</IconButton>
						<IconButton
							size="small"
							onClick={() => toggleFormat('italic')}
							className={clsx('textarea__toolbar__button', {
								'textarea__toolbar__button--active':
									editor.isActive('italic')
							})}
							aria-label="Italic"
							sx={{
								color: editor.isActive('italic')
									? theme.palette.primary.main
									: 'inherit'
							}}
						>
							<FormatItalicIcon fontSize="small" />
						</IconButton>
						<IconButton
							size="small"
							onClick={() => toggleFormat('underline')}
							className={clsx('textarea__toolbar__button', {
								'textarea__toolbar__button--active':
									editor.isActive('underline')
							})}
							aria-label="Underline"
							sx={{
								color: editor.isActive('underline')
									? theme.palette.primary.main
									: 'inherit'
							}}
						>
							<FormatUnderlinedIcon fontSize="small" />
						</IconButton>
						<IconButton
							size="small"
							onClick={() => toggleFormat('strike')}
							className={clsx('textarea__toolbar__button', {
								'textarea__toolbar__button--active':
									editor.isActive('strike')
							})}
							aria-label="Strikethrough"
							sx={{
								color: editor.isActive('strike')
									? theme.palette.primary.main
									: 'inherit'
							}}
						>
							<StrikethroughSIcon fontSize="small" />
						</IconButton>
						<IconButton
							size="small"
							onClick={() => toggleFormat('bulletList')}
							className={clsx('textarea__toolbar__button', {
								'textarea__toolbar__button--active':
									editor.isActive('bulletList')
							})}
							aria-label="Bullet List"
							sx={{
								color: editor.isActive('bulletList')
									? theme.palette.primary.main
									: 'inherit'
							}}
						>
							<FormatListBulletedIcon fontSize="small" />
						</IconButton>
						<IconButton
							size="small"
							onClick={() => toggleFormat('orderedList')}
							className={clsx('textarea__toolbar__button', {
								'textarea__toolbar__button--active':
									editor.isActive('orderedList')
							})}
							aria-label="Numbered List"
							sx={{
								color: editor.isActive('orderedList')
									? theme.palette.primary.main
									: 'inherit'
							}}
						>
							<FormatListNumberedIcon fontSize="small" />
						</IconButton>
					</Box>
				)}
				<Box
					className="textarea__editor-wrapper"
					sx={{
						position: 'relative',
						padding: '12px',
						backgroundColor: theme.palette.background.paper
					}}
				>
					<EditorContent editor={editor} />
				</Box>
			</Box>
		);
	}
);

TiptapEditor.displayName = 'TiptapEditor';
