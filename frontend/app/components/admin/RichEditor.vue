<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'

const model = defineModel<string>({ default: '' })
withDefaults(defineProps<{ placeholder?: string }>(), { placeholder: 'Matnni shu yerga yozing...' })

const media = useMedia()
const pickerOpen = ref(false)
const editorRef = ref<{ editor?: Editor } | null>(null)

const items = computed<EditorToolbarItem[][]>(() => [
  [
    { kind: 'undo', icon: 'i-lucide-undo-2', tooltip: { text: 'Bekor qilish' } },
    { kind: 'redo', icon: 'i-lucide-redo-2', tooltip: { text: 'Qaytarish' } }
  ],
  [
    {
      icon: 'i-lucide-heading',
      tooltip: { text: 'Sarlavha' },
      content: { align: 'start' },
      items: [
        { kind: 'paragraph', label: 'Oddiy matn', icon: 'i-lucide-type' },
        { kind: 'heading', level: 2, label: 'Sarlavha 2', icon: 'i-lucide-heading-2' },
        { kind: 'heading', level: 3, label: 'Sarlavha 3', icon: 'i-lucide-heading-3' },
        { kind: 'heading', level: 4, label: 'Sarlavha 4', icon: 'i-lucide-heading-4' }
      ]
    }
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Qalin' } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Kursiv' } },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: 'Tagiga chizilgan' } },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', tooltip: { text: 'O‘chirilgan' } }
  ],
  [
    { kind: 'bulletList', icon: 'i-lucide-list', tooltip: { text: 'Ro‘yxat' } },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered', tooltip: { text: 'Raqamli ro‘yxat' } },
    { kind: 'blockquote', icon: 'i-lucide-text-quote', tooltip: { text: 'Iqtibos' } },
    { kind: 'horizontalRule', icon: 'i-lucide-separator-horizontal', tooltip: { text: 'Ajratuvchi chiziq' } }
  ],
  [
    { kind: 'link', icon: 'i-lucide-link', tooltip: { text: 'Havola' } },
    { icon: 'i-lucide-image-plus', tooltip: { text: 'Rasm qo‘shish' }, onClick: () => (pickerOpen.value = true) },
    { kind: 'clearFormatting', icon: 'i-lucide-remove-formatting', tooltip: { text: 'Formatni tozalash' } }
  ]
])

const insertImage = (url: string) => {
  pickerOpen.value = false
  editorRef.value?.editor?.chain().focus().setImage({ src: media(url) ?? url }).run()
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-default bg-default focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
    <UEditor
      ref="editorRef"
      v-slot="{ editor }"
      v-model="model"
      content-type="html"
      :placeholder="placeholder"
      :image="{ inline: false, allowBase64: false }"
      class="w-full"
      :ui="{ base: 'rich-content min-h-72 px-4 py-4 sm:px-6 text-base' }"
    >
      <UEditorToolbar
        :editor="editor"
        :items="items"
        class="sticky top-0 z-10 overflow-x-auto border-b border-default bg-default/95 px-2 py-1.5 backdrop-blur"
      />
    </UEditor>
    <AdminFileManagerModal
      v-model:open="pickerOpen"
      accept="image"
      @select="insertImage"
    />
  </div>
</template>
