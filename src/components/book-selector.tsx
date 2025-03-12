'use client';

import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { useRouter } from 'next/navigation';

interface BookSelectorProps {
  currentBook: number;
  progress: number;
  totalLessons: number;
  onBookSelect: (book: number) => void;
}

export function BookSelector({
  currentBook,
  progress,
  totalLessons,
  onBookSelect,
}: BookSelectorProps) {
  const router = useRouter();

  return (
    <div className="w-full p-4 bg-background border-b">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          className="text-lg font-semibold flex items-center gap-2"
          onClick={() => router.push('/lessons/select')}
        >
          第{currentBook}册·美音 <ChevronDown className="h-4 w-4" />
        </Button>
        <div className="text-sm text-muted-foreground">
          累计学习 42天
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          已完成 {progress}/{totalLessons}
        </div>
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${(progress / totalLessons) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}