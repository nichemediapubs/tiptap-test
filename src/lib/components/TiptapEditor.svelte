<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Placeholder from '@tiptap/extension-placeholder';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import { Bold, Italic, List, ListOrdered, Link2 } from 'lucide-svelte';

	let element: HTMLElement;
	let bubbleMenuElement: HTMLElement;
	let editor: Editor;
	let showLinkModal = false;
	let linkUrl = '';
	let linkSelection: Range | null = null;
	let initialPosition: DOMRect | null = null;
	let shouldUpdatePosition = true;

	export let content;

	onMount(() => {
		editor = new Editor({
			editorProps: {
				attributes: {
					class: 'dt-prose'
				}
			},
			element: element,
			extensions: [
				StarterKit.configure({
					bulletList: {
						keepMarks: true,
						keepAttributes: false
					},
					orderedList: {
						keepMarks: true,
						keepAttributes: false
					},
					strike: {}
				}),
				Link.configure({
					openOnClick: false,
					linkOnPaste: true
				}),
				Placeholder.configure({
					placeholder: 'Write something...'
				}),
				BubbleMenu.configure({
					element: bubbleMenuElement,
					tippyOptions: {
						placement: 'bottom',
						popperOptions: {
							modifiers: [
								{
									name: 'preventOverflow',
									options: {
										altAxis: true,
										padding: 8
									}
								},
								{
									name: 'computeStyles',
									options: {
										adaptive: false
									}
								}
							]
						}
					}
				})
			],
			content: content,
			onUpdate: ({ editor }) => {
				content = editor.getHTML();
			},
			onTransaction: () => {
				editor = editor;
			}
		});

		document.addEventListener('selectionchange', () => {
			shouldUpdatePosition = true;
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	const toggleFormat = (type) => {
		shouldUpdatePosition = false;
		switch (type) {
			case 'BulletList':
				editor.chain().focus().toggleBulletList().run();
				break;
			case 'OrderedList':
				editor.chain().focus().toggleOrderedList().run();
				break;
			default:
				editor.chain().focus()[`toggle${type}`]().run();
		}
	};

	function handleLinkSubmit() {
		if (linkUrl && editor) {
			editor.chain().focus().setLink({ href: linkUrl }).run();
			linkUrl = '';
			showLinkModal = false;
		}
	}
</script>

<div class="dt-editor relative min-h-[200px] max-w-4xl rounded-lg border border-gray-200">
	<div class:dt-bubble-menu={editor} bind:this={bubbleMenuElement}>
		{#if editor}
			<button
				type="button"
				class="menu-item"
				on:click={() => editor.chain().focus().toggleBold().run()}
				on:keydown={(e) => e.key === 'Enter' && editor.chain().focus().toggleBold().run()}
				class:active={editor.isActive('bold')}
				aria-label="Bold"
			>
				<Bold size={22} />
			</button>

			<button
				type="button"
				class="menu-item"
				on:click={() => editor.chain().focus().toggleItalic().run()}
				on:keydown={(e) => e.key === 'Enter' && editor.chain().focus().toggleItalic().run()}
				class:active={editor.isActive('italic')}
				aria-label="Italic"
			>
				<Italic size={22} />
			</button>

			<button
				type="button"
				class="menu-item"
				on:click={() => toggleFormat('BulletList')}
				on:keydown={(e) => e.key === 'Enter' && toggleFormat('BulletList')}
				class:active={editor.isActive('bulletList')}
				aria-label="Bullet List"
			>
				<List size={22} />
			</button>

			<button
				type="button"
				class="menu-item"
				on:click={() => toggleFormat('OrderedList')}
				on:keydown={(e) => e.key === 'Enter' && toggleFormat('OrderedList')}
				class:active={editor.isActive('orderedList')}
				aria-label="Ordered List"
			>
				<ListOrdered size={22} />
			</button>

			<button
				type="button"
				class="menu-item"
				on:click={() => {
					linkSelection = window.getSelection()?.getRangeAt(0) || null;
					showLinkModal = true;
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						linkSelection = window.getSelection()?.getRangeAt(0) || null;
						showLinkModal = true;
					}
				}}
				class:active={editor.isActive('link')}
				aria-label="Add Link"
			>
				<Link2 size={22} />
			</button>
		{/if}
	</div>

	<div class="max-h-[600px] min-h-[150px] overflow-y-auto px-4 pb-16 pt-2" bind:this={element} />

	<div
		class="absolute bottom-0 left-0 right-0 rounded-b-lg border-t border-gray-200 bg-white px-3 py-2"
	>
		<div class="flex items-center space-x-2">
			<button
				class="rounded p-2 transition-colors hover:bg-gray-100"
				class:bg-gray-100={editor?.isActive('bold')}
				on:click={() => toggleFormat('Bold')}
			>
				<Bold size={20} class="text-gray-600" />
			</button>

			<button
				class="rounded p-2 transition-colors hover:bg-gray-100"
				class:bg-gray-100={editor?.isActive('italic')}
				on:click={() => toggleFormat('Italic')}
			>
				<Italic size={20} class="text-gray-600" />
			</button>

			<div class="mx-2 h-5 w-px bg-gray-200" />

			<button
				class="rounded p-2 transition-colors hover:bg-gray-100"
				class:bg-gray-100={editor?.isActive('bulletList')}
				on:click={() => toggleFormat('BulletList')}
			>
				<List size={20} class="text-gray-600" />
			</button>

			<button
				class="rounded p-2 transition-colors hover:bg-gray-100"
				class:bg-gray-100={editor?.isActive('orderedList')}
				on:click={() => toggleFormat('OrderedList')}
			>
				<ListOrdered size={20} class="text-gray-600" />
			</button>

			<div class="mx-2 h-5 w-px bg-gray-200" />

			<button
				class="rounded p-2 transition-colors hover:bg-gray-100"
				class:bg-gray-100={editor?.isActive('link')}
				on:click={() => {
					linkSelection = window.getSelection()?.getRangeAt(0) || null;
					showLinkModal = true;
				}}
			>
				<Link2 size={20} class="text-gray-600" />
			</button>
		</div>
	</div>
</div>

{#if showLinkModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="w-96 rounded-lg bg-white p-4">
			<h3 class="mb-4 text-lg font-medium">Insert Link</h3>
			<input
				type="url"
				bind:value={linkUrl}
				placeholder="Enter URL"
				class="mb-4 w-full rounded-lg border px-3 py-2"
				on:keydown={(e) => e.key === 'Enter' && handleLinkSubmit()}
			/>
			<div class="flex justify-end space-x-2">
				<button
					class="rounded px-4 py-2 text-gray-600 hover:bg-gray-100"
					on:click={() => {
						showLinkModal = false;
						linkUrl = '';
					}}
				>
					Cancel
				</button>
				<button
					class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					on:click={handleLinkSubmit}
				>
					Add Link
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(.ProseMirror) {
		@apply min-h-[150px] outline-none;
	}

	:global(.ProseMirror p) {
		@apply my-4;
	}

	:global(.ProseMirror ul) {
		@apply my-4 list-disc pl-4;
	}

	:global(.ProseMirror ol) {
		@apply my-4 list-decimal pl-4;
	}

	:global(.ProseMirror li) {
		@apply my-1;
	}

	:global(.ProseMirror a) {
		@apply text-blue-600 underline hover:text-blue-800;
	}

	.dt-editor {
		position: relative;
	}

	:global(.dt-prose) {
		outline: none;
	}

	.dt-bubble-menu {
		display: flex;
		background-color: #fff;
		border-radius: 0.5rem;
		transition:
			visibility 0.1s ease,
			opacity 0.1s ease;
		border: 1px solid #e3e3e3;
		z-index: 50;
		position: fixed;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.menu-item {
		border: none;
		background: none;
		color: #000;
		font-weight: 500;
		padding: 7px;
		opacity: 0.6;
		margin: 0;
		width: 28px;
		height: 28px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-left: 1px solid #e8e8e8;
		border-radius: 0;
	}

	.menu-item:first-child {
		border-left: none;
		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: 0.5rem;
	}

	.menu-item:last-child {
		border-top-right-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
	}

	.menu-item.active {
		background: rgb(243 244 246);
		color: inherit;
	}

	.menu-item:hover,
	.menu-item.is-active {
		opacity: 1;
	}
</style>
