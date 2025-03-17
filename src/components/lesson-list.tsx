import Link from 'next/link';
import { BookId } from '@/types/lesson';
import { cn } from '@/lib/utils';
import { Lock, CheckCircle } from 'lucide-react';

interface Lesson {
  bookId: BookId;
  id: string;
  title: string;
  imageUrl: string;
  practiceLevel: number;
  isLocked?: boolean;
}

interface LessonListProps {
  lessons: Lesson[];
}

export function LessonList({ lessons }: LessonListProps) {
  return (
    <div className='container mx-auto mb-[80px] px-2 mt-20'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            href={`/lesson/${lesson.bookId}/${encodeURIComponent(lesson.id)}`}
            className={cn(
              'group relative flex flex-col rounded-lg border p-6',
              'bg-card transition-all duration-200',
              'hover:shadow-lg hover:shadow-primary/5',
              'hover:border-primary/50',
              lesson.isLocked && 'opacity-80'
            )}
          >
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-4'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary'>
                  {index + 1}
                </div>
                <div>
                  <h3 className='text-lg font-bold text-foreground'>
                    {lesson.title}
                  </h3>
                </div>
              </div>
              <div>
                {lesson.isLocked ? (
                  <Lock className='text-muted-foreground' size={20} />
                ) : (
                  <CheckCircle className='text-green-500' size={20} />
                )}
              </div>
            </div>

            {lesson.isLocked && (
              <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-[2px]'>
                <div className='flex items-center gap-2 rounded-md bg-muted px-3 py-1'>
                  <Lock size={16} className='text-muted-foreground' />
                  <span className='text-sm font-medium text-muted-foreground'>
                    已锁定
                  </span>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
