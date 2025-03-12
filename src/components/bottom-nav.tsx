"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Dumbbell, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "首页" },
  { href: "/training", icon: Dumbbell, label: "训练" },
  { href: "/lessons", icon: BookOpen, label: "课程" },
  { href: "/profile", icon: User, label: "我的" },
];


export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs mt-1 ${isActive ? 'text-primary' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}