import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Activity, Sparkles, Target, Zap } from "lucide-react";
import { cn } from "../lib/utils";

export default function Landing() {
  const { user, login, loading } = useAuth();
  
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ccff00]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00d4ff]/5 blur-[120px] rounded-full" />

      <nav className="container mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Activity className="text-[#ccff00] w-6 h-6" />
          <span className="font-extrabold text-xl tracking-tighter uppercase">NutriTrack <span className="text-[#ccff00]">AI</span></span>
        </div>
        <button 
          onClick={login}
          className="bg-[#ccff00] text-black px-6 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-widest hover:bg-white transition-colors shadow-lg shadow-[#ccff00]/10"
        >
          Get Started
        </button>
      </nav>

      <main className="container mx-auto px-6 pt-20 pb-20 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 rounded-sm bg-[#ccff00]/10 text-[#ccff00] text-[10px] font-black tracking-[0.2em] uppercase mb-6 border border-[#ccff00]/20">
              Biometric Intelligence Engine
            </span>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8 italic uppercase">
              Fuel <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-[#00d4ff]">
                Human
              </span> <br />
              Potential.
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl max-w-xl mb-12 leading-relaxed font-medium">
              Precision nutrition meets autonomous wellness. AI-powered recipe generation, biometric tracking, and adaptive coaching.
            </p>

            <div className="flex flex-wrap gap-4 mb-20">
              <button 
                onClick={login}
                className="bg-[#ccff00] text-black px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform flex items-center gap-3 shadow-xl shadow-[#ccff00]/20 uppercase italic"
              >
                Join the Mission
                <Zap className="fill-current w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "GEN RECIPES", desc: "Turn raw data into healthy meals with Gemini AI.", color: "text-[#ccff00]" },
              { icon: Target, title: "TARGET GOALS", desc: "Log activity with clinical-grade precision.", color: "text-[#00d4ff]" },
              { icon: Activity, title: "ADAPTIVE LOG", desc: "Dynamic planning based on real expenditure.", color: "text-white" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="glass-card p-8 group overflow-hidden relative border-white/5"
              >
                <feature.icon className={cn("w-8 h-8 mb-4", feature.color)} />
                <h3 className="text-xs font-black mb-2 uppercase tracking-widest text-[#888888]">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Hero Mockup or Image */}
      <div className="hidden lg:block absolute top-1/2 right-[-5%] translate-y-[-50%] w-[35%] aspect-square glass-card rounded-full overflow-hidden p-0 animate-float opacity-30 pointer-events-none">
        <img 
          src="https://picsum.photos/seed/fitness/1000/1000" 
          alt="Abstract fitness" 
          className="w-full h-full object-cover grayscale opacity-50"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
