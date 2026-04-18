import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Utensils, Dumbbell, Clock, Flame, ChevronRight, Apple, Beef, Pizza } from "lucide-react";
import { cn } from "../lib/utils";

export default function Log() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"meal" | "workout">("meal");
  const [loading, setLoading] = useState(false);

  const [mealData, setMealData] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    category: "lunch"
  });

  const [workoutData, setWorkoutData] = useState({
    type: "",
    duration: 30,
    caloriesBurned: 200
  });

  const handleMealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const date = new Date().toISOString().split('T')[0];
      await addDoc(collection(db, "users", user.uid, "meals"), {
        ...mealData,
        date,
        timestamp: new Date().toISOString()
      });
      toast.success("Meal logged!");
      setMealData({ name: "", calories: 0, protein: 0, carbs: 0, fats: 0, category: "lunch" });
    } catch (err) {
      toast.error("Failed to log meal.");
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const date = new Date().toISOString().split('T')[0];
      await addDoc(collection(db, "users", user.uid, "workouts"), {
        ...workoutData,
        date,
        timestamp: new Date().toISOString()
      });
      toast.success("Workout logged!");
      setWorkoutData({ type: "", duration: 30, caloriesBurned: 200 });
    } catch (err) {
      toast.error("Failed to log workout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2 text-white">
          DIET & <span className="text-[#ccff00]">POWER LOG</span>
        </h1>
        <p className="text-[#888888] text-[10px] font-bold uppercase tracking-widest">Measure biometric intake and metabolic output</p>
      </header>

      <div className="flex p-1 bg-white/5 rounded-2xl w-full md:w-64 border border-white/5">
        <button
          onClick={() => setActiveTab("meal")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
            activeTab === "meal" ? "bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/10" : "text-zinc-500 hover:text-white"
          )}
        >
          <Utensils className="w-3 h-3" /> Intake
        </button>
        <button
          onClick={() => setActiveTab("workout")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
            activeTab === "workout" ? "bg-[#00d4ff] text-black shadow-lg shadow-[#00d4ff]/10" : "text-zinc-500 hover:text-white"
          )}
        >
          <Dumbbell className="w-3 h-3" /> Output
        </button>
      </div>

      {activeTab === "meal" ? (
        <form onSubmit={handleMealSubmit} className="glass-panel space-y-6">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
             <h3 className="mb-0 text-[#ccff00]">Food Registry</h3>
             <Apple className="text-[#ccff00] w-4 h-4 opacity-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Entry Designation</label>
              <input
                required
                type="text"
                placeholder="e.g. Avocado Toast with Egg"
                value={mealData.name}
                onChange={e => setMealData({...mealData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-[#00d4ff] transition-all font-bold text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Category</label>
              <select
                value={mealData.category}
                onChange={e => setMealData({...mealData, category: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-[#00d4ff] transition-all appearance-none font-bold text-sm"
              >
                <option value="breakfast" className="bg-zinc-950">Breakfast</option>
                <option value="lunch" className="bg-zinc-950">Lunch</option>
                <option value="dinner" className="bg-zinc-950">Dinner</option>
                <option value="snack" className="bg-zinc-950">Snack</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Calorie Value</label>
              <div className="relative">
                <input
                  required
                  type="number"
                  value={mealData.calories}
                  onChange={e => setMealData({...mealData, calories: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-[#00d4ff] transition-all font-bold text-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#888888] uppercase">kcal</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              {[
                { label: "Protein", key: "protein", icon: Beef, color: "text-[#ff4d4d]" },
                { label: "Carbs", key: "carbs", icon: Pizza, color: "text-[#00d4ff]" },
                { label: "Fats", key: "fats", icon: Utensils, color: "text-[#ffd700]" },
              ].map((macro) => (
                <div key={macro.key} className="space-y-2">
                  <label className="text-[8px] font-black text-[#888888] uppercase tracking-[0.2em] flex items-center gap-1">
                     {macro.label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={mealData[macro.key as keyof typeof mealData]}
                      onChange={e => setMealData({...mealData, [macro.key]: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-3 outline-none font-bold text-xs"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-[#888888] font-bold">G</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#ccff00] text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all disabled:opacity-50 shadow-lg shadow-[#ccff00]/10 flex items-center justify-center gap-2 italic"
          >
            {loading ? "SYNCHRONIZING..." : "COMMIT INTAKE DATA"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleWorkoutSubmit} className="glass-panel space-y-6">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
             <h3 className="mb-0 text-[#00d4ff]">Metabolic Output</h3>
             <Dumbbell className="text-[#00d4ff] w-4 h-4 opacity-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Activity Definition</label>
              <input
                required
                type="text"
                placeholder="e.g. HIIT, Weightlifting, Running"
                value={workoutData.type}
                onChange={e => setWorkoutData({...workoutData, type: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-[#00d4ff] transition-all font-bold text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Duration Profile</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input
                  required
                  type="number"
                  value={workoutData.duration}
                  onChange={e => setWorkoutData({...workoutData, duration: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#00d4ff] transition-all font-bold text-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#888888] uppercase">min</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Expended Energy</label>
              <div className="relative">
                <Flame className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input
                  required
                  type="number"
                  value={workoutData.caloriesBurned}
                  onChange={e => setWorkoutData({...workoutData, caloriesBurned: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#00d4ff] transition-all font-bold text-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#888888] uppercase">kcal</span>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#00d4ff] text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all disabled:opacity-50 shadow-lg shadow-[#00d4ff]/10 flex items-center justify-center gap-2 italic"
          >
            {loading ? "TRANSMITTING..." : "COMMIT POWER DATA"}
          </button>
        </form>
      )}
    </div>
  );
}
