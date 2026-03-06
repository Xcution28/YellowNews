<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useUpload } from '@/composables/useUpload'
import type { IUploadResponse } from '@/types'

const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits<{
    'update:modelValue': [html: string]
}>()

const { uploadFile } = useUpload()

const headingButtons = [
    { label: 'H1', level: 1 as const },
    { label: 'H2', level: 2 as const },
    { label: 'H3', level: 3 as const }
]

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit.configure({
            codeBlock: { languageClassPrefix: 'language-' }
        }),
        Image.configure({ inline: false, allowBase64: true }),
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                rel: 'noopener noreferrer',
                target: '_blank'
            }
        })
    ],
    editorProps: {
        attributes: {
            class: 'tiptap-prose',
            spellcheck: 'true'
        }
    },
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    }
})

watch(
    () => props.modelValue,
    (val) => {
        if (editor.value && editor.value.getHTML() !== val) {
            editor.value.commands.setContent(val, { emitUpdate: false })
        }
    }
)

async function handleImageUpload(e: Event): Promise<void> {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file || !editor.value) return
    const result: IUploadResponse | null = await uploadFile(file)
    if (result) {
        editor.value.chain().focus().setImage({ src: result.url }).run()
    }
    ;(e.target as HTMLInputElement).value = ''
}

async function handleFileAttach(e: Event): Promise<void> {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file || !editor.value) return
    const result: IUploadResponse | null = await uploadFile(file)
    if (result) {
        editor.value
            .chain()
            .focus()
            .insertContent(
                ` <a href="${result.url}" target="_blank" rel="noopener noreferrer">${result.filename}</a> `
            )
            .run()
    }
    ;(e.target as HTMLInputElement).value = ''
}

onBeforeUnmount(() => {
    editor.value?.destroy()
})
</script>

<template>
    <div class="tiptap-editor">
        <div v-if="editor" class="tiptap-toolbar">
            <div class="tiptap-toolbar__group">
                <button
                    v-for="btn in headingButtons"
                    :key="btn.label"
                    class="toolbar-btn"
                    :class="{ active: editor.isActive('heading', { level: btn.level }) }"
                    :title="btn.label"
                    @click="editor.chain().focus().toggleHeading({ level: btn.level }).run()"
                >
                    {{ btn.label }}
                </button>
            </div>

            <div class="tiptap-toolbar__divider"></div>

            <div class="tiptap-toolbar__group">
                <button
                    class="toolbar-btn"
                    :class="{ active: editor.isActive('bold') }"
                    title="Жирный"
                    @click="editor.chain().focus().toggleBold().run()"
                >
                    <strong>Ж</strong>
                </button>
                <button
                    class="toolbar-btn"
                    :class="{ active: editor.isActive('italic') }"
                    title="Курсив"
                    @click="editor.chain().focus().toggleItalic().run()"
                >
                    <em>К</em>
                </button>
            </div>

            <div class="tiptap-toolbar__divider"></div>

            <div class="tiptap-toolbar__group">
                <button
                    class="toolbar-btn"
                    :class="{ active: editor.isActive('blockquote') }"
                    title="Цитата"
                    @click="editor.chain().focus().toggleBlockquote().run()"
                >
                    ❝
                </button>
                <button
                    class="toolbar-btn"
                    :class="{ active: editor.isActive('codeBlock') }"
                    title="Код"
                    @click="editor.chain().focus().toggleCodeBlock().run()"
                >
                    &lt;/&gt;
                </button>
            </div>

            <div class="tiptap-toolbar__divider"></div>

            <div class="tiptap-toolbar__group">
                <label class="toolbar-btn cursor-pointer" title="Изображение">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>
                    <input type="file" accept="image/*" hidden @change="handleImageUpload" />
                </label>
                <label class="toolbar-btn cursor-pointer" title="Файл">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path
                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                        ></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <input type="file" hidden @change="handleFileAttach" />
                </label>
            </div>
        </div>

        <EditorContent :editor="editor" class="tiptap-content" />
    </div>
</template>

<style lang="sass">
@use '@/styles/variables' as *

.tiptap-editor
  border: 1px solid $color-border
  border-radius: $radius-lg
  overflow: hidden
  background: $color-bg-input

.tiptap-toolbar
  display: flex
  align-items: center
  flex-wrap: wrap
  gap: $space-xs
  padding: $space-sm $space-md
  border-bottom: 1px solid $color-border
  background: $color-bg-card

  &__group
    display: flex
    align-items: center
    gap: 2px

  &__divider
    width: 1px
    height: 20px
    background: $color-border
    margin: 0 $space-xs

.toolbar-btn
  display: inline-flex
  align-items: center
  justify-content: center
  width: 32px
  height: 32px
  border: 1px solid transparent
  border-radius: $radius-sm
  background: transparent
  color: $text-secondary
  font-size: 0.85rem
  cursor: pointer
  transition: all $transition

  &:hover
    background: rgba(255, 255, 255, 0.06)
    color: $text-primary

  &.active
    background: rgba($color-primary, 0.15)
    color: $color-primary
    border-color: rgba($color-primary, 0.3)

.tiptap-content
  padding: $space-lg

.tiptap-prose
  min-height: 320px
  outline: none
  font-size: 0.95rem
  line-height: 1.8
  color: $text-primary

  h1, h2, h3
    font-weight: 700
    margin: 1.2em 0 0.4em
    color: $text-primary

  h1
    font-size: 1.8rem

  h2
    font-size: 1.4rem

  h3
    font-size: 1.1rem

  p
    margin-bottom: 0.8em

  strong
    color: $text-primary

  em
    font-style: italic

  blockquote
    border-left: 3px solid $color-primary
    margin: 1em 0
    padding: $space-sm $space-md
    color: $text-secondary
    font-style: italic
    background: rgba($color-primary, 0.05)
    border-radius: 0 $radius-sm $radius-sm 0

  pre
    background: #0a0c15
    border: 1px solid $color-border
    border-radius: $radius-md
    padding: $space-md
    overflow-x: auto
    font-family: $font-mono
    font-size: 0.875rem
    margin: 1em 0

    code
      background: none
      color: #e2c08d
      padding: 0
      font-size: inherit

  code
    background: rgba($color-primary, 0.1)
    color: $color-primary
    border-radius: $radius-sm
    padding: 2px 6px
    font-family: $font-mono
    font-size: 0.85em

  img
    max-width: 100%
    border-radius: $radius-md
    margin: $space-md 0

  ul, ol
    padding-left: 1.5em
    margin-bottom: 0.8em

  a
    color: $color-primary
    text-decoration: none
    border-bottom: 1px dashed rgba($color-primary, 0.4)
    transition: all $transition
    &:hover
      color: lighten($color-primary, 10%)
      border-bottom-color: $color-primary
</style>
