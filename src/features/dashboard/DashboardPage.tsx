import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Leaf, ArrowRight, Activity } from "lucide-react";
import { Layout } from "../../components/Layout";
import { getUserProfile, getActivityLogs, getChallengesState } from "../../lib/storage";
import { calculateTotalFootprint, getCategoryBreakdown } from "../../lib/carbonCalculator";
import { calculateEcoScore } from "../../lib/ecoScore";
import { getEcoInsight } from "../../lib/insightEngine";
import { UserProfile, CarbonSummary, EcoInsight } from "../../types";

const COLORS = ['#004532', '#006591', '#39b8fd', '#8bd6b6', '#4a564f'];

function FootprintCard({ title, value }: { title: string, value: number }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-outline-variant col-span-1 md:col-span-2">
      <div className="text-sm font-medium text-on-surface-variant mb-4">{title}</div>
      <div className="text-3xl font-bold text-on-surface">
        {value} <span className="text-base font-normal text-on-surface-variant">kg CO₂e</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, className = "" }: { label: string, value: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-surface-container-lowest rounded-2xl p-4 shadow-soft border border-outline-variant flex items-center gap-4 ${className}`}>
      <div className="text-sm text-on-surface-variant flex-grow">{label}</div>
      <div className="text-lg font-bold text-on-surface capitalize">{value}</div>
    </div>
  );
}

export function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [summary, setSummary] = useState<CarbonSummary | null>(null);
  const [ecoScore, setEcoScore] = useState(100);
  const [insight, setInsight] = useState<EcoInsight | null>(null);
  const [streak, setStreak] = useState(0);
  const [saved, setSaved] = useState(0);

  useEffect(() => {
    const loadedProfile = getUserProfile();
    setProfile(loadedProfile);
    
    const logs = getActivityLogs();
    const dataSummary = calculateTotalFootprint(logs);
    setSummary(dataSummary);
    
    const state = getChallengesState();
    setEcoScore(calculateEcoScore(dataSummary, loadedProfile, logs, state.completed.length));
    
    setInsight(getEcoInsight(dataSummary));
    
    // Calculate streak (consecutive days of logging)
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    const uniqueDates = Array.from(new Set(logs.map(l => new Date(l.date).setHours(0,0,0,0)))).sort((a, b) => b - a);
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const expectedDate = new Date(today.getTime() - i * 86400000).getTime();
      if (uniqueDates[i] === expectedDate) {
        currentStreak++;
      } else if (i === 0 && uniqueDates[0] === today.getTime() - 86400000) {
        // streak continues if last logged was yesterday
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
    
    // Estimate saved -> completed challenges * simple avg
    setSaved(state.completed.length * 3.5);

  }, []);

  if (!summary || !insight) return <Layout><div className="p-8 text-center">Loading...</div></Layout>;

  const pieData = getCategoryBreakdown(summary);
  
  // Weekly compare mock vs current
  const barData = [
    { name: 'Last Week', value: summary.weeklyTotal > 0 ? Math.max(0, summary.weeklyTotal - 5) : 0 },
    { name: 'This Week', value: summary.weeklyTotal },
  ];

  // Daily trend
  const sortedDays = Object.keys(summary.dailyHistory).sort();
  const lineData = sortedDays.slice(-7).map(d => ({ name: d.slice(5), value: summary.dailyHistory[d] }));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-on-surface mb-2">Hello, {profile?.name || "EcoWarrior"}</h1>
          <p className="text-on-surface-variant">Here is your carbon footprint snapshot.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Summary Cards */}
          <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-6 gap-6">
            <FootprintCard title="Today's Footprint" value={summary.dailyHistory[new Date().toISOString().split('T')[0]] || 0} />
            <FootprintCard title="Weekly Footprint" value={summary.weeklyTotal} />

            <div className="bg-primary rounded-2xl p-6 shadow-soft col-span-2 md:col-span-2 text-on-primary">
              <div className="text-sm font-medium mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5" /> EcoScore
              </div>
              <div className="text-4xl font-bold flex items-end gap-2">
                {ecoScore}<span className="text-lg opacity-80">/100</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Top Category" value={insight.topCategory || "None"} />
            <StatCard label="CO₂ Saved" value={`${saved} kg`} />
            <StatCard label="Current Streak" value={`${streak} days`} />
          </div>

          {!pieData.length ? (
            <div className="md:col-span-12 bg-surface-container-lowest rounded-2xl p-12 text-center border border-outline-variant shadow-soft">
              <Activity className="w-12 h-12 text-on-surface-variant mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-on-surface mb-2">No data yet</h3>
              <p className="text-on-surface-variant mb-6">Start logging daily activities to understand your carbon impact.</p>
              <Link to="/add" className="px-6 py-2 bg-primary text-on-primary rounded-lg">Add Activity</Link>
            </div>
          ) : (
            <>
              {/* Charts */}
              <div className="md:col-span-8 grid grid-cols-1 gap-6">
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-outline-variant">
                  <h3 className="text-lg font-semibold mb-4">Daily Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="value" stroke="#004532" strokeWidth={3} dot={{r: 4}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-outline-variant">
                    <h3 className="text-lg font-semibold mb-4">Breakdown</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border border-outline-variant">
                    <h3 className="text-lg font-semibold mb-4">Weekly Compare</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                          <RechartsTooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="value" fill="#39b8fd" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* EcoCoach Preview */}
              <div className="md:col-span-4 flex flex-col gap-6">
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft border-l-4 border-l-secondary-container relative overflow-hidden flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf className="w-5 h-5 text-secondary" />
                    <h3 className="text-lg font-semibold">Impact Summary & Action</h3>
                  </div>
                  <div className="flex-grow">
                    <p className="text-on-surface-variant mb-6 text-sm">
                      <strong className="text-on-surface block mb-1">Your biggest carbon source:</strong> 
                      {insight.whyItMatters}
                    </p>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant mb-6">
                      <p className="text-sm font-semibold text-primary mb-1">Next Best Action:</p>
                      <p className="text-sm text-on-surface mb-2">{insight.nextBestAction}</p>
                      <p className="text-xs text-on-surface-variant">
                        <strong>Why this action?</strong> Because {insight.topCategory} is your highest-impact category this week.
                      </p>
                    </div>
                  </div>
                  <Link to="/coach" className="w-full py-3 px-4 bg-transparent border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-on-primary transition-colors flex justify-center items-center gap-2">
                    View Full EcoCoach <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
