import { useState, useEffect, useMemo } from "react";
import { Layout } from "../../components/Layout";
import { getChallengesState, updateChallengeStatus, getActivityLogs } from "../../lib/storage";
import { calculateTotalFootprint } from "../../lib/carbonCalculator";
import { getEcoInsight } from "../../lib/insightEngine";
import { getPersonalizedChallenges } from "../../lib/challengeEngine";
import { Category } from "../../types";
import { CheckCircle, Clock, Star } from "lucide-react";

export function ChallengesPage() {
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [topCategory, setTopCategory] = useState<Category | null>(null);

  useEffect(() => {
    const challengeState = getChallengesState();
    setActiveIds(challengeState.active);
    setCompletedIds(challengeState.completed);
    
    // Determine top category to prioritize personalized challenges
    const logs = getActivityLogs();
    const summary = calculateTotalFootprint(logs);
    const insight = getEcoInsight(summary);
    if (insight.topCategory) {
      setTopCategory(insight.topCategory);
    }
  }, []);

  const sortedChallenges = useMemo(() => {
    return getPersonalizedChallenges(topCategory);
  }, [topCategory]);

  const handleStart = (id: string) => {
    updateChallengeStatus(id, "active");
    const challengeState = getChallengesState();
    setActiveIds(challengeState.active);
  };

  const handleComplete = (id: string) => {
    updateChallengeStatus(id, "completed");
    const challengeState = getChallengesState();
    setActiveIds(challengeState.active);
    setCompletedIds(challengeState.completed);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-12 text-center md:text-left max-w-3xl">
          <h1 className="text-4xl font-bold text-primary mb-4 tracking-tight">Weekly Eco Challenges</h1>
          <p className="text-lg text-on-surface-variant">Turn everyday actions into measurable environmental impact. Select challenges tailored to your lifestyle and track your CO2 savings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedChallenges.map((challenge) => {
            const isActive = activeIds.includes(challenge.id);
            const isCompleted = completedIds.includes(challenge.id);
            const isRecommended = challenge.category === topCategory;

            return (
              <div key={challenge.id} className={`glass-card rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group ${isActive ? "border-primary shadow-[0_0_0_2px_rgba(0,69,50,0.1)]" : ""} ${isCompleted ? "opacity-70" : ""}`}>
                {isCompleted && (
                  <div className="absolute top-0 right-0 p-3">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                )}
                {isRecommended && !isCompleted && !isActive && (
                  <div className="absolute top-0 right-0 p-3 flex items-center gap-1 text-xs font-bold text-secondary-container">
                    <Star className="w-4 h-4 fill-secondary-container" /> Recommended
                  </div>
                )}
                <div className={`absolute top-0 left-0 w-full h-1 ${challenge.category === 'travel' ? 'bg-secondary-container' : challenge.category === 'electricity' ? 'bg-primary-fixed' : 'bg-tertiary-container'}`}></div>
                
                <div className="flex justify-between items-start mb-4 mt-2">
                  <div className="bg-surface-variant text-on-surface-variant text-xs font-medium px-3 py-1 rounded-full capitalize">
                    {challenge.category}
                  </div>
                  <div className={`text-xs font-medium px-3 py-1 rounded-full border border-outline-variant flex items-center gap-1 ${challenge.difficulty==='Easy' ? 'bg-surface-container-low text-primary' : challenge.difficulty==='Medium' ? 'bg-surface-container-high text-on-surface-variant' : 'bg-surface-container-highest text-error'}`}>
                    <span className={`w-2 h-2 rounded-full ${challenge.difficulty==='Easy' ? 'bg-primary' : challenge.difficulty==='Medium' ? 'bg-secondary' : 'bg-error'}`}></span> 
                    {challenge.difficulty}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-on-surface mb-2">{challenge.title}</h3>
                <p className="text-sm text-on-surface-variant flex-grow mb-6">{challenge.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant">
                  <div className="flex flex-col">
                    <span className="text-xs text-outline font-medium">Est. Saving</span>
                    <span className="text-xl font-bold text-primary flex items-baseline gap-1">
                      {challenge.estimatedSaving} <span className="text-xs font-normal text-on-surface-variant">kg CO₂e</span>
                    </span>
                  </div>

                  {!isActive && !isCompleted && (
                    <button onClick={() => handleStart(challenge.id)} className="bg-primary text-on-primary text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary-container shadow-sm transition-colors">Start Challenge</button>
                  )}
                  {isActive && !isCompleted && (
                    <button onClick={() => handleComplete(challenge.id)} className="bg-surface-container-high text-primary border border-primary text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-surface-container flex gap-2 items-center transition-colors">
                      <Clock className="w-4 h-4" /> Finish
                    </button>
                  )}
                  {isCompleted && (
                    <span className="text-sm font-semibold text-primary">Completed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
