<template>
  <!-- 自定义主菜单。侧栏和首页顶栏菜单 -->
  <div class="mainnavi top" v-if="type==='top'">
    <ul class="ul">
      <li class="li pc">
        <VDropdown :distance="6" :placement="'bottom'">
          <button class="tags a"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.9042 2.10025L20.8037 3.51446L22.2179 13.414L13.0255 22.6063C12.635 22.9969 12.0019 22.9969 11.6113 22.6063L1.71184 12.7069C1.32131 12.3163 1.32131 11.6832 1.71184 11.2926L10.9042 2.10025ZM13.7327 10.5855C14.5137 11.3666 15.78 11.3666 16.5611 10.5855C17.3421 9.80448 17.3421 8.53815 16.5611 7.7571C15.78 6.97606 14.5137 6.97606 13.7327 7.7571C12.9516 8.53815 12.9516 9.80448 13.7327 10.5855Z" fill="currentColor"></path></svg>标签</button>
          <template #popper>
            <Tags />
          </template>
        </VDropdown>
      </li>
      <li class="li pc">
        <VDropdown :distance="6" :placement="'bottom'">
          <button class="brandfilter-btn a"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"></path></svg>品牌</button>
          <template #popper>
            <BrandFilter />
          </template>
        </VDropdown>
      </li>
      <li class="li pc">
        <VDropdown :distance="6" :placement="'bottom'">
          <button class="brands a"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" fill="currentColor"></path></svg>专辑</button>
          <template #popper>
            <Brands />
          </template>
        </VDropdown>
      </li>
      <li class="li pc">
        <VDropdown :distance="6" :placement="'bottom'">
          <button class="archives a"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 10H21V20.0044C21 20.5543 20.5551 21 20.0066 21H3.9934C3.44476 21 3 20.5552 3 20.0044V10ZM9 12V14H15V12H9ZM2 3.99981C2 3.44763 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44372 22 3.99981V8H2V3.99981Z" fill="currentColor"></path></svg>存档</button>
          <template #popper>
            <Archives />
          </template>
        </VDropdown>
      </li>
      <li class="li h5" @click="choose('tags')"
        :class="{ on: (page.relativePath == 'pages/tags.md' && selected === '') || selected === 'tags' }">
        <a class="a" :href="withBase(`/pages/tags`)"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.9042 2.10025L20.8037 3.51446L22.2179 13.414L13.0255 22.6063C12.635 22.9969 12.0019 22.9969 11.6113 22.6063L1.71184 12.7069C1.32131 12.3163 1.32131 11.6832 1.71184 11.2926L10.9042 2.10025ZM13.7327 10.5855C14.5137 11.3666 15.78 11.3666 16.5611 10.5855C17.3421 9.80448 17.3421 8.53815 16.5611 7.7571C15.78 6.97606 14.5137 6.97606 13.7327 7.7571C12.9516 8.53815 12.9516 9.80448 13.7327 10.5855Z" fill="currentColor"></path></svg>标签</a>
      </li>
      <li class="li h5" @click="choose('brand')"
        :class="{ on: selected === 'brand' }">
        <a class="a" :href="withBase(`/pages/brandfilter`)"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"></path></svg>品牌</a>
      </li>
      <li class="li h5" @click="choose('brands')"
        :class="{ on: (page.relativePath == 'pages/brands.md' && selected === '') || selected === 'brands' }">
        <a class="a" :href="withBase(`/pages/brands`)"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" fill="currentColor"></path></svg>专辑</a>
      </li>
      <li class="li h5 archives-h5" @click="choose('archives')"
        :class="{ on: (page.relativePath == 'pages/archives.md' && selected === '') || selected === 'archives' }"><a
          class="a" :href="withBase(`/pages/archives`)"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 10H21V20.0044C21 20.5543 20.5551 21 20.0066 21H3.9934C3.44476 21 3 20.5552 3 20.0044V10ZM9 12V14H15V12H9ZM2 3.99981C2 3.44763 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44372 22 3.99981V8H2V3.99981Z" fill="currentColor"></path></svg>存档</a></li>
    </ul>
  </div>
  
  <!-- 顶部导航栏菜单 -->
  <div class="mainnavi header" v-else-if="type==='header'">
    <ul class="ul">
      <li class="li" @click="choose('home'); goHome()"
        :class="{ on: isHome }">
        <span class="a">全部</span>
      </li>
      <li class="li" v-for="(item, key) in data" @click="choose(String(key)); goCategory(String(key))"
        :class="{ on: currentCategory === String(key) }">
        <span class="a">{{ key }}<strong
            class="VPBadge tip strong mini">{{ data[key].length }}</strong></span>
      </li>
    </ul>
  </div>
  
  <!-- 左侧边栏菜单 -->
  <div class="mainnavi left" v-else>
    <ul class="ul">
      <li class="li" @click="choose('home'); goHome()"
        :class="{ on: isHome }">
        <span class="a">全部</span>
      </li>
      <li class="li" v-for="(item, key) in data" @click="choose(String(key)); goCategory(String(key))"
        :class="{ on: currentCategory === String(key) }">
        <span class="a">{{ key }}<strong
            class="VPBadge tip strong mini">{{ data[key].length }}</strong></span>
      </li>
    </ul>
    <h4 class="h4"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="M22 20V7L20 3H4L2 7.00353V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20ZM4 9H20V19H4V9ZM5.236 5H18.764L19.764 7H4.237L5.236 5ZM15 11H9V13H15V11Z"
          fill="currentColor"></path>
      </svg>其他</h4>
    <ul class="ul">
      <li class="li" @click="choose('feed')"
        :class="{ on: (page.relativePath == 'pages/feed.md' && selected === '') || selected === 'feed' }">
        <a class="a" :href="withBase(`/pages/feed`)"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M3 3C12.9411 3 21 11.0589 21 21H18C18 12.7157 11.2843 6 3 6V3ZM3 10C9.07513 10 14 14.9249 14 21H11C11 16.5817 7.41828 13 3 13V10ZM3 17C5.20914 17 7 18.7909 7 21H3V17Z"
              fill="currentColor"></path>
          </svg>订阅更新</a>
      </li>
      <li class="li" @click="choose('tools')"
        :class="{ on: (page.relativePath == 'pages/tools.md' && selected === '') || selected === 'tools' }"><a class="a"
          :href="withBase(`/pages/tools`)"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M4.96488 5.09625L8.5107 17.5066L11.5514 11.4253L17.188 9.17062L4.96488 5.09625ZM2.89945 2.29958L21.7052 8.56818C21.9672 8.6555 22.1088 8.93866 22.0215 9.20063C21.975 9.34016 21.8694 9.45214 21.7328 9.50676L13.0002 12.9998L8.57501 21.8501C8.45151 22.0971 8.15118 22.1972 7.90419 22.0737C7.77883 22.011 7.68553 21.8986 7.64703 21.7639L2.26058 2.91129C2.18472 2.64577 2.33846 2.36903 2.60398 2.29316C2.70087 2.26548 2.80386 2.26772 2.89945 2.29958Z"
              fill="currentColor"></path>
          </svg>友情链接</a></li>
          <li class="li" @click="choose('about')"
        :class="{ on: (page.relativePath == 'pages/about.md' && selected === '') || selected === 'about' }"><a class="a"
          :href="withBase(`/pages/about`)"><svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 13V5H6V13C6 14.1046 6.89543 15 8 15H14C15.1046 15 16 14.1046 16 13ZM5 3H20C21.1046 3 22 3.89543 22 5V8C22 9.10457 21.1046 10 20 10H18V13C18 15.2091 16.2091 17 14 17H8C5.79086 17 4 15.2091 4 13V4C4 3.44772 4.44772 3 5 3ZM18 5V8H20V5H18ZM2 19H20V21H2V19Z" fill="currentColor"></path></svg>关于本站</a></li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, inject } from 'vue'
import { useData, withBase } from 'vitepress'
import { initCats } from '../functions'
import { data as themeposts } from '../posts.data'
import Brands from './Brands.vue'
import BrandFilter from './BrandFilter.vue'

const { page } = useData()
const data = computed(() => initCats(themeposts))
const props = defineProps<{ type?: string }>();
const selected = ref('')
const choose = (e: string) => {
  selected.value = e
}

const setFilter = inject<(key: string, value: string) => void>('setFilter', () => {})
const currentCategory = inject<import('vue').Ref<string>>('activeCategory', ref(''))

const isHome = computed(() => {
  return !currentCategory.value
})

const goCategory = (category: string) => {
  setFilter('category', category)
}

const goHome = () => {
  setFilter('category', '')
}

</script>

<style scoped>
.h4 {

  margin: 0;
  padding: 0;
  font-weight: bold;
  font-size: 12px;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .svg {
    width: 14px;
    height: 14px;
    margin-right: 5px;
    fill: currentColor;
    display:none;
  }
}

.tags,
.archives,
.brandfilter-btn {
  padding: 0;
  /* color: #ffffff; */
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 44px;
  line-height: 1;
  transform: translateX(0px);
  transition: .3s;
}

.mainnavi.left {
  position: relative;
  margin-top: 20px;
  /* background-color: var(--vp-c-gray-1); */
  width: 80%;
  border-radius: 16px;
  font-size: 14px;
  z-index: 1000;
  min-height: calc(100vh - 200px);

  .ul {

    display: flex;
    flex-direction: column;
    padding: 10px 0;

    .li {
      /* padding: 0 10px; */
      /* margin: 0 10px; */
      /* border-bottom: 1px solid var(--vp-c-divider); */

      .a {
        padding: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 44px;
        font-size: 14px;
        line-height: 1;
        transform: translateX(0px);
        transition: .3s;
        cursor: pointer;
        width: 100%;
      }

      .svg {
        width: 16px;
        height: 16px;
        margin-right: 5px;
        fill: currentColor
      }

      .a:hover {
        /* color: #ffffff; */
        transform: translateX(10px);
        transition: .3s;
      }
    }

    .li.pc {
      display: none;
    }

    .li.h5 {
      display: block;
    }

    .li:last-child {
      /* border-bottom: none; */
    }

    .li.on .a {
      font-weight: bold;
    }
  }
}

.mainnavi.top {
  margin-bottom: 32px;
  /* background-color: var(--vp-c-gray-1); */
  width: 100%;
  border-radius: 16px;
  font-size: 14px;

  display: flex;
  flex-direction: row;
  justify-content: center;

  .ul {

    display: flex;
    flex-direction: row;
    padding: 10px 0;

    .li {
      padding: 0 10px;
      margin: 0 10px;
      /* border-bottom: 1px solid var(--vp-c-divider); */

      .a {
        padding: 0;
        /* color: #ffffff; */
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 44px;
        font-size: 14px;
        line-height: 1;
        transform: translateX(0px);
        transition: .3s;
        width: 100%;
      }

      .svg {
        width: 16px;
        height: 16px;
        margin-right: 5px;
        fill: currentColor
      }

      .a:hover {
        /* color: #ffffff; */
        /* transform: translateX(10px); */
        transition: .3s;
        color: var(--vp-c-brand);
      }
    }

    .li.pc {
      display: none;
    }

    .li.h5 {
      display: block;

      background: var(--vp-c-bg-alt);
      border-radius: 40px;
      padding: 0 20px;
    }

    .li.h5.archives-h5 {
      display: none;
    }

    .li:last-child {
      border-bottom: none;
    }

    .li.on .a {
      font-weight: bold;
      color: var(--vp-c-brand);
    }
  }
}

/* 顶部导航栏菜单样式 */
.mainnavi.header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  .ul {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    .li {
      flex-shrink: 0;

      .a {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 14px;
        color: var(--vp-c-text-1);
        text-decoration: none;
        transition: all 0.2s ease;
        cursor: pointer;
        white-space: nowrap;
      }

      .a:hover {
        background-color: var(--vp-c-bg-soft);
        color: var(--vp-c-brand);
      }
    }

    .li.on .a {
      background-color: var(--vp-c-brand-soft);
      color: var(--vp-c-brand);
      font-weight: 500;
    }
  }

  .ul::-webkit-scrollbar {
    display: none;
  }
}

@media (min-width: 960px) {

  .mainnavi.top,
  .mainnavi.left {

    .ul {
      .li.pc {
        display: block;

      background: var(--vp-c-bg-alt);
      border-radius: 40px;
      padding: 0 20px;
      }

      .li.h5 {
        display: none;
      }
    }
  }
}
</style>