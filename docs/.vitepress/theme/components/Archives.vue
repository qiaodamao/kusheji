<template>
    <!-- 存档页面。按年、月进行显示 -->
    <div class="wrap">
        <div class="archives">
            <div class="archive" v-for="(item, name) in data">
                <div class="year">
                    <span v-if="hasSetFilter" class="year-link" @click="goYear(String(name))">{{ name.toString() }}</span>
                    <a v-else :href="withBase(`/?year=${name.toString()}`)">{{ name.toString() }}</a>
                </div>
                <div class="months">
                    <span class="month" v-for="(cell, key) in item">
                        <span v-if="hasSetFilter" class="a" @click="goMonth(String(name), String(key))">{{
                            key.toString() }}<strong class="VPBadge tip strong mini">{{ item[key].length }}</strong></span>
                        <a v-else class="a" :href="withBase(`/?year=${name.toString()}&month=${key.toString()}`)">{{
                            key.toString() }}<strong class="VPBadge tip strong mini">{{ item[key].length }}</strong></a>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { withBase } from 'vitepress'
import { hideAllPoppers } from 'floating-vue'
import { initArchives } from '../functions'
import { data as themeposts } from '../posts.data'
const data = computed(() => initArchives(themeposts))

const setFilter = inject<(key: string, value: string) => void>('setFilter', () => {})
const hasSetFilter = inject<import('vue').Ref<boolean>>('hasSetFilter', computed(() => false))

const goYear = (year: string) => {
    setFilter('year', year)
    hideAllPoppers()
}

const goMonth = (year: string, month: string) => {
    setFilter('yearmonth', year + '|' + month)
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

.archives {
    display: flex;
    flex-direction: column;
    line-height: 24px;
}

.year {
    padding: 14px 0 8px 0;
    font-size: 15px;
    font-weight: 500;
    font-family: var(--date-font-family);

    .year-link {
        cursor: pointer;
    }

    .year-link:hover {
        color: var(--vp-c-brand);
    }
}

.month {
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
