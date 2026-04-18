import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { User, Scale, Ruler, Goal, Calendar } from "lucide-react";

export default function Profile() {
  const { profile, updateProfile, user } = useAuth();
  const [formData, setFormData] = useState({
    age: 25,
    gender: "male",
    weight: 70,
    height: 175,
    fitnessGoal: "maintain",
    targetCalories: 2000,
    dailyWaterTarget: 2000
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2 text-white">
          BIOMETRIC <span className="text-[#ccff00]">DATA CORE</span>
        </h1>
        <p className="text-[#888888] text-[10px] font-bold uppercase tracking-widest">Configure human physical metrics for target optimization</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Stats Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel flex flex-col items-center text-center py-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ccff00] to-[#00d4ff] p-1 mb-4">
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full bg-black object-cover"
                alt="Profile"
              />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight italic">{user?.displayName}</h2>
            <p className="text-[#888888] text-[10px] uppercase font-bold tracking-widest mb-6">{user?.email}</p>
            
            <div className="grid grid-cols-2 gap-4 w-full px-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] font-black text-[#888888] mb-1 uppercase tracking-widest">BMI INDEX</p>
                <p className="text-2xl font-black tabular-nums">
                  {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] font-black text-[#888888] mb-1 uppercase tracking-widest">STATUS</p>
                <p className="text-[10px] font-black text-[#ccff00] uppercase tracking-wider underline underline-offset-4">{formData.fitnessGoal}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-panel space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-[#00d4ff]" /> Age
                </label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:border-[#00d4ff] outline-none transition-all font-bold text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest flex items-center gap-2">
                   Gender
                </label>
                <select 
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:border-[#00d4ff] outline-none transition-all appearance-none font-bold text-sm"
                >
                  <option value="male" className="bg-zinc-950">Male</option>
                  <option value="female" className="bg-zinc-950">Female</option>
                  <option value="other" className="bg-zinc-950">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest flex items-center gap-2">
                  <Scale className="w-3 h-3 text-[#00d4ff]" /> Weight (kg)
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:border-[#00d4ff] outline-none transition-all font-bold text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest flex items-center gap-2">
                  <Ruler className="w-3 h-3 text-[#00d4ff]" /> Height (cm)
                </label>
                <input 
                  type="number" 
                  value={formData.height}
                  onChange={e => setFormData({...formData, height: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:border-[#00d4ff] outline-none transition-all font-bold text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest flex items-center gap-2">
                  <Goal className="w-3 h-3 text-[#00d4ff]" /> Fitness Objective
                </label>
                <select 
                  value={formData.fitnessGoal}
                  onChange={e => setFormData({...formData, fitnessGoal: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:border-[#00d4ff] outline-none transition-all appearance-none font-bold text-sm"
                >
                  <option value="lose weight" className="bg-zinc-950">Lose Weight</option>
                  <option value="maintain" className="bg-zinc-950">Maintain Weight</option>
                  <option value="gain muscle" className="bg-zinc-950">Gain Muscle</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest flex items-center gap-2">
                   Daily Calorie Target
                </label>
                <input 
                  type="number" 
                  value={formData.targetCalories}
                  onChange={e => setFormData({...formData, targetCalories: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:border-[#00d4ff] outline-none transition-all font-bold text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#ccff00] text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all shadow-lg shadow-[#ccff00]/10 active:scale-95 italic"
            >
              Update System Metrics
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
