<template>
    <div class="wrap">
        <div class="brandfilter">
            <span class="brand" v-for="(item, key) in data" :key="key">
                <span v-if="hasSetFilter" class="a" @click="goBrand(String(key))"> {{ key }}<strong class="VPBadge tip strong mini">{{
                    data[key].length }}</strong></span>
                <a v-else class="a" :href="withBase(`/?brand=${String(key)}`)"> {{ key }}<strong class="VPBadge tip strong mini">{{
                    data[key].length }}</strong></a>
            </span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, inject } from 'vue'
import { withBase } from 'vitepress'
import { hideAllPoppers } from 'floating-vue'
import { initBrandFilter } from '../functions'
import { data as themeposts } from '../posts.data'
const data = computed(() => initBrandFilter(themeposts))

const setFilter = inject<(key: string, value: string) => void>('setFilter', () => {})
const hasSetFilter = inject<import('vue').Ref<boolean>>('hasSetFilter', computed(() => false))

const goBrand = (brand: string) => {
    setFilter('brand', brand)
    hideAllPoppers()
}
</script>

<style scoped>
.wrap {
    min-width: 300px;
    min-height: 100px;
    max-height: 40vh;
    max-width: 40vw;
    overflow-y: auto;
    padding: 20px;
}

@media (max-width: 960px) {
    .wrap {
        min-width: 100%;
        max-width: 100%;
        max-height: none;
    }
}

.brandfilter {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    line-height: 24px;
}

.brand {
    margin: 5px;
    padding: 0 8px;
    display: inline-block;
    background-color: rgba(123, 123, 123, .05);
    color: var(--vp-c-text-1);
    font-size: 12px;
    border-radius: 2px;
    line-height: 24px;

    .a {
        color: var(--vp-c-text-1);
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
    }

    .a:hover {
        color: var(--vp-c-brand);
    }
}
</style>
