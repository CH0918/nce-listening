'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Book {
  id: number;
  volume: number;
  accent: 'american' | 'british';
  color: string;
}

const books: Book[] = [
  { id: 1, volume: 1, accent: 'american', color: '#4CAF50' },
  { id: 2, volume: 1, accent: 'british', color: '#4CAF50' },
  { id: 3, volume: 2, accent: 'american', color: '#FF9800' },
  { id: 4, volume: 2, accent: 'british', color: '#FF9800' },
  { id: 5, volume: 3, accent: 'american', color: '#2196F3' },
  { id: 6, volume: 3, accent: 'british', color: '#2196F3' },
  { id: 7, volume: 4, accent: 'american', color: '#009688' },
  { id: 8, volume: 4, accent: 'british', color: '#009688' },
];

export default function BookSelect() {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F7FF] to-white flex flex-col">
      <header className="flex items-center p-4 gap-4">
        <button onClick={() => router.back()} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">选择学习资源</h1>
      </header>

      <main className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              className={`relative bg-white p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 ${selectedBook === book.id ? 'ring-2 ring-green-500 ring-offset-2' : 'border border-gray-200'}`}
              onClick={() => setSelectedBook(book.id)}
            >
              <div
                className="w-14 h-20 rounded-lg flex-shrink-0"
                style={{ backgroundColor: book.color }}
              >
                <div className="w-full h-full flex items-center justify-center text-white">
                  <span className="text-xs">新概念英语</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-base font-medium mb-1">第{book.volume}册</div>
                <div className="text-sm text-gray-500">
                  {book.accent === 'american' ? '美音' : '英音'}
                </div>
              </div>
              {selectedBook === book.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
        <Button
          className="w-full h-11 text-base rounded-full"
          disabled={!selectedBook}
          onClick={() => selectedBook && router.push(`/?bookId=${selectedBook}`)}
        >
          确认
        </Button>
      </footer>
    </div>
  );
}