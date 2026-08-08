//此播放器代码参考：https://juejin.cn/post/7172081641836249118
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Song } from '../theme/types';
import {getRandomInt} from '../theme/functions'
import { toast, type ToastOptions } from 'vue3-toastify';
export const usePlayerStore = defineStore('Player', () => {
    // State
    const audio: HTMLAudioElement = typeof window !== 'undefined' ? new Audio() : ({} as HTMLAudioElement)
    const loopType = ref(0); // 循环模式 0 列表循环 1 单曲循环 2随机播放
    const playList = ref<Song[]>([]); // 播放列表
    const showPlayList = ref(false); // 播放列表显隐
    const id = ref(0);  // 当前歌曲id
    const url = ref('');    // 歌曲url
    const song = ref<Song>({} as Song);
    const isPlaying = ref(false); // 是否播放中
    const isPause = ref(true); // 是否暂停
    const isFold = ref(false); // 是否靠边
    const sliderInput = ref(false); // 是否正在拖动进度条
    const ended = ref(false); // 是否播放结束
    const muted = ref(false); // 是否静音
    const currentTime = ref(0); // 当前播放时间
    const duration = ref(0); // 总播放时长
    const currentLyric = ref(null); // 解析后歌词数据
    const playerShow = ref(false); // 控制播放器显隐

    // Getters
    const playListCount = computed(() => {
        return playList.value.length;
    });

    const thisIndex = computed(() => {
        return playList.value.findIndex((song) => song.id === id.value);
    });

    const nextSong = computed((): Song => {
        if (thisIndex.value === playListCount.value - 1) {
            return playList.value[0];
        } else {
            return playList.value[thisIndex.value + 1];
        }
    });

    const prevSong = computed((): Song => {
        if (thisIndex.value === 0) {
            return playList.value[playListCount.value - 1];
        } else {
            return playList.value[thisIndex.value - 1];
        }
    });

    // Actions
    function foldPlayer() {
        isFold.value = !isFold.value;
    }

    function pushPlayList(replace: boolean, ...list: Song[]) {
        if (replace) {
            playList.value = list;
            return;
        }
        list.forEach((song) => {
            if (playList.value.filter((s) => s.id == song.id).length <= 0) {
                playList.value.push(song);
            }
        });
    }

    function deleteSong(songId: number) {
        playList.value.splice(
            playList.value.findIndex((s) => s.id == songId),
            1
        );
    }

    function clearPlayList() {
        url.value = '';
        id.value = 0;
        song.value = {} as Song;
        isPlaying.value = false;
        isPause.value = false;
        sliderInput.value = false;
        ended.value = false;
        muted.value = false;
        currentTime.value = 0;
        playList.value = [];
        showPlayList.value = false;
        
        try {
            audio.pause();
            audio.src = '';
        } catch (e) {
            console.error('Error stopping audio:', e);
        }
        
        let transTimer: NodeJS.Timeout | null = null;
        if (transTimer) clearTimeout(transTimer);
        transTimer = setTimeout(() => {
            duration.value = 0;
        }, 500);
    }

    async function play(songObj: any) {
        if (songObj.id == id.value) return;
        ended.value = false;
        isPause.value = false;
        isPlaying.value = false;
        
        if (songObj.url) {
            id.value = songObj.id;
            song.value = songObj;
            
            let transTimer: NodeJS.Timeout | null = null;
            if (transTimer) clearTimeout(transTimer);
            transTimer = setTimeout(() => {
                audio.title = song.value.title;
                audio.src = songObj.url;
                audio.play().catch((error) => {
                    console.error('Error playing audio:', error);
                });
                isPlaying.value = true;
                interval();
                url.value = song.value.url;
            }, 500);
        } else {
            deleteSong(id.value);
            next();
        }
    }

    function playEnd() {
        isPause.value = true;
        switch (loopType.value) {
            case 0:
                next();
                break;
            case 1:
                rePlay();
                break;
            case 2:
                randomPlay();
                break;
        }
    }

    function rePlay() {
        let transTimer: NodeJS.Timeout | null = null;
        if (transTimer) clearTimeout(transTimer);
        transTimer = setTimeout(() => {
            currentTime.value = 0;
            ended.value = false;
            isPause.value = false;
            isPlaying.value = true;
            
            try {
                audio.currentTime = 0;
                audio.play().catch((error) => {
                    console.error('Error replaying audio:', error);
                });
            } catch (e) {
                console.error('Error in rePlay:', e);
            }
        }, 1500);
    }

    function next() {
        if (loopType.value === 2) {
            randomPlay();
        } else {
            toast("播放结束", {
                autoClose: 2000,
                "type": "success",
                "hideProgressBar": true,
              } as ToastOptions);
                id.value = 0;
                isPause.value = true;
                song.value = {} as Song;
        }
    }

    function prev() {
        if (id.value === prevSong.value.id) {
            toast("没有上一首", {
                autoClose: 2000,
                "type": "warning",
                "hideProgressBar": true,
              } as ToastOptions);
        } else {
            play(prevSong.value);
        }
    }

    function randomPlay() {
        if (playList.value.length > 0) {
            play(playList.value[getRandomInt(playList.value.length)]);
        }
    }

    function togglePlay() {
        if (!song.value.id) {
            randomPlay();
            return;
        }
        
        isPlaying.value = !isPlaying.value;
        
        if (!isPlaying.value) {
            audio.pause();
            isPause.value = true;
        } else {
            audio.play().catch((error) => {
                console.error('Error toggling play:', error);
            });
            isPause.value = false;
        }
    }

    function setPlay() {
        if (!song.value.id) return;
        isPlaying.value = true;
        audio.play().catch((error) => {
            console.error('Error setting play:', error);
        });
        isPause.value = false;
    }

    function setPause() {
        if (!song.value.id) return;
        isPlaying.value = false;
        audio.pause();
        isPause.value = true;
    }

    function toggleLoop() {
        if (loopType.value == 2) {
            loopType.value = 0;
        } else {
            loopType.value++;
        }
    }

    function forward(val: number) {
        // audio.seek(currentTime.value + val);
    }

    function backup(val: number) {
        if (currentTime.value < 5) {
            // audio.seek(0)
        } else {
            // audio.seek(currentTime.value - val);
        }
    }

    function onSliderChange(val: number) {
        // audio.seek(val);
    }

    function interval() {
        if (isPlaying.value && !sliderInput.value) {
            audio.addEventListener("timeupdate", () => {
                currentTime.value = audio.currentTime;
            });
            audio.addEventListener('canplay', () => {
                duration.value = audio.duration;
            });
            audio.addEventListener(
                "ended",
                () => {
                    next();
                }
            );
        }
    }

    function setPlayerShow(val: number) {
        // val 0:显示 1:隐藏
        if (val === 0) {
            playerShow.value = true;
        } else {
            playerShow.value = false;
        }
    }

    return {
        // State
        audio,
        loopType,
        playList,
        showPlayList,
        id,
        url,
        song,
        isPlaying,
        isPause,
        isFold,
        sliderInput,
        ended,
        muted,
        currentTime,
        duration,
        currentLyric,
        playerShow,
        
        // Getters
        playListCount,
        thisIndex,
        nextSong,
        prevSong,
        
        // Actions
        foldPlayer,
        pushPlayList,
        deleteSong,
        clearPlayList,
        play,
        playEnd,
        rePlay,
        next,
        prev,
        randomPlay,
        togglePlay,
        setPlay,
        setPause,
        toggleLoop,
        forward,
        backup,
        onSliderChange,
        interval,
        setPlayerShow
    };
});
