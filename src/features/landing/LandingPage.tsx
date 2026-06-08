import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, Footprints, MonitorPlay, Leaf } from "lucide-react";
import { Layout } from "../../components/Layout";

export function LandingPage() {
  return (
    <Layout>
      <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center relative">
        <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-6 max-w-4xl tracking-tight leading-tight">
          Your AI Carbon Coach for smarter daily choices.
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mb-10">
          CarbonWise helps you track daily lifestyle activities, understand your carbon footprint, and reduce emissions through personalized eco actions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/onboarding" className="px-8 py-4 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-2">
            Start Tracking
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/dashboard" className="px-8 py-4 bg-transparent border-2 border-primary text-primary rounded-lg font-semibold hover:bg-surface-container-low transition-all flex items-center justify-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            View Demo Dashboard
          </Link>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 py-16 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-on-surface mb-4">Features Designed for Clarity</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Transform complex carbon data into simple, actionable steps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant shadow-soft flex flex-col items-start text-left">
            <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center mb-6 text-primary">
              <Footprints className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-3">Track Daily Activities</h3>
            <p className="text-on-surface-variant">Effortlessly log your commute, meals, and energy usage. Our smart inputs categorize everything automatically.</p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant shadow-soft flex flex-col items-start text-left md:col-span-2">
            <div className="w-12 h-12 bg-secondary-fixed text-secondary-container-on bg-opacity-30 rounded-lg flex items-center justify-center mb-6 text-secondary">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-3">Understand Your Impact</h3>
            <p className="text-on-surface-variant max-w-md">Visualize your footprint with lightweight, elegant charts. See exactly which areas of your life contribute most to your emissions.</p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant shadow-soft flex flex-col items-start text-left md:col-span-3 border-l-4 border-l-primary-fixed-dim">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                <Leaf className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-on-surface mb-2">Reduce With EcoCoach</h3>
                <p className="text-on-surface-variant">Get AI-generated, highly personalized suggestions based on your specific habits to lower your footprint without drastically changing your lifestyle.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-surface-container-low py-16 border-y border-outline-variant mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-on-surface mb-4">A Simple Path to Sustainability</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {['Track', 'Understand', 'Act', 'Improve'].map((step, idx) => (
              <div key={step} className="flex flex-col items-center bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold mb-4 border-2 border-primary-fixed-dim">
                  {idx + 1}
                </div>
                <h4 className="text-lg font-semibold text-on-surface mb-2">{step}</h4>
                <p className="text-sm text-on-surface-variant">
                  {idx === 0 ? "Log daily habits" : idx === 1 ? "See the data" : idx === 2 ? "Follow insights" : "Lower emissions"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
