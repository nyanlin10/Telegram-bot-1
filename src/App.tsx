import { useState, useEffect } from "react";
import { Bot, Search, MessageSquare, ShieldCheck, AlertCircle, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const [status, setStatus] = useState<{ status: string; botInitialized: boolean; geminiInitialized: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error("Failed to fetch status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 rounded-2xl mb-6 border border-orange-500/20">
            <Bot className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Burmese Info Bot
          </h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
            Telegram ကနေ မြန်မာလို အချက်အလက်တွေ ရှာဖွေပေးမဲ့ အစွမ်းထက် Bot တစ်ခု။
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Bot Status
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-white/60">Telegram Bot</span>
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : status?.botInitialized ? (
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">Active</span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">Missing Token</span>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-white/60">Gemini AI</span>
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : status?.geminiInitialized ? (
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">Active</span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">Missing Key</span>
                )}
              </div>
            </div>

            {!status?.botInitialized && (
              <div className="mt-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                <p className="text-sm text-orange-200/80 leading-relaxed">
                  Settings ထဲမှာ <code className="bg-black/40 px-1 rounded">TELEGRAM_BOT_TOKEN</code> ကို ထည့်သွင်းပေးဖို့ လိုအပ်ပါတယ်။
                </p>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              Features
            </h2>
            <ul className="space-y-4">
              {[
                "မြန်မာလို မေးမြန်းနိုင်ခြင်း",
                "မှန်ကန်သော အချက်အလက်များ ရှာဖွေခြင်း",
                "YouTube, TikTok, Facebook လင့်ခ်များ ရှာဖွေခြင်း",
                "ရှာမတွေ့ပါက ပွင့်လင်းစွာ အကြောင်းပြန်ခြင်း"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 to-blue-500/10 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6">စတင်အသုံးပြုနည်း</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-none w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">1</div>
              <div>
                <p className="font-semibold mb-1">Bot Token ရယူပါ</p>
                <p className="text-white/50 text-sm">Telegram မှာ @BotFather ကို သွားပြီး bot အသစ်တစ်ခု ဖန်တီးပါ။</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-none w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">2</div>
              <div>
                <p className="font-semibold mb-1">Token ထည့်သွင်းပါ</p>
                <p className="text-white/50 text-sm">ရရှိလာတဲ့ Token ကို Settings {">"} Secrets မှာ <code className="bg-black/40 px-1 rounded">TELEGRAM_BOT_TOKEN</code> အမည်နဲ့ သိမ်းဆည်းပါ။</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-none w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">3</div>
              <div>
                <p className="font-semibold mb-1">စတင်အသုံးပြုပါ</p>
                <p className="text-white/50 text-sm">Telegram မှာ သင့် Bot ကို ရှာပြီး စာပို့လိုက်ရုံပါပဲ။</p>
              </div>
            </div>
          </div>
        </motion.div>

        <footer className="mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-sm">
          Built with Gemini AI & Telegram Bot API
        </footer>
      </main>
    </div>
  );
}
