<template>
  <!-- 首页文章列表控制条 -->
  <div class="pagectrol">
    <div class="ctrol-left">
      <PageNavi type="header" />
    </div>
    <div class="ctrol-right">
      <span class="a filter">
        <span><strong>{{ bread }}</strong>{{ ' 共' + count + '篇' }}</span>
      </span>
      <a class="a random" :href="withBase(`${randomdata?.relativePath}`)">
        <svg class="svg left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C10.0224 20.3135 4.91625 17.5626 2.8685 13L7.56619 13L8.5 11.4437L11.5 16.4437L13.5662 13H17V11H12.4338L11.5 12.5563L8.5 7.55635L6.43381 11L2.21024 10.9999C2.07418 10.3626 2 9.69615 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3Z"
            fill="rgba(255,99,71,1)"></path>
        </svg>
        <span>随机一文</span>
        <svg class="svg right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"
          ></path>
        </svg>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { randomOne } from '../functions'
import { data as themeposts } from '../posts.data'
import PageNavi from './PageNavi.vue'
const props = defineProps({
  bread: String,
  count: Number
})
const randomdata = computed(() => randomOne(themeposts))
</script>

<style scoped>
.pagectrol {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-bottom: 20px;
  width: 100%;
  overflow-x: hidden;

  .ctrol-left {
    display: flex;
    flex-direction: row;
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    min-width: 0;
  }

  .ctrol-left::-webkit-scrollbar {
    display: none;
  }

  .ctrol-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;

    .a {
      background-color: var(--vp-c-bg-alt);
      border-radius: 4px;
      padding: 2px 10px;
      display: flex;
      flex-direction: row;
      margin-right: 8px;
      flex-shrink: 0;

      .svg {
        width: 16px;
        object-fit: fill;
        fill: currentColor;
      }

      .svg.left {
        margin-right: 5px;
      }

      .svg.right {
        margin-left: 5px;
      }
    }
  }
}

/* 移动端隐藏右侧按钮 */
@media (max-width: 768px) {
  .pagectrol {
    justify-content: flex-start;
  }
  
  .pagectrol .ctrol-right {
    display: none !important;
  }

  .pagectrol .ctrol-left {
    width: 100%;
  }
}
</style>