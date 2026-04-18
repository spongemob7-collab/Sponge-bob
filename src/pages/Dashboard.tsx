import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, onSnapshot, doc, setDoc } from "firebase/firestore";
import { getHealthTip } from "../services/gemini";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { 
  Plus, Droplets, Zap, Flame, Target, TrendingUp, Sparkles, PlusCircle, MinusCircle, Utensils, List 
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { toast } from "react-hot-toast";

interface DailyStats {
  caloriesIn: number;
  caloriesOut: number;
  water: number;
  steps: number;
  macros: { protein: number; carbs: number; fats: number };
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DailyStats>({
    caloriesIn: 0,
    caloriesOut: 0,
    water: 0,
    steps: 0,
    macros: { protein: 0, carbs: 0, fats: 0 }
  });
  const [tip, setTip] = useState("Loading your health tip...");
  const [waterLoading, setWaterLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    // Listen to meals
    const mealsQuery = query(collection(db, "users", user.uid, "meals"), where("date", "==", today));
    const unsubscribeMeals = onSnapshot(mealsQuery, (snapshot) => {
      let calTemp = 0;
      let pLine = 0, cLine = 0, fLine = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        calTemp += data.calories || 0;
        pLine += data.protein || 0;
        cLine += data.carbs || 0;
        fLine += data.fats || 0;
      });
      setStats(prev => ({ ...prev, caloriesIn: calTemp, macros: { protein: pLine, carbs: cLine, fats: fLine } }));
    });

    // Listen to workouts
    const workoutsQuery = query(collection(db, "users", user.uid, "workouts"), where("date", "==", today));
    const unsubscribeWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
      let calOut = 0;
      snapshot.forEach(doc => calOut += doc.data().caloriesBurned || 0);
      setStats(prev => ({ ...prev, caloriesOut: calOut }));
    });

    // Listen to daily stats (water and steps)
    const statsDocRef = doc(db, "users", user.uid, "dailyStats", today);
    const unsubscribeStats = onSnapshot(statsDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setStats(prev => ({ ...prev, water: data.waterIntake || 0, steps: data.steps || 0 }));
      } else {
        setStats(prev => ({ ...prev, water: 0, steps: 0 }));
      }
    });

    // Fetch AI Tip
    getHealthTip(profile?.fitnessGoal || "healthy lifestyle").then(setTip);

    return () => {
      unsubscribeMeals();
      unsubscribeWorkouts();
      unsubscribeStats();
    };
  }, [user, profile]);

  const updateWater = async (amount: number) => {
    if (!user) return;
    setWaterLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const newWater = Math.max(0, stats.water + amount);
    try {
      await setDoc(doc(db, "users", user.uid, "dailyStats", today), {
        waterIntake: newWater,
        date: today
      }, { merge: true });
    } catch (err) {
      toast.error("Failed to update water intake");
    } finally {
      setWaterLoading(false);
    }
  };

  const macroData = [
    { name: 'Protein', value: stats.macros.protein, color: '#3b82f6' },
    { name: 'Carbs', value: stats.macros.carbs, color: '#f59e0b' },
    { name: 'Fats', value: stats.macros.fats, color: '#f87171' },
  ].filter(d => d.value > 0);

  const calData = [
    { name: 'In', value: stats.caloriesIn },
    { name: 'Target', value: profile?.targetCalories || 2000 },
    { name: 'Burned', value: stats.caloriesOut }
  ];

  const waterProgress = (stats.water / (profile?.dailyWaterTarget || 2000)) * 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
            NUTRITRACK <br />
            <span className="text-[#ccff00]">AI SYSTEM</span>
          </h1>
          <p className="text-[#888888] text-[10px] font-bold uppercase tracking-widest">Real-time Biometric Analysis</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-2xl border border-white/5 max-w-sm">
          <Sparkles className="text-[#ccff00] w-4 h-4 shrink-0" />
          <p className="text-[10px] uppercase font-bold text-[#888888] leading-relaxed tracking-wider">{tip}</p>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Consumed", value: stats.caloriesIn, unit: "kcal", icon: Utensils, color: "text-white", bg: "bg-white/5", target: profile?.targetCalories || 2000 },
          { label: "Expended", value: stats.caloriesOut, unit: "kcal", icon: Flame, color: "text-[#00d4ff]", bg: "bg-[#00d4ff]/5", target: 500 },
          { label: "Net Balance", value: stats.caloriesIn - stats.caloriesOut, unit: "kcal", icon: Zap, color: "text-[#ccff00]", bg: "bg-[#ccff00]/5", target: 1500 },
          { label: "Steps", value: stats.steps, unit: "steps", icon: Target, color: "text-white", bg: "bg-white/5", target: 10000 },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn("glass-panel stat-card", item.bg)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="mb-0">{item.label}</h3>
              <item.icon className={cn("w-4 h-4", item.color)} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black tabular-nums">{item.value.toLocaleString()}</span>
              <span className="text-[10px] text-[#888888] font-black uppercase">{item.unit}</span>
            </div>
            <div className="progress-bar mt-4">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${Math.min(100, (item.value / item.target) * 100)}%`,
                  backgroundColor: item.color.includes('[') ? item.color.match(/#\w+/)?.[0] : undefined
                }} 
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Analysis */}
        <div className="lg:col-span-2 glass-panel space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="mb-0 font-black tracking-widest">Efficiency Output</h3>
            <div className="text-[10px] font-bold text-[#888888] uppercase tracking-widest italic">Weekly Cycle</div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calData}>
                <XAxis dataKey="name" stroke="#333" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {calData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? '#222' : index === 0 ? '#ccff00' : '#00d4ff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Macro Distribution */}
        <div className="glass-panel flex flex-col items-center justify-center space-y-6">
          <h3 className="self-start mb-0">MACROS</h3>
          {macroData.length > 0 ? (
            <div className="relative w-full aspect-square max-w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    innerRadius={65}
                    outerRadius={80}
                    paddingAngle={10}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{stats.macros.protein + stats.macros.carbs + stats.macros.fats}g</span>
                <span className="text-[8px] text-[#888888] uppercase font-black tracking-[0.2em]">Aggregate</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 opacity-10">
              <Utensils className="w-12 h-12 mx-auto mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4">Null Matrix</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-2 w-full">
            {macroData.map(m => (
              <div key={m.name} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-[10px] font-black text-[#888888] uppercase tracking-tighter">{m.name}</span>
                </div>
                <span className="text-xs font-black tabular-nums">{m.value}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Water Tracker - Specialized UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 glass-panel overflow-hidden relative">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="mb-0">Hydration</h3>
                <span className="text-[10px] font-black text-[#00d4ff] uppercase italic tracking-widest">{(waterProgress > 100 ? 100 : waterProgress).toFixed(0)}% OPTIMAL</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tabular-nums">{stats.water / 1000}</span>
                <span className="text-[10px] text-[#888888] font-black uppercase tracking-widest ml-1">Liters / {(profile?.dailyWaterTarget || 2000) / 1000}L</span>
              </div>

              <div className="water-tracker mt-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "water-drop",
                      (i + 1) * ((profile?.dailyWaterTarget || 2000) / 8) <= stats.water && "filled"
                    )} 
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-8">
              <button 
                onClick={() => updateWater(-250)}
                className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-all disabled:opacity-50"
                disabled={waterLoading}
              >
                <MinusCircle className="w-4 h-4 text-[#888888]" />
              </button>
              <button 
                onClick={() => updateWater(250)}
                className="flex-1 bg-[#00d4ff] text-black py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-white disabled:opacity-50"
                disabled={waterLoading}
              >
                Refill 250ml
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 glass-panel space-y-6 flex flex-col">
          <h3 className="mb-0 tracking-widest">Biometric Log Entry</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/5 rounded-2xl p-8">
             <List className="w-8 h-8 mb-3" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Historical Analysis Pending</p>
          </div>
        </div>
      </div>

    </div>
  );
}
