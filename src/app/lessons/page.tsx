'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const books = [
  { id: 1, name: '第一册' },
  { id: 2, name: '第二册' },
  { id: 3, name: '第三册' },
  { id: 4, name: '第四册' },
];

export default function LessonsPage() {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedBook) {
      router.push(`/?book=${selectedBook}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold mb-4">选择课程</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {books.map((book) => (
          <Button
            key={book.id}
            variant={selectedBook === book.id ? "default" : "outline"}
            className="h-24 text-lg"
            onClick={() => setSelectedBook(book.id)}
          >
            {book.name}
          </Button>
        ))}
      </div>
      <Button
        className="w-full"
        disabled={!selectedBook}
        onClick={handleConfirm}
      >
        确认
      </Button>
    </div>
  );
}