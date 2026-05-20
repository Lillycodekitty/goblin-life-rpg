import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListQuests, 
  useCompleteQuest, 
  useDeleteQuest,
  useCreateQuest,
  getListQuestsQueryKey,
  getGetStatsQueryKey,
  getGetCharacterQueryKey,
  getGetActivityQueryKey,
  QuestCategory
} from "@workspace/api-client-react";
import { QUEST_CATEGORY_META } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Trash2, Plus, Ghost } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Quests() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: quests, isLoading } = useListQuests();
  const completeQuest = useCompleteQuest();
  const deleteQuest = useDeleteQuest();
  const createQuest = useCreateQuest();

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<QuestCategory>("goblin_survival");

  const activeQuests = quests?.filter(q => !q.completed) || [];
  const completedQuests = quests?.filter(q => q.completed) || [];

  const handleComplete = (id: number) => {
    completeQuest.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCharacterQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetActivityQueryKey() });
        toast({ title: "Quest complete", description: "XP added to your soul." });
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteQuest.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
        toast({ title: "Quest vanished", description: "It never existed anyway." });
      }
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createQuest.mutate({
      data: { title: newTitle, category: newCategory, xpReward: 10 }
    }, {
      onSuccess: () => {
        setNewTitle("");
        queryClient.invalidateQueries({ queryKey: getListQuestsQueryKey() });
        toast({ title: "Quest inscribed", description: "Good luck." });
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
        className="mb-12 text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl text-primary font-serif italic tracking-wide drop-shadow-md">
          Quest Board
        </h1>
        <p className="text-lg text-muted-foreground/80">Tiny tasks to keep the darkness at bay.</p>
      </motion.header>

      <motion.form 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleCreate}
        className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-xl p-4 flex flex-col sm:flex-row gap-4 mb-12 shadow-lg"
      >
        <Input 
          value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New quest..."
          className="flex-1 bg-background/50 border-border/50 font-serif h-12 text-lg"
        />
        <Select value={newCategory} onValueChange={(v) => setNewCategory(v as QuestCategory)}>
          <SelectTrigger className="w-full sm:w-[200px] h-12 bg-background/50 border-border/50 font-serif">
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
        <Button type="submit" disabled={!newTitle.trim() || createQuest.isPending} className="h-12 bg-primary text-primary-foreground">
          <Plus className="w-5 h-5 mr-2" /> Inscribe
        </Button>
      </motion.form>

      <div className="space-y-4">
        {activeQuests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-serif">
            <Ghost className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>The board is quiet today.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {activeQuests.map((quest) => (
              <motion.div
                layout
                key={quest.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="group flex items-center justify-between p-4 bg-[#e8e2d2] dark:bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg shadow-sm hover:border-primary/30 transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`
                }}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium uppercase tracking-widest text-primary/70 mb-1">
                    {QUEST_CATEGORY_META[quest.category].icon} {QUEST_CATEGORY_META[quest.category].name}
                  </span>
                  <span className="font-serif text-lg text-card-foreground dark:text-foreground">{quest.title}</span>
                </div>
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleComplete(quest.id)} className="text-emerald-600 hover:bg-emerald-600/10 hover:text-emerald-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(quest.id)} className="text-destructive/70 hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {completedQuests.length > 0 && (
        <div className="mt-16 pt-8 border-t border-border/30">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6 text-center">Echoes of the Past (Completed)</h3>
          <div className="space-y-3 opacity-50 grayscale mix-blend-luminosity">
            {completedQuests.slice(0, 5).map(quest => (
              <div key={quest.id} className="flex items-center gap-4 p-3 bg-card/20 rounded-lg">
                <span className="text-muted-foreground line-through font-serif">{quest.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
