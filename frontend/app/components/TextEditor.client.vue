<template>
  <div>
    <div class="custom-editor-wrapper relative">
     <QuillEditor
        ref="quillEditorRef"
        :content="modelValue"
        @update:content="$emit('update:modelValue', $event)"
        contentType="html"
        theme="snow"
        :toolbar="editorOptions.modules.toolbar" 
        :modules="customModules"
      />
    </div>

    <UModal
      v-if="isFileManagerOpen"
      :open="isFileManagerOpen"
      @update:open="isFileManagerOpen = $event"
      title="Fayl menejeri"
      :ui="{ width: 'sm:max-w-4xl' }"
    >
      <template #body>
        <div class="max-h-[80vh] overflow-y-auto">
          <FileManagerModal
            @select="handleFileManagerSelect"
            @close="isFileManagerOpen = false"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

// 1. Yangi modulni import qilamiz
import BlotFormatter from 'quill-blot-formatter'

const { ENV_BASE } = useEnv()

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const quillEditorRef = ref(null)
const isFileManagerOpen = ref(false)

const openFileManager = () => {
  isFileManagerOpen.value = true
}

const closeFileManager = () => {
  isFileManagerOpen.value = false
}

// 2. Vue Quill uchun maxsus modullar massivini (array) yaratamiz
const customModules = [
  {
    name: 'blotFormatter',
    module: BlotFormatter,
    options: {
      // Qo'shimcha sozlamalar (ixtiyoriy)
    }
  }
]

const editorOptions = ref({
  modules: {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 1 }, { header: 2 }, { header: 3 }, { header: 4 }, { header: 5 }, { header: 6 }],
        // Matnni tekislash tugmalari (chap, o'rta, o'ng, justify)
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }], 
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: openFileManager
      }
    }
    // E'tibor bering: blotFormatter ni bu yerda emas, tepadagi customModules orqali beramiz
  }
})

const handleFileManagerSelect = (url) => {
  closeFileManager()

  if (!url) return

  const fullImageUrl = url.startsWith('http')
    ? url
    : `${ENV_BASE}${url.startsWith('/') ? '' : '/'}${url}`

  const quill = quillEditorRef.value?.getQuill?.()
  if (!quill) return

  const range = quill.getSelection(true) || { index: quill.getLength() }

  quill.insertEmbed(range.index, 'image', fullImageUrl, 'user')
  quill.setSelection(range.index + 1, 0, 'user')
}
</script>

<style scoped>
.custom-editor-wrapper {
  background-color: white;
  border-radius: 8px;
  width: 100%;
}

:deep(.ql-container) {
  min-height: 250px;
  font-size: 16px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

:deep(.ql-toolbar) {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>