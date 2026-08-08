<template>
  <div class="search-results-page">
    <div class="search-header">
      <div class="search-header-inner">
        <h1 class="search-title">搜索："{{ keyword }}"</h1>
        <p class="search-count">{{ filteredPosts.length }} 个结果</p>
      </div>
    </div>

    <div class="search-body" v-if="filteredPosts.length > 0">
      <div class="search-grid">
        <div class="search-item" v-for="(article, index) in filteredPosts" :key="index">
          <div class="item-card" @click="handleClick(article)">
            <div class="item-cover">
              <img class="item-img bgimg" :src="article.frontmatter?.cover" :alt="article.frontmatter?.title" />
              <div class="item-overlay">
                <h3 class="item-title">{{ article.frontmatter?.title }}</h3>
              </div>
            </div>
            <div class="item-mobile-title">
              <h3 class="item-title">{{ article.frontmatter?.title }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="search-empty" v-else>
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>
      <p class="empty-text">未找到与 '{{ keyword }}' 相关的内容</p>
      <a class="empty-link" :href="withBase(`/`)">返回首页</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { withBase, useRoute } from 'vitepress'
import { data as themeposts } from '../posts.data'
import type { Post } from '../types'

const route = useRoute()
const keyword = ref('')

const filteredPosts = computed(() => {
  if (!keyword.value.trim()) return []
  const kw = keyword.value.trim().toLowerCase()
  return themeposts.filter((post: Post) => {
    const title = (post.frontmatter?.title || '').toLowerCase()
    const description = (post.frontmatter?.description || '').toLowerCase()
    const tags = (post.frontmatter?.tags || []).join(' ').toLowerCase()
    const categories = (post.frontmatter?.categories || []).join(' ').toLowerCase()
    return title.includes(kw) || description.includes(kw) || tags.includes(kw) || categories.includes(kw)
  })
})

const handleClick = (article: Post) => {
  if (article.relativePath) {
    window.location.href = withBase(article.relativePath.replace('.md', ''))
  }
}

const getKeywordFromUrl = () => {
  return route.query.search as string || ''
}

watch(() => route.query.search, (newSearch) => {
  keyword.value = (newSearch as string) || ''
}, { immediate: true })

onMounted(() => {
  keyword.value = getKeywordFromUrl()
})
</script>

<style scoped>
.search-results-page {
  width: 100%;
}

.search-header {
  background-color: var(--vp-c-bg-alt);
  padding: 48px 0;
  width: 100vw;
  box-sizing: border-box;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 32px;
}

.search-header-inner {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
  padding: 0 32px;
}

.search-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.search-count {
  font-size: 14px;
  color: var(--vp-c-text-3);
  margin: 0;
}

.search-body {
  width: 100%;
}

.search-grid {
  column-count: 4;
  column-gap: 16px;
}

.search-item {
  break-inside: avoid;
  margin-bottom: 16px;
}

.item-card {
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--vp-shadow-2);
}

.item-cover {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.item-img {
  object-fit: cover;
  width: 100%;
  height: auto;
  display: block;
}

.item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.item-card:hover .item-overlay {
  opacity: 1;
}

.item-overlay .item-title {
  padding: 15px;
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
}

.item-mobile-title {
  display: none;
}

.search-empty {
  text-align: center;
  padding: 80px 32px;
}

.empty-icon {
  color: var(--vp-c-text-3);
  margin-bottom: 24px;
}

.empty-text {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin: 0 0 24px 0;
}

.empty-link {
  display: inline-block;
  padding: 10px 24px;
  background-color: var(--vp-c-brand);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.empty-link:hover {
  opacity: 0.9;
}

@media (max-width: 1200px) {
  .search-grid {
    column-count: 3;
  }
}

@media (max-width: 900px) {
  .search-grid {
    column-count: 2;
  }

  .search-header {
    padding: 32px 0;
  }

  .search-header-inner {
    padding: 0 20px;
  }

  .search-title {
    font-size: 22px;
  }

  .item-card:hover .item-overlay {
    opacity: 0;
  }

  .item-mobile-title {
    display: block;
    padding: 10px 0 0 0;
  }

  .item-mobile-title .item-title {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
    color: var(--vp-c-text-1);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
  }
}

@media (max-width: 500px) {
  .search-grid {
    column-count: 2;
    column-gap: 10px;
  }

  .search-item {
    margin-bottom: 10px;
  }
}
</style>
