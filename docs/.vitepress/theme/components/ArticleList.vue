<template>
  <!-- 文章列表内容 -->
  <div class="articlelist">
    <div class="acontent">
      <!-- 根据配置决定点击行为：弹窗或直接跳转 -->
      <div class="main" @click="handleClick">
        <div class="cover">
          <img class="img bgimg cursor-pointer" :src="article.frontmatter?.cover" />
          <!-- hover 时显示的信息层（桌面端） -->
          <div class="overlay desktop-overlay">
            <div class="overlay-content">
              <h3 class="title">{{ article.frontmatter.title }}</h3>
            </div>
          </div>
        </div>
        <!-- 手机端标题显示在图片下方 -->
        <div class="mobile-title">
          <h3 class="title">{{ article.frontmatter.title }}</h3>
        </div>
      </div>
    </div>

    <!-- 文章详情弹窗（仅在启用弹窗功能时显示） -->
    <ArticleModal v-if="showModal" v-model:visible="modalVisible" :article="article" :posts="posts" :current-index="index" @close="modalVisible = false" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useData, withBase } from 'vitepress'
import ArticleModal from './ArticleModal.vue'
import { useSettingsStore } from '../../store/settings'
import type { Post } from '../types'

const { theme } = useData()
const settings = useSettingsStore()

onMounted(() => {
  settings.init()
})

// 定义文章属性
const props = defineProps<{
  article?: Post
  posts?: Post[]
  index?: number
  disableModal?: boolean
}>();

const modalVisible = ref(false)

const showModal = computed(() => !props.disableModal && settings.showModal && theme.value?.website?.showArticleModal !== false)

// 处理点击事件
const handleClick = () => {
  if (showModal.value) {
    // 启用弹窗模式
    modalVisible.value = true
  } else {
    // 直接跳转详情页
    if (props.article?.relativePath) {
      window.location.href = withBase(props.article.relativePath.replace('.md', ''))
    }
  }
}
</script>

<style scoped>
.articlelist {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  flex-grow: 1;
  background: var(--vp-c-bg-elv);
  overflow: hidden;

  .cover {
    width: 100%;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    background-color: var(--vp-c-bg-alt);

    .img {
      object-fit: cover;
      width: 100%;
      height: auto;
      display: block;
      box-sizing: border-box;
    }

    /* hover 时显示的遮罩层 */
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%);
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;
      pointer-events: none;

      .overlay-content {
        padding: 15px;
        text-align: left;
        color: white;
        width: auto;
        box-sizing: border-box;

        .title {
          margin: 0;
          font-size: 14px;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-wrap: break-word;
        }
      }
    }
  }

  /* 手机端标题区域 - 默认隐藏 */
  .mobile-title {
    display: none;
  }
}

.articlelist:hover {
  background-color: var(--vp-c-bg-elv);
  overflow: hidden;
}

/* hover 时显示 overlay */
.articlelist:hover .cover .overlay {
  opacity: 1;
}

/* 卡片可点击指示 */
.cursor-pointer {
  cursor: pointer;
}

.articlelist .main {
  cursor: pointer;
}

/* 响应式调整 - 桌面端 */
@media screen and (min-width: 900px) {
  /* 桌面端隐藏手机端标题，显示桌面端 overlay */
  .articlelist .mobile-title {
    display: none;
  }
  
  .articlelist .cover .desktop-overlay {
    display: flex;
  }
}

/* 响应式调整 - 手机端 */
@media screen and (max-width: 900px) {
  .articlelist {
    width: 100% !important;
    box-sizing: border-box !important;
  }
  
  /* 手机端隐藏桌面端 overlay */
  .articlelist .cover .desktop-overlay {
    display: none !important;
  }
  
  /* 手机端显示图片下方的标题 */
  .articlelist .mobile-title {
    display: block !important;
    padding: 10px 0 0 0 !important;
    box-sizing: border-box !important;
    
    .title {
      margin: 0 !important;
      font-size: 14px !important;
      line-height: 1.4 !important;
      color: var(--vp-c-text-1) !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      word-wrap: break-word !important;
    }
  }
  
  /* 手机端移除 hover 效果，因为触摸设备不需要 */
  .articlelist:hover .cover .desktop-overlay {
    opacity: 0 !important;
  }
}
</style>
