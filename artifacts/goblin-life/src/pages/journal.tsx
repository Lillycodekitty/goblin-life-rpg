import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListJournalEntries,
  useCreateJournalEntry,
  useDeleteJournalEntry,
  getListJournalEntriesQueryKey,
} from "@workspace/api-client-react";
import { WEATHER_META, GOBLIN_STATE_META } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, BookOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── Content parser for auto-generated entries ─────────────── */
function parseEntry(content: string) {
  const isAuto = content.includes("Today's card:");
  const translationMatch = content.match(/Translation:\s*"([^"]+)"/);
  const successMatch     = content.match(/Success today(?:\s+looks like)?:\s*(.+?)(?:\n|$)/i);
  const tinyThingMatch   = content.match(/(?:one thing|tiny thing):\s*(.+?)(?:\n|$)/i);
  const creatureMatch    = content.match(/Creatures present:\s*(.+?)(?:\n|$)/i);
  return {
    isAuto,
    translation:  translationMatch?.[1]?.trim()  ?? null,
    success:      successMatch?.[1]?.trim()       ?? null,
    tinyThing:    tinyThingMatch?.[1]?.trim()     ?? null,
    creatureSnip: creatureMatch?.[1]?.trim()       ?? null,
  };
}

/* ── Tarot reading card ────────────────────────────────────── */
function CornerOrnament({ flip }: { flip?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" className={`text-primary/40 ${flip ? "rotate-180" : ""}`} fill="none">
      <path d="M2 2 L2 14 M2 2 L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
    </svg>
  );
}

interface EntryCardProps {
  entry: {
    id: number;
    content: string;
    createdAt: string;
    emotionalWeather?: string | null;
    goblinState?: string | null;
  };
  onDelete: (id: number) => void;
  index: number;
}

function EntryCard({ entry, onDelete, index }: EntryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const weatherMeta = entry.emotionalWeather
    ? WEATHER_META[entry.emotionalWeather as keyof typeof WEATHER_META] ?? null
    : null;
  const goblinMeta = entry.goblinState
    ? GOBLIN_STATE_META[entry.goblinState as keyof typeof GOBLIN_STATE_META] ?? null
    : null;

  const parsed = parseEntry(entry.content);
  const date   = new Date(entry.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="relative rounded-2xl border border-primary/25 overflow-hidden shadow-lg"
      style={{
        background: "linear-gradient(160deg, #0e1c10 0%, #080f09 60%, #0b1c0d 100%)",
        boxShadow: "0 0 40px rgba(150,110,10,0.08), inset 0 0 30px rgba(0,0,0,0.35)",
      }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      <div className="relative p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <CornerOrnament />
          <div className="flex-1 text-center space-y-0.5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-primary/40">
              {format(date, "EEEE")}
            </p>
            <p className="text-sm font-serif text-primary/80">
              {format(date, "d MMMM yyyy")}
            </p>
          </div>
          <CornerOrnament flip />
        </div>

        {/* State + weather badges */}
        {(goblinMeta || weatherMeta) && (
          <div className="flex items-center justify-center gap-3 pt-1">
            {goblinMeta && (
              <div className="flex items-center gap-1.5">
                <span className="text-xl">{goblinMeta.icon}</span>
                <span className="text-xs font-serif text-foreground/70">{goblinMeta.name}</span>
              </div>
            )}
            {goblinMeta && weatherMeta && (
              <span className="text-primary/20 text-xs">·</span>
            )}
            {weatherMeta && (
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{weatherMeta.icon}</span>
                <span className="text-xs text-muted-foreground/60">{weatherMeta.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Creature snippet */}
        {parsed.creatureSnip && (
          <p className="text-center text-xs text-muted-foreground/50 italic">{parsed.creatureSnip}</p>
        )}

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-primary/15" />
          <span className="text-primary/30 text-[10px]">✦</span>
          <div className="flex-1 h-px bg-primary/15" />
        </div>

        {/* Auto-entry highlights */}
        {parsed.isAuto ? (
          <div className="space-y-2">
            {parsed.translation && (
              <p className="font-serif italic text-foreground/85 text-sm leading-relaxed text-center px-2">
                "{parsed.translation}"
              </p>
            )}
            {parsed.success && (
              <p className="text-xs text-primary/70 italic text-center">{parsed.success}</p>
            )}
            {parsed.tinyThing && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                <span className="text-primary/50 text-xs uppercase tracking-wide shrink-0 mt-0.5">one thing:</span>
                <p className="text-xs text-foreground/75">{parsed.tinyThing}</p>
              </div>
            )}

            {/* Expand / collapse full reading */}
            <button
              onClick={() => setExpanded(e => !e)}
              className="w-full flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-primary/40 hover:text-primary/70 transition-colors py-1"
            >
              {expanded ? <><ChevronUp className="w-3 h-3" /> Hide full reading</> : <><ChevronDown className="w-3 h-3" /> Read full reading</>}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="font-serif text-sm leading-relaxed text-foreground/70 whitespace-pre-wrap pt-1 border-t border-primary/10">
                    {entry.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Manual entry — show full content */
          <div className="font-serif text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {entry.content}
          </div>
        )}

        {/* Delete */}
        <div className="flex justify-end pt-1">
          <button
            onClick={() => onDelete(entry.id)}
            className="text-destructive/30 hover:text-destructive/70 transition-colors p-1"
            aria-label="Delete entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function Journal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: entries, isLoading } = useListJournalEntries();
  const createEntry  = useCreateJournalEntry();
  const deleteEntry  = useDeleteJournalEntry();

  const [isWriting, setIsWriting] = useState(false);
  const [content,   setContent]   = useState("");

  const handleSave = () => {
    if (!content.trim()) return;
    createEntry.mutate(
      { data: { content } },
      {
        onSuccess: () => {
          setContent("");
          setIsWriting(false);
          queryClient.invalidateQueries({ queryKey: getListJournalEntriesQueryKey() });
          toast({ title: "Memory sealed", description: "Your thoughts are safe here." });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteEntry.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListJournalEntriesQueryKey() });
        toast({ title: "Entry released", description: "Gone from the record." });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary/40 font-serif italic">leafing through the pages...</div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-12 max-w-2xl mx-auto min-h-screen pt-20 pb-24">

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-primary/40 mb-1">The</p>
          <h1 className="text-4xl md:text-5xl text-primary font-serif italic tracking-wide">
            Grimoire
          </h1>
          <p className="text-sm text-muted-foreground/60 mt-1 font-serif italic">
            A record of the days, as they actually were.
          </p>
        </div>
        <Button
          variant={isWriting ? "secondary" : "default"}
          onClick={() => setIsWriting(w => !w)}
          className="rounded-full w-12 h-12 shrink-0"
        >
          {isWriting ? <BookOpen className="w-5 h-5" /> : <PenLine className="w-5 h-5" />}
        </Button>
      </motion.header>

      {/* Write panel */}
      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-xl">
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="The ink waits..."
                className="bg-transparent border-none focus-visible:ring-0 text-base font-serif min-h-[180px] resize-none placeholder:text-muted-foreground/30 p-0"
              />
              <div className="flex justify-end mt-4 pt-4 border-t border-border/30">
                <Button
                  onClick={handleSave}
                  disabled={!content.trim() || createEntry.isPending}
                  className="bg-primary text-primary-foreground font-serif"
                >
                  Seal Entry
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries */}
      {(!entries || entries.length === 0) ? (
        <div className="text-center py-24 text-muted-foreground/50 font-serif space-y-2">
          <p className="text-lg italic">The pages are blank.</p>
          <p className="text-sm">Draw your first card to write the first entry.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {entries.map((entry, i) => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} index={i} />
          ))}
        </div>
      )}

    </div>
  );
}
