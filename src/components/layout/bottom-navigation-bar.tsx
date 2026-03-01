"use client";

import { Home, Users, Zap, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import type { NavigationItem } from "@/src/types/home";

const navigationItems: NavigationItem[] = [
    {
        id: "home",
        label: "홈",
        href: "/",
    },
    {
        id: "groups",
        label: "그룹",
        href: "/groups",
    },
    {
        id: "lightning",
        label: "번개",
        href: "/lightning",
        disabled: false,
    },
    {
        id: "mypage",
        label: "마이",
        href: "/mypage"
    },
];

const iconMap: Record<string, typeof Home> = {
    home: Home,
    groups: Users,
    lightning: Zap,
    mypage: User,
};

export function BottomNavigationBar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="sticky bottom-0 z-50 w-full bg-background">
            <div className="mx-auto flex h-16 w-full max-w-[430px] items-center justify-around px-2">
                {navigationItems.map((item) => {
                    const Icon = iconMap[item.id];
                    const active = isActive(item.href);

                    if (item.disabled) {
                        return (
                            <div
                                key={item.id}
                                className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground/50"
                            >
                                <Icon className="size-5" />
                                <span className="text-xs">
                                    {item.label}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                                active
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Icon className="size-5" />
                            <span className="text-xs">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
