import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('Settings', () => {
    const showModal = ref(true)

    function init() {
        const saved = localStorage.getItem('article-modal-setting')
        if (saved !== null) {
            showModal.value = saved === 'true'
        }
    }

    function toggleModal() {
        showModal.value = !showModal.value
        localStorage.setItem('article-modal-setting', String(showModal.value))
    }

    return {
        showModal,
        init,
        toggleModal
    }
})
