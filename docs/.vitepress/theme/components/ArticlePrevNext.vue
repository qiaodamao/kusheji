<template>
  <div class="article-prev-next" v-if="prev || next">
    <div class="nav-container">
      <a v-if="prev" class="nav-item prev" :href="withBase(prev.relativePath)">
        <div class="nav-label">
          <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
          </svg>
          <span>上一篇</span>
        </div>
        <div class="nav-title">{{ prev.frontmatter?.title || '上一篇' }}</div>
      </a>
      <div v-else class="nav-item prev disabled">
        <div class="nav-label">
          <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
          </svg>
          <span>上一篇</span>
        </div>
        <div class="nav-title">没有了</div>
      </div>

      <a v-if="next" class="nav-item next" :href="withBase(next.relativePath)">
        <div class="nav-label">
          <span>下一篇</span>
          <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
          </svg>
        </div>
        <div class="nav-title">{{ next.frontmatter?.title || '下一篇' }}</div>
      </a>
      <div v-else class="nav-item next disabled">
        <div class="nav-label">
          <span>下一篇</span>
          <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
          </svg>
        </div>
        <div class="nav-title">没有了</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as themeposts } from '../posts.data'
import type { Post } from '../types'

const { page } = useData()

const currentIndex = computed(() => {
  const currentPath = page.value.relativePath.replace(/\.md$/, '.html')
  return themeposts.findIndex((post: Post) => {
    const postPath = post.relativePath || ''
    return postPath === currentPath || postPath === '/' + currentPath
  })
})

const prev = computed(() => {
  const index = currentIndex.value
  if (index > 0) {
    return themeposts[index - 1]
  }
  return null
})

const next = computed(() => {
  const index = currentIndex.value
  if (index >= 0 && index < themeposts.length - 1) {
    return themeposts[index + 1]
  }
  return null
})
</script>

<style scoped>
.article-prev-next {
  margin-top: 32px;
  margin-bottom: 16px;
}

.nav-container {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-elv);
  text-decoration: none;
  transition: all 0.3s ease;
  min-width: 0;
}

.nav-item:hover {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-alt);
}

.nav-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.nav-item.next {
  align-items: flex-end;
  text-align: right;
}

.nav-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}

.nav-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.nav-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (max-width: 640px) {
  .nav-container {
    flex-direction: column;
  }

  .nav-item.next {
    align-items: flex-start;
    text-align: left;
  }
}
</style>
