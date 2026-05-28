'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, Cloud, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function CloudinaryUploader({ images, onImagesChange, onRemoveImage }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [widget, setWidget] = useState(null);

  // Load Cloudinary script on mount
  useEffect(() => {
    if (window.cloudinary) {
      // Already loaded
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    
    script.onload = () => {
      // Script loaded successfully
      if (window.cloudinary) {
        console.log('Cloudinary script loaded');
      } else {
        setError('Failed to load Cloudinary');
      }
    };

    script.onerror = () => {
      setError('Failed to load Cloudinary upload widget');
    };

    document.body.appendChild(script);
  }, []);

  const openUploadWidget = useCallback(() => {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      setError('Cloudinary configuration is missing');
      return;
    }

    if (!window.cloudinary) {
      setError('Cloudinary is not loaded yet. Please try again.');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const uploadWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'profile',
          folder: 'nexorate/listings',
          multiple: true,
          maxFiles: 5,
          maxFileSize: 5000000, // 5MB
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#0EA5E9',
              menuIcons: '#5A616A',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#0EA5E9',
              action: '#FF620C',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#0078FF',
              complete: '#20B832',
              sourceBg: '#E4E8ED'
            }
          }
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            setError('Upload failed: ' + (error.status || error.message));
            setIsUploading(false);
            return;
          }

          if (result && result.event === 'success') {
            const { info } = result;
            const newImage = {
              id: info.public_id,
              url: info.secure_url,
              thumbnail: info.thumbnail_url || info.secure_url,
              width: info.width,
              height: info.height,
              format: info.format,
              bytes: info.bytes,
              createdAt: new Date().toISOString()
            };
            
            onImagesChange([...images, newImage]);
          }

          if (result && result.event === 'close') {
            setIsUploading(false);
          }
        }
      );

      uploadWidget.open();
    } catch (err) {
      console.error('Widget error:', err);
      setError('Failed to open upload widget: ' + err.message);
      setIsUploading(false);
    }
  }, [images, onImagesChange]);

  const handleRemoveImage = (index) => {
    onRemoveImage(index);
    setError('');
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
        Product Media Gallery
      </label>
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {images.map((img, index) => (
            <div key={img.id || index} className="relative aspect-square bg-slate-50 border border-slate-100 rounded-xl overflow-hidden group">
              <Image 
                src={img.thumbnail || img.url} 
                alt={`Upload ${index + 1}`} 
                fill 
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-slate-200 p-1.5 rounded-lg hover:text-white transition duration-150 opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Button */}
      <button
        type="button"
        onClick={openUploadWidget}
        disabled={isUploading || images.length >= 5}
        className="w-full flex flex-col items-center justify-center gap-2.5 py-8 border-2 border-dashed border-slate-200 hover:border-sky-500 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-white transition-all duration-150 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400 group-hover:text-sky-600 transition-colors duration-150">
          <Cloud size={20} className="stroke-[1.5]" />
        </div>
        <div className="text-center">
          <span className="text-xs font-bold text-slate-700 block">
            {isUploading ? 'Uploading...' : 'Upload to Cloudinary'}
          </span>
          <span className="text-[10px] font-medium text-slate-400 mt-0.5 block">
            {images.length}/5 images • JPG, PNG, WebP
          </span>
        </div>
      </button>
      
      {/* Upload Info */}
      {images.length > 0 && (
        <p className="text-xs text-slate-400 mt-3 text-center">
          Images are stored securely in Cloudinary cloud storage
        </p>
      )}
    </div>
  );
}