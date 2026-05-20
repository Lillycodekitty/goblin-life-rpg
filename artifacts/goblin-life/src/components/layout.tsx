import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Scroll, BookOpen, UserRound, Sparkles } from "lucide-react";
import { Atmosphere } from "./atmosphere";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/",          icon: Sparkles,  label: "Check-In" },
    { href: "/quests",    icon: Scroll,    label: "Quests"   },
    { href: "/journal",   icon: BookOpen,  label: "Grimoire" },
    { href: "/character", icon: UserRound, label: "Character"},
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col text-foreground relative transition-colors duration-1000 font-sans">
      <Atmosphere />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:pl-20 relative z-10">
        {children}
      </main>

      {/* Nav — bottom on mobile, left side on desktop */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 md:h-full md:w-20 md:right-auto bg-card/30 backdrop-blur-2xl border-t md:border-t-0 md:border-r border-primary/10 flex md:flex-col items-center justify-around md:justify-center md:gap-8 z-50">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = location === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "drop-shadow-[0_0_6px_rgba(180,130,20,0.8)]" : ""}`} />
              <span className={`text-[9px] font-medium uppercase tracking-wider ${active ? "text-primary" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
