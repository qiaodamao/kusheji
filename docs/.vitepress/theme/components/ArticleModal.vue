<template>
  <!-- 文章详情弹窗 - 类似小红书交互 -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="article-modal-overlay" @click.self="closeModal">
        <!-- 左侧切换区域 -->
        <div class="article-nav-zone article-nav-prev" @click.stop="prevArticle" v-if="hasPrev">
          <div class="nav-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
        </div>

        <!-- 右侧切换区域 -->
        <div class="article-nav-zone article-nav-next" @click.stop="nextArticle" v-if="hasNext">
          <div class="nav-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        <Transition name="modal-scale">
          <div v-if="visible" class="article-modal-container">
            <!-- 关闭按钮 -->
            <button class="modal-close" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="modal-content">
              <!-- 左侧图片区域 -->
              <div class="modal-image-section">
                <!-- 多张图片轮播 -->
                <template v-if="activeArticle?.images && activeArticle.images.length > 1">
                  <img 
                    :src="activeArticle.images[currentImageIndex]" 
                    :alt="activeArticle?.frontmatter?.title" 
                    class="modal-image" 
                  />
                  <!-- 左右切换箭头 -->
                  <button class="image-nav image-nav-prev" @click.stop="prevImage">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button class="image-nav image-nav-next" @click.stop="nextImage">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                  <!-- 图片指示器 -->
                  <div class="image-indicators">
                    <span 
                      v-for="(img, index) in activeArticle.images" 
                      :key="index"
                      class="indicator"
                      :class="{ active: currentImageIndex === index }"
                      @click.stop="goToImage(index)"
                    ></span>
                  </div>
                </template>
                <!-- 单张图片 -->
                <template v-else>
                  <img :src="activeArticle?.frontmatter?.cover" :alt="activeArticle?.frontmatter?.title" class="modal-image" />
                </template>
                <div class="image-overlay"></div>
              </div>

              <!-- 右侧内容区域 -->
              <div class="modal-info-section">
                <div class="info-header">
                  <h2 class="modal-title">{{ activeArticle?.frontmatter?.title }}</h2>
                  <div class="modal-meta">
                    <ClientOnly>
                      <ArticleMetadata :article="activeArticle" />
                    </ClientOnly>
                  </div>
                </div>

                <div class="info-body">
                  <div class="modal-desc" v-html="activeArticle?.frontmatter?.description"></div>

                  <!-- 分类和标签显示 -->
                  <div class="modal-meta-row" v-if="activeArticle?.frontmatter?.categories?.length || activeArticle?.frontmatter?.tags?.length">
                    <!-- 分类 -->
                    <div class="modal-categories-inline" v-if="activeArticle?.frontmatter?.categories?.length">
                      <span class="cat-label">分类</span>
                      <div class="cats-list">
                        <span v-for="cat in activeArticle.frontmatter.categories" :key="cat" class="cat-item">{{ cat }}</span>
                      </div>
                    </div>

                    <!-- 标签 -->
                    <div class="modal-tags-inline" v-if="activeArticle?.frontmatter?.tags?.length">
                      <span class="tag-label">标签</span>
                      <div class="tags-list">
                        <span v-for="tag in activeArticle.frontmatter.tags" :key="tag" class="tag-item">{{ tag }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="info-footer">
                  <div class="modal-actions">
                    <a :href="withBase(activeArticle?.relativePath || '')" class="modal-btn modal-btn-secondary">
                      阅读全文
                    </a>
                    <a :href="activeArticle?.frontmatter?.externalLink || activeArticle?.frontmatter?.github || activeArticle?.frontmatter?.view || '#'"
                       target="_blank" rel="noopener noreferrer" class="modal-btn modal-btn-primary">
                      {{ activeArticle?.frontmatter?.externalLinkText || activeArticle?.frontmatter?.githubText || activeArticle?.frontmatter?.viewText || '直接下载' }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { withBase } from 'vitepress'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import ArticleMetadata from './ArticleMetadata.vue'
import type { Post } from '../types'

const props = defineProps<{
  visible: boolean
  article?: Post
  posts?: Post[]
  currentIndex?: number
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}>()

const activeIndex = ref(props.currentIndex ?? 0)

const activeArticle = computed(() => {
  if (props.posts && props.posts.length > 0) {
    return props.posts[activeIndex.value]
  }
  return props.article
})

const hasPrev = computed(() => props.posts && props.posts.length > 1 && activeIndex.value > 0)
const hasNext = computed(() => props.posts && props.posts.length > 1 && activeIndex.value < props.posts.length - 1)

const prevArticle = () => {
  if (hasPrev.value) {
    activeIndex.value--
    currentImageIndex.value = 0
  }
}

const nextArticle = () => {
  if (hasNext.value) {
    activeIndex.value++
    currentImageIndex.value = 0
  }
}

const closeModal = () => {
  emit('update:visible', false)
  emit('close')
}

const currentImageIndex = ref(0)

const prevImage = () => {
  if (!activeArticle.value?.images) return
  currentImageIndex.value = (currentImageIndex.value - 1 + activeArticle.value.images.length) % activeArticle.value.images.length
}

const nextImage = () => {
  if (!activeArticle.value?.images) return
  currentImageIndex.value = (currentImageIndex.value + 1) % activeArticle.value.images.length
}

const goToImage = (index: number) => {
  currentImageIndex.value = index
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    activeIndex.value = props.currentIndex ?? 0
    currentImageIndex.value = 0
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!props.visible) return
  if (e.key === 'Escape') {
    closeModal()
  } else if (e.key === 'ArrowLeft') {
    prevArticle()
  } else if (e.key === 'ArrowRight') {
    nextArticle()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* 遮罩层 */
.article-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 文章切换区域 */
.article-nav-zone {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10000;
  transition: background 0.2s ease;
}

.article-nav-zone:hover {
  background: rgba(255, 255, 255, 0.05);
}

.article-nav-prev {
  left: 0;
}

.article-nav-next {
  right: 0;
}

.nav-arrow {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  opacity: 0;
}

.article-nav-zone:hover .nav-arrow {
  opacity: 1;
  color: rgba(255, 255, 255, 0.7);
}

/* 弹窗容器 */
.article-modal-container {
  background: var(--vp-c-bg);
  border-radius: 16px;
  overflow: hidden;
  max-width: 1100px;
  width: 95%;
  height: 85vh;
  max-height: 800px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 关闭按钮 */
.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: rotate(90deg);
}

/* 内容区域 */
.modal-content {
  display: flex;
  height: 100%;
}

/* 左侧图片 */
.modal-image-section {
  flex: 1.2;
  min-width: 0;
  position: relative;
  background: var(--vp-c-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
  pointer-events: none;
}

/* 图片切换箭头 */
.image-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  transition: all 0.3s ease;
}

.image-nav:hover {
  background: rgba(0, 0, 0, 0.8);
}

.image-nav-prev {
  left: 12px;
}

.image-nav-next {
  right: 12px;
}

/* 图片指示器 */
.image-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 5;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
}

/* 右侧信息 */
.modal-info-section {
  flex: 0 0 320px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 32px;
  overflow-y: auto;
}

.info-header {
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 12px 0;
  color: var(--vp-c-text-1);
}

.modal-meta {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.info-body {
  flex: 1;
  overflow-y: auto;
}

.modal-desc {
  font-size: 14px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
}

/* 标签和分类显示 - 文字在上，标签在下 */
.modal-meta-row {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.modal-categories-inline,
.modal-tags-inline {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.modal-categories-inline {
  flex-shrink: 0;
}

.modal-tags-inline {
  flex-shrink: 0;
}

.tag-label,
.cat-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  flex-shrink: 0;
}

.tags-list,
.cats-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item,
.cat-item {
  padding: 4px 12px;
  border-radius: 20px;
    font-size: 12px;
  background: #f6f6f7;
  color: #333;
  border: none;
  white-space: nowrap;
}

/* 底部操作 */
.info-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.modal-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.modal-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  flex: 1;
  text-align: center;
}

.modal-btn-primary {
  background: #0057ff;
  color: white;
}

.modal-btn-primary:hover {
  background: #0057ff;
  color: white;
  box-shadow: 0 8px 25px -8px #0057ff;
}

.modal-btn-primary:hover svg {
  stroke: white;
}

.modal-btn-secondary {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: none;
}

.modal-btn-secondary:hover {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

/* 动画效果 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

/* 响应式 */
@media screen and (max-width: 1024px) {
  .article-nav-zone {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .article-modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .article-nav-zone {
    display: none;
  }

  .article-modal-container {
    width: 100%;
    max-width: 100%;
    height: auto;
    max-height: 95vh;
    border-radius: 16px 16px 0 0;
    overflow-y: auto;
  }

  .modal-content {
    flex-direction: column;
    height: auto;
  }

  .modal-image-section {
    height: 200px;
    flex: none;
  }

  .modal-info-section {
    flex: none;
    width: 100%;
    padding: 20px;
    max-height: none;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .modal-desc {
    font-size: 13px;
    line-height: 1.6;
    max-height: none;
    overflow: visible;
  }

  .modal-meta-row {
    flex-direction: row;
    gap: 10px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-btn {
    justify-content: center;
    width: 100%;
  }
}

/* 滚动条美化 */
.modal-info-section::-webkit-scrollbar {
  width: 4px;
}

.modal-info-section::-webkit-scrollbar-track {
  background: transparent;
}

.modal-info-section::-webkit-scrollbar-thumb {
  background: var(--vp-c-gray-3);
  border-radius: 2px;
}
</style>
