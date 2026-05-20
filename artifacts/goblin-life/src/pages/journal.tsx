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
import { BookOpen, PenLine, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Journal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: entries, isLoading } = useListJournalEntries();
  const createEntry = useCreateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!content.trim()) return;
    createEntry.mutate({
      data: { content }
    }, {
      onSuccess: () => {
        setContent("");
        setIsWriting(false);
        queryClient.invalidateQueries({ queryKey: getListJournalEntriesQueryKey() });
        toast({ title: "Memory sealed", description: "Your thoughts are safe here." });
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteEntry.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListJournalEntriesQueryKey() });
      }
    });
  };

  if (isLoading) {
    return <div className="p-6 min-h-screen flex items-center justify-center"><div className="animate-pulse w-16 h-16 bg-primary/20 rounded-full" /></div>;
  }

  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto min-h-screen pt-24">
      <motion.header 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl text-primary font-serif italic tracking-wide drop-shadow-md">
            Goblin Journal
          </h1>
          <p className="text-lg text-muted-foreground/80 mt-2">Pages torn from the mind.</p>
        </div>
        <Button 
          variant={isWriting ? "secondary" : "default"} 
          onClick={() => setIsWriting(!isWriting)}
          className="rounded-full w-14 h-14"
        >
          {isWriting ? <BookOpen className="w-6 h-6" /> : <PenLine className="w-6 h-6" />}
        </Button>
      </motion.header>

      <AnimatePresence>
        {isWriting && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
            animate={{ opacity: 1, height: 'auto', marginBottom: 48 }} 
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-xl relative">
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="The ink waits..."
                className="bg-transparent border-none focus-visible:ring-0 text-lg font-serif min-h-[200px] resize-none placeholder:text-muted-foreground/30 p-0"
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

      <div className="space-y-8">
        {(!entries || entries.length === 0) ? (
          <div className="text-center py-20 text-muted-foreground font-serif">
            <p>The book is empty.</p>
          </div>
        ) : (
          entries.map((entry, i) => {
            const weatherMeta = entry.emotionalWeather ? WEATHER_META[entry.emotionalWeather as any] : null;
            const goblinMeta = entry.goblinState ? GOBLIN_STATE_META[entry.goblinState as any] : null;
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                key={entry.id}
                className="group relative bg-[#f4f1ea] dark:bg-card/20 backdrop-blur-md rounded-lg p-6 md:p-8 shadow-sm"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`
                }}
              >
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)} className="text-destructive/50 hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-3 mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground/70 border-b border-border/20 pb-4">
                  <span>{format(new Date(entry.createdAt), "MMM d, yyyy")}</span>
                  {(weatherMeta || goblinMeta) && <span className="opacity-50">•</span>}
                  {weatherMeta && <span title={weatherMeta.name}>{weatherMeta.icon}</span>}
                  {goblinMeta && <span title={goblinMeta.name}>{goblinMeta.icon}</span>}
                </div>
                
                <div className="font-serif text-lg leading-relaxed text-card-foreground dark:text-foreground whitespace-pre-wrap">
                  {entry.content}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
