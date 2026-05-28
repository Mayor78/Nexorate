import LocationInput from "../ui/LocationInput";

export default function BasicInfoForm({ title, setTitle, price, setPrice, location, setLocation }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-50 pb-2">
        Basic Information
      </h2>
      
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Listing Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., iPhone 13 Pro Max - Pristine Swap"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Price (NGN) *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 650000"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150"
            required
          />
        </div>

  
<div>
  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
    Location *
  </label>
  <LocationInput
    value={location}
    onChange={setLocation}
    placeholder="Select your state"
    required
  />
</div>
      </div>
    </div>
  );
}