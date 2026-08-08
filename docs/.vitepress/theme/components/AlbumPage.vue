<template>
  <div class="album-page">
    <template v-if="!albumName">
      <div class="album-banner">
        <div class="album-banner-content">
          <h1 class="album-banner-title">专辑</h1>
          <p class="album-banner-desc">按专辑分类浏览</p>
        </div>
      </div>

      <div class="album-grid">
        <div
          v-for="album in albums"
          :key="album.name"
          class="album-card"
          @click="goToAlbum(album.name)"
        >
          <div class="album-covers">
            <div class="cover-grid" :class="'cover-grid-' + Math.min(album.covers.length, 3)">
                  <div
                    v-for="(cover, idx) in album.covers.slice(0, 3)"
                :key="idx"
                class="cover-item"
              >
                <img :src="cover" :alt="album.name" />
              </div>
            </div>
          </div>
          <div class="album-info">
            <span class="album-name">{{ album.name }}</span>
            <span class="album-count">{{ album.count }} 篇</span>
          </div>
        </div>
      </div>

      <div v-if="albums.length === 0" class="album-empty">
        暂无专辑分类
      </div>
    </template>

    <template v-else>
      <div class="album-detail-header">
        <a :href="withBase('/pages/album')" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          全部专辑
        </a>
        <h1 class="album-detail-title">{{ albumName }}</h1>
        <span class="album-detail-count">{{ filteredPosts.length }} 篇文章</span>
      </div>

      <div class="album-detail-grid">
        <div v-for="(post, index) in filteredPosts" :key="index" class="album-detail-item">
          <ArticleList :article="post" :posts="filteredPosts" :index="index" />
        </div>
      </div>

      <div v-if="filteredPosts.length === 0" class="album-empty">
        该专辑下暂无文章
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { data as themeposts } from '../posts.data'
import ArticleList from './ArticleList.vue'

const albumName = ref('')

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  albumName.value = params.get('album') || ''
})

const albums = computed(() => {
  const albumMap = new Map<string, { covers: string[]; count: number }>()

  themeposts.forEach((post: any) => {
    const albumList = post.frontmatter?.album
    if (!albumList || !Array.isArray(albumList)) return
    albumList.forEach((name: string) => {
      if (!name) return
      if (!albumMap.has(name)) {
        albumMap.set(name, { covers: [], count: 0 })
      }
      const entry = albumMap.get(name)!
      entry.count++
      if (post.frontmatter?.cover) {
        entry.covers.push(post.frontmatter.cover)
      }
    })
  })

  return Array.from(albumMap.entries())
    .map(([name, data]) => ({
      name,
      covers: data.covers,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count)
})

const filteredPosts = computed(() => {
  if (!albumName.value) return []
  return themeposts.filter((post: any) => {
    const albumList = post.frontmatter?.album
    return albumList && Array.isArray(albumList) && albumList.includes(albumName.value)
  })
})

const goToAlbum = (name: string) => {
  window.location.href = withBase(`/pages/album?album=${encodeURIComponent(name)}`)
}
</script>

<style scoped>
.album-page {
  margin: 0 auto;
  padding: 0;
}

.album-banner {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 32px;
}

.album-banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.album-banner-title {
  display: block !important;
  font-size: 48px;
  margin: 0 0 8px 0;
  letter-spacing: 4px;
  color: var(--vp-c-text-1);
}

.album-banner-desc {
  font-size: 14px;
  margin: 0;
  opacity: 0.85;
  color: #929295 !important;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.album-card {
  background: transparent;
  border-radius: 0;
  overflow: hidden;
  cursor: pointer;
}

.album-covers {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
}

.cover-grid {
  display: grid;
  width: 100%;
  height: 100%;
  gap: 2px;
}

.cover-grid-1 {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.cover-grid-2 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}

.cover-grid-3 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.cover-grid-3 .cover-item:first-child {
  grid-row: 1 / 3;
}

.cover-item {
  overflow: hidden;
}

.cover-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.album-info {
  padding: 14px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.album-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.album-count {
  font-size: 13px;
  color: var(--vp-c-text-3);
  display: flex;
  align-items: center;
  gap: 4px;
}

.album-detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 24px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
  flex-shrink: 0;
}

.back-link:hover {
  color: var(--vp-c-brand);
}

.album-detail-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--vp-c-text-1);
}

.album-detail-count {
  font-size: 14px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.album-detail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.album-detail-item {
  min-width: 0;
}

.album-empty {
  text-align: center;
  padding: 80px 0;
  color: var(--vp-c-text-3);
  font-size: 16px;
}

@media screen and (max-width: 1024px) {
  .album-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .album-detail-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 640px) {
  .album-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 12px;
  }

  .album-banner {
    height: 150px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .album-banner-title {
    font-size: 48px;
  }

  .album-banner-desc {
    font-size: 14px;
  }

  .album-info {
    padding: 10px 12px;
  }

  .album-name {
    font-size: 13px;
  }

  .album-count {
    font-size: 12px;
  }

  .album-detail-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .album-detail-header {
    padding: 16px 0;
    gap: 12px;
  }

  .album-detail-title {
    font-size: 20px;
  }
}
</style>
