<template>
  <div ref="toggleRef" class="modal-toggle-wrapper">
    <div class="modal-toggle" @click="toggle" :title="showModal ? '当前：弹窗打开文章，点击切换为直接跳转' : '当前：直接跳转文章，点击切换为弹窗打开'">
      <svg v-if="showModal" class="toggle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
      <svg v-else class="toggle-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M298.666667 170.666667a42.666667 42.666667 0 0 1 7.68 84.650666L298.666667 256H85.333333v512h682.666667V640l0.682667-7.68a42.666667 42.666667 0 0 1 34.304-34.304L810.666667 597.333333a42.666667 42.666667 0 0 1 41.984 34.986667L853.333333 640V768a85.333333 85.333333 0 0 1-85.333333 85.333333H85.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V256a85.333333 85.333333 0 0 1 85.333333-85.333333h213.333334zM938.666667 85.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v256a85.333333 85.333333 0 0 1-85.333333 85.333333H512a85.333333 85.333333 0 0 1-85.333333-85.333333V170.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h426.666667z m0 85.333334H512v256h426.666667V170.666667z" fill="currentColor"></path>
      </svg>
    </div>
    <span class="modal-toggle-divider"></span>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '../../store/settings'

const settings = useSettingsStore()
const toggleRef = ref<HTMLElement | null>(null)

const showModal = computed(() => settings.showModal)

const toggle = () => {
  settings.toggleModal()
}

onMounted(() => {
  settings.init()
  const socialLinks = document.querySelector('.VPSocialLinks')
  if (socialLinks && toggleRef.value) {
    socialLinks.parentNode?.insertBefore(toggleRef.value, socialLinks)
  }
})
</script>

<style scoped>
.modal-toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 10px;
}

.modal-toggle-divider {
  width: 1px;
  height: 24px;
  background-color: var(--vp-c-divider);
}

.modal-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: color 0.25s, background-color 0.25s;
  color: var(--vp-c-text-2);
}

.modal-toggle:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
}

.toggle-icon {
  width: 18px;
  height: 18px;
}
</style>
