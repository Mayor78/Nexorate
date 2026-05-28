import { X, ImagePlus } from 'lucide-react';
import Image from 'next/image';

export default function ImageUploader({ images, onImagesChange, onRemoveImage }) {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    onImagesChange([...images, ...newImages].slice(0, 10));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
        Product Media Gallery
      </label>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square bg-slate-50 border border-slate-100 rounded-xl overflow-hidden group">
              <Image src={img.preview} alt={`Preview ${index}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-slate-200 p-1.5 rounded-lg hover:text-white transition duration-150"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <label className="flex flex-col items-center justify-center gap-2.5 w-full py-8 border-2 border-dashed border-slate-200 hover:border-sky-500 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-white transition-all duration-150 group">
        <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400 group-hover:text-sky-600 transition-colors duration-150">
          <ImagePlus size={20} className="stroke-[1.5]" />
        </div>
        <div className="text-center">
          <span className="text-xs font-bold text-slate-700 block">Click to append catalog images</span>
          <span className="text-[10px] font-medium text-slate-400 mt-0.5 block">JPEG, PNG, or WebP up to 10 files</span>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
    </div>
  );
}