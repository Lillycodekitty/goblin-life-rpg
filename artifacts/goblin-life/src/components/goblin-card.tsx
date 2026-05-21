import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateQuest, getListQuestsQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  GOBLIN_STATE_META,
  WEATHER_META,
  MODIFIERS,
  SUGGESTED_QUESTS,
  CREATURES,
  getCreatureReading,
  type CreatureId,
  type Modifier,
} from "@/lib/constants";
import type { GoblinState, EmotionalWeather } from "@workspace/api-client-react";

interface GoblinCardProps {
  goblinState: GoblinState;
  weather: EmotionalWeather;
  activeModifiers: string[];
  selectedCreatures: CreatureId[];
  onDrawAgain: () => void;
}

function CornerOrnament({ flip }: { flip?: boolean }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className={`text-primary/60 ${flip ? "rotate-180" : ""}`} fill="none">
      <path d="M2 2 L2 14 M2 2 L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
      <path d="M6 6 L6 10 M6 6 L10 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-2 my-1">
      <div className="flex-1 h-px bg-primary/20" />
      <span className="text-primary/40 text-xs">✦</span>
      <div className="flex-1 h-px bg-primary/20" />
    </div>
  );
}

export function GoblinCard({ goblinState, weather, activeModifiers, selectedCreatures, onDrawAgain }: GoblinCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createQuest = useCreateQuest();
  const [sentToBoard, setSentToBoard] = useState(false);

  const stateMeta  = GOBLIN_STATE_META[goblinState];
  const weatherMeta = WEATHER_META[weather];
  const suggested  = SUGGESTED_QUESTS[goblinState] ?? [];
  const selectedModifierObjs = MODIFIERS.filter(m => activeModifiers.includes(m.id));
  const creatureReading = selectedCreatures.length > 0 ? getCreatureReading(selectedCreatures) : null;
  const presentCreatures = selectedCreatures.map(id => CREATURES[id]).filter(Boolean);

  const handleSendToBoard = async () => {
    for (const quest of suggested) {
      await createQuest.mutateAsync({ data: quest });
    }
    queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
    setSentToBoard(true);
    toast({ title: "Quests inscribed", description: "Check the Quest Board." });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto"
    >
      <div
        className="relative rounded-2xl border border-primary/30 overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #0d1a0f 0%, #070f08 50%, #0a1a0c 100%)",
          boxShadow: "0 0 60px rgba(180,130,20,0.12), inset 0 0 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Parchment noise */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />

        <div className="relative p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <CornerOrnament />
            <p className="text-[10px] tracking-[0.25em] uppercase text-primary/50 font-sans flex-1 text-center">The Goblin Card</p>
            <CornerOrnament flip />
          </div>

          {/* State */}
          <div className="text-center space-y-1">
            <div className="text-5xl mb-2">{stateMeta.icon}</div>
            <h2 className="text-2xl font-serif text-primary tracking-wide">{stateMeta.name}</h2>
            <p className="text-sm font-serif italic text-muted-foreground">{stateMeta.tagline}</p>
          </div>

          <Divider />

          {/* Weather */}
          <div className="space-y-0.5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-primary/50">Emotional Weather</p>
            <div className="flex items-center gap-2">
              <span className="text-lg">{weatherMeta.icon}</span>
              <span className="font-serif text-foreground/90">{weatherMeta.name}</span>
            </div>
            <p className="text-sm text-muted-foreground italic">{weatherMeta.description}</p>
          </div>

          <Divider />

          {/* Translation */}
          <div className="space-y-0.5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-primary/50">Translation</p>
            <p className="font-serif italic text-foreground/90 text-sm leading-relaxed">"{stateMeta.translation}"</p>
          </div>

          {/* What you need */}
          <div className="space-y-0.5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-primary/50">What You Actually Need</p>
            <p className="text-sm text-foreground/80">{stateMeta.whatYouNeed}</p>
          </div>

          {/* Success today */}
          <div className="space-y-0.5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-primary/50">Success Today Looks Like</p>
            <p className="font-serif italic text-primary/90 text-sm">{stateMeta.successToday}</p>
          </div>

          {/* Creature reading */}
          {creatureReading && (
            <>
              <Divider />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-primary/50">Creature Reading</p>
                  <div className="flex gap-0.5">
                    {presentCreatures.map(c => (
                      <span key={c.id} className="text-base">{c.icon}</span>
                    ))}
                  </div>
                </div>
                <p className="font-serif text-sm text-primary/80 font-medium">{creatureReading.heading}</p>
                <p className="text-sm text-foreground/75 leading-relaxed">{creatureReading.reading}</p>
                <div className="flex items-start gap-2 mt-1 p-2 rounded-lg bg-primary/5 border border-primary/10">
                  <span className="text-primary/60 shrink-0 text-xs uppercase tracking-wide">one thing:</span>
                  <p className="text-sm text-foreground/80">{creatureReading.tinyThing}</p>
                </div>
              </div>
            </>
          )}

          {/* Active curses */}
          {selectedModifierObjs.length > 0 && (
            <>
              <Divider />
              <div className="space-y-1.5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-primary/50">Active Curses</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModifierObjs.map((m: Modifier) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-primary/20 bg-primary/5 text-foreground/70"
                    >
                      {m.icon} {m.label}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <Divider />

          {/* Approach */}
          <div className="space-y-1.5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-primary/50">Approach for Today</p>
            <ul className="space-y-1">
              {stateMeta.approach.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-primary/60 mt-0.5 shrink-0">✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-500/60 italic mt-1">⚠ avoid: {stateMeta.avoid}</p>
          </div>

          <Divider />

          {/* Quests */}
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.2em] uppercase text-primary/50">Recommended Quests</p>
            <div className="space-y-1.5">
              {suggested.map((q, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-foreground/75 flex items-start gap-1.5">
                    <span className="text-muted-foreground/50 shrink-0">·</span>
                    {q.title}
                  </span>
                  <span className="text-xs text-primary/70 font-mono shrink-0">+{q.xpReward}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={handleSendToBoard}
              disabled={sentToBoard || createQuest.isPending}
              variant="outline"
              className="w-full mt-2 border-primary/30 text-primary/80 hover:bg-primary/10 hover:text-primary font-sans tracking-widest text-xs uppercase"
            >
              {sentToBoard ? (
                <><Check className="w-3 h-3 mr-2" />Sent to Quest Board</>
              ) : createQuest.isPending ? (
                "Inscribing..."
              ) : (
                "✦ Send to Quest Board ✦"
              )}
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-1">
            <p className="text-xs text-muted-foreground/40 italic font-serif">~ may your moss be soft ~</p>
          </div>

          <div className="flex items-end justify-between -mb-1">
            <CornerOrnament flip />
            <div className="flex-1" />
            <CornerOrnament />
          </div>
        </div>
      </div>

      {/* Draw again */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center mt-6"
      >
        <Button
          onClick={onDrawAgain}
          variant="ghost"
          className="text-muted-foreground/60 hover:text-foreground text-sm tracking-widest uppercase font-sans"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-2" />
          Draw Again
        </Button>
      </motion.div>
    </motion.div>
  );
}
