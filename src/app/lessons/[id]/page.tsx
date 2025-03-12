// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { ChevronLeft } from 'lucide-react';
// import { Howl } from 'howler';
import LessonClient from './lesson-client';

// const tabs = [
//   { id: 'intro', label: '简介' },
//   { id: 'text', label: '课文' },
//   { id: 'speaking', label: '口语' },
//   { id: 'explanation', label: '详解' },
//   { id: 'vocabulary', label: '单词' },
//   { id: 'exercise', label: '练习' },
// ];

export default async function LessonPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <LessonClient lessonId={id} />;
}
