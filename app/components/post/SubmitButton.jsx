export default function SubmitButton({ isLoading, text = "Post Listing" }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 py-3.5 rounded-xl font-bold text-sm shadow-sm transition duration-150 active:scale-[0.995] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </>
      ) : (
        text
      )}
    </button>
  );
}