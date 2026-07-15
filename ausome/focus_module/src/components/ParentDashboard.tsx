import React, { useState } from "react";
import { 
  BarChart2, ShieldAlert, Award, Calendar, Timer, 
  Layers, Lightbulb, RefreshCw, Printer, ArrowLeft, Heart, CheckCircle2 
} from "lucide-react";
import { Profile, SensoryLog, ProgressLog, Certificate } from "../types";

interface ParentDashboardProps {
  profile: Profile;
  sensoryLogs: SensoryLog[];
  activityLogs: ProgressLog[];
  onClearLogs?: () => void;
  onClose: () => void;
}

export default function ParentDashboard({
  profile,
  sensoryLogs,
  activityLogs,
  onClearLogs,
  onClose
}: ParentDashboardProps) {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Calculate summary metrics
  const totalLevelsCompleted = activityLogs.filter(a => a.completed).length;
  const totalPoints = profile.points;
  const totalPlayTimeSeconds = activityLogs.reduce((acc, log) => acc + log.sessionTime, 0);
  const totalPlayTimeMinutes = Math.round(totalPlayTimeSeconds / 60);
  const totalSensoryTriggers = sensoryLogs.length;

  // Find favorite theme from activities (or default to current theme)
  const favoriteTheme = profile.unlockedThemes[profile.unlockedThemes.length - 1] || "Shapes";

  // Generate automated therapist-friendly recommendations
  const getTherapistRecommendations = () => {
    const recommendations = [];
    if (totalSensoryTriggers > 3) {
      recommendations.push({
        type: "calm",
        title: "Pacing Encouragement",
        desc: "The child triggered sensory pacing filters several times. Encourage them to take brief stretches or deep breath exercises between levels."
      });
    } else {
      recommendations.push({
        type: "praise",
        title: "Superb Focus Window",
        desc: "The child exhibits highly calm, steady focus times! You can unlock more intricate patterns to continue pattern-matching development."
      });
    }

    if (totalLevelsCompleted > 10) {
      recommendations.push({
        type: "growth",
        title: "Stage Progress",
        desc: "Visual scanning is progressing well. Consider matching physical items around the house (e.g., placing colorful blocks) to reinforce learning."
      });
    } else {
      recommendations.push({
        type: "start",
        title: "Foundation Building",
        desc: "Keep game play under 10 minutes per session to prevent mental fatigue. Simple card sizes (Level 1-10) are excellent for visual exploration."
      });
    }

    return recommendations;
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-warm-cream p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-muted-lavender pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-muted-lavender text-warm-cream rounded-2xl">
              <BarChart2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-muted-lavender">Au-Some Parent Dashboard</h1>
              <p className="text-sm text-muted-lavender/80">Monitor visual progress, sensory trends, and certificates securely.</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-6 py-3 bg-soft-blue hover:bg-soft-blue/90 text-muted-lavender font-bold rounded-2xl border-4 border-muted-lavender shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Return to Map</span>
          </button>
        </div>

        {/* Big Grid Analytics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-warm-cream p-5 rounded-3xl border-4 border-muted-lavender flex items-center space-x-4 shadow-sm">
            <div className="p-3 bg-soft-blue/20 rounded-2xl text-muted-lavender border-2 border-soft-blue">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold text-muted-lavender/70 uppercase">Completed</span>
              <span className="text-2xl font-black text-muted-lavender">{totalLevelsCompleted} Levels</span>
            </div>
          </div>

          <div className="bg-warm-cream p-5 rounded-3xl border-4 border-muted-lavender flex items-center space-x-4 shadow-sm">
            <div className="p-3 bg-soft-green/20 rounded-2xl text-muted-lavender border-2 border-soft-green">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold text-muted-lavender/70 uppercase">Total Time</span>
              <span className="text-2xl font-black text-muted-lavender">{totalPlayTimeMinutes} Mins</span>
            </div>
          </div>

          <div className="bg-warm-cream p-5 rounded-3xl border-4 border-muted-lavender flex items-center space-x-4 shadow-sm">
            <div className="p-3 bg-soft-blue/20 rounded-2xl text-muted-lavender border-2 border-soft-blue">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold text-muted-lavender/70 uppercase">Score Earned</span>
              <span className="text-2xl font-black text-muted-lavender">{totalPoints} Pts</span>
            </div>
          </div>

          <div className="bg-warm-cream p-5 rounded-3xl border-4 border-muted-lavender flex items-center space-x-4 shadow-sm">
            <div className={`p-3 rounded-2xl border-2 ${
              totalSensoryTriggers > 0 ? "bg-soft-green/20 border-soft-green" : "bg-soft-blue/10 border-soft-blue"
            }`}>
              <ShieldAlert className="w-6 h-6 text-muted-lavender" />
            </div>
            <div>
              <span className="block text-xs font-bold text-muted-lavender/70 uppercase">Accommodations</span>
              <span className="text-2xl font-black text-muted-lavender">{totalSensoryTriggers} Silently Applied</span>
            </div>
          </div>

        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Progress Activity Chart (Lg block) */}
          <div className="lg:col-span-2 bg-warm-cream rounded-3xl border-4 border-muted-lavender p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-muted-lavender mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-lavender" />
                <span>Play Time Patterns</span>
              </h3>
              <p className="text-xs text-muted-lavender/70 mb-4">Focus time duration trends per level played.</p>
            </div>

            {/* Custom SVG Line-Bar Chart */}
            <div className="h-48 w-full flex items-end justify-between border-b-2 border-muted-lavender/20 pb-2 space-x-2">
              {activityLogs.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-sm text-muted-lavender/50 italic">
                  Complete matches to populate focus charts.
                </div>
              ) : (
                activityLogs.slice(-10).map((log, index) => {
                  const maxTime = Math.max(...activityLogs.map(l => l.sessionTime), 60);
                  const barHeight = Math.max(10, Math.round((log.sessionTime / maxTime) * 100));
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center">
                      <span className="text-[10px] font-bold mb-1 text-muted-lavender">{log.sessionTime}s</span>
                      <div 
                        className="w-full rounded-t-lg bg-soft-blue border border-muted-lavender transition-all duration-300 hover:bg-soft-green"
                        style={{ height: `${barHeight}px` }}
                      />
                      <span className="text-[10px] font-black mt-2 text-muted-lavender/80">Lvl {log.level}</span>
                    </div>
                  );
                })
              )}
            </div>
            <p className="text-[11px] text-muted-lavender/60 text-right mt-2 italic">Showing up to last 10 completed sessions.</p>
          </div>

          {/* Therapist Insights (Sm block) */}
          <div className="bg-warm-cream rounded-3xl border-4 border-muted-lavender p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-muted-lavender flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-muted-lavender" />
              <span>Pedagogical Insights</span>
            </h3>
            
            <div className="space-y-3">
              {getTherapistRecommendations().map((rec, i) => (
                <div key={i} className="p-3 rounded-xl border border-muted-lavender/30 bg-soft-blue/10">
                  <h4 className="text-sm font-bold text-muted-lavender flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-soft-green fill-soft-green" />
                    <span>{rec.title}</span>
                  </h4>
                  <p className="text-xs text-muted-lavender/80 mt-1 leading-relaxed">{rec.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Secondary Info: Sensory logs & Certificates list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Sensory overload logs - Silent Monitor */}
          <div className="bg-warm-cream rounded-3xl border-4 border-muted-lavender p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-muted-lavender mb-2 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-muted-lavender" />
                <span>Sensory Overload Log (Silent)</span>
              </h3>
              <p className="text-xs text-muted-lavender/70 mb-4">
                We monitor rapid consecutive mismatches. When overload triggers, the game automatically slows flips, dampens audio, and increases margins to support the child.
              </p>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto">
              {sensoryLogs.length === 0 ? (
                <div className="p-4 border border-dashed border-muted-lavender/30 rounded-2xl text-center text-sm text-muted-lavender/60 italic">
                  No rapid overload patterns detected. Child is pacing comfortably!
                </div>
              ) : (
                sensoryLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl border border-muted-lavender bg-soft-green/10 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-extrabold block">Conscious Pacing Triggered (Level {log.level})</span>
                      <span className="opacity-80 block mt-0.5">{log.triggerReason} • {log.errorCount} total mismatches</span>
                    </div>
                    <span className="font-bold text-muted-lavender bg-warm-cream px-2.5 py-1 rounded-lg border border-muted-lavender">
                      {log.date} @ {log.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stage Certificates System */}
          <div className="bg-warm-cream rounded-3xl border-4 border-muted-lavender p-6 shadow-sm">
            <h3 className="text-xl font-bold text-muted-lavender mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-muted-lavender" />
              <span>Learning Stage Certificates</span>
            </h3>
            <p className="text-xs text-muted-lavender/70 mb-4">
              Generated automatically every 10 levels. Perfect for building children's cognitive pride!
            </p>

            <div className="space-y-3 max-h-56 overflow-y-auto">
              {profile.certificates.length === 0 ? (
                <div className="p-4 border border-dashed border-muted-lavender/30 rounded-2xl text-center text-sm text-muted-lavender/60 italic">
                  Certificates unlock upon completing level 10, 20, 30, 40, and 50.
                </div>
              ) : (
                profile.certificates.map((cert) => (
                  <div 
                    key={cert.id} 
                    className="p-3 rounded-xl border-2 border-muted-lavender bg-soft-blue/20 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-sm block text-muted-lavender">{cert.stageName} Complete</span>
                      <span className="text-xs text-muted-lavender/70 block">{cert.theme} Theme Mastery • Level {cert.level}</span>
                    </div>
                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="px-4 py-2 bg-warm-cream hover:bg-soft-green text-muted-lavender text-xs font-bold rounded-lg border border-muted-lavender shadow-sm transition-all cursor-pointer"
                    >
                      View Cert
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Printable Certificate Lightbox */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-muted-lavender/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-warm-cream border-8 border-double border-muted-lavender p-8 md:p-12 text-center rounded-2xl shadow-2xl relative print:border-none print:shadow-none print:m-0">
            
            {/* Elegant Certificate Border Accent */}
            <div className="absolute inset-4 border-2 border-muted-lavender/20 pointer-events-none rounded" />

            <div className="space-y-6">
              
              {/* Badge/Seal */}
              <div className="flex justify-center">
                <div className="p-4 bg-soft-blue/20 rounded-full border-4 border-muted-lavender relative">
                  <Award className="w-16 h-16 text-muted-lavender animate-pulse" />
                  <div className="absolute -bottom-1 -right-1 bg-soft-green rounded-full p-1 border-2 border-muted-lavender">
                    <CheckCircle2 className="w-5 h-5 text-muted-lavender" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-muted-lavender/60">Certificate of Focus Stage Completion</span>
                <h2 className="text-4xl font-black text-muted-lavender">Matching Quest Hero</h2>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-lavender max-w-2xl mx-auto leading-relaxed">
                This certifies that the amazing explorer, <strong className="text-2xl underline text-soft-blue block my-2">{selectedCertificate.childName}</strong>
                has successfully matched their way through <strong className="text-muted-lavender font-extrabold">{selectedCertificate.stageName}</strong> up to <strong className="text-muted-lavender font-extrabold">Level {selectedCertificate.level}</strong>, displaying superb concentration, attentiveness, and visual pattern recognition!
              </p>

              {/* Details footer inside Certificate */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-muted-lavender/10 max-w-lg mx-auto text-sm">
                <div>
                  <span className="text-xs text-muted-lavender/60 block uppercase font-bold">Theme Mastered</span>
                  <span className="font-extrabold text-muted-lavender">{selectedCertificate.theme}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-lavender/60 block uppercase font-bold">Achievement Date</span>
                  <span className="font-extrabold text-muted-lavender">{selectedCertificate.date}</span>
                </div>
              </div>

              {/* Action Buttons for Certificate (Hidden on print) */}
              <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
                <button
                  onClick={handlePrintCertificate}
                  className="px-6 py-3 bg-soft-green hover:bg-soft-green/90 text-muted-lavender font-bold rounded-xl border-2 border-muted-lavender flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Printer className="w-5 h-5" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="px-6 py-3 bg-soft-blue hover:bg-soft-blue/90 text-muted-lavender font-bold rounded-xl border-2 border-muted-lavender cursor-pointer transition-all active:scale-95"
                >
                  Close Document
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
