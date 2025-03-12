import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface Lesson {
  id: number;
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
    <div className="flex flex-col gap-4 p-4 pb-20">
      {lessons.map((lesson) => (
        <Link
          key={lesson.id}
          href={`/lessons/${lesson.id}`}
          className="flex gap-4 p-4 bg-card rounded-lg border hover:border-primary transition-colors"
        >
          <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted">
            <Image
              src={lesson.imageUrl}
              alt={lesson.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-between flex-1">
            <div>
              <h3 className="font-semibold mb-2">Lesson {lesson.id}</h3>
              <p className="text-sm text-muted-foreground">{lesson.title}</p>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < lesson.practiceLevel ? 'fill-primary text-primary' : 'text-muted'}`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-2">真题演练</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}