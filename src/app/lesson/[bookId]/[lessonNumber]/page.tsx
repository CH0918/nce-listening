'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchLyrics } from './actions';
import {
  ChevronLeft,
  Repeat,
  MoreHorizontal,
  Headphones,
  Languages,
  Play,
  Pause,
  Music2,
  Ear,
  Type,
  Gauge,
  Check,
  Repeat1,
  ListRestart,
} from 'lucide-react';
import { Howl } from 'howler';
import * as Popover from '@radix-ui/react-popover';
import { toast } from 'sonner';
import { dataInfo } from '@/lib/constant';

const tabs = [{ id: 'text', label: '课文' }];
// LRC解析器类型定义
interface LyricLine {
  time: number;
  text: string;
}

// 在组件开始处添加新的类型和状态
type LoopMode = 'none' | 'all' | 'single';
type PlaybackRate = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 2.0;
type FontSize = 'small' | 'normal' | 'large';

// 在类型定义后添加
interface UserSettings {
  loopMode: LoopMode;
  fontSize: FontSize;
  playbackRate: PlaybackRate;
}

const STORAGE_KEY = 'nce_player_settings';

// 在组件开始处添加获取存储的设置函数
const getStoredSettings = (): UserSettings => {
  if (typeof window === 'undefined')
    return {
      loopMode: 'none',
      fontSize: 'normal',
      playbackRate: 1.0,
    };

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored)
    return {
      loopMode: 'none',
      fontSize: 'normal',
      playbackRate: 1.0,
    };

  try {
    return JSON.parse(stored);
  } catch {
    return {
      loopMode: 'none',
      fontSize: 'normal',
      playbackRate: 1.0,
    };
  }
};

export default function LessonClient() {
  const router = useRouter();
  // 当前激活的标签页（简介、课文、口语等）
  const [activeTab, setActiveTab] = useState('text');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // Howler音频实例
  const [sound, setSound] = useState<Howl | null>(null);
  // 音频是否正在播放
  const [isPlaying, setIsPlaying] = useState(false);
  // 当前音频播放时间（秒）
  const [currentTime, setCurrentTime] = useState(0);
  // 音频总时长（秒）
  const [duration, setDuration] = useState(0);
  // 是否正在拖动进度条
  const [isDragging, setIsDragging] = useState(false);
  // 拖动进度条前是否在播放
  const [wasPlaying, setWasPlaying] = useState(false);
  // 拖动进度条时的临时位置
  const [scrubPosition, setScrubPosition] = useState<number>(0);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(-1);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const [showLyrics, setShowLyrics] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  // 添加新的状态来控制音频是否准备好
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>(
    () => getStoredSettings().loopMode
  );
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(
    () => getStoredSettings().playbackRate
  );
  const [fontSize, setFontSize] = useState<FontSize>(
    () => getStoredSettings().fontSize
  );
  const [isLoopPopoverOpen, setIsLoopPopoverOpen] = useState(false);
  const [isMorePopoverOpen, setIsMorePopoverOpen] = useState(false);
  const [moreMenuState, setMoreMenuState] = useState<'main' | 'speed' | 'font'>(
    'main'
  );

  // 获取动态路由 /bookId/lessonNumber
  const { bookId, lessonNumber } = useParams();
  console.log('lessonNumber======', lessonNumber);
  const lessonTitle =
    dataInfo[
      decodeURIComponent(lessonNumber as string) as keyof typeof dataInfo
    ] || '';
  const lrc = `https://source.hhhstudy.online/${bookId}/${lessonNumber}.lrc`;
  const mp3 = `https://source.hhhstudy.online/${bookId}/${lessonNumber}.mp3`;

  // 确保组件已经在客户端挂载
  useEffect(() => {
    setIsMounted(true);
    // 组件卸载时清理
    return () => {
      if (sound) {
        sound.stop();
        sound.unload();
      }
    };
  }, [sound]);

  useEffect(() => {
    if (!isMounted) return;

    const audioSrc = mp3;
    const newSound = new Howl({
      src: [audioSrc],
      html5: true,
      onload: () => {
        setDuration(newSound.duration());
        // 音频加载完成后，设置准备状态
        setIsAudioReady(true);
        // 加载完成后自动播放
        newSound.play();
      },
      onloaderror: () => {
        // 加载出错时提示用户
        toast.error('音频加载失败，请刷新页面重试');
      },
      onplay: () => {
        setIsPlaying(true);
        if (lyricsContainerRef.current) {
          lyricsContainerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
    });
    setSound(newSound);

    return () => {
      if (newSound) {
        newSound.unload();
      }
    };
  }, [isMounted, mp3]);

  useEffect(() => {
    if (!isMounted) return;
    let interval: NodeJS.Timeout;
    if (sound && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(sound.seek());
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [sound, isPlaying, isMounted]);

  // 解析LRC文件
  const parseLRC = (lrc: string) => {
    console.log('📝 Client: Starting LRC parsing');
    const lines = lrc.split('\n');
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
    const parsedLyrics: LyricLine[] = [];

    lines.forEach((line) => {
      const match = timeRegex.exec(line);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = parseInt(match[3]);
        const time = minutes * 60 + seconds + milliseconds / 1000;
        const text = line.replace(timeRegex, '').trim();
        if (text) {
          parsedLyrics.push({ time, text });
        }
      }
    });

    console.log(`✅ Client: Parsed ${parsedLyrics.length} lyrics lines`);
    return parsedLyrics.sort((a, b) => a.time - b.time);
  };

  // 加载LRC文件
  useEffect(() => {
    if (!isMounted) return;
    console.log('🔄 Client: Loading lyrics effect triggered');
    const loadLyrics = async () => {
      try {
        console.log('🚀 Client: Calling fetchLyrics');
        const lrcText = await fetchLyrics(lrc);
        console.log('📥 Client: Received lyrics text, length:', lrcText.length);
        const parsedLyrics = parseLRC(lrcText);
        console.log('💾 Client: Setting lyrics state with parsed lyrics');
        setLyrics(parsedLyrics);
      } catch (error) {
        console.error('❌ Client: Error loading lyrics:', error);
      }
    };

    loadLyrics();
  }, [isMounted]);

  // 页面加载时滚动到顶部
  useEffect(() => {
    if (lyricsContainerRef.current) {
      lyricsContainerRef.current.scrollTo({
        top: 0,
        behavior: 'instant',
      });
    }
  }, []);

  // 更新当前歌词
  useEffect(() => {
    if (!isMounted || lyrics.length === 0 || !isPlaying) return;

    const updateCurrentLyric = () => {
      const currentTime = sound?.seek() || 0;
      const index = lyrics.findIndex((lyric, i) => {
        const nextLyric = lyrics[i + 1];
        return (
          currentTime >= lyric.time &&
          (!nextLyric || currentTime < nextLyric.time)
        );
      });

      if (index !== currentLyricIndex) {
        setCurrentLyricIndex(index);
        if (index !== -1 && lyricsContainerRef.current) {
          const container = lyricsContainerRef.current;
          const lyricElement = container.children[1]?.children[0]?.children[
            index
          ] as HTMLElement;

          if (lyricElement) {
            const containerHeight = container.clientHeight;
            const lyricTop = lyricElement.offsetTop;
            const lyricHeight = lyricElement.clientHeight;
            const scrollTo = lyricTop - containerHeight / 2 + lyricHeight / 2;

            container.scrollTo({
              top: scrollTo,
              behavior: 'smooth',
            });
          }
        }
      }
    };

    const interval = setInterval(updateCurrentLyric, 100);
    return () => clearInterval(interval);
  }, [lyrics, isPlaying, currentLyricIndex, sound, isMounted]);

  // 在 useEffect 中添加播放速率变化的处理
  useEffect(() => {
    if (sound) {
      sound.rate(playbackRate);
    }
  }, [sound, playbackRate]);

  // 在 useEffect 中添加循环模式变化的处理
  useEffect(() => {
    if (sound) {
      sound.loop(loopMode === 'all');
    }
  }, [sound, loopMode]);

  // 计算当前句子的结束时间
  const getCurrentSentenceEndTime = (index: number) => {
    if (index < 0 || index >= lyrics.length) return 0;
    return lyrics[index + 1]?.time || lyrics[index].time + 5; // 如果是最后一句，假设持续5秒
  };

  // 修改单句循环的逻辑
  useEffect(() => {
    if (!sound || !lyrics.length || loopMode !== 'single') return;

    const checkAndLoopSentence = () => {
      if (currentLyricIndex >= 0 && currentLyricIndex < lyrics.length) {
        const currentLyric = lyrics[currentLyricIndex];
        const currentTime = sound.seek();
        const sentenceEndTime = getCurrentSentenceEndTime(currentLyricIndex);

        // 如果当前时间超过了句子结束时间，就回到句子开始
        if (currentTime >= sentenceEndTime) {
          sound.seek(currentLyric.time);

          // 如果音频已经结束，需要重新播放
          if (!sound.playing()) {
            sound.play();
          }
        }
      }
    };

    // 更频繁地检查，以确保更准确的循环
    const interval = setInterval(checkAndLoopSentence, 50);

    // 处理音频结束的情况
    const handleEnd = () => {
      if (currentLyricIndex >= 0 && currentLyricIndex < lyrics.length) {
        const currentLyric = lyrics[currentLyricIndex];
        sound.seek(currentLyric.time);
        sound.play();
      }
    };

    sound.on('end', handleEnd);

    return () => {
      clearInterval(interval);
      sound.off('end', handleEnd);
    };
  }, [sound, lyrics, currentLyricIndex, loopMode]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const displayTime = isDragging ? scrubPosition : currentTime;

  // 获取字体大小的类名
  const getFontSizeClass = (size: FontSize) => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'normal':
        return 'text-base';
      case 'large':
        return 'text-lg';
    }
  };

  // 添加设置存储功能
  const updateSettings = (updates: Partial<UserSettings>) => {
    const currentSettings = getStoredSettings();
    const newSettings = { ...currentSettings, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  // 修改设置更新的处理函数
  const handleLoopModeChange = (newMode: LoopMode) => {
    setLoopMode(newMode);
    updateSettings({ loopMode: newMode });
    setIsLoopPopoverOpen(false);
  };

  const handlePlaybackRateChange = (newRate: PlaybackRate) => {
    setPlaybackRate(newRate);
    updateSettings({ playbackRate: newRate });
    setMoreMenuState('main');
    setIsMorePopoverOpen(false);
  };

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize);
    updateSettings({ fontSize: newSize });
    setMoreMenuState('main');
    setIsMorePopoverOpen(false);
  };

  // 添加歌词点击处理函数
  const handleLyricClick = (index: number) => {
    if (!sound || index < 0 || index >= lyrics.length) return;

    const clickedLyric = lyrics[index];
    sound.seek(clickedLyric.time);
    if (!isPlaying) {
      sound.play();
    }
  };

  // 如果组件还没有挂载或音频还没准备好，返回加载状态
  if (!isMounted || !isAudioReady) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin' />
          <p className='text-sm text-foreground/70'>正在准备课程...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-[100vh] bg-background'>
      <header className='flex items-center p-4 border-b shrink-0 backdrop-blur-md bg-background/80 sticky top-0 z-50'>
        <button
          onClick={() => router.back()}
          className='flex items-center text-foreground hover:text-foreground/80 transition-colors'
        >
          <ChevronLeft className='w-6 h-6' />
        </button>
        <h1 className='flex-1 text-lg font-medium text-center'>
          {lessonTitle}
        </h1>
      </header>

      <nav className='flex overflow-x-auto border-b shrink-0 backdrop-blur-sm bg-background/60 sticky top-[65px] z-40'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-foreground/60 hover:text-foreground/80'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />
            )}
          </button>
        ))}
      </nav>

      <main className='flex-1 relative min-h-0'>
        {activeTab === 'text' && (
          <div
            ref={lyricsContainerRef}
            className='absolute inset-0 overflow-y-auto pb-[140px] scroll-smooth'
          >
            {/* 顶部渐变遮罩 */}
            <div className='sticky top-0 h-6 bg-gradient-to-b from-background to-transparent pointer-events-none z-10' />

            <div className='min-h-full flex flex-col items-center justify-center px-4 pb-4'>
              <div className='w-full max-w-2xl mx-auto space-y-1'>
                {lyrics.map((lyric, index) => (
                  <div
                    key={index}
                    onClick={() => handleLyricClick(index)}
                    className={`transition-all duration-300 py-3 px-4 rounded-lg cursor-pointer 
                      hover:bg-accent/10 ${!showLyrics ? 'hidden' : ''} ${
                      index === currentLyricIndex
                        ? `text-primary ${getFontSizeClass(
                            fontSize
                          )} font-medium bg-accent/5 shadow-sm`
                        : `text-foreground/50 ${getFontSizeClass(
                            fontSize
                          )} hover:text-foreground/70`
                    }`}
                  >
                    {lyric.text}
                  </div>
                ))}
              </div>
            </div>

            {/* 底部渐变遮罩 */}
            <div className='sticky bottom-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none z-10' />
          </div>
        )}
      </main>

      <div className='fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t p-4 h-[140px] flex flex-col z-50 transition-all duration-300'>
        {sound ? (
          <>
            <div className='flex items-center mb-8 max-w-2xl mx-auto w-full px-4'>
              <span className='text-xs font-medium text-foreground/70 min-w-[42px] text-right pr-3'>
                {formatTime(displayTime)}
              </span>
              <div className='relative flex-1 h-4 group'>
                <div
                  className='absolute inset-x-0 -top-2 -bottom-2 cursor-pointer'
                  onClick={(e) => {
                    if (sound) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const percentage = Math.max(
                        0,
                        Math.min(x / rect.width, 1)
                      );
                      const newTime = percentage * duration;
                      sound.seek(newTime);
                      setCurrentTime(newTime);
                    }
                  }}
                  onMouseDown={() => {
                    setIsDragging(true);
                    setWasPlaying(isPlaying);
                    if (isPlaying) {
                      sound?.pause();
                    }

                    const handleMouseMove = (e: MouseEvent) => {
                      if (sound) {
                        const rect =
                          e.target instanceof Element
                            ? e.target.getBoundingClientRect()
                            : new DOMRect();
                        const x = Math.max(
                          0,
                          Math.min(e.clientX - rect.left, rect.width)
                        );
                        const percentage = x / rect.width;
                        const newTime = percentage * duration;
                        setScrubPosition(newTime);
                      }
                    };

                    const handleMouseUp = (e: MouseEvent) => {
                      if (sound) {
                        const rect =
                          e.target instanceof Element
                            ? e.target.getBoundingClientRect()
                            : new DOMRect();
                        const x = Math.max(
                          0,
                          Math.min(e.clientX - rect.left, rect.width)
                        );
                        const percentage = x / rect.width;
                        const newTime = percentage * duration;
                        sound.seek(newTime);
                        setCurrentTime(newTime);
                        setScrubPosition(newTime);
                      }
                      setIsDragging(false);
                      if (wasPlaying) {
                        sound?.play();
                      }
                      setWasPlaying(false);
                      document.removeEventListener(
                        'mousemove',
                        handleMouseMove
                      );
                      document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                    setWasPlaying(isPlaying);

                    const handleTouchMove = (e: TouchEvent) => {
                      e.preventDefault();
                      if (sound) {
                        const touch = e.touches[0];
                        const rect =
                          e.target instanceof Element
                            ? e.target.getBoundingClientRect()
                            : new DOMRect();
                        const x = Math.max(
                          0,
                          Math.min(touch.clientX - rect.left, rect.width)
                        );
                        const percentage = x / rect.width;
                        const newTime = percentage * duration;
                        setScrubPosition(newTime);
                      }
                    };

                    const handleTouchEnd = (e: TouchEvent) => {
                      e.preventDefault();
                      if (sound) {
                        const touch = e.changedTouches[0];
                        const rect =
                          e.target instanceof Element
                            ? e.target.getBoundingClientRect()
                            : new DOMRect();
                        const x = Math.max(
                          0,
                          Math.min(touch.clientX - rect.left, rect.width)
                        );
                        const percentage = x / rect.width;
                        const newTime = percentage * duration;
                        sound.seek(newTime);
                        setCurrentTime(newTime);
                        setScrubPosition(newTime);
                      }
                      setIsDragging(false);
                      if (wasPlaying) {
                        sound?.play();
                      }
                      setWasPlaying(false);
                      document.removeEventListener(
                        'touchmove',
                        handleTouchMove
                      );
                      document.removeEventListener('touchend', handleTouchEnd);
                    };

                    document.addEventListener('touchmove', handleTouchMove, {
                      passive: false,
                    });
                    document.addEventListener('touchend', handleTouchEnd);
                  }}
                />
                <div className='absolute top-1/2 -translate-y-1/2 w-full h-1.5 group-hover:h-2'>
                  <div className='absolute inset-y-0 w-full bg-foreground/10 rounded-full' />
                  <div
                    className='absolute inset-y-0 bg-primary rounded-full '
                    style={{
                      width: `${
                        ((isDragging ? scrubPosition : currentTime) /
                          duration) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div
                  className='absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-sm'
                  style={{
                    left: `${
                      ((isDragging ? scrubPosition : currentTime) / duration) *
                      100
                    }%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
              <span className='text-xs font-medium text-foreground/70 min-w-[42px] pl-3'>
                {formatTime(duration)}
              </span>
            </div>
            <div className='flex items-center justify-between px-3 max-w-2xl mx-auto w-full'>
              {/* 中英对照 */}
              <Popover.Root
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
              >
                <Popover.Trigger asChild>
                  <button className='flex-1 flex flex-col items-center gap-1.5 hover:scale-105 active:scale-95'>
                    <Languages className='w-5 h-5 text-foreground/70' />
                    <span className='text-[10px] font-medium text-foreground/70'>
                      中英对照
                    </span>
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className='rounded-lg py-2 w-38 bg-popover shadow-md border z-[100]'
                    sideOffset={5}
                    align='center'
                    side='top'
                  >
                    <div className='space-y-1'>
                      <button
                        onClick={() => {
                          toast.info('功能开发中...');
                          setIsPopoverOpen(false);
                        }}
                        className='w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors'
                      >
                        <Music2 className='w-4 h-4' />
                        <span>中音对照</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowLyrics(!showLyrics);
                          setIsPopoverOpen(false);
                        }}
                        className='w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors'
                      >
                        <Ear className='w-4 h-4' />
                        <span>{showLyrics ? '关闭字幕' : '显示字幕'}</span>
                      </button>
                    </div>
                    <Popover.Arrow className='fill-popover' />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
              {/* 循环模式 */}
              <Popover.Root
                open={isLoopPopoverOpen}
                onOpenChange={setIsLoopPopoverOpen}
              >
                <Popover.Trigger asChild>
                  <button className='flex-1 flex flex-col items-center gap-1.5 hover:scale-105 active:scale-95'>
                    {loopMode === 'single' ? (
                      <Repeat1 className='w-5 h-5 text-primary' />
                    ) : loopMode === 'all' ? (
                      <ListRestart className='w-5 h-5 text-primary' />
                    ) : (
                      <Repeat className='w-5 h-5 text-foreground/70' />
                    )}
                    <span className='text-[10px] font-medium text-foreground/70'>
                      循环模式
                    </span>
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className='rounded-lg py-2 w-38 bg-popover shadow-md border z-[100]'
                    sideOffset={5}
                    align='center'
                    side='top'
                  >
                    <div className='space-y-1'>
                      <button
                        onClick={() => {
                          handleLoopModeChange(
                            loopMode === 'all' ? 'none' : 'all'
                          );
                        }}
                        className='w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors'
                      >
                        <div className='flex items-center gap-2'>
                          <ListRestart className='w-4 h-4' />
                          <span>课文循环</span>
                        </div>
                        {loopMode === 'all' && <Check className='w-4 h-4' />}
                      </button>
                      <button
                        onClick={() => {
                          handleLoopModeChange(
                            loopMode === 'single' ? 'none' : 'single'
                          );
                        }}
                        className='w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors'
                      >
                        <div className='flex items-center gap-2'>
                          <Repeat1 className='w-4 h-4' />
                          <span>单句循环</span>
                        </div>
                        {loopMode === 'single' && <Check className='w-4 h-4' />}
                      </button>
                    </div>
                    <Popover.Arrow className='fill-popover' />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
              <button
                onClick={() => {
                  if (isPlaying) {
                    sound.pause();
                  } else {
                    sound.play();
                  }
                }}
                className='w-[30%] flex flex-col items-center -mt-8'
              >
                <div className='w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/20 flex items-center justify-center hover:bg-primary/90 transition-colors'>
                  {isPlaying ? (
                    <Pause className='w-7 h-7 text-primary-foreground' />
                  ) : (
                    <Play className='w-7 h-7 text-primary-foreground translate-x-0.5' />
                  )}
                </div>
              </button>
              <button className='flex-1 flex flex-col items-center gap-1.5 hover:scale-105 active:scale-95'>
                <Headphones className='w-5 h-5 text-foreground/70' />
                <span className='flex-1 text-[10px] font-medium text-foreground/70'>
                  随身听
                </span>
              </button>
              <Popover.Root
                open={isMorePopoverOpen}
                onOpenChange={setIsMorePopoverOpen}
              >
                <Popover.Trigger asChild>
                  <button className='flex-1 flex flex-col items-center gap-1.5  hover:scale-105 active:scale-95'>
                    <MoreHorizontal className='w-5 h-5 text-foreground/70' />
                    <span className='text-[10px] font-medium text-foreground/70'>
                      更多选项
                    </span>
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className='rounded-lg py-2 w-38 bg-popover shadow-md border z-[100]'
                    sideOffset={5}
                    align='center'
                    side='top'
                  >
                    {moreMenuState === 'main' && (
                      <div className='space-y-1'>
                        <button
                          onClick={() => setMoreMenuState('speed')}
                          className='w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors'
                        >
                          <Gauge className='w-4 h-4' />
                          <span>倍速调整</span>
                        </button>
                        <button
                          onClick={() => setMoreMenuState('font')}
                          className='w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors'
                        >
                          <Type className='w-4 h-4' />
                          <span>字体调整</span>
                        </button>
                      </div>
                    )}

                    {moreMenuState === 'speed' && (
                      <div className='space-y-1'>
                        {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                          <button
                            key={rate}
                            onClick={() =>
                              handlePlaybackRateChange(rate as PlaybackRate)
                            }
                            className='w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors'
                          >
                            <span>{rate}×</span>
                            {playbackRate === rate && (
                              <Check className='w-4 h-4' />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {moreMenuState === 'font' && (
                      <div className='space-y-1'>
                        {[
                          { value: 'small', label: '小' },
                          { value: 'normal', label: '标准' },
                          { value: 'large', label: '大' },
                        ].map((size) => (
                          <button
                            key={size.value}
                            onClick={() =>
                              handleFontSizeChange(size.value as FontSize)
                            }
                            className='w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors'
                          >
                            <span>{size.label}</span>
                            {fontSize === size.value && (
                              <Check className='w-4 h-4' />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    <Popover.Arrow className='fill-popover' />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          </>
        ) : (
          <div className='text-foreground/60 flex items-center justify-center h-full'>
            <div className='flex flex-col items-center gap-4'>
              <div className='w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin' />
              <p className='text-sm text-foreground/70'>加载音频中...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
