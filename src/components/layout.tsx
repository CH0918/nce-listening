'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BottomNav } from './bottom-nav';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(false);
  
  useEffect(() => {
    // 定义不需要显示底部导航的页面路径
    const noBottomNavPaths = [
      '/lessons/select'
    ];

    // 使用正则表达式匹配课程听力页面路径
    const isLessonPage = /^\/lessons\/\d+$/.test(pathname);

    // 在客户端更新导航栏显示状态
    setShowNav(!noBottomNavPaths.includes(pathname) && !isLessonPage);
  }, [pathname]);

  return (
    <>
      <div className="min-h-screen">
        {children}
      </div>
      {showNav && <BottomNav />}
    </>
  );
}