export const runtime = 'edge';
export default function Loading() {
  return (
    // 使用与主页面相同的布局结构
    <div className='flex flex-col h-[100vh] bg-background'>
      {/* 顶部导航栏骨架屏 */}
      <header className='flex items-center p-4 border-b shrink-0 backdrop-blur-md bg-background/80 sticky top-0 z-50'>
        <div className='w-6 h-6 bg-foreground/10 rounded-full animate-pulse' />
        <div className='flex-1 h-6 mx-8 bg-foreground/10 rounded animate-pulse' />
      </header>

      {/* 标签栏骨架屏 */}
      <nav className='flex border-b shrink-0 backdrop-blur-sm bg-background/60 sticky top-[65px] z-40'>
        <div className='px-6 py-3'>
          <div className='w-12 h-4 bg-foreground/10 rounded animate-pulse' />
        </div>
      </nav>

      {/* 主内容区骨架屏 */}
      <main className='flex-1 relative min-h-0'>
        <div className='absolute inset-0 overflow-y-auto pb-[140px]'>
          <div className='min-h-full flex flex-col items-center justify-center px-4 pb-4'>
            <div className='w-full max-w-2xl mx-auto space-y-4'>
              {/* 生成多个加载占位行 */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='h-16 bg-foreground/10 rounded-lg animate-pulse'
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 底部播放控制栏骨架屏 */}
      <div className='fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t p-4 h-[140px] flex flex-col z-50'>
        <div className='flex items-center mb-8 max-w-2xl mx-auto w-full px-4'>
          <div className='w-10 h-4 bg-foreground/10 rounded animate-pulse' />
          <div className='flex-1 h-4 mx-4 bg-foreground/10 rounded animate-pulse' />
          <div className='w-10 h-4 bg-foreground/10 rounded animate-pulse' />
        </div>
        <div className='flex items-center justify-center gap-8 max-w-2xl mx-auto w-full'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='w-10 h-10 bg-foreground/10 rounded-full animate-pulse'
            />
          ))}
        </div>
      </div>
    </div>
  );
}
