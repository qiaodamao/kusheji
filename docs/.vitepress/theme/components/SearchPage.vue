<template>
  <div class="search-page">
    <div class="search-container">
      <div class="search-header">
        <h1 class="search-title">搜索</h1>
        <p class="search-label">搜索</p>
        <p class="search-subtitle">输入关键词搜索全站素材</p>
      </div>

      <div class="search-box-wrapper">
        <div class="search-box">
          <input 
            v-model="keyword" 
            type="text" 
            class="search-input" 
            placeholder="请输入要搜索的关键字"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <svg class="search-btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <span class="search-btn-text">搜索</span>
          </button>
        </div>
      </div>

      <div class="hot-search">
        <span class="hot-label">热门搜索：</span>
        <button 
          v-for="(tag, index) in hotTags" 
          :key="index" 
          class="hot-tag"
          @click="searchTag(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <div v-if="hasSearched" class="search-results">
        <div class="results-header">
          <span class="results-count">找到 {{ filteredPosts.length }} 个结果</span>
          <span v-if="keyword" class="results-keyword">"{{ keyword }}"</span>
        </div>

        <div v-if="filteredPosts.length > 0" class="results-grid">
          <div 
            v-for="(article, index) in filteredPosts" 
            :key="index" 
            class="result-item"
            @click="handleArticleClick(article)"
          >
            <div class="article-card">
              <div class="cover">
                <img class="img bgimg" :src="article.frontmatter?.cover" />
                <div class="overlay">
                  <div class="overlay-content">
                    <h3 class="title">{{ article.frontmatter?.title }}</h3>
                  </div>
                </div>
              </div>
              <div class="mobile-title">
                <h3 class="title">{{ article.frontmatter?.title }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="no-results">
          <p>未找到与 '{{ keyword }}' 相关的内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { data as themeposts } from '../posts.data'
import type { Post } from '../types'

const keyword = ref('')
const hasSearched = ref(false)

const hotTags = ['样机', '图标', '插画', '笔刷']

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

const handleSearch = () => {
  hasSearched.value = true
}

const searchTag = (tag: string) => {
  keyword.value = tag
  handleSearch()
}

const handleArticleClick = (article: Post) => {
  if (article.relativePath) {
    window.location.href = withBase(article.relativePath.replace('.md', ''))
  }
}

// 从 URL 参数获取搜索关键词
const getKeywordFromUrl = () => {
  if (typeof window === 'undefined') return ''
  const url = new URL(window.location.href)
  return url.searchParams.get('search') || ''
}

onMounted(() => {
  const urlKeyword = getKeywordFromUrl()
  if (urlKeyword) {
    keyword.value = urlKeyword
    hasSearched.value = true
  }
})
</script>

<style scoped>
.search-page {
  width: 100%;
  min-height: 60vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 32px;
  background-color: var(--vp-c-bg);
}

.search-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.search-header {
  margin-bottom: 40px;
}

.search-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 12px 0;
}

.search-label {
  font-size: 48px;
  color: var(--vp-c-text-1);
  margin: 0 0 20px 0;
  font-weight: 500;
}

.search-subtitle {
  font-size: 14px;
  color: var(--vp-c-text-3);
  margin: 0;
}

.search-box-wrapper {
  margin-bottom: 32px;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--vp-c-bg-alt);
  border-radius: 40px;
  padding: 8px 8px 8px 20px;
  transition: box-shadow 0.3s ease;
  max-width: 600px;
  margin: 0 auto;
}

.search-box:focus-within {
  box-shadow: none;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  color: var(--vp-c-text-1);
  padding-left: 12px;
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-btn {
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 30px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
  padding: 0 20px;
  gap: 6px;
}

.search-btn:hover {
  opacity: 0.9;
}

.search-btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.search-btn-text {
  font-size: 14px;
  font-weight: 500;
}

.hot-search {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 40px;
}

.hot-label {
  font-size: 14px;
  color: var(--vp-c-text-3);
}

.hot-tag {
  background: var(--vp-c-bg-alt);
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.hot-tag:hover {
  background: var(--vp-c-brand);
  color: white;
}

.search-results {
  margin-top: 20px;
}

.results-header {
  text-align: left;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.results-count {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.results-keyword {
  font-size: 14px;
  color: #000000;
  margin-left: 8px;
}

/* 瀑布流布局 */
.results-grid {
  column-count: 4;
  column-gap: 16px;
}

.result-item {
  break-inside: avoid;
  margin-bottom: 16px;
}

.article-card {
  cursor: pointer;
  overflow: hidden;
  border-radius: 0;
  background: var(--vp-c-bg-elv);
  box-shadow: none;
  border: none;
}

.cover {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.img {
  object-fit: cover;
  width: 100%;
  height: auto;
  display: block;
  margin: 0;
  padding: 0;
}

.overlay {
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

.article-card:hover .overlay {
  opacity: 1;
}

.overlay-content {
  padding: 15px;
  text-align: left;
  color: white;
  width: 100%;
}

.overlay-content .title {
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

.mobile-title {
  display: none;
}

.no-results {
  text-align: center;
  padding: 40px 0;
}

.no-results p {
  font-size: 14px;
  color: var(--vp-c-text-3);
  margin: 0;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .results-grid {
    column-count: 3;
  }
}

@media (max-width: 900px) {
  .results-grid {
    column-count: 2;
  }

  .article-card:hover .overlay {
    opacity: 0;
  }

  .mobile-title {
    display: block;
    padding: 10px 0 0 0;
  }

  .mobile-title .title {
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
  .search-title {
    font-size: 28px;
  }

  .search-header {
    margin-bottom: 30px;
  }

  .search-box {
    padding: 6px 6px 6px 16px;
  }

  .search-btn {
    padding: 10px;
    font-size: 13px;
    background-color: transparent;
    color: var(--vp-c-text-1);
  }

  .search-btn-text {
    display: none;
  }

  .search-btn-icon {
    width: 22px;
    height: 22px;
    margin-right: 5px;
  }

  .hot-search {
    gap: 8px;
    margin-bottom: 30px;
  }

  .hot-tag {
    padding: 5px 12px;
    font-size: 12px;
  }

  .results-grid {
    column-count: 2;
    column-gap: 10px;
  }

  .result-item {
    margin-bottom: 10px;
  }
}
</style>