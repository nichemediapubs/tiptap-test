import { Mark } from "@tiptap/core";

export const AiInsertion = Mark.create({
    name: 'AiInsertion', // The name of the mark
    addAttributes() {
        return {
            class: {
                default: 'ai-insertion', // Default class to apply
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span', // Target all tags
                getAttrs: (node) => {
                    // Check if the class is already applied
                    return node instanceof HTMLElement && node.classList.contains('ai-insertion')
                        ? { class: 'ai-insertion' }
                        : null;
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const { class: className } = HTMLAttributes;
        return ['span', { class: className }, 0]; // Apply the class to the tag
    },
});