<template>
  <div class="hero-banner" :style="{ backgroundImage: `url(${currentBgItem?.image})` }">
    <div class="hero-overlay"></div>

    <div class="hero-content">
      <!-- 网站标题和描述 -->
      <div class="hero-header">
        <h1 class="hero-title">{{ theme.website?.title || '酷设计' }}</h1>
        <p class="hero-description">{{ theme.website?.description || '设计学习交流平台' }}</p>
      </div>
      
      <!-- 搜索框 -->
      <div class="hero-search">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            class="search-input" 
            placeholder="请输入要搜索的关键词"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>
        
        <!-- 热门搜索 -->
        <div class="hot-search">
          <span class="hot-label">热门搜索：</span>
          <span 
            v-for="tag in hotTags" 
            :key="tag" 
            class="hot-tag"
            @click="searchTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 右下角信息：随机模式显示文章，自定义模式显示当前背景图对应的自定义标题和链接（新窗口打开） -->
    <div class="hero-post-info" v-if="postInfo">
      <a :href="postInfo.link" class="post-link" :target="postInfo.external ? '_blank' : '_self'" :rel="postInfo.external ? 'noopener noreferrer' : undefined">
        <svg class="link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <span class="post-title">{{ postInfo.title }}</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as themeposts } from '../posts.data'

const { theme } = useData()

const searchQuery = ref('')

const randomPost = ref<any>(null)

// 文章详情页地址（用于随机模式下右下角链接）
const getPostUrl = (post: any) => {
  return withBase(post.relativePath.replace('.md', ''))
}

// 背景图模式：'random' 随机文章封面 | 'custom' 自定义背景图
const isRandomMode = computed(() => (theme.value as any)?.heroBgMode !== 'custom')

// 统一的背景项结构：{ image, link?, title? }
interface BgItem {
  image: string
  link?: string
  title?: string
}

// 当前显示的背景项：
// - 自定义模式：heroBgImage 支持字符串 / 字符串数组 / 对象数组 {link,image,title}，多张时每次刷新随机一张
// - 随机模式：用随机文章封面
const currentBgItem = ref<BgItem | null>(null)

// 右下角显示的信息：随机模式取文章链接和标题；自定义模式取当前背景项的 link 和 title
const postInfo = computed(() => {
  if (isRandomMode.value) {
    if (!randomPost.value) return null
    return {
      link: getPostUrl(randomPost.value),
      title: randomPost.value.frontmatter.title,
      external: false
    }
  }
  const item = currentBgItem.value
  if (!item || !item.title) return null
  return {
    link: item.link || 'javascript:void(0)',
    title: item.title,
    external: !!item.link  // 自定义模式下，配置了 link 才在新窗口打开
  }
})

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = typeof window !== 'undefined' && window.innerWidth <= 768
}

if (typeof window !== 'undefined') {
  checkMobile()
  window.addEventListener('resize', checkMobile)
}

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkMobile)
  }
})

const hotTags = computed(() => {
  const tags: string[] = []
  themeposts.forEach((post: any) => {
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach((tag: string) => {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      })
    }
  })
  return tags.slice(0, isMobile.value ? 3 : 6)
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    window.location.href = withBase(`/pages/search?search=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

const searchTag = (tag: string) => {
  window.location.href = withBase(`/pages/search?search=${encodeURIComponent(tag)}`)
}

onMounted(() => {
  const t = theme.value as any
  if (!isRandomMode.value && t?.heroBgImage) {
    // 自定义模式：从配置中随机选一张
    const raw = t.heroBgImage
    let items: BgItem[] = []
    if (Array.isArray(raw)) {
      items = raw
        .map((it: any) => {
          if (typeof it === 'string') return { image: it }
          if (it && typeof it === 'object' && it.image) {
            return { image: it.image, link: it.link, title: it.title }
          }
          return null
        })
        .filter((it: BgItem | null): it is BgItem => !!it && !!it.image)
    } else if (typeof raw === 'string' && raw) {
      items = [{ image: raw }]
    }
    if (items.length > 0) {
      // 避免连续刷新显示同一张：用 sessionStorage 记住上次显示的 image
      const lastImage = sessionStorage.getItem('hero_last_image')
      let pool = items
      if (lastImage && items.length > 1) {
        pool = items.filter(it => it.image !== lastImage)
      }
      const picked = pool[Math.floor(Math.random() * pool.length)]
      currentBgItem.value = picked
      sessionStorage.setItem('hero_last_image', picked.image)
    }
  } else {
    // 随机模式：用随机文章封面
    const postsWithCover = themeposts.filter((post: any) => post.frontmatter.cover)
    if (postsWithCover.length > 0) {
      const randomIndex = Math.floor(Math.random() * postsWithCover.length)
      randomPost.value = postsWithCover[randomIndex]
      currentBgItem.value = { image: randomPost.value.frontmatter.cover }
    }
  }
})
</script>

<style scoped>
.hero-banner {
  position: relative;
  width: 100vw;
  height: 600px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.5) 100%);
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  width: 100%;
  max-width: 800px;
  padding: 0 20px;
  box-sizing: border-box;
  margin-bottom: 50px;
}

.hero-header {
  margin-bottom: 24px;
  letter-spacing: 1px;
  line-height: 1.4;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
  line-height: 1.2;
}

.hero-description {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
  letter-spacing: 0.5px;
  line-height: 1.5;
}

.hero-search {
  max-width: 600px;
  margin: 0 auto;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40px;
  padding: 0 15px 0 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 60px;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #999;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: #333;
  margin-right: 12px;
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: scale(1.05);
}

.search-btn svg {
  width: 22px;
  height: 22px;
}

.hot-search {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.hot-label {
  font-size: 12px;
  opacity: 0.8;
}

.hot-tag {
  font-size: 12px;
  padding: 4px 12px;
  background: transparent;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hot-tag:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hero-post-info {
  position: absolute;
  bottom: 32px;
  right: 32px;
  z-index: 10;
}

.post-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  text-decoration: none;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 8px 14px;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.post-link:hover {
    background: rgba(0, 0, 0, 0.3);
}

@media (hover: none) {
    .post-link:hover {
        background: rgba(0, 0, 0, 0.1);
    }
}

.link-icon {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
}

.post-title {
  font-size: 12px;
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .hero-banner {
    height: 500px;
  }
  
  .hero-content {
    padding: 0 20px;
    box-sizing: border-box;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .hero-description {
    font-size: 14px;
  }
  
  .search-container {
    padding: 0 16px;
    height: 50px;
  }
  
  .hero-post-info {
    bottom: 20px;
    right: 20px;
  }
  
  .post-title {
    max-width: 150px;
    font-size: 12px;
  }
  
  .link-icon {
    width: 8px;
    height: 8px;
  }
}

@media (min-width: 769px) and (max-width: 1199px) {
  .hero-banner {
    height: 650px;
  }
}

@media (min-width: 1200px) {
  .hero-banner {
    height: 800px;
  }
}
</style>