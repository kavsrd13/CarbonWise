import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserProfile } from "../../lib/storage";
import { UserProfile } from "../../types";
import { Layout } from "../../components/Layout";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: "",
    city: "",
    country: "United States",
    householdSize: 1,
    primaryCommuteMode: "Car",
    fuelType: "Petrol",
    dailyCommuteDistance: 10,
    monthlyElectricityUsage: 200,
    acUsageLevel: "Medium",
    dietType: "Mixed",
    foodDeliveryFrequency: "Sometimes",
    shoppingFrequency: "Medium",
    recyclingHabit: "Sometimes"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Type assertion via unknown to circumvent specific union type matching in a general text handler
    setProfile(prev => ({ ...prev, [name]: (value as unknown) }));
  };

  const nextStep = () => {
    // Validation
    const validationErrors: Record<string, string> = {};
    if (step === 1) {
      if (!profile.name || profile.name.trim() === "") validationErrors.name = "Name is required.";
      if (Number(profile.householdSize) < 1) validationErrors.householdSize = "Household size must be at least 1.";
    }
    if (step === 2) {
      if (Number(profile.dailyCommuteDistance) < 0) validationErrors.dailyCommuteDistance = "Distance cannot be negative.";
    }
    if (step === 3) {
      if (Number(profile.monthlyElectricityUsage) < 0) validationErrors.monthlyElectricityUsage = "Usage cannot be negative.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    if (step < 5) setStep(step + 1);
    else finishOnboarding();
  };

  const finishOnboarding = () => {
    saveUserProfile(profile as UserProfile);
    navigate("/dashboard");
  };

  const progressPercentage = (step / 5) * 100;

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary tracking-tight">CarbonWise</h1>
            <p className="text-lg text-on-surface-variant mt-2">Let's establish your environmental baseline.</p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-popover border border-outline-variant p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary-container"></div>
            
            <div className="mb-10">
              <div className="flex justify-between text-sm font-medium text-on-surface-variant mb-3">
                <span>Step {step} of 5</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            <form onSubmit={e => e.preventDefault()}>
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-2">Basic Profile</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface" placeholder="Jane Doe" />
                    {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input type="text" name="city" value={profile.city} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface" placeholder="Seattle" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Country</label>
                      <input type="text" name="country" value={profile.country} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Household Size</label>
                    <input type="number" name="householdSize" min="1" value={profile.householdSize} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface" />
                    {errors.householdSize && <p className="text-error text-sm mt-1">{errors.householdSize}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-2">Travel Habits</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Primary Commute Mode</label>
                    <select name="primaryCommuteMode" value={profile.primaryCommuteMode} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface">
                      <option>Walk</option>
                      <option>Cycle</option>
                      <option>Bike</option>
                      <option>Car</option>
                      <option>Bus</option>
                      <option>Train</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Fuel Type</label>
                      <select name="fuelType" value={profile.fuelType} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface">
                        <option>None</option>
                        <option>Petrol</option>
                        <option>Diesel</option>
                        <option>Electric</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Daily Distance (km)</label>
                      <input type="number" name="dailyCommuteDistance" value={profile.dailyCommuteDistance} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface" />
                      {errors.dailyCommuteDistance && <p className="text-error text-sm mt-1">{errors.dailyCommuteDistance}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-2">Home Energy</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estimated Monthly Electricity (kWh)</label>
                    <input type="number" name="monthlyElectricityUsage" value={profile.monthlyElectricityUsage} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface" />
                    {errors.monthlyElectricityUsage && <p className="text-error text-sm mt-1">{errors.monthlyElectricityUsage}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">AC Usage Level</label>
                    <select name="acUsageLevel" value={profile.acUsageLevel} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-2">Food Habits</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Diet Type</label>
                    <select name="dietType" value={profile.dietType} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface">
                      <option>Vegetarian</option>
                      <option>Mixed</option>
                      <option>High Meat</option>
                      <option>Vegan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Food Delivery Frequency</label>
                    <select name="foodDeliveryFrequency" value={profile.foodDeliveryFrequency} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface">
                      <option>Rare</option>
                      <option>Sometimes</option>
                      <option>Often</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-2">Shopping & Waste</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Shopping Frequency</label>
                    <select name="shoppingFrequency" value={profile.shoppingFrequency} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Recycling Habit</label>
                    <select name="recyclingHabit" value={profile.recyclingHabit} onChange={handleChange} className="w-full p-3 rounded-lg border border-outline-variant bg-surface">
                      <option>Never</option>
                      <option>Sometimes</option>
                      <option>Often</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2 border border-primary text-primary rounded-lg">Back</button>
                )}
                <div className="ml-auto">
                  <button type="button" onClick={nextStep} className="px-6 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-container">
                    {step === 5 ? "Complete" : "Next Step"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
