import { useState, useEffect } from "react";
import { Leaf, Activity, ArrowRight, Calendar } from "lucide-react";
import { Layout } from "../../components/Layout";
import { getActivityLogs } from "../../lib/storage";
import { calculateTotalFootprint } from "../../lib/carbonCalculator";
import { getEcoInsight } from "../../lib/insightEngine";
import { EcoInsight } from "../../types";

export function EcoCoachPage() {
  const [insight, setInsight] = useState<EcoInsight | null>(null);

  useEffect(() => {
    const logs = getActivityLogs();
    const summary = calculateTotalFootprint(logs);
    setInsight(getEcoInsight(summary));
  }, []);

  if (!insight) return <Layout><div className="p-8">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Advisor Chat & Core Insights */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-on-surface">Your Weekly Eco-Brief</h1>
              <p className="text-on-surface-variant">Here are your personalized insights for reducing your footprint this week.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-secondary-fixed shadow-popover relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-secondary" />
                  <span className="font-medium text-secondary">Top Category Focus</span>
                </div>
                <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full text-xs font-semibold capitalize">{insight.topCategory || "Start"}</span>
              </div>
              <h2 className="text-xl font-semibold text-on-surface mb-2">{insight.mainInsight}</h2>
              <p className="text-on-surface-variant text-sm">{insight.whyItMatters}</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-soft">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-error" />
                  <span className="font-medium text-on-surface-variant">Impact Analysis</span>
                </div>
              </div>
              <p className="text-on-surface-variant text-sm">{insight.whyItMatters}</p>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 border border-primary-fixed shadow-popover mt-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">Next Best Action</span>
                </div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">{insight.nextBestAction}</h3>
                <p className="text-on-surface-variant text-sm">{insight.estimatedImpact}</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col items-center justify-center min-w-[150px]">
                <span className="text-xs uppercase font-medium text-on-surface-variant tracking-wider mb-1">Weekly Goal</span>
                <span className="text-2xl font-bold text-primary">Action</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 7-Day Plan */}
        <div className="col-span-1 lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-soft sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-on-surface">Personalized 7-Day Plan</h3>
              <Calendar className="w-5 h-5 text-on-surface-variant" />
            </div>
            
            {insight.sevenDayPlan.length > 0 ? (
              <div className="space-y-4">
                {insight.sevenDayPlan.map((plan, idx) => (
                  <div key={idx} className={`flex gap-4 items-start relative ${idx !== insight.sevenDayPlan.length - 1 ? "pb-4 border-b border-surface-container-highest" : ""}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${idx === 0 ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                        D{plan.day}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface mt-1">{plan.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-on-surface-variant">{insight.starterGuidance}</div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}
