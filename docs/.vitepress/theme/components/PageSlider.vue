<template>
    <!-- <div class="newyearcard">
        <a href="https://mp.weixin.qq.com/s?__biz=Mzg2NjY4NDM3MQ==&mid=2247484735&idx=1&sn=ada2866d75923961740976ff83508bab&chksm=ce465983f931d09529b05480982c2563b4f12964bf03aa8b8a1f11ad302b224f9a4fa6a1e353&scene=178&cur_album_id=2990480834551906308#rd" target="_blank" class="a"></a>
        <div class="contain">
            <div class="dengbox" style="pointer-events: none;z-index: 1000;">
                <div :style="{
                    left: 5 + (2 * index) + '%'
                }" class="deng-box" :class="'deng-box' + index" v-for="(item, index) in lanternText" :key="index">
                    <div class="deng" :class="index % 2 === 0 ? 'deng3' : 'deng5'">
                        <div class="xian"></div>
                        <div class="deng-a">
                            <div class="deng-b">
                                <div class="deng-t">{{ item }}</div>
                            </div>
                        </div>
                        <div class="shui shui-a">
                            <div class="shui-c"></div>
                            <div class="shui-b"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="timedown">
                <p class="title">比比除夕送福利，红包、小程序通通有</p>
                <p class="desc">2024年2月9日（除夕） 20:00开奖，另有群内红包发放</p>
                <div>
                    <Countdown :until="until" />
                </div>
                <button class="tolink"><span class="span">前往抽奖</span><svg class="svf" width="15" height="15"
                        viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                            fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                    </svg></button>
            </div>
            <div class="redcover">

            </div>
        </div>
    </div> -->
    <!-- 这是一个非常简易的轮播 -->
    <div v-if="theme?.website?.homeBanner && bannerList.length" class="slider-container" :style="{ height: theme?.website?.bannerHeight + 'px' }">
        <div class="carousel">
            <!-- 轮播内容 -->
            <div class="carousel-wrapper" :style="{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'transform 0.5s ease' }">
                <div class="carousel-slide" v-for="(item, index) in bannerList" :key="index">
                    <a class="a" :href="item?.link"><img class="image" :src="item?.image" :alt="item?.title" /></a>
                </div>
            </div>
            <!-- 导航按钮 -->
            <div class="carousel-button next" @click="nextSlide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 7L14 12L8 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="carousel-button prev" @click="prevSlide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 7L8 12L14 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <!-- 分页指示器 -->
            <div class="carousel-pagination">
                <div 
                    v-for="(item, index) in bannerList" 
                    :key="index" 
                    class="carousel-dot" 
                    :class="{ active: index === currentIndex }"
                    @click="goToSlide(index)"
                ></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useData } from 'vitepress'
import Countdown from "../../theme/components/Countdown.vue";
const { theme } = useData();
const bannerList = ref(theme.value?.banner || []);
const currentIndex = ref(0);
let autoplayTimer: number | null = null;

// 监听banner数据变化
watch(() => theme.value?.banner, (newBanner) => {
    if (newBanner) {
        bannerList.value = newBanner;
        currentIndex.value = 0;
        resetAutoplay();
    }
}, { deep: true });

// 监听homeBanner状态变化
watch(() => theme.value?.website?.homeBanner, (newValue) => {
    if (newValue && bannerList.value.length > 0) {
        resetAutoplay();
    } else if (!newValue) {
        clearAutoplay();
    }
});

// 切换到下一张
function nextSlide() {
    currentIndex.value = (currentIndex.value + 1) % bannerList.value.length;
    resetAutoplay();
}

// 切换到上一张
function prevSlide() {
    currentIndex.value = (currentIndex.value - 1 + bannerList.value.length) % bannerList.value.length;
    resetAutoplay();
}

// 切换到指定幻灯片
function goToSlide(index: number) {
    currentIndex.value = index;
    resetAutoplay();
}

// 重置自动播放
function resetAutoplay() {
    clearAutoplay();
    startAutoplay();
}

// 开始自动播放
function startAutoplay() {
    autoplayTimer = window.setInterval(() => {
        nextSlide();
    }, 3000);
}

// 清除自动播放
function clearAutoplay() {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
}

// 组件挂载后初始化
onMounted(() => {
    if (bannerList.value.length > 0) {
        startAutoplay();
    }
});

// 组件卸载前清理
function onUnmounted() {
    clearAutoplay();
}


const lanternText = ref(['新', '年'])
const defaultDate = '2024/02/09 20:00'

function getUntilDate() {
    if (typeof location === 'undefined') return defaultDate
    const param = new URL(location.href).searchParams.get('until') || defaultDate
    if (/\d{8}/.test(param))
        return `${param.substring(0, 4)}/${param.substring(4, 6)}/${param.substring(6, 8)}`
    return defaultDate
}

const until = getUntilDate()
</script>

<style scoped>
.slider-container {
    width: 100%;
    margin-bottom: 32px;
    border-radius: 8px;
    overflow: hidden;
}

.carousel {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
}

.carousel-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
}

.carousel-slide {
    flex: 0 0 100%;
    height: 100%;
    /* display:flex; */
    align-items: center;
    justify-content: center;
}

/* 导航按钮样式 */
.carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background-color 0.3s ease;
}

.carousel-button:hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.carousel-button.next {
    right: 15px;
}

.carousel-button.prev {
    left: 15px;
}

/* 分页指示器样式 */
.carousel-pagination {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 10;
}

.carousel-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
}

.carousel-dot.active {
    background-color: white;
    width: 20px;
    border-radius: 5px;
}

.image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

@media (min-width: 1281px) {
    .slider-container {
        max-width: 1280px;
        margin-left: auto;
        margin-right: auto;
    }
}

@media (max-width: 1280px) {
    .slider-container {
        padding: 0 20px;
        box-sizing: border-box;
    }
}

@media (max-width: 768px) {
    .slider-container {
        border-radius: 0;
    }

    .carousel {
        border-radius: 8px;
    }
}

.newyearcard:hover {
    .tolink {
        color: var(--vp-c-brand-1);
    }
}

.newyearcard {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 32px;
    padding: 0;
    /* background-color: #EA4444; */
    position: relative;

    .a {
        position: absolute;
        width:100%;
        height:100%;
        left:0;
        top:0;
        z-index: 30;
    }


    .contain {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 20;
    }

    .dengbox {
        .deng-box {
            position: absolute;
            top: -15px;
            z-index: 10;
            pointer-events: none;
            transform: scale(.5);
            transform-origin: top left;
        }

        .deng {
            position: relative;
            width: 120px;
            height: 90px;
            margin: 50px;
            background: #d8000f;
            background: rgba(216, 0, 15, .8);
            border-radius: 50% 50%;
            transform-origin: 50% -100px;
            box-shadow: -5px 5px 50px 4px #fa6c00
        }

        .deng3 {
            animation: swing 3s infinite ease-in-out;
        }

        .deng5 {
            animation: swing 5s infinite ease-in-out;
        }

        .deng-a {
            width: 100px;
            height: 90px;
            background: #d8000f;
            background: rgba(216, 0, 15, .1);
            margin: 12px 8px 8px 8px;
            border-radius: 50% 50%;
            border: 2px solid #dc8f03
        }

        .deng-b {
            width: 45px;
            height: 90px;
            background: #d8000f;
            background: rgba(216, 0, 15, .1);
            margin: -4px 8px 8px 26px;
            border-radius: 50% 50%;
            border: 2px solid #dc8f03
        }

        .xian {
            position: absolute;
            top: -20px;
            left: 60px;
            width: 2px;
            height: 20px;
            background: #dc8f03
        }

        .shui-a {
            position: relative;
            width: 5px;
            height: 20px;
            margin: -5px 0 0 59px;
            animation: swing 4s infinite ease-in-out;
            transform-origin: 50% -45px;
            background: orange;
            border-radius: 0 0 5px 5px
        }

        .shui-b {
            position: absolute;
            top: 14px;
            left: -2px;
            width: 10px;
            height: 10px;
            background: #dc8f03;
            border-radius: 50%
        }

        .shui-c {
            position: absolute;
            top: 18px;
            left: -2px;
            width: 10px;
            height: 35px;
            background: orange;
            border-radius: 0 0 0 5px
        }

        .deng:before {
            position: absolute;
            top: -7px;
            left: 29px;
            height: 12px;
            width: 60px;
            content: " ";
            display: block;
            z-index: 999;
            border-radius: 5px 5px 0 0;
            border: solid 1px #dc8f03;
            background: orange;
            background: linear-gradient(to right, #dc8f03, orange, #dc8f03, orange, #dc8f03)
        }

        .deng:after {
            position: absolute;
            bottom: -7px;
            left: 10px;
            height: 12px;
            width: 60px;
            content: " ";
            display: block;
            margin-left: 20px;
            border-radius: 0 0 5px 5px;
            border: solid 1px #dc8f03;
            background: orange;
            background: linear-gradient(to right, #dc8f03, orange, #dc8f03, orange, #dc8f03)
        }

        .deng-t {
            font-family: 黑体, Arial, Lucida Grande, Tahoma, sans-serif;
            font-size: 3.2rem;
            color: #dc8f03;
            font-weight: 700;
            line-height: 85px;
            text-align: center
        }


    }

    .timedown {
        width: 65%;
        margin: 0px auto;
        /* color: #FDF1E0; */
        text-align: center;
        position: relative;
        z-index: 20;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .title {
            font-weight: 700;
            font-size: 2.08rem;
            line-height: 1.1;
            letter-spacing: -.05em;
        }

        .desc {
            font-size: 1.2rem;
            line-height: 1.75rem;
            opacity: .8;
        }

        .tolink {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin-top: 5px;

            .svg {
                width: 1rem;
                height: 1rem;
                margin-left: 0.25rem;
            }
        }
    }
}

@-moz-keyframes swing {
    0% {
        -moz-transform: rotate(-10deg)
    }

    50% {
        -moz-transform: rotate(10deg)
    }

    100% {
        -moz-transform: rotate(-10deg)
    }
}

@-webkit-keyframes swing {
    0% {
        -webkit-transform: rotate(-10deg)
    }

    50% {
        -webkit-transform: rotate(10deg)
    }

    100% {
        -webkit-transform: rotate(-10deg)
    }
}

</style>