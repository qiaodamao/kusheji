<template>
    <!-- 页脚区域 -->
    <div class="site-footer">
        <div class="footer-content">
            <!-- 菜单导航 -->
            <div class="footer-nav">
                <ul class="nav-list">
                    <li class="nav-item">
                        <a class="nav-link" :href="withBase(`/pages/tools`)">工具导航</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :href="withBase(`/pages/feed`)">订阅更新</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :href="withBase(`/pages/about`)">关于</a>
                    </li>
                </ul>
            </div>
            
            <!-- 版权信息 -->
            <div class="footer-copyright" v-if="website?.showFooter">
                <p>
                    Copyright © {{ new Date().getFullYear() === 2026 ? '' : '2026-' }}{{ new Date().getFullYear() }} 
                    <a class="site-title strong" :href="website?.link">{{ webTitle }}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useData, withBase } from 'vitepress'

const { site, theme } = useData()
const website = theme.value?.website ? theme.value.website : {}
const webTitle = website?.title ? website.title : (site.value?.title ? site.value.title : '酷设计')
</script>

<style>
.site-footer {
    background-color: var(--vp-c-bg-alt);
    border-top: none;
    padding: 40px 0 0 0;
    margin-top: 60px;
    margin-bottom: 0;
    width: 100%;
    box-sizing: border-box;
}

.footer-content {
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 0 32px;
    box-sizing: border-box;
}

.footer-nav .nav-list {
    display: flex;
    gap: 24px;
    list-style: none;
    margin: 0;
    padding: 0;
}

.footer-nav .nav-item .nav-link {
    color: var(--vp-c-text-2);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s ease;
    cursor: pointer;
}

.footer-nav .nav-item .nav-link:hover {
    color: var(--vp-c-brand);
}


.footer-copyright {
    text-align: center;
    font-size: 12px;
    color: var(--vp-c-text-3);
    padding-bottom: 40px;
}

.footer-copyright .site-title {
    color: var(--vp-c-text-2);
    font-weight: 600;
    text-decoration: none;
}

.footer-copyright .site-title:hover {
    color: var(--vp-c-brand);
}

.strong {
    color: var(--vp-c-text-1);
    font-weight: 700;
}

@media (max-width: 768px) {
    .footer-nav .nav-list {
        gap: 16px;
    }
}
</style>
