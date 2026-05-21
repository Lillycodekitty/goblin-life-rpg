import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetDailyState,
  useSetDailyState,
  useCreateJournalEntry,
  getGetDailyStateQueryKey,
  getGetRecommendedQuestsQueryKey,
  getListJournalEntriesQueryKey,
  EmotionalWeather,
  GoblinState,
} from "@workspace/api-client-react";
import {
  GOBLIN_STATE_META,
  WEATHER_META,
  MODIFIERS,
  CREATURE_LIST,
  type CreatureId,
  generateJournalEntry,
} from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { GoblinCard } from "@/components/goblin-card";

type Step = "state" | "creatures" | "modifiers" | "card";

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: dailyState, isLoading } = useGetDailyState();
  const setDailyState = useSetDailyState();
  const createJournalEntry = useCreateJournalEntry();

  const [step, setStep] = useState<Step>("state");
  const [selectedState, setSelectedState] = useState<GoblinState>("vaguely_employed");
  const [selectedWeather, setSelectedWeather] = useState<EmotionalWeather>("foggy_morning");
  const [selectedCreatures, setSelectedCreatures] = useState<CreatureId[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);

  /* Restore today's saved state */
  useEffect(() => {
    if (dailyState?.emotionalWeather && dailyState?.goblinState) {
      setSelectedState(dailyState.goblinState as GoblinState);
      setSelectedWeather(dailyState.emotionalWeather as EmotionalWeather);
      setStep("card");
    }
  }, [dailyState]);

  const toggleCreature = (id: CreatureId) => {
    setSelectedCreatures(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleModifier = (id: string) => {
    setSelectedModifiers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleDrawCard = () => {
    setDailyState.mutate(
      { data: { emotionalWeather: selectedWeather, goblinState: selectedState } },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(getGetDailyStateQueryKey(), data);
          queryClient.invalidateQueries({ queryKey: getGetRecommendedQuestsQueryKey() });

          /* Auto-write Grimoire entry */
          const content = generateJournalEntry(
            selectedState,
            selectedWeather,
            selectedModifiers,
            selectedCreatures
          );
          createJournalEntry.mutate(
            {
              data: {
                content,
                mood: selectedState,
                emotionalWeather: selectedWeather,
                goblinState: selectedState,
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getListJournalEntriesQueryKey() });
                toast({
                  title: "Reading inscribed",
                  description: "Today's entry has been added to your Grimoire.",
                });
              },
            }
          );

          setStep("card");
        },
        onError: () => {
          toast({ title: "Something went wrong", description: "The forest is confused. Try again." });
        },
      }
    );
  };

  const handleDrawAgain = () => {
    setStep("state");
    setSelectedModifiers([]);
    setSelectedCreatures([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary/40 font-serif italic text-lg">reading the moss...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 pb-24 px-4">
      {/* App header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 pt-4"
      >
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 mb-1">~ A Cozy Fantasy ~</p>
        <h1 className="font-serif text-3xl md:text-4xl">
          <span className="text-primary">Goblin</span>{" "}
          <span className="text-foreground/90">Life</span>{" "}
          <span className="text-emerald-600/80">RPG</span>
        </h1>
        <p className="text-sm text-muted-foreground/60 italic mt-1 font-serif max-w-xs mx-auto">
          A self-care grimoire for tiny forest menaces, haunted bookworms, and suspiciously functional witches.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── STEP 1: Goblin State ─────────────────────────────── */}
        {step === "state" && (
          <motion.div
            key="step-state"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="max-w-sm mx-auto space-y-5"
          >
            <div className="text-center space-y-1">
              <p className="text-[10px] tracking-[0.25em] uppercase text-primary/50">Step I · The Reckoning</p>
              <h2 className="font-serif text-2xl text-foreground/90">How's the goblin today?</h2>
            </div>

            <div className="space-y-2">
              {(Object.keys(GOBLIN_STATE_META) as GoblinState[]).map((key) => {
                const meta = GOBLIN_STATE_META[key];
                const isSelected = selectedState === key;
                return (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedState(key)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/5"
                        : "border-border/40 bg-card/30 hover:border-border/60 hover:bg-card/50"
                    }`}
                  >
                    <span className="text-2xl shrink-0">{meta.icon}</span>
                    <div className="min-w-0">
                      <p className={`font-serif text-base leading-tight ${isSelected ? "text-primary" : "text-foreground/90"}`}>
                        {meta.name}
                      </p>
                      <p className="text-xs text-muted-foreground/70 italic mt-0.5 truncate">{meta.tagline}</p>
                    </div>
                    {isSelected && <span className="text-primary ml-auto shrink-0 text-sm">✦</span>}
                  </motion.button>
                );
              })}
            </div>

            <Btn onClick={() => setStep("creatures")} className="w-full h-12 bg-primary text-primary-foreground font-sans tracking-widest text-sm uppercase">
              Continue →
            </Btn>
          </motion.div>
        )}

        {/* ── STEP 2: Creature Check-In ────────────────────────── */}
        {step === "creatures" && (
          <motion.div
            key="step-creatures"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-sm mx-auto space-y-5"
          >
            <button
              onClick={() => setStep("state")}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground uppercase tracking-widest flex items-center gap-1"
            >
              ← back
            </button>

            <div className="text-center space-y-1">
              <p className="text-[10px] tracking-[0.25em] uppercase text-primary/50">Step II · The Woods</p>
              <h2 className="font-serif text-2xl text-foreground/90">Who is moving through the woods today?</h2>
              <p className="text-xs text-muted-foreground/50 italic">Select all that apply. Or none — that's valid too.</p>
            </div>

            <div className="space-y-3">
              {CREATURE_LIST.map((creature) => {
                const isSelected = selectedCreatures.includes(creature.id);
                return (
                  <motion.button
                    key={creature.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleCreature(creature.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/5"
                        : "border-border/40 bg-card/30 hover:border-border/60 hover:bg-card/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{creature.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-serif text-base ${isSelected ? "text-primary" : "text-foreground/90"}`}>
                            {creature.name}
                          </p>
                          {isSelected && <span className="text-primary text-xs">✦</span>}
                        </div>
                        <p className="text-[11px] text-primary/50 uppercase tracking-wide mt-0.5">{creature.species}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{creature.meaning}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-2 pl-9">
                        <p className="text-xs text-muted-foreground/60 italic">"{creature.coretruth}"</p>
                        <div className="flex gap-1 mt-1.5">
                          {creature.careIcons.map((ic, i) => (
                            <span key={i} className="text-base">{ic}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <Btn onClick={() => setStep("modifiers")} className="w-full h-12 bg-primary text-primary-foreground font-sans tracking-widest text-sm uppercase">
              Continue →
            </Btn>
          </motion.div>
        )}

        {/* ── STEP 3: Modifiers + Weather ──────────────────────── */}
        {step === "modifiers" && (
          <motion.div
            key="step-modifiers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-sm mx-auto space-y-6"
          >
            <button
              onClick={() => setStep("creatures")}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground uppercase tracking-widest flex items-center gap-1"
            >
              ← back
            </button>

            {/* Weather */}
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.25em] uppercase text-primary/50">Emotional Weather</p>
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.keys(WEATHER_META) as EmotionalWeather[]).map(key => {
                  const m = WEATHER_META[key];
                  const isSelected = selectedWeather === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedWeather(key)}
                      className={`flex flex-col items-center gap-0.5 p-2 rounded-lg border text-center transition-all ${
                        isSelected
                          ? "border-primary/50 bg-primary/10"
                          : "border-border/30 bg-card/20 hover:border-border/50"
                      }`}
                    >
                      <span className="text-xl leading-none">{m.icon}</span>
                      <span className={`text-[9px] leading-tight font-sans ${isSelected ? "text-primary" : "text-muted-foreground/60"}`}>
                        {m.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modifiers */}
            <div className="space-y-2">
              <div className="text-center space-y-0.5">
                <p className="text-[10px] tracking-[0.25em] uppercase text-primary/50">Step III · Modifiers</p>
                <h2 className="font-serif text-xl text-foreground/90">What's in the mix today?</h2>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {MODIFIERS.map(m => {
                  const isActive = selectedModifiers.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleModifier(m.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all duration-150 ${
                        isActive
                          ? "border-primary/50 bg-primary/15 text-primary"
                          : "border-border/40 bg-card/30 text-muted-foreground/70 hover:border-border/60"
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Btn
              onClick={handleDrawCard}
              disabled={setDailyState.isPending}
              className="w-full h-12 bg-primary text-primary-foreground font-sans tracking-widest text-sm uppercase shadow-lg shadow-primary/20"
            >
              {setDailyState.isPending ? "Reading the moss..." : "✦ Draw the Card ✦"}
            </Btn>
          </motion.div>
        )}

        {/* ── STEP 4: The Goblin Card ──────────────────────────── */}
        {step === "card" && (
          <motion.div
            key="step-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-sm mx-auto"
          >
            <GoblinCard
              goblinState={selectedState}
              weather={selectedWeather}
              activeModifiers={selectedModifiers}
              selectedCreatures={selectedCreatures}
              onDrawAgain={handleDrawAgain}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

function Btn({
  children, onClick, disabled, className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
