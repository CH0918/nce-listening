'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Book } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Book {
  id: string;
  volume: number;
  accent: 'american' | 'british';
  color: string;
}

const books: Book[] = [
  { id: 'a1', volume: 1, accent: 'american', color: '#2196F3' },
  { id: 'a2', volume: 2, accent: 'american', color: '#4CAF50' },
  { id: 'a3', volume: 3, accent: 'american', color: '#FF9800' },
  { id: 'a4', volume: 4, accent: 'american', color: '#9C27B0' },
  { id: 'e1', volume: 1, accent: 'british', color: '#2196F3' },
  { id: 'e2', volume: 2, accent: 'british', color: '#4CAF50' },
  { id: 'e3', volume: 3, accent: 'british', color: '#FF9800' },
  { id: 'e4', volume: 4, accent: 'british', color: '#9C27B0' },
];

export default function BookSelect() {
  const router = useRouter();
  const currentBookId = localStorage.getItem('selectedBook') || 'a1';
  const [selectedBook, setSelectedBook] = useState<string>(currentBookId);

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-14 items-center'>
          <button
            onClick={() => router.back()}
            className='mr-3 flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent'
          >
            <ChevronLeft className='h-5 w-5' />
          </button>
          <h1 className='text-lg font-semibold'>选择学习资源</h1>
        </div>
      </header>

      <main className='container mx-auto py-8 px-4'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {books.map((book) => (
            <div
              key={book.id}
              className={cn(
                'flex cursor-pointer flex-row items-start gap-3 rounded-lg border p-6',
                'transition-all duration-200',
                'hover:bg-accent hover:text-accent-foreground',
                selectedBook === book.id &&
                  'bg-accent text-accent-foreground ring-2 ring-ring ring-offset-2'
              )}
              onClick={() => setSelectedBook(book.id)}
            >
              <div className='flex-shrink-0'>
                <div
                  className='flex h-24 w-16 items-center justify-center rounded-sm text-white'
                  style={{ backgroundColor: book.color }}
                >
                  <Book className='h-8 w-8' />
                </div>
              </div>
              <div className='flex flex-col space-y-1.5'>
                <h3 className='font-semibold'>第{book.volume}册</h3>
                <p className='text-sm text-muted-foreground'>
                  {book.accent === 'american' ? '美音' : '英音'}
                </p>
              </div>
              {selectedBook === book.id && (
                <div className='absolute right-4 top-4'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                    <svg
                      className='h-3.5 w-3.5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <div className='fixed inset-x-0 bottom-0 border-t bg-background p-4'>
        <div className='container mx-auto'>
          <Button
            className='w-full rounded-full py-6 text-base'
            disabled={!selectedBook}
            onClick={() => {
              if (!selectedBook) return;
              localStorage.setItem('selectedBook', selectedBook);
              router.push('/');
            }}
          >
            确认
          </Button>
        </div>
      </div>
    </div>
  );
}
