export default function DescriptionInput({ value, onChange }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
        Item Description *
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Provide a clean summary detailing system history, configuration details, or connection requirements..."
        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-150 resize-none leading-relaxed"
        required
      />
    </div>
  );
}