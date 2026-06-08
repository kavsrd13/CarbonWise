import { useState, useEffect } from "react";
import { Layout } from "../../components/Layout";
import { getUserProfile, clearAllData } from "../../lib/storage";
import { UserProfile } from "../../types";
import { useNavigate } from "react-router-dom";

export function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  const handleReset = () => {
    if (confirm("Are you sure you want to delete all activity logs and profile data? This action cannot be undone.")) {
      clearAllData();
      navigate("/");
    }
  };

  if (!profile) return <Layout><div className="p-8">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-on-surface mb-8 tracking-tight">Profile & Settings</h1>

        <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant shadow-soft mb-8">
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">Name</span>
              <span className="font-medium text-on-surface text-lg">{profile.name}</span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">Location</span>
              <span className="font-medium text-on-surface text-lg">{profile.city}, {profile.country}</span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">Commute Mode</span>
              <span className="font-medium text-on-surface text-lg">{profile.primaryCommuteMode}</span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">Diet Type</span>
              <span className="font-medium text-on-surface text-lg">{profile.dietType}</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-outline-variant text-right">
             <button onClick={() => navigate("/onboarding")} className="text-primary font-medium hover:underline">Edit Profile details in Onboarding</button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-8 border border-error-container shadow-soft">
          <h2 className="text-xl font-semibold text-error mb-2">Danger Zone</h2>
          <p className="text-on-surface-variant mb-6 text-sm">Reseting your data will delete all logs, challenge progress, and profile information entirely from this browser.</p>
          <button onClick={handleReset} className="bg-error-container text-on-error-container px-6 py-3 rounded-lg font-semibold hover:bg-opacity-80 transition-opacity text-sm">
            Erase All Local Data
          </button>
        </div>
      </div>
    </Layout>
  );
}
