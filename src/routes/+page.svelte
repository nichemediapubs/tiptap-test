<script lang="ts">
	import TiptapEditor from '$lib/components/TiptapEditor.svelte';

	let editorContent;
</script>

<div class="m-16">
	<TiptapEditor bind:content={editorContent} />
</div>

<div class="output">
	<h2>Output HTML:</h2>
	<pre>{editorContent}</pre>
</div>

<style>
	.output {
		margin-top: 2rem;
		padding: 1rem;
		background: #f5f5f5;
		border-radius: 4px;
	}
</style>
