import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, Scroll, BookHeart, UserRound } from "lucide-react";
import { Atmosphere } from "./atmosphere";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col text-foreground relative transition-colors duration-1000 font-sans">
      <Atmosphere />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:pl-20 relative z-10">
        {children}
      </main>

      {/* Mobile Bottom Nav / Desktop Side Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 md:h-full md:w-20 md:right-auto bg-card/40 backdrop-blur-xl border-t md:border-t-0 md:border-r border-border/50 flex md:flex-col items-center justify-around md:justify-center md:gap-8 z-50">
        
        <Link href="/" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium hidden md:block uppercase tracking-widest">Home</span>
        </Link>
        
        <Link href="/quests" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location === '/quests' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Scroll className="w-6 h-6" />
          <span className="text-[10px] font-medium hidden md:block uppercase tracking-widest">Quests</span>
        </Link>
        
        <Link href="/journal" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location === '/journal' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <BookHeart className="w-6 h-6" />
          <span className="text-[10px] font-medium hidden md:block uppercase tracking-widest">Journal</span>
        </Link>
        
        <Link href="/character" className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${location === '/character' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <UserRound className="w-6 h-6" />
          <span className="text-[10px] font-medium hidden md:block uppercase tracking-widest">Character</span>
        </Link>
        
      </nav>
      
    </div>
  );
}
