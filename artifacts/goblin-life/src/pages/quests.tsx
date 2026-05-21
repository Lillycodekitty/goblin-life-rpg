import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListQuests,
  useCompleteQuest,
  useDeleteQuest,
  useCreateQuest,
  useGetDailyState,
  getListQuestsQueryKey,
  getGetStatsQueryKey,
  getGetCharacterQueryKey,
  getGetActivityQueryKey,
  QuestCategory,
} from "@workspace/api-client-react";
import {
  QUEST_CATEGORY_META,
  DAILY_SURVIVAL_QUESTS,
  DAILY_FUN_QUESTS,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Trash2, Plus, Ghost, Flame, Sparkles, Snowflake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isToday } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { QuestCelebration, type CelebrationConfig } from "@/components/quest-celebration";

/* Today key for sessionStorage (YYYY-MM-DD) */
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function Quests() {
  const queryClient    = useQueryClient();
  const { toast }      = useToast();
  const { data: quests, isLoading } = useListQuests();
  const { data: dailyState }        = useGetDailyState();
  const completeQuest  = useCompleteQuest();
  const deleteQuest    = useDeleteQuest();
  const createQuest    = useCreateQuest();

  const [newTitle,     setNewTitle]    = useState("");
  const [newCategory,  setNewCategory] = useState<QuestCategory>("goblin_survival");
  const [celebration,  setCelebration] = useState<CelebrationConfig | null>(null);
  const seeding = useRef(false);

  /* ── Hard day detection ────────────────────────────────── */
  const isHardDay =
    dailyState?.emotionalWeather === "cold_snap" ||
    dailyState?.goblinState === "roadkill_crunch";

  /* ── Daily quest auto-seed ─────────────────────────────── */
  useEffect(() => {
    if (!quests || seeding.current) return;

    const storageKey = `dailyQuestsSeeded_${todayKey()}`;
    if (sessionStorage.getItem(storageKey)) return;

    /* Check if any quest was already created today */
    const alreadyHaveToday = quests.some(q => isToday(new Date(q.createdAt)));
    if (alreadyHaveToday) {
      sessionStorage.setItem(storageKey, "1");
      return;
    }

    /* On hard days, survival XP is doubled */
    const hardDay =
      dailyState?.emotionalWeather === "cold_snap" ||
      dailyState?.goblinState === "roadkill_crunch";

    const survivalQuests = DAILY_SURVIVAL_QUESTS.map(q => ({
      ...q,
      xpReward: hardDay ? q.xpReward * 2 : q.xpReward,
    }));
    const allDaily = [...survivalQuests, ...DAILY_FUN_QUESTS];

    /* Seed daily quests */
    seeding.current = true;
    Promise.all(allDaily.map(q => createQuest.mutateAsync({ data: q })))
      .then(() => {
        queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
        sessionStorage.setItem(storageKey, "1");
        toast({
          title: hardDay ? "Cold Snap quests ready ❄️" : "Daily quests ready 🍄",
          description: hardDay
            ? "Survival counts double today. Existing is valid progress."
            : "Survival + fun quests added to the board.",
        });
      })
      .catch(() => {
        seeding.current = false;
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quests, dailyState]);

  const activeQuests    = quests?.filter(q => !q.completed) ?? [];
  const completedQuests = quests?.filter(q => q.completed)  ?? [];

  /* Split active into today vs older */
  const todayQuests  = activeQuests.filter(q => isToday(new Date(q.createdAt)));
  const olderQuests  = activeQuests.filter(q => !isToday(new Date(q.createdAt)));

  const handleComplete = (id: number) => {
    const quest = quests?.find(q => q.id === id);
    completeQuest.mutate({ id }, {
      onSuccess: (result) => {
        queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCharacterQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetActivityQueryKey() });
        setCelebration({
          xp: result.xpAwarded ?? quest?.xpReward ?? 10,
          weather: dailyState?.emotionalWeather ?? "foggy_morning",
        });
        toast({ title: "Quest complete", description: "+XP added to your soul." });
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteQuest.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
      },
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createQuest.mutate(
      { data: { title: newTitle, category: newCategory, xpReward: 15 } },
      {
        onSuccess: () => {
          setNewTitle("");
          queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
          toast({ title: "Quest inscribed", description: "Good luck out there." });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary/40 font-serif italic">checking the board...</div>
      </div>
    );
  }

  return (
    <>
      <QuestCelebration config={celebration} onDone={() => setCelebration(null)} />

      <div className="p-5 md:p-12 max-w-3xl mx-auto min-h-screen pt-20 pb-24">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center space-y-2"
        >
          <h1 className="text-4xl md:text-5xl text-primary font-serif italic tracking-wide">
            Quest Board
          </h1>
          <p className="text-sm text-muted-foreground/60 font-serif italic">
            Small things. All of them count.
          </p>
        </motion.header>

        {/* Cold Snap / Hard Day banner */}
        <AnimatePresence>
          {isHardDay && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 rounded-2xl border border-blue-400/20 bg-blue-950/30 backdrop-blur-sm p-4 flex gap-3 items-start"
            >
              <Snowflake className="w-5 h-5 text-blue-300/70 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-serif text-blue-200/80 font-medium">
                  {dailyState?.goblinState === "roadkill_crunch"
                    ? "Roadkill Crunch detected."
                    : "Cold Snap in effect."}
                </p>
                <p className="text-xs text-blue-300/55 leading-relaxed">
                  Survival counts double today. Every small thing you do is valid progress.
                  Completing a survival quest gives twice the XP.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add quest form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleCreate}
          className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-xl p-4 flex flex-col sm:flex-row gap-3 mb-10 shadow-lg"
        >
          <Input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Add your own quest..."
            className="flex-1 bg-background/50 border-border/40 font-serif h-11"
          />
          <Select value={newCategory} onValueChange={v => setNewCategory(v as QuestCategory)}>
            <SelectTrigger className="w-full sm:w-[180px] h-11 bg-background/50 border-border/40 font-serif">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/50">
              {Object.entries(QUEST_CATEGORY_META).map(([key, meta]) => (
                <SelectItem key={key} value={key} className="font-serif">
                  {meta.icon} {meta.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="submit"
            disabled={!newTitle.trim() || createQuest.isPending}
            className="h-11 bg-primary text-primary-foreground shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" /> Inscribe
          </Button>
        </motion.form>

        {/* Today's quests */}
        {todayQuests.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-500/70" />
              <h2 className="text-[10px] uppercase tracking-widest text-primary/60">Today's Quests</h2>
            </div>

            {/* Survival section */}
            {(() => {
              const survivalTitles = new Set(DAILY_SURVIVAL_QUESTS.map(q => q.title));
              const survivalToday  = todayQuests.filter(q => survivalTitles.has(q.title));
              const funToday       = todayQuests.filter(q => !survivalTitles.has(q.title));

              return (
                <div className="space-y-5">
                  {survivalToday.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Survival</span>
                        <div className="flex-1 h-px bg-border/20" />
                      </div>
                      <AnimatePresence mode="popLayout">
                        {survivalToday.map(quest => (
                          <QuestRow key={quest.id} quest={quest} onComplete={handleComplete} onDelete={handleDelete} />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {funToday.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Daily Ritual</span>
                        <div className="flex-1 h-px bg-border/20" />
                      </div>
                      <AnimatePresence mode="popLayout">
                        {funToday.map(quest => (
                          <QuestRow key={quest.id} quest={quest} onComplete={handleComplete} onDelete={handleDelete} />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.section>
        )}

        {/* Older / custom quests */}
        {olderQuests.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary/50" />
              <h2 className="text-[10px] uppercase tracking-widest text-primary/60">Your Quests</h2>
            </div>
            <AnimatePresence mode="popLayout">
              {olderQuests.map(quest => (
                <QuestRow key={quest.id} quest={quest} onComplete={handleComplete} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.section>
        )}

        {/* Empty state */}
        {activeQuests.length === 0 && (
          <div className="text-center py-16 text-muted-foreground/50 font-serif space-y-2">
            <Ghost className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="italic">The board is quiet today.</p>
            <p className="text-sm">Draw your card to get today's quests.</p>
          </div>
        )}

        {/* Completed */}
        {completedQuests.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border/20">
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40 mb-5 text-center">
              Dispatched — {completedQuests.length} done
            </h3>
            <div className="space-y-2 opacity-40 grayscale">
              {completedQuests.slice(0, 6).map(quest => (
                <div key={quest.id} className="flex items-center gap-3 p-3 bg-card/20 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600/60 shrink-0" />
                  <span className="text-sm text-muted-foreground line-through font-serif">{quest.title}</span>
                </div>
              ))}
              {completedQuests.length > 6 && (
                <p className="text-center text-xs text-muted-foreground/30 italic pt-1">
                  +{completedQuests.length - 6} more dispatched
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}

/* ── Quest row component ────────────────────────────────────── */
interface QuestRowProps {
  quest: {
    id: number;
    title: string;
    category: QuestCategory;
    xpReward: number;
    completed: boolean;
  };
  onComplete: (id: number) => void;
  onDelete:   (id: number) => void;
}

function QuestRow({ quest, onComplete, onDelete }: QuestRowProps) {
  const catMeta = QUEST_CATEGORY_META[quest.category];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93, transition: { duration: 0.15 } }}
      className="group flex items-center justify-between gap-3 p-4 bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl hover:border-primary/25 transition-colors"
    >
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-medium uppercase tracking-widest text-primary/50 mb-0.5">
          {catMeta.icon} {catMeta.name}
        </span>
        <span className="font-serif text-base text-foreground/90 truncate">{quest.title}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <span className="text-xs font-mono text-primary/50 mr-1">+{quest.xpReward}</span>
        <button
          onClick={() => onComplete(quest.id)}
          className="p-1.5 rounded-lg text-emerald-600/60 hover:text-emerald-500 hover:bg-emerald-600/10 transition-colors"
          aria-label="Complete quest"
        >
          <CheckCircle2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(quest.id)}
          className="p-1.5 rounded-lg text-destructive/30 hover:text-destructive/70 hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Delete quest"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
