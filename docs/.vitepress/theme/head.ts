import type { HeadConfig } from 'vitepress';

// console.log('dddddd',frontmatter.value)
export const head: HeadConfig[] = [
  ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
  ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo.png' }],
  ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }],
  ['meta', { property: 'og:image', content: '/logo.png' }],
  ['meta', { name: 'referrer', content: 'strict-origin-when-cross-origin' }],

  // 百度统计
  [
    'script',
    {},
    `var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?8808da6231820f5b8f686703365b6927";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();`
  ],

 // 百度统计
//   [
//  'script',
//  {},
//  `var _hmt = _hmt || [];
//  (function() {
//    var hm = document.createElement("script");
//    hm.src = "https://hm.baidu.com/hm.js?db01b999bcfe4df5611fe1033870db9c";
//    var s = document.getElementsByTagName("script")[0]; 
//    s.parentNode.insertBefore(hm, s);
//   })();`
//   ],


// Google AdSense 广告
//  [
//    "script",
//    {
//     crossorigin: "anonymous",
//     async: "",
//     src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1279518235550313",
//   },
// ],

// Google Analytics 4 (GA4) 统计
// [
//  'script',
//  { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-QRQ5599P9G' }
//],
//[
// 'script',
//  {},
//  `window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//  gtag('js', new Date());
//  gtag('config', 'G-QRQ5599P9G');`
// ],

// Google 资金选择（广告隐私提示）
//  [
//    "script",
//    {
//      nonce: "X3-MeXfNjwsxlQdQcRqhtQ",
//      async: "",
//      src: "https://fundingchoicesmessages.google.com/i/pub-1279518235550313?ers=1",
//    },
//  ],
//  [
//    'script',
//    {},
//    `(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();`
//  ],
  [
    "link",
    { rel: "stylesheet", href: "/static/css/fancybox.css" },   //全局控制图片放大样式
  ],
  ["script", { src: "/static/js/fancybox.umd.js" }],  //全局控制图片放大交互

  // Footer全屏显示关键样式 - 确保在所有页面生效
  [
    "style",
    {},
    `/* 确保父容器不限制footer */
    .VPDoc .container,
    .VPDoc .content,
    .VPDoc .content-container {
      overflow-x: visible !important;
    }
    .site-footer {
      background-color: var(--vp-c-bg-alt) !important;
      border-top: none !important;
      padding: 40px 0 0 0 !important;
      margin-top: 60px !important;
      margin-bottom: 0 !important;
      width: 100vw !important;
      box-sizing: border-box !important;
      position: relative !important;
      left: calc(-50vw + 50%) !important;
      right: auto !important;
      transform: none !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
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
    .footer-nav .nav-item.on .nav-link {
      color: var(--vp-c-brand);
      font-weight: 500;
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
    @media (max-width: 768px) {
      .footer-nav .nav-list {
        gap: 16px;
      }
    }`
  ],
];

