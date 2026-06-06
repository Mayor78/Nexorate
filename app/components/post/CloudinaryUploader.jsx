'use client';

import { useState, useRef } from 'react';
import { X, Upload, AlertCircle, Loader2, ImagePlus } from 'lucide-react';
import Image from 'next/image';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'profile';

export default function CloudinaryUploader({ images, onImagesChange, onRemoveImage }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'nexorate/listings');
    formData.append('cloud_name', CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return {
      id: data.public_id,
      url: data.secure_url,
      thumbnail: data.secure_url,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes,
    };
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (!CLOUD_NAME) {
      setError('Cloudinary is not configured. Contact support.');
      return;
    }

    const remaining = 5 - images.length;
    if (files.length > remaining) {
      setError(`You can only add ${remaining} more image${remaining !== 1 ? 's' : ''}. Maximum is 5.`);
      return;
    }

    setError('');
    setIsUploading(true);
    const newImages = [];
    const progress = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      progress[i] = `Uploading ${file.name}...`;
      setUploadProgress({ ...progress });

      try {
        const uploaded = await uploadSingleFile(file);
        newImages.push(uploaded);
        progress[i] = 'done';
        setUploadProgress({ ...progress });
        onImagesChange([...images, ...newImages]);
      } catch (err) {
        progress[i] = 'failed';
        setUploadProgress({ ...progress });
        setError(`Failed to upload "${file.name}": ${err.message}`);
      }
    }

    setIsUploading(false);
    setUploadProgress({});

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    onRemoveImage(index);
    setError('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Add Photos</h2>
          <p className="text-xs text-slate-500 mt-0.5">Show buyers what you&apos;re selling</p>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
          {images.length}/5
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-red-600 text-xs font-medium">{error}</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {images.map((img, index) => (
            <div
              key={img.id || index}
              className="relative aspect-square bg-slate-100 border border-slate-200 rounded-xl overflow-hidden group"
            >
              {img.url ? (
                <>
                  <Image
                    src={img.thumbnail || img.url}
                    alt={`Photo ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-500 text-white p-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={13} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 bg-sky-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      MAIN
                    </span>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin text-slate-400" />
                </div>
              )}
            </div>
          ))}

          {images.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="aspect-square bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-sky-400 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50"
            >
              <ImagePlus size={22} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400">Add</span>
            </button>
          )}
        </div>
      )}

      {images.length === 0 && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-slate-300 hover:border-sky-400 rounded-xl bg-slate-50/50 hover:bg-sky-50/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
            <Upload size={26} className="text-sky-500 stroke-[1.5]" />
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-bold text-slate-700">Tap to add photos</p>
            <p className="text-xs text-slate-500 mt-1">
              Pick up to 5 photos of your item. First photo will be the cover.
            </p>
          </div>
        </button>
      )}

      {isUploading && Object.keys(uploadProgress).length > 0 && (
        <div className="mt-3 space-y-1.5">
          {Object.entries(uploadProgress).map(([key, status]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              {status === 'done' ? (
                <span className="text-green-600 font-medium">&#10003; Uploaded successfully</span>
              ) : (
                <span className="text-slate-500 font-medium">{status}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
