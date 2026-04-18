import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { generateRecipes, Recipe } from "../services/gemini";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Search, Sparkles, Clock, Flame, BookOpen, Bookmark, Zap, Loader2, List } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function Recipes() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) {
      toast.error("Please enter some ingredients.");
      return;
    }

    setLoading(true);
    try {
      const results = await generateRecipes(ingredients);
      setRecipes(results);
      if (results.length === 0) {
        toast.error("No recipes found for those ingredients.");
      }
    } catch (error) {
      toast.error("AI service error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async (recipe: Recipe, index: number) => {
    if (!user) return;
    setSaving(index);
    try {
      await addDoc(collection(db, "users", user.uid, "savedRecipes"), {
        ...recipe,
        inputIngredients: ingredients,
        createdAt: new Date().toISOString()
      });
      toast.success("Recipe saved to your collection!");
    } catch (err) {
      toast.error("Failed to save recipe.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
          AI <span className="text-[#ccff00]">RECIPE ENGINE</span>
        </h1>
        <p className="text-[#888888] text-[10px] font-bold uppercase tracking-widest">Generative Gastronomy based on available data</p>
      </header>

      <div className="glass-panel space-y-6">
        <div>
          <h3 className="mb-2 text-[#ccff00] text-[10px] font-bold uppercase tracking-widest">Ingredient Input</h3>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-4">Initialize the generation engine by listing your available kitchen assets.</p>
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 bg-white/5 border border-[#00d4ff]/30 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#00d4ff] transition-all">
              <Search className="w-4 h-4 text-[#00d4ff]" />
              <input 
                type="text"
                placeholder="chicken, spinach, avocado, lemon..."
                className="bg-transparent border-none outline-none text-white w-full text-sm font-medium"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="bg-[#ccff00] text-black px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 shadow-lg shadow-[#ccff00]/10 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "PROCESSING..." : "GENERATE"}
            </button>
          </form>
        </div>

        <AnimatePresence>
          {recipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-white/5">
              {recipes.map((recipe, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "glass-card p-0 overflow-hidden relative border-white/5 flex flex-col group",
                    idx === 0 && "md:col-span-2 lg:col-span-1 border-stone-800"
                  )}
                >
                  <div className="p-6 flex-1">
                    {idx === 0 && (
                      <div className="inline-block px-2 py-0.5 rounded-sm bg-[#ccff00] text-black text-[8px] font-black tracking-widest uppercase mb-4">
                        Top Recommendation
                      </div>
                    )}
                    <h2 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-[#ccff00] transition-colors italic">{recipe.title}</h2>
                    <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase text-[#00d4ff] mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.prepTime}</span>
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {recipe.calories} KCAL</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] uppercase font-black text-[#888888] tracking-widest mb-2 italic">Instructions</h4>
                        <ol className="text-xs text-zinc-400 space-y-2 leading-relaxed font-medium">
                          {recipe.instructions.slice(0, 3).map((step, i) => (
                            <li key={i} className="flex gap-2">
                               <span className="text-[#ccff00] font-black tabular-nums">{i + 1}.</span>
                               <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => saveRecipe(recipe, idx)}
                    disabled={saving === idx}
                    className="w-full py-4 bg-white/5 hover:bg-[#ccff00]/10 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-[#888888] hover:text-[#ccff00] transition-all flex items-center justify-center gap-2"
                  >
                    {saving === idx ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bookmark className="w-3 h-3" />}
                    {saving === idx ? "SAVING..." : "Save to Log"}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {!loading && recipes.length === 0 && ingredients === "" && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/5 text-zinc-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="text-zinc-600 max-w-xs">Enter local ingredients to discover creative, healthy recipes powered by AI.</p>
        </div>
      )}
    </div>
  );
}
