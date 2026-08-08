<template>
    <!-- 对页面布局做统筹管理 -->
    <Layout :class="{ home: frontmatter?.index, post: frontmatter?.post, tools: frontmatter?.page === true && !frontmatter?.index && !frontmatter?.post, album: frontmatter?.albumPage === true, 'no-sidebar': frontmatter?.aside === false && !frontmatter?.index }">
        <template #not-found>
            <!-- 页面不存在 -->
                <div class="page404">
                    <PageASide type="page404" />
                    
                </div>
        </template>
        <template #layout-top>
            <ClientOnly>
                <Teleport to="body">
                    <div class="snow" v-if="theme.website?.showSnow&&isDark">
                        <div v-for="index in 80" :key="index" class="dot"></div>
                    </div>
                </Teleport>
                <Lantern/>
            </ClientOnly>
        </template>
        <template #nav-bar-content-after>
      <ClientOnly>
        <ModalToggle />
      </ClientOnly>
    </template>
        <template #nav-screen-content-after>

        </template>
        <template #nav-bar-content-before>
            <!-- 在导航搜索框前添加 logo -->
            <a href="/" class="logo-link">
                <img class="logo-img" src="/logo.svg" alt="Logo" />
                <span class="logo-text">酷设计</span>
            </a>
            <!-- 在导航搜索框💰添加 -->
            <ClientOnly>
                <div v-if="!isPause" class="" style="padding-left: 32px;position: relative;height:40px;margin-right:0px;">
                    <Player />
                </div>
            </ClientOnly>

        </template>
        <template #nav-bar-title-after>
            <!-- 在标题后添加 -->
        </template>
        <template #sidebar-nav-before>
            <!-- <PageNavi /> -->
            <ClientOnly>
                <div class="fireworkwrap">
                    <Firework></Firework>
                </div>
            </ClientOnly>
        </template>
        <template #doc-top>
            <ClientOnly>
                <HeroBanner v-if="frontmatter?.index && theme.website?.showHeroBanner !== false" />
                <PageSlider v-if="frontmatter?.index && theme.website?.homeBanner" :key="md5(page.relativePath)"></PageSlider>
            </ClientOnly>
        </template>
        <template #doc-before>
                <Home v-if="frontmatter?.index" />
                <ArticleBread v-if="(frontmatter?.post)" :article="page" />
                <ArticleMetadata v-if="(frontmatter?.post)" type="single" :article="page" :key="md5(page.relativePath)" />
        </template>
        <template #aside-bottom>
            <ClientOnly>
                
                <!-- <ArticleLink v-if="(frontmatter?.post)" :key="md5(page.relativePath)" /> -->
                <!-- <PageASide v-if="(frontmatter.index)" /> -->
            </ClientOnly>
                <!-- <PageGZH /> -->
                <!-- <Links v-if="(frontmatter.index)" /> -->
            
        </template>
        <template #doc-footer-before>
           
                <ArticlePrevNext v-if="(frontmatter?.post)" :key="md5(page.relativePath)" />
                <ArticleRelate v-if="(frontmatter?.post)" :key="md5(page.relativePath)" />
  
        </template>
        <template #doc-bottom>
           
        </template>
        <template #layout-bottom>
            <Footer />
        </template>
        
    </Layout>

    <!-- 返回顶部按钮 -->
    <div 
        id="back-to-top" 
        :style="backToTopStyle"
        @click="scrollToTop"
    >
        <div class="arrow"></div>
    </div>
</template>
<script lang="ts" setup>
import { computed, toRefs, onMounted, ref, onUnmounted, watch, nextTick } from 'vue'
import { useData, useRouter, useRoute } from 'vitepress'
import { usePlayerStore } from '../../store/player'
import md5 from 'blueimp-md5'
import DefaultTheme from 'vitepress/theme'
import Footer from './Footer.vue'
import Player from './Player.vue'
import HeroBanner from './HeroBanner.vue'
import Home from './Home.vue'
import ModalToggle from './ModalToggle.vue'

const { isPause } = toRefs(usePlayerStore())
const { page, theme, frontmatter, isDark } = useData()
const { Layout } = DefaultTheme;
const route = useRoute()

function updateLocalNavVisibility() {
    const shouldHide = frontmatter.value?.aside === false && !frontmatter.value?.index
    nextTick(() => {
        const localNav = document.querySelector('.VPLocalNav')
        if (localNav) {
            localNav.style.display = shouldHide ? 'none' : ''
        }
    })
}

onMounted(() => {
    updateLocalNavVisibility()
})

watch(() => route.path, () => {
    nextTick(() => {
        updateLocalNavVisibility()
    })
})

// 滚动状态
const showBackToTop = ref(false);
let lastScrollY = 0;

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

function handleScroll() {
    const currentY = window.scrollY;
    if (currentY <= 300) {
        showBackToTop.value = false;
    } else {
        showBackToTop.value = currentY < lastScrollY;
    }
    lastScrollY = currentY;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const backToTopStyle = computed(() => ({
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: '999999',
    boxShadow: 'none',
    fontSize: '24px',
    fontWeight: 'bold',
    opacity: showBackToTop.value ? '1' : '0',
    pointerEvents: showBackToTop.value ? 'auto' : 'none',
    transform: showBackToTop.value ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.3s ease'
}));
</script>

<style>
/* ===== Footer 样式已在 Footer.vue 中定义 ===== */
</style>

<style scoped>

.snowbanner {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 10;
    pointer-events: none;

    .img {
        width: 88%;
        height: fit-content;
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translate(-50%);
    }
}

.page404 {
    width: 224px;
    margin: 50px auto;
}

.arrow {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 9px solid black;
    transition: all 0.3s ease;
}

#back-to-top:hover {
    background-color: #000000 !important;
    transition: all 0.3s ease;
}

#back-to-top:hover .arrow {
        border-bottom: 9px solid white;
        transition: all 0.3s ease;
    }

    .logo-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--vp-c-text-1);
        margin-right: 16px;

        &:hover {
            color: var(--vp-c-brand);
        }
    }

    @media (max-width: 768px) {
        .logo-link:hover {
            color: var(--vp-c-text-1);
        }
    }

    .logo-img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }

    .dark .logo-img {
        filter: invert(1);
    }

    .logo-text {
        font-size: 14px;
        font-weight: 600;
    }

    /* 移动端样式：确保logo和名字在左侧显示 */
    @media (max-width: 768px) {
        .logo-link {
            margin-right: auto !important;
            margin-left: 0 !important;
            justify-content: flex-start !important;
            height: 44px;
        }
    }

</style>



