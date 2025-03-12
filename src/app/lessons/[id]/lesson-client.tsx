'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchLyrics } from './actions';
// import l1audio from '/nce/a1/';
// import l1lrc from '/nce/a1/001&002.lrc';

import {
  ChevronLeft,
  Repeat,
  MoreHorizontal,
  Headphones,
  Languages,
  Eye,
  EyeOff,
  Play,
  Pause,
  Music2,
  Ear,
} from 'lucide-react';
import { Howl } from 'howler';
import * as Popover from '@radix-ui/react-popover';
import { toast } from 'sonner';

const tabs = [
  // { id: 'intro', label: '简介' },
  { id: 'text', label: '课文' },
  // { id: 'speaking', label: '口语' },
  // { id: 'explanation', label: '详解' },
  // { id: 'vocabulary', label: '单词' },
  // { id: 'exercise', label: '练习' },
];
const lrc =
  'https://source.hhhstudy.online/01%EF%BC%8DA%20Puma%20at%20Large.lrc';
const mp3 =
  'https://source.hhhstudy.online/01%EF%BC%8DA%20Puma%20at%20Large.mp3';
// LRC解析器类型定义
interface LyricLine {
  time: number;
  text: string;
}

export default function LessonClient({ lessonId }: { lessonId: string }) {
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

  useEffect(() => {
    const audioSrc = mp3;
    const newSound = new Howl({
      src: [audioSrc],
      html5: true,
      onplay: () => {
        setIsPlaying(true);
        // 开始播放时滚动到顶部
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
      onload: () => {
        setDuration(newSound.duration());
      },
    });
    setSound(newSound);

    return () => {
      if (sound) {
        sound.unload();
      }
    };
  }, [lessonId]);

  useEffect(() => {
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
  }, [sound, isPlaying]);

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
  }, []);

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
    if (lyrics.length === 0) {
      console.log('⚠️ Client: No lyrics available yet');
      return;
    }
    if (!isPlaying) {
      console.log('⏸️ Client: Audio not playing');
      return;
    }

    console.log('▶️ Client: Starting lyrics update interval');
    const updateCurrentLyric = () => {
      const currentTime = sound?.seek() || 0;
      let index = lyrics.findIndex((lyric, i) => {
        const nextLyric = lyrics[i + 1];
        return (
          currentTime >= lyric.time &&
          (!nextLyric || currentTime < nextLyric.time)
        );
      });

      if (index !== currentLyricIndex) {
        console.log(
          `🎯 Client: Updating current lyric index to ${index}, time: ${currentTime}`
        );
        setCurrentLyricIndex(index);
        // 滚动到当前歌词，保持在视口中间
        if (index !== -1 && lyricsContainerRef.current) {
          const container = lyricsContainerRef.current;
          const lyricElement = container.children[1]?.children[0]?.children[
            index
          ] as HTMLElement;

          if (lyricElement) {
            const containerHeight = container.clientHeight;
            const lyricTop = lyricElement.offsetTop;
            const lyricHeight = lyricElement.clientHeight;

            // 计算滚动位置，使当前歌词保持在容器中间
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
    return () => {
      console.log('🛑 Client: Cleaning up lyrics update interval');
      clearInterval(interval);
    };
  }, [lyrics, isPlaying, currentLyricIndex, sound]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const displayTime = isDragging ? scrubPosition : currentTime;

  return (
    <div className='flex flex-col h-[100vh] bg-background'>
      <header className='flex items-center p-4 border-b shrink-0'>
        <button
          onClick={() => router.back()}
          className='flex items-center text-foreground hover:text-foreground/80'
        >
          <ChevronLeft className='w-6 h-6' />
        </button>
        <h1 className='flex-1 text-lg font-medium text-center'>
          Lesson {lessonId}
        </h1>
      </header>

      <nav className='flex overflow-x-auto border-b shrink-0'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className='flex-1 relative min-h-0'>
        {activeTab === 'text' && (
          <div
            ref={lyricsContainerRef}
            className='absolute inset-0 overflow-y-auto'
          >
            {/* 顶部渐变遮罩 */}
            <div className='sticky top-12 bg-gradient-to-b from-background to-transparent pointer-events-none' />

            <div className='min-h-full flex flex-col items-center justify-center px-4'>
              <div className='w-full space-y-4'>
                {/* Debug logs */}
                {(() => {
                  console.log(
                    '🎵 Client: Rendering lyrics, count:',
                    lyrics.length
                  );
                  console.log('📌 Client: Current active tab:', activeTab);
                  return null;
                })()}
                {lyrics.map((lyric, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-300 py-1 ${
                      !showLyrics ? 'hidden' : ''
                    } ${
                      index === currentLyricIndex
                        ? 'text-primary text-lg font-medium'
                        : 'text-foreground/50 text-base'
                    }`}
                  >
                    {lyric.text}
                  </div>
                ))}
              </div>
            </div>

            {/* 底部渐变遮罩 */}
            <div className='sticky bottom-0 h-4 bg-gradient-to-t from-background to-transparent pointer-events-none' />
          </div>
        )}
      </main>

      <div className='fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t p-4 h-[120px] flex flex-col z-10'>
        {sound ? (
          <>
            <div className='flex items-center mb-10'>
              <span className='text-xs font-medium text-foreground/70 min-w-[42px] text-right pr-3'>
                {formatTime(displayTime)}
              </span>
              <div className='relative flex-1 h-3'>
                <div
                  className='absolute inset-x-0 -top-3 -bottom-3 cursor-pointer'
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
                  onMouseDown={(e) => {
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
                    // if (isPlaying) {
                    //   sound?.pause();
                    // }

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
                <div className='absolute top-1/2 -translate-y-1/2 w-full h-1.5'>
                  <div className='absolute inset-y-0 w-full bg-foreground/10 rounded-full' />
                  <div
                    className='absolute inset-y-0 bg-primary rounded-full'
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
                  className='absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary/90 rounded-full shadow-sm'
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
            <div className='flex items-center justify-between px-3'>
              <Popover.Root
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
              >
                <Popover.Trigger asChild>
                  <button className='flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95'>
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
              <button className='flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95'>
                <Repeat className='w-5 h-5 text-foreground/70' />
                <span className='text-[10px] font-medium text-foreground/70'>
                  课文循环
                </span>
              </button>
              <button
                onClick={() => {
                  if (isPlaying) {
                    sound.pause();
                  } else {
                    sound.play();
                  }
                }}
                className='flex flex-col items-center -mt-8 transition-transform hover:scale-105 active:scale-95'
              >
                <div className='w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/20 flex items-center justify-center'>
                  {isPlaying ? (
                    <Pause className='w-7 h-7 text-primary-foreground' />
                  ) : (
                    <Play className='w-7 h-7 text-primary-foreground translate-x-0.5' />
                  )}
                </div>
              </button>
              <button className='flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95'>
                <Headphones className='w-5 h-5 text-foreground/70' />
                <span className='text-[10px] font-medium text-foreground/70'>
                  随身听
                </span>
              </button>
              <button className='flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95'>
                <MoreHorizontal className='w-5 h-5 text-foreground/70' />
                <span className='text-[10px] font-medium text-foreground/70'>
                  更多选项
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className='text-foreground/60 flex items-center justify-center h-full'>
            加载音频中...
          </div>
        )}
      </div>
    </div>
  );
}
