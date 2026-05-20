import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetDailyState, 
  useSetDailyState, 
  getGetDailyStateQueryKey,
  useGetRecommendedQuests,
  EmotionalWeather,
  GoblinState
} from "@workspace/api-client-react";
import { WEATHER_META, GOBLIN_STATE_META } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: dailyState, isLoading } = useGetDailyState();
  const { data: recommendations } = useGetRecommendedQuests();
  const setDailyState = useSetDailyState();

  const [weather, setWeather] = useState<EmotionalWeather>("foggy_morning");
  const [goblinState, setGoblinState] = useState<GoblinState>("vaguely_employed");
  const [note, setNote] = useState("");

  const initialized = useRef(false);

  useEffect(() => {
    if (dailyState && !initialized.current) {
      if (dailyState.emotionalWeather) setWeather(dailyState.emotionalWeather as EmotionalWeather);
      if (dailyState.goblinState) setGoblinState(dailyState.goblinState as GoblinState);
      setNote(dailyState.note || "");
      initialized.current = true;
    }
  }, [dailyState]);

  const handleSave = () => {
    setDailyState.mutate({
      data: { emotionalWeather: weather, goblinState, note }
    }, {
      onSuccess: (data) => {
        queryClient.setQueryData(getGetDailyStateQueryKey(), data);
        toast({ title: "Sanctuary updated", description: "The atmosphere has shifted." });
      }
    });
  };

  if (isLoading) {
    return <div className="p-6 min-h-screen flex items-center justify-center"><div className="animate-pulse w-16 h-16 bg-primary/20 rounded-full" /></div>;
  }

  const currentMeta = WEATHER_META[weather];
  const isEditing = !dailyState || dailyState.emotionalWeather !== weather || dailyState.goblinState !== goblinState || (dailyState.note || "") !== note;

  return (
    <div className="p-6 md:p-12 max-w-2xl mx-auto min-h-screen pt-24 relative">
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center space-y-4"
      >
        <h1 className="text-4xl md:text-6xl text-primary font-serif italic tracking-wide drop-shadow-md">
          Goblin Life
        </h1>
        <p className="text-lg text-muted-foreground/80">Your cozy, haunted sanctuary.</p>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Today's Weather</label>
            <Select value={weather} onValueChange={(v) => setWeather(v as EmotionalWeather)}>
              <SelectTrigger className="w-full h-14 bg-background/50 border-border/50 font-serif text-lg text-foreground hover:bg-background/80 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                {Object.entries(WEATHER_META).map(([key, meta]) => (
                  <SelectItem key={key} value={key} className="font-serif">
                    <span className="mr-2">{meta.icon}</span> {meta.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-primary/80 italic pt-2">{currentMeta.description}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Goblin State</label>
            <Select value={goblinState} onValueChange={(v) => setGoblinState(v as GoblinState)}>
              <SelectTrigger className="w-full h-14 bg-background/50 border-border/50 font-serif text-lg text-foreground hover:bg-background/80 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                {Object.entries(GOBLIN_STATE_META).map(([key, meta]) => (
                  <SelectItem key={key} value={key} className="font-serif">
                    <span className="mr-2">{meta.icon}</span> {meta.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Scribble a thought...</label>
            <Textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's lingering?"
              className="bg-background/50 border-border/50 min-h-[100px] resize-none font-serif text-lg placeholder:text-muted-foreground/30 focus-visible:ring-primary/20"
            />
          </div>

          <AnimatePresence>
            {isEditing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Button 
                  onClick={handleSave} 
                  disabled={setDailyState.isPending}
                  className="w-full h-12 font-serif text-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {setDailyState.isPending ? "Shifting..." : "Solidify Atmosphere"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {recommendations && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-serif text-primary">Guidance from the Woods</h2>
            <p className="text-muted-foreground">{recommendations.guidance.translation}</p>
          </div>
          
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-4">
            <p className="font-serif text-xl">"Pick ONE tiny thing:"</p>
            <p className="text-lg text-primary/90">{recommendations.tinyThing}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
