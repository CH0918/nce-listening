'use client';

import { BookSelector } from '@/components/book-selector';
import { LessonList } from '@/components/lesson-list';
import { BottomNav } from '@/components/bottom-nav';
import { dataInfo } from '@/lib/constant';
import { BookId } from '@/types/lesson';
const mockLessons = Object.entries(dataInfo).map(([key, value]) => ({
  id: key,
  title: value,
  bookId: key.split('_')[0] as BookId,
  imageUrl: `/images/books/${key.split('_')[0]}.png`,
  practiceLevel: 1,
}));

export default function Home() {
  const currentBook = localStorage.getItem('selectedBook') || 'a1';
  const currentBookLessons = mockLessons.filter(
    (lesson) => lesson.bookId === currentBook
  );
  // const [currentBook, setCurrentBook] = useState(2);

  // useEffect(() => {
  //   const bookId = localStorage.getItem('selectedBook') || 'a1';
  //   setCurrentBook(Number(bookId));
  // }, []);

  return (
    <div className='min-h-screen bg-background'>
      <div className='fixed top-0 left-0 right-0 z-10 bg-background'>
        <BookSelector
          // currentBook={currentBook}
          progress={80}
          totalLessons={96}
          // onBookSelect={(book) => setCurrentBook(book)}
        />
      </div>
      <div className='py-6 overflow-y-auto'>
        <LessonList lessons={currentBookLessons} />
      </div>
      <BottomNav />
    </div>
  );
}
