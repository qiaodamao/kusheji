

<template>
  <!-- 文章通用数据字段。根据判断是列表还是内页进行区分显示。type === 'single'表示在内页显示 -->
  <div class="articlemeta" :class="{ grid: listview === 'grid', list: listview === 'list' }">
    <h1 class="h1" v-if="type === 'single'">{{ dataSource.frontmatter?.title }}</h1>
    <div class="meta">
      <p class="date" v-if="dataSource.frontmatter?.date">
        <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z">
          </path>
        </svg>
        <time class="time"
          :datetime="dataformat === 0 ? formatTime(dataSource.frontmatter.date) : relativeTime(dataSource.frontmatter.date)">{{
            dataformat === 0 ? formatTime(dataSource.frontmatter.date) : relativeTime(dataSource.frontmatter.date) }}</time>
        <!-- <span class="views">
                  <svg class="svg" t="1776776715683" viewBox="0 0 1440 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8183" width="16" height="16">
                    <path d="M1433.334241 494.091869a761.91989 761.91989 0 0 0-1426.58681 0l-6.747431 17.993149 6.747431 17.993149a761.91989 761.91989 0 0 0 1426.58681 0l6.747431-17.993149zM719.995853 923.048538a664.756886 664.756886 0 0 1-612.306857-411.143452 661.518119 661.518119 0 0 1 1224.613714 0 665.026783 665.026783 0 0 1-612.306857 411.143452z" p-id="8184"></path>
                    <path d="M719.995853 245.606482a266.118672 266.118672 0 1 0 266.118672 266.118673A266.478535 266.478535 0 0 0 719.995853 245.606482z m0 431.835574a165.53697 165.53697 0 1 1 165.53697-165.53697 165.626936 165.626936 0 0 1-165.53697 165.357039z" p-id="8185"></path>
                  </svg>
                  {{ viewsCount }}
                </span> -->
      </p>
      <div class="tag-container" v-if="type === 'single'">
        <!-- 标签部分，暂时隐藏 -->
        <div class="tags" v-if="dataSource.frontmatter?.tags && type === 'single'">
          <template v-if="type !== 'single'">
            <span class="tag" v-for="item in dataSource.frontmatter.tags.slice(0, 2)"><a class="a"
                :href="withBase(`/?tag=${item}`)"> {{
                  '#' + item }}</a></span>
            <span class="tag" v-if="dataSource.frontmatter.tags.length > 2">...</span>
          </template>
          <template v-else>
            <span class="tag" v-for="item in dataSource.frontmatter.tags"><a class="a" :href="withBase(`/?tag=${item}`)"> {{
              '#' + item }}</a></span>
          </template>
        </div>
        <!-- 品牌部分 -->
      <div class="brands" v-if="type === 'single' && (dataSource.frontmatter?.brands || dataSource.frontmatter?.brand)">
        <span class="brand" v-for="item in (dataSource.frontmatter.brands || (Array.isArray(dataSource.frontmatter.brand) ? dataSource.frontmatter.brand : [dataSource.frontmatter.brand]))"><a class="a" :href="withBase(`/?brand=${item}`)"> {{
              item }}</a></span>
      </div>
      </div>
    </div>

    <!-- <div class="cover" v-if="type === 'single' && dataSource.frontmatter?.cover">
      <p>
        <img class="img" :src="dataSource.frontmatter.cover" alt="效果">
      </p>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { useStorage } from '@vueuse/core'
import type { Post } from '../types'
import { relativeTime, formatTime } from '../functions'
const listview = useStorage('listview', 'grid')
const dataformat = ref(0)
const props = defineProps<{
  article?: Post
  type?: string
}>();
const dataSource = computed(() => (props.article))

// console.log('dddd',dataSource.value)

if (dataSource.value?.frontmatter?.date) {
  if ((new Date().getTime() - new Date(dataSource.value?.frontmatter?.date).getTime()) / (24 * 60 * 60 * 1000) < 365) {
    dataformat.value = 1 //判断发布日期距离现在365天以内则显示人性化时间
  } else {
    dataformat.value = 0
  }
}
</script>

<style scoped>
.articlemeta {
  padding-top: 8px;

  .h1 {
    font-size: 1.4rem;
    line-height: 2rem;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    .date {
        font-size: 13px;
        line-height: 1.25rem;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        opacity: .5;
        margin: 0;
        margin-right: 10px;

        .svg {
          width: 14px;
          height: 14px;
          margin-right: 5px;
          flex-shrink: 0;
          fill: currentColor;
        }

        .time {
          flex-shrink: 0;
          margin-right: 10px;
        }

        .views {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-shrink: 0;

          .svg {
            width: 14px;
            height: 14px;
            margin-right: 5px;
            flex-shrink: 0;
            fill: currentColor;
          }
        }
      }

    .tag-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;

      .tags {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .tag {
          margin-left: 10px;
          margin-top: 5px;
          margin-bottom: 5px;
          padding: 0 8px;
          display: inline-block;
          background-color: rgba(123, 123, 123, .05);
          color: var(--vp-c-text-1);
          font-size: 12px;
          border-radius: 2px;
          /* .a {
            opacity: .6;
          } */
        }

        .tag:first-child {
          margin-left: 0px;
        }
      }

      .brands {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .brand {
          margin-left: 10px;
          margin-top: 5px;
          margin-bottom: 5px;
          padding: 0 8px;
          display: inline-block;
          background-color: rgba(71, 170, 255, .1);
          color: var(--vp-c-brand);
          font-size: 12px;
          border-radius: 2px;
        }

        .brand:first-child {
          margin-left: 10px;
        }
      }
    }
  }
}

.articlemeta.grid {
  .meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;

    .tag-container {
      .tags {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .tag {
          margin-top: 5px;
          margin-bottom: 5px;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical !important
        }
      }

      .brands {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .brand {
          margin-top: 5px;
          margin-bottom: 5px;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical !important
        }
      }
    }
  }
}

.postlist .list .articlemeta.grid {
  .tag-container {
    .tags {
      flex-wrap: nowrap;
    }
    .brands {
      flex-wrap: nowrap;
    }
  }
}

.articlemeta.list {
  padding-top: 12px;

  .meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .date {
      font-size: 13px;
      line-height: 1.25rem;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      opacity: .5;
      margin: 0;

      .svg {
        width: 14px;
        height: 14px;
        margin-right: 5px;
        flex-shrink: 0;
        fill: currentColor;
      }

      .time {
        flex-shrink: 0;
        margin-right: 10px;
      }

      .views {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-shrink: 0;

        .svg {
          width: 14px;
          height: 14px;
          margin-right: 5px;
          flex-shrink: 0;
          fill: currentColor;
        }
      }
    }

    .tag-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;

      .tags {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        .tag {
          margin-left: 10px;
          padding: 0 8px;
          display: inline-block;
          background-color: rgba(123, 123, 123, .05);
          color: var(--vp-c-text-1);
          font-size: 12px;
          border-radius: 2px;
        }
      }

      .brands {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        .brand {
          margin-left: 10px;
          padding: 0 8px;
          display: inline-block;
          background-color: rgba(71, 170, 255, .1);
          color: var(--vp-c-brand);
          font-size: 12px;
          border-radius: 2px;
        }
      }
    }
  }
}

.cover {
  .img {
    border-radius: 12px;
    border: 5px solid var(--vp-c-bg-alt);
    box-shadow: var(--vp-shadow-1);
  }
}

@media (max-width: 550px) {
  .articlemeta.grid,
  .articlemeta.list {
    .meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    overflow: hidden;

    .date {
      flex-shrink: 0;
      margin-right: 10px;
    }

    .tag-container {
      flex: 1;
      justify-content: flex-end;
      margin-top: 0;
      overflow: hidden;

      .tags {
        overflow: hidden;
        white-space: nowrap;

        .tag {
          margin-left: 10px!important;
          margin-right: 0;
        }

        .tag:first-child {
          margin-left: 0!important;
        }
      }

      .brand {
        margin-left: 10px!important;
      }
    }
    }
  }
}
</style>


