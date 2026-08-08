<template>
    <!-- 首页文章列表区域，对不同浏览器宽度做适配 -->
    <div class="postlist"
        :class="{ grid: true, hasaside: frontmatter.aside, hassidebar: frontmatter.sidebar || theme?.sidebar?.length }">
        <template v-for="(article, index) in posts" :key="index">
            <div class="list" v-if="theme.website?.showUserCard &&Number(theme.website?.cardPosition)-2 < 0 && index ===0">
                <ClientOnly>
                    <PageASide type="articlelist" />
                </ClientOnly>
            </div>
            <div class="list">
                <ClientOnly>
                    <ArticleList :article="article" :posts="posts" :index="index" />
                </ClientOnly>
            </div>
            <div class="list" v-if="theme.website?.showUserCard &&index == Number(theme.website?.cardPosition)-2">
                <ClientOnly>
                    <PageASide type="articlelist" />
                </ClientOnly>
            </div>
        </template>
        <div class="list" v-if="theme.website?.showUserCard &&posts.length < Number(theme.website?.cardPosition)-1">
            <ClientOnly>
                <PageASide type="articlelist" />
            </ClientOnly>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import { useData } from 'vitepress'
const { theme, frontmatter } = useData();
const props = defineProps({
    posts: Array
})
</script>

<style scoped>
.postlist {
    border-bottom: 1px dashed var(--vp-c-divider-light);
    padding: 14px 0 14px 0;
    box-sizing: border-box;
    max-width: 1400px;
    margin: 0 auto;
}

.list {
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
}
</style>