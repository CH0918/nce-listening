'use client';

import { ArrowRightLeft, Book } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { bookIdText } from '@/lib/constant';
import { BookId } from '@/types/lesson';

interface BookSelectorProps {
  // currentBook: number;
  progress: number;
  totalLessons: number;
  // onBookSelect: (book: number) => void;
}

export function BookSelector({}: // currentBook
// onBookSelect,
BookSelectorProps) {
  const router = useRouter();
  const currentBook = localStorage.getItem('selectedBook') || 'a1';
  const currentBookText = bookIdText[currentBook as BookId];

  return (
    <div className='w-full'>
      <div className='container mx-auto'>
        <div className='flex items-center justify-between py-4 bg-primary text-white'>
          <div
            className='flex items-center gap-2 text-lg font-semibold px-4 py-2 select-none'
            onClick={() => router.push('/books')}
          >
            <div className='flex items-center gap-2'>
              <Book className='h-5 w-5 text-white' />
              <span>{currentBookText}</span>
            </div>
            <ArrowRightLeft className='h-4 w-4 text-muted-foreground text-white' />
          </div>
          {/* <div className='text-sm text-muted-foreground'>累计学习 42天</div> */}
        </div>
      </div>
    </div>
  );
}
