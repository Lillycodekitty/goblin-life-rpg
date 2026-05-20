import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetCharacter, 
  useUpdateCharacter,
  useGetStats,
  useGetActivity,
  getGetCharacterQueryKey
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Edit2, Check, Star, Flame, Scroll, BookHeart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CharacterSheet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: character, isLoading: charLoading } = useGetCharacter();
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: activity, isLoading: actLoading } = useGetActivity();
  const updateChar = useUpdateCharacter();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (character && !isEditing) {
      setName(character.name);
      setTitle(character.title);
    }
  }, [character, isEditing]);

  const handleSave = () => {
    updateChar.mutate({
      data: { name, title }
    }, {
      onSuccess: () => {
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: getGetCharacterQueryKey() });
        toast({ title: "Identity forged", description: "The records have been updated." });
      }
    });
  };

  if (charLoading || statsLoading) {
    return <div className="p-6 min-h-screen flex items-center justify-center"><div className="animate-pulse w-16 h-16 bg-primary/20 rounded-full" /></div>;
  }

  if (!character || !stats) return null;

  const xpProgress = (character.xp / (character.xp + character.xpToNextLevel)) * 100;

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto min-h-screen pt-24 grid md:grid-cols-[1fr_300px] gap-8">
      
      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 relative overflow-hidden shadow-xl"
        >
          {/* Subtle tarot card border effect */}
          <div className="absolute inset-2 border border-primary/10 rounded-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="text-3xl font-serif h-14 bg-background/50 border-primary/30" />
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xl font-serif text-muted-foreground bg-background/50 border-primary/30" />
                  <Button onClick={handleSave} className="bg-primary text-primary-foreground"><Check className="w-4 h-4 mr-2" /> Save</Button>
                </div>
              ) : (
                <div className="group relative pr-12">
                  <h1 className="text-4xl md:text-5xl text-primary font-serif italic tracking-wide">{character.name}</h1>
                  <p className="text-xl text-muted-foreground mt-2 font-serif">{character.title}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsEditing(true)} 
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center bg-background/50 shadow-inner flex-shrink-0">
              <div className="text-center">
                <span className="block text-sm uppercase tracking-widest text-muted-foreground">Level</span>
                <span className="block text-4xl font-serif text-primary">{character.level}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-2">
            <div className="flex justify-between text-sm uppercase tracking-widest font-medium text-muted-foreground">
              <span>Experience</span>
              <span>{character.xp} / {character.xp + character.xpToNextLevel}</span>
            </div>
            <Progress value={xpProgress} className="h-3 bg-background/50" />
            <p className="text-right text-xs text-primary/70">{character.xpToNextLevel} XP to next level</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-card/20 border border-border/30 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Flame className="w-8 h-8 text-orange-500/70" />
            <span className="text-3xl font-serif">{stats.currentStreak}</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Day Streak</span>
          </div>
          <div className="bg-card/20 border border-border/30 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Scroll className="w-8 h-8 text-primary/70" />
            <span className="text-3xl font-serif">{stats.questsCompletedTotal}</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Quests</span>
          </div>
          <div className="bg-card/20 border border-border/30 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <BookHeart className="w-8 h-8 text-rose-500/70" />
            <span className="text-3xl font-serif">{stats.journalEntriesTotal}</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Entries</span>
          </div>
          <div className="bg-card/20 border border-border/30 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Star className="w-8 h-8 text-amber-500/70" />
            <span className="text-3xl font-serif">{stats.totalXp}</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Total XP</span>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
        className="bg-card/10 border-l border-border/20 pl-8 space-y-6 hidden md:block"
      >
        <h3 className="text-sm font-medium uppercase tracking-widest text-primary/80 border-b border-border/20 pb-4">Recent Chronicles</h3>
        <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border/30">
          {!activity?.items?.length ? (
            <p className="text-muted-foreground font-serif italic pl-8">No recent activity.</p>
          ) : (
            activity.items.map((item, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-background border border-primary/30 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary/50" />
                </div>
                <p className="font-serif text-foreground/90">{item.description}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{format(new Date(item.timestamp), "MMM d")}</span>
                  {item.xpAwarded && <span className="text-primary/70">+{item.xpAwarded} XP</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

    </div>
  );
}
