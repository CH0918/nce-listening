export default function Loading() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <div className='w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin' />
        <p className='text-sm text-foreground/70'>正在准备课程...</p>
      </div>
    </div>
  );
}
