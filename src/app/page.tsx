'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookSelector } from '@/components/book-selector';
import { LessonList } from '@/components/lesson-list';
import { BottomNav } from '@/components/bottom-nav';

const mockLessons = [
  {
    id: 1,
    title: "A Private Conversation",
    imageUrl: "/lessons/lesson1.jpg",
    practiceLevel: 3
  },
  {
    id: 2,
    title: "Breakfast or Lunch?",
    imageUrl: "/lessons/lesson2.jpg",
    practiceLevel: 3
  },
  {
    id: 3,
    title: "Please Send Me a Card",
    imageUrl: "/lessons/lesson3.jpg",
    practiceLevel: 3
  },
  {
    id: 4,
    title: "I'm Feeling Good",
    imageUrl: "/lessons/lesson4.jpg",
    practiceLevel: 3
  },
  {
    id: 5,
    title: "I'm Feeling Good",
    imageUrl: "/lessons/lesson5.jpg",
    practiceLevel: 3
  },
  {
    id: 6,
    title: "I'm Feeling Good",
    imageUrl: "/lessons/lesson6.jpg",
    practiceLevel: 3
  },
];

export default function Home() {
  const searchParams = useSearchParams();
  const [currentBook, setCurrentBook] = useState(2);

  useEffect(() => {
    const bookId = searchParams.get('book');
    if (bookId) {
      setCurrentBook(Number(bookId));
    }
  }, [searchParams]);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-10 bg-background">
        <BookSelector
          currentBook={currentBook}
          progress={80}
          totalLessons={96}
          onBookSelect={(book) => setCurrentBook(book)}
        />
      </div>
      <div className="pt-[120px] overflow-y-auto">
        <LessonList lessons={mockLessons} />
      </div>
      <BottomNav />
    </div>
  );
}
