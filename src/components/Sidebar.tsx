import { NavLink } from "react-router-dom";
import { LayoutDashboard, Utensils, Activity, User, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/log", label: "Track", icon: Activity },
  { path: "/recipes", label: "AI Recipes", icon: Sparkles },
  { path: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-white/5 h-screen sticky top-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ccff00] to-[#00d4ff] rounded-xl flex items-center justify-center shadow-lg shadow-[#ccff00]/10">
              <Activity className="text-black w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tighter text-white">
              NUTRITRACK <span className="text-[#ccff00]">AI</span>
            </h1>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-[#ccff00]/5 text-[#ccff00] border border-[#ccff00]/10 shadow-[0_0_15px_rgba(204,255,0,0.05)]" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold text-xs uppercase tracking-wider">{item.label}</span>
                {item.label === "AI Recipes" && (
                  <span className="ml-auto text-[8px] bg-[#ccff00] text-black px-1.5 py-0.5 rounded-sm font-black uppercase">GEN</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-2 mb-2 bg-white/5 rounded-full border border-white/5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ccff00] to-[#00d4ff] p-[1px]">
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full bg-black object-cover"
                alt="Avatar"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold truncate text-white uppercase tracking-tight">{user?.displayName?.split(' ')[0]}.</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-zinc-500 hover:text-white transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass border-t border-white/10 z-50 flex items-center justify-around px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 transition-all duration-200",
              isActive ? "text-[#ccff00]" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label === "AI Recipes" ? "AI" : item.label}</span>
          </NavLink>
        ))}
        <button 
          onClick={logout}
          className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Exit</span>
        </button>
      </nav>
    </>
  );
}
