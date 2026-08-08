
<template>
  <!-- 首页。处理不同路由显示不同文章数据，包括 tag\category\year\month\pagesnum -->
  <PageNavi type="top" />
  <PageCtrol :bread="breadrxt" :count="posts.length" />
  <Page :posts="getposts" />
  <ArticlePage :page="currentpage" :totalPages="posts.length" :showPages="per_page" @update:page="pageChange" />
  
</template>
<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted, nextTick, watch, provide } from 'vue'
import { useBrowserLocation, useStorage } from '@vueuse/core'
import { useData,useRouter } from 'vitepress'
import { data as themeposts } from '../posts.data'
import { formatSearch } from '../../theme/functions'
import { toast, type ToastOptions } from 'vue3-toastify';
import Welcome from "../../theme/components/Welcome.vue";
import Page from "../../theme/components/Page.vue";
const { theme } = useData();
const welcomestate = useStorage('weclome', false, typeof window !== 'undefined' ? sessionStorage : undefined)
const router = useRouter()
const location = typeof window !== 'undefined' ? useBrowserLocation() : ref({} as any)
const activeTag = ref('')
const activeCategory = ref('')
const activeYear = ref('')
const activeMonth = ref('')
const activeAlbum = ref('')
const activeBrandFilter = ref('')
const selectTag = computed(() => (activeTag.value))
const selectCategory = computed(() => (activeCategory.value))
const selectYear = computed(() => (activeYear.value))
const selectMonth = computed(() => (activeMonth.value))
const selectAlbum = computed(() => (activeAlbum.value))
const selectBrandFilter = computed(() => (activeBrandFilter.value))
const bread = ref('全部内容')
const breadrxt = computed(() => (bread.value))

provide('activeCategory', activeCategory)
provide('hasSetFilter', ref(true))

provide('setFilter', (key: string, value: string) => {
  currentpage.value = 1
  if (key === 'category') {
    activeCategory.value = value
    activeTag.value = ''
    activeYear.value = ''
    activeMonth.value = ''
    activeAlbum.value = ''
    activeBrandFilter.value = ''
    bread.value = value ? '分类：' + value : '全部内容'
  } else if (key === 'tag') {
    activeTag.value = value
    activeCategory.value = ''
    activeYear.value = ''
    activeMonth.value = ''
    activeAlbum.value = ''
    activeBrandFilter.value = ''
    bread.value = '标签：' + value
  } else if (key === 'brand') {
    activeBrandFilter.value = value
    activeCategory.value = ''
    activeTag.value = ''
    activeYear.value = ''
    activeMonth.value = ''
    activeAlbum.value = ''
    bread.value = '品牌：' + value
  } else if (key === 'album') {
    activeAlbum.value = value
    activeCategory.value = ''
    activeTag.value = ''
    activeYear.value = ''
    activeMonth.value = ''
    activeBrandFilter.value = ''
    bread.value = '专辑：' + value
  } else if (key === 'year') {
    activeYear.value = value
    activeMonth.value = ''
    activeCategory.value = ''
    activeTag.value = ''
    activeAlbum.value = ''
    activeBrandFilter.value = ''
    bread.value = '存档：' + value
  } else if (key === 'month') {
    activeMonth.value = value
    activeCategory.value = ''
    activeTag.value = ''
    activeAlbum.value = ''
    activeBrandFilter.value = ''
    bread.value = '存档：' + activeYear.value + '/' + value
  } else if (key === 'yearmonth') {
    const [y, m] = value.split('|')
    activeYear.value = y
    activeMonth.value = m
    activeCategory.value = ''
    activeTag.value = ''
    activeAlbum.value = ''
    activeBrandFilter.value = ''
    bread.value = '存档：' + y + '/' + m
  }
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    url.searchParams.delete('category')
    url.searchParams.delete('tag')
    url.searchParams.delete('brand')
    url.searchParams.delete('album')
    url.searchParams.delete('year')
    url.searchParams.delete('month')
    url.searchParams.delete('page')
    if (value) {
      if (key === 'yearmonth') {
        const [y, m] = value.split('|')
        url.searchParams.set('year', y)
        url.searchParams.set('month', m)
      } else {
        url.searchParams.set(key, value)
      }
    }
    history.pushState(null, '', url.toString())
    nextTick(() => {
      const banner = document.querySelector('.hero-banner')
      if (banner) {
        window.scrollTo({ top: getScrollTop(banner), behavior: 'smooth' })
      }
    })
  }
})
const posts = computed(() => {
  if (selectCategory.value) {
    return themeposts.filter((article: any) =>
      article?.frontmatter?.categories && article?.frontmatter?.categories.includes(selectCategory.value)
    )
  } else if (selectTag.value) {
    return themeposts.filter((article: any) =>
      article?.frontmatter?.tags && article?.frontmatter?.tags.includes(selectTag.value)
    )
  } else if (selectBrandFilter.value) {
    return themeposts.filter((article: any) => {
      const brands = article?.frontmatter?.brand ? (Array.isArray(article.frontmatter.brand) ? article.frontmatter.brand : [article.frontmatter.brand]) : []
      return brands.includes(selectBrandFilter.value)
    })
  } else if (selectAlbum.value) {
    return themeposts.filter((article: any) => {
      const albums = article?.frontmatter?.albums || (article?.frontmatter?.album ? (Array.isArray(article.frontmatter.album) ? article.frontmatter.album : [article.frontmatter.album]) : [])
      return albums.includes(selectAlbum.value)
    })
  } else if (selectYear.value && selectMonth.value) {
    return themeposts.filter((article: any) =>
      article?.frontmatter?.date && new Date(article?.frontmatter?.date).getFullYear() + '' == selectYear.value && new Date(article?.frontmatter?.date).getMonth() + 1 + '月' == selectMonth.value
    )
  } else if (selectYear.value) {
    return themeposts.filter((article: any) =>
      article?.frontmatter?.date && new Date(article?.frontmatter?.date).getFullYear() + '' == selectYear.value
    )
  } else {
    return themeposts
  }
})
const per_page = ref(23);
if(theme.value?.website?.showUserCard){
  per_page.value = Number(theme.value?.website?.perpage) - 1
} else {
  per_page.value = Number(theme.value?.website?.perpage)
}

const currentpage = ref(1) //当前第几页
const getposts = computed(() => {
  return posts.value.slice(per_page.value * (currentpage.value - 1), per_page.value * currentpage.value) //获取当前第几页的的文章集合
})

const isPageChange = ref(false)
const getScrollTop = (banner: Element) => {
  const offset = banner.offsetTop + banner.offsetHeight
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 960
  return offset - (isMobile ? 0 : navHeight)
}
const navHeight = typeof window !== 'undefined' ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')) || 56 : 56

const pageChange = (e: any) => {
  if (typeof window === 'undefined') return
  isPageChange.value = true
  currentpage.value = e
  const { searchParams } = new URL(window.location.href!)
  searchParams.delete('page')
  searchParams.append('page', String(e))
  router.go(
    `${location.value.origin}${router.route.path}?${searchParams.toString()}`
  )
}

router.onAfterRouteChanged = (to) => {
  nextTick(() => {
    if (isPageChange.value) {
      isPageChange.value = false
      const banner = document.querySelector('.hero-banner')
      if (banner) {
        window.scrollTo({ top: getScrollTop(banner), behavior: 'smooth' })
      }
      return
    }
    const url = new URL(to, window.location.origin)
    if (url.searchParams.get('tag') || url.searchParams.get('brand') || url.searchParams.get('album') || url.searchParams.get('year') || url.searchParams.get('category')) {
      const banner = document.querySelector('.hero-banner')
      if (banner) {
        window.scrollTo({ top: getScrollTop(banner), behavior: 'smooth' })
      }
    }
  })
}

router.onBeforeRouteChange = (to) => {
  if (typeof window === 'undefined') return to
  const url = new URL(to, window.location.origin)
  const params = formatSearch(url.search)
  activeTag.value = params?.tag || ''
  activeCategory.value = params?.category || ''
  activeYear.value = params?.year || ''
  activeMonth.value = params?.month || ''
  activeAlbum.value = params?.album || ''
  activeBrandFilter.value = params?.brand || ''
  currentpage.value = Number(params?.page) || 1
  if(params?.tag) {
    console.log('new')
    bread.value  = '标签：'+params.tag
  } else if(params?.category) {
    bread.value  = '分类：'+params.category
  } else if(params?.brand) {
    bread.value  = '品牌：'+params.brand
  } else if(params?.album) {
    bread.value  = '专辑：'+params.album
  } else if(params?.year&&params?.month) {
    bread.value  = '存档：'+params.year+'/'+params.month
  } else if(params?.year) {
    bread.value  = '存档：'+params.year
  } else {
    bread.value  = '全部内容'
  }
}
watch(
  location,
  () => {
    // console.log('location', location)
    if (location.value.href) {
      const url = new URL(location.value.href!)
      activeTag.value = url.searchParams.get('tag') || ''
      activeCategory.value = url.searchParams.get('category') || ''
      activeYear.value = url.searchParams.get('year') || ''
      activeMonth.value = url.searchParams.get('month') || ''
      activeAlbum.value = url.searchParams.get('album') || ''
      activeBrandFilter.value = url.searchParams.get('brand') || ''
      currentpage.value = Number(url.searchParams.get('page')) || 1

      if(url.searchParams.get('tag')) {
    bread.value  = '标签：'+url.searchParams.get('tag')
  } else if(url.searchParams.get('category')) {
    bread.value  = '分类：'+url.searchParams.get('category')
  } else if(url.searchParams.get('brand')) {
    bread.value  = '品牌：'+url.searchParams.get('brand')
  } else if(url.searchParams.get('album')) {
    bread.value  = '专辑：'+url.searchParams.get('album')
  } else if(url.searchParams.get('year')&&url.searchParams.get('month')) {
    bread.value  = '存档：'+url.searchParams.get('year')+'/'+url.searchParams.get('month')
  } else if(url.searchParams.get('year')) {
    bread.value  = '存档：'+url.searchParams.get('year')
  } else {
    bread.value  = '全部内容'
  }
    }
  },
  {
    immediate: true
  }
)
onMounted(() => {
  window.addEventListener('popstate', handlePopState)
  // 如果 URL 带筛选参数，滚动到 hero-banner 下方
  const url = new URL(window.location.href)
  if (url.searchParams.get('tag') || url.searchParams.get('brand') || url.searchParams.get('album') || url.searchParams.get('year') || url.searchParams.get('category')) {
    nextTick(() => {
      const banner = document.querySelector('.hero-banner')
      if (banner) {
        window.scrollTo({ top: getScrollTop(banner), behavior: 'smooth' })
      }
    })
  }
  if (theme.value?.website?.showWelcome&&((theme.value?.website?.welcomeusestate&&!welcomestate.value) || !theme.value?.website?.welcomeusestate)) {
    nextTick(() => {
      toast(Welcome, {
        autoClose: theme.value?.website?.welcome?.autoClose?theme.value.website.welcome.autoClose:false,
        "closeOnClick": false,
        position: toast.POSITION.BOTTOM_RIGHT,
      } as ToastOptions);
      if(theme.value?.website?.welcomeusestate&&!welcomestate.value) {
      welcomestate.value = true
    }
    });
  }
});

const handlePopState = () => {
  const url = new URL(window.location.href)
  activeCategory.value = url.searchParams.get('category') || ''
  activeTag.value = url.searchParams.get('tag') || ''
  activeYear.value = url.searchParams.get('year') || ''
  activeMonth.value = url.searchParams.get('month') || ''
  activeAlbum.value = url.searchParams.get('album') || ''
  activeBrandFilter.value = url.searchParams.get('brand') || ''
  currentpage.value = Number(url.searchParams.get('page')) || 1
  if (activeTag.value) {
    bread.value = '标签：' + activeTag.value
  } else if (activeCategory.value) {
    bread.value = '分类：' + activeCategory.value
  } else if (activeBrandFilter.value) {
    bread.value = '品牌：' + activeBrandFilter.value
  } else if (activeAlbum.value) {
    bread.value = '专辑：' + activeAlbum.value
  } else if (activeYear.value && activeMonth.value) {
    bread.value = '存档：' + activeYear.value + '/' + activeMonth.value
  } else if (activeYear.value) {
    bread.value = '存档：' + activeYear.value
  } else {
    bread.value = '全部内容'
  }
}

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>
<style>
.Toastify__toast {
  overflow: visible !important;
}</style>