import { useState, useMemo, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { Layout } from "../../components/Layout";
import { Category, ActivityLog } from "../../types";
import { saveActivityLog, getActivityLogs } from "../../lib/storage";
import { calculateTravelEmission, calculateElectricityEmission, calculateFoodEmission, calculateShoppingEmission, calculateWasteEmission } from "../../lib/carbonCalculator";
import { Car, Zap, Utensils, ShoppingBag, Trash2 } from "lucide-react";

export function AddActivityPage() {
  const [activeTab, setActiveTab] = useState<Category>("travel");
  const [logs, setLogs] = useState<ActivityLog[]>(getActivityLogs());
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = (log: ActivityLog) => {
    saveActivityLog(log);
    setLogs(getActivityLogs());
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 3000);
  };

  const tabs: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: "travel", label: "Travel", icon: <Car className="w-4 h-4" /> },
    { id: "electricity", label: "Electricity", icon: <Zap className="w-4 h-4" /> },
    { id: "food", label: "Food", icon: <Utensils className="w-4 h-4" /> },
    { id: "shopping", label: "Shopping", icon: <ShoppingBag className="w-4 h-4" /> },
    { id: "waste", label: "Waste", icon: <Trash2 className="w-4 h-4" /> },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-on-surface mb-2">Log New Activity</h1>
          <p className="text-on-surface-variant">Track your daily actions to see your carbon impact.</p>
        </div>

        {showConfirm && (
          <div className="bg-primary-fixed text-on-primary-fixed p-4 rounded-lg mb-6 text-center shadow-soft animate-fade-in font-medium">
            Activity logged successfully! Dashboard updated.
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-2 border border-outline-variant shadow-soft flex overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setActiveTab(t.id); setErrorMsg(""); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors min-w-max ${
                    activeTab === t.id ? "bg-surface-container-low text-primary" : "text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-popover">
              {errorMsg && <p className="text-error text-sm mb-4 bg-error-container p-2 rounded">{errorMsg}</p>}
              {activeTab === "travel" && <TravelForm onSave={handleSave} setError={setErrorMsg} />}
              {activeTab === "electricity" && <ElectricityForm onSave={handleSave} setError={setErrorMsg} />}
              {activeTab === "food" && <FoodForm onSave={handleSave} setError={setErrorMsg} />}
              {activeTab === "shopping" && <ShoppingForm onSave={handleSave} setError={setErrorMsg} />}
              {activeTab === "waste" && <WasteForm onSave={handleSave} setError={setErrorMsg} />}
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-soft">
              <h2 className="text-xl font-semibold text-on-surface mb-4">Recent Logs</h2>
              <div className="flex flex-col gap-3">
                {logs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-on-surface capitalize">{log.category} - {log.activityType.replace("_", " ")}</span>
                      <span className="text-xs text-on-surface-variant">{log.date} | {log.quantity} {log.unit}</span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-sm font-semibold text-error">{log.emissionKgCO2e} kg</span>
                      <span className="text-xs text-on-surface-variant">CO₂e</span>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && <p className="text-sm text-on-surface-variant text-center py-4">No activities logged yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const inputClass = "w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors";
const labelClass = "block text-sm font-medium text-on-surface mb-1.5";

function TravelForm({ onSave, setError }: { onSave: (log: ActivityLog) => void, setError: (m: string) => void }) {
  const [mode, setMode] = useState("car");
  const [fuel, setFuel] = useState("petrol");
  const [distance, setDistance] = useState("10");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const d = parseFloat(distance);
    if (isNaN(d) || d < 0) return setError("Distance cannot be negative.");
    if (!date) return setError("Date is required.");
    setError("");

    // match factor key
    let typeKey = mode;
    if (mode === "car" || mode === "bike") {
      typeKey = `${mode}_${fuel}`;
      if (fuel === "electric") typeKey = "electric_vehicle";
      if (fuel === "none") typeKey = "walk"; // fallback edgecase
    }

    const co2 = calculateTravelEmission(typeKey, d);
    onSave({
      id: "MOCK_UUID", // using mock to avoid heavy deps, better logic later
      category: "travel",
      activityType: typeKey,
      quantity: d,
      unit: "km",
      emissionKgCO2e: co2,
      date,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>Transport Mode</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className={inputClass}>
          <option value="walk">Walk</option>
          <option value="cycle">Cycle</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
        </select>
      </div>
      {(mode === "car" || mode === "bike") && (
        <div>
          <label className={labelClass}>Fuel Type</label>
          <select value={fuel} onChange={(e) => setFuel(e.target.value)} className={inputClass}>
            <option value="none">None</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
          </select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Distance (km)</label>
          <input type="number" step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <button type="submit" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-container">Calculate & Save</button>
      </div>
    </form>
  );
}

// SIMILAR STRUCTURE FOR OTHERS (Electricity, Food, Shopping, Waste)
function ElectricityForm({ onSave, setError }: any) {
  const [usage, setUsage] = useState("100");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = parseFloat(usage);
    if (isNaN(q) || q < 0) return setError("Usage cannot be negative.");
    if (!date) return setError("Date is required.");
    setError("");

    const co2 = calculateElectricityEmission(q);
    onSave({ id: "UUID", category: "electricity", activityType: "grid", quantity: q, unit: "kWh", emissionKgCO2e: co2, date, createdAt: new Date().toISOString() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Usage (kWh)</label>
          <input type="number" step="1" value={usage} onChange={(e) => setUsage(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <button type="submit" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-medium">Calculate & Save</button>
      </div>
    </form>
  );
}

function FoodForm({ onSave, setError }: any) {
  const [meal, setMeal] = useState("mixed");
  const [qty, setQty] = useState("1");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = parseFloat(qty);
    if (isNaN(q) || q < 0) return setError("Quantity cannot be negative.");
    if (!date) return setError("Date is required.");
    setError("");

    const co2 = calculateFoodEmission(meal, q);
    onSave({ id: "UUID", category: "food", activityType: meal, quantity: q, unit: "meals", emissionKgCO2e: co2, date, createdAt: new Date().toISOString() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>Meal Type</label>
        <select value={meal} onChange={(e) => setMeal(e.target.value)} className={inputClass}>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="mixed">Mixed</option>
          <option value="chicken">Chicken</option>
          <option value="mutton">Mutton</option>
          <option value="packaged">Packaged</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Meals</label>
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <button type="submit" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-medium">Save</button>
      </div>
    </form>
  );
}

function ShoppingForm({ onSave, setError }: any) {
  const [item, setItem] = useState("clothes");
  const [qty, setQty] = useState("1");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = parseFloat(qty);
    if (isNaN(q) || q < 0) return setError("Quantity cannot be negative.");
    if (!date) return setError("Date is required.");
    
    setError("");

    const co2 = calculateShoppingEmission(item, q);
    onSave({ id: "UUID", category: "shopping", activityType: item, quantity: q, unit: "items", emissionKgCO2e: co2, date, createdAt: new Date().toISOString() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>Item Type</label>
        <select value={item} onChange={(e) => setItem(e.target.value)} className={inputClass}>
          <option value="clothes">Clothes</option>
          <option value="electronics">Electronics</option>
          <option value="household">Household</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Quantity</label>
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <button type="submit" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-medium">Save</button>
      </div>
    </form>
  );
}

function WasteForm({ onSave, setError }: any) {
  const [type, setType] = useState("general");
  const [qty, setQty] = useState("1");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = parseFloat(qty);
    if (isNaN(q) || q < 0) return setError("Quantity cannot be negative.");
    if (!date) return setError("Date is required.");
    setError("");

    const co2 = calculateWasteEmission(type, q);
    onSave({ id: "UUID", category: "waste", activityType: type, quantity: q, unit: "kg", emissionKgCO2e: co2, date, createdAt: new Date().toISOString() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>Waste Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
          <option value="general">General</option>
          <option value="recycled">Recycled</option>
          <option value="compost">Compost</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Quantity (kg)</label>
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <button type="submit" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-medium">Save</button>
      </div>
    </form>
  );
}
