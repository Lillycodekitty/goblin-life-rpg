import { useState, useEffect } from "react";
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
import { getLevelTitle, getStreakMessage } from "@/lib/constants";

export default function CharacterSheet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: character, isLoading: charLoading } = useGetCharacter();
  const { data: stats } = useGetStats();
  const { data: activity } = useGetActivity();
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
    updateChar.mutate({ data: { name, title } }, {
      onSuccess: () => {
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: getGetCharacterQueryKey() });
        toast({ title: "Identity forged", description: "The records have been updated." });
      }
    });
  };

  if (charLoading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary/40 font-serif italic">reading the ledger...</div>
      </div>
    );
  }

  if (!character || !stats) return null;

  const xpTotal = character.xp + character.xpToNextLevel;
  const xpProgress = xpTotal > 0 ? (character.xp / xpTotal) * 100 : 0;
  const levelTitle = getLevelTitle(character.level);
  const streakMsg = getStreakMessage(stats.currentStreak);

  return (
    <div className="p-5 md:p-12 max-w-4xl mx-auto min-h-screen pt-20 grid md:grid-cols-[1fr_300px] gap-8">

      <div className="space-y-6">

        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-xl overflow-hidden"
        >
          <div className="absolute inset-2 border border-primary/10 rounded-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="text-2xl font-serif h-12 bg-background/50 border-primary/30"
                    placeholder="Your name..."
                  />
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="font-serif bg-background/50 border-primary/30"
                    placeholder="Your title..."
                  />
                  <Button onClick={handleSave} className="bg-primary text-primary-foreground text-sm">
                    <Check className="w-4 h-4 mr-2" /> Save
                  </Button>
                </div>
              ) : (
                <div className="group relative pr-10">
                  <h1 className="text-3xl md:text-4xl text-primary font-serif italic tracking-wide">
                    {character.name}
                  </h1>
                  <p className="text-base text-muted-foreground mt-1 font-serif">{character.title}</p>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => setIsEditing(true)}
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Level badge */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-primary/25 flex items-center justify-center bg-background/50 shadow-inner">
                <div className="text-center">
                  <span className="block text-[9px] uppercase tracking-widest text-muted-foreground">Level</span>
                  <span className="block text-4xl font-serif text-primary leading-none">{character.level}</span>
                </div>
              </div>
              <p className="text-[10px] text-primary/60 uppercase tracking-wide mt-2 text-center max-w-[100px] leading-tight">
                {levelTitle}
              </p>
            </div>
          </div>

          {/* XP bar */}
          <div className="mt-8 space-y-1.5">
            <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
              <span>Experience</span>
              <span className="font-mono">{character.xp} / {xpTotal} XP</span>
            </div>
            <Progress value={xpProgress} className="h-2.5 bg-background/50" />
            <p className="text-right text-xs text-primary/60">
              {character.xpToNextLevel} XP to next level — <span className="italic">{getLevelTitle(character.level + 1)}</span>
            </p>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Streak */}
          <div className="bg-card/20 border border-border/30 rounded-xl p-5 flex flex-col items-center text-center space-y-1.5 col-span-2">
            <Flame className="w-7 h-7 text-orange-500/70" />
            <span className="text-4xl font-serif">{stats.currentStreak}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Day Streak</span>
            <p className="text-xs text-muted-foreground/60 italic">{streakMsg}</p>
            {stats.currentStreak === 0 && (
              <p className="text-xs text-muted-foreground/40">Showing up on hard days counts. Cold Snap days count double in here.</p>
            )}
          </div>

          <div className="bg-card/20 border border-border/30 rounded-xl p-5 flex flex-col items-center text-center space-y-1.5">
            <Scroll className="w-7 h-7 text-primary/70" />
            <span className="text-3xl font-serif">{stats.questsCompletedTotal}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Quests Done</span>
          </div>

          <div className="bg-card/20 border border-border/30 rounded-xl p-5 flex flex-col items-center text-center space-y-1.5">
            <BookHeart className="w-7 h-7 text-rose-500/70" />
            <span className="text-3xl font-serif">{stats.journalEntriesTotal}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Grimoire Entries</span>
          </div>

          <div className="bg-card/20 border border-border/30 rounded-xl p-5 flex flex-col items-center text-center space-y-1.5 col-span-2">
            <Star className="w-7 h-7 text-amber-500/70" />
            <span className="text-3xl font-serif">{stats.totalXp}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Total XP Earned</span>
            <p className="text-xs text-muted-foreground/40 italic">All of it. Every hard day included.</p>
          </div>
        </motion.div>

        {/* Level ladder — mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card/20 border border-border/30 rounded-xl p-5 space-y-3 md:hidden"
        >
          <h3 className="text-[10px] uppercase tracking-widest text-primary/60">The Path</h3>
          <LevelLadder currentLevel={character.level} />
        </motion.div>

      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block space-y-6">

        {/* Level ladder */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className="bg-card/20 border border-border/20 rounded-xl p-5 space-y-3"
        >
          <h3 className="text-[10px] uppercase tracking-widest text-primary/60">The Path</h3>
          <LevelLadder currentLevel={character.level} />
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          <h3 className="text-[10px] uppercase tracking-widest text-primary/60 border-b border-border/20 pb-3">
            Recent Chronicles
          </h3>
          <div className="space-y-5 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border/30">
            {!activity?.items?.length ? (
              <p className="text-muted-foreground font-serif italic pl-8 text-sm">Nothing logged yet.</p>
            ) : (
              activity.items.map((item, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-background border border-primary/30 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary/50" />
                  </div>
                  <p className="font-serif text-foreground/90 text-sm">{item.description}</p>
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

    </div>
  );
}

/* ── Level ladder component ──────────────────────────────── */
const LEVEL_RUNGS = [
  { level: 1,  title: "Freshly Spawned Goblin" },
  { level: 3,  title: "Moss-Crowned Menace" },
  { level: 5,  title: "Blanket Warlord" },
  { level: 7,  title: "Doom Pile Slayer" },
  { level: 9,  title: "Villain Cave Architect" },
  { level: 11, title: "Certified Forest Cryptid" },
  { level: 16, title: "Emotionally Competent Nightmare" },
  { level: 21, title: "Legendary Cozy Chaos Witch" },
];

function LevelLadder({ currentLevel }: { currentLevel: number }) {
  return (
    <div className="space-y-2">
      {LEVEL_RUNGS.map(({ level, title }) => {
        const isReached  = currentLevel >= level;
        const isCurrent  = currentLevel >= level &&
          (LEVEL_RUNGS.findIndex(r => r.level > currentLevel) === LEVEL_RUNGS.indexOf({ level, title }) ||
           LEVEL_RUNGS[LEVEL_RUNGS.indexOf({ level, title }) + 1]?.level > currentLevel);
        return (
          <div
            key={level}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isReached
                ? "bg-primary/10 border border-primary/20 text-primary"
                : "text-muted-foreground/40"
            }`}
          >
            <span className="font-mono text-xs shrink-0 w-6">{level}</span>
            <span className={`font-serif ${isReached ? "" : "line-through opacity-50"}`}>{title}</span>
            {isReached && <span className="ml-auto text-[10px]">✦</span>}
          </div>
        );
      })}
    </div>
  );
}
