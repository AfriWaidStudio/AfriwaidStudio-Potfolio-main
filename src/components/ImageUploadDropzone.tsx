import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon, Link as LinkIcon, AlertCircle } from "lucide-react";

interface ImageUploadDropzoneProps {
  value: string; // can be a single URL or comma-separated URLs
  onChange: (value: string) => void;
  multiple?: boolean;
  label?: string;
  placeholderText?: string;
  maxSizeMB?: number;
}

export default function ImageUploadDropzone({
  value,
  onChange,
  multiple = false,
  label = "Upload Images",
  placeholderText = "Drag & drop images here or click to browse",
  maxSizeMB = 4,
}: ImageUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse existing values
  const getImagesArray = (): string[] => {
    if (!value) return [];
    if (multiple) {
      return value.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [value.trim()].filter(Boolean);
  };

  const images = getImagesArray();

  const handleFiles = (files: FileList) => {
    setError(null);
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        setError("Only image files (PNG, JPG, JPEG, WEBP, GIF) are supported.");
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File is too large. Max size is ${maxSizeMB}MB.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Convert to Base64
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const resultUrl = reader.result;
          if (multiple) {
            const current = getImagesArray();
            if (!current.includes(resultUrl)) {
              onChange([...current, resultUrl].join(", "));
            }
          } else {
            onChange(resultUrl);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const current = getImagesArray();
    const updated = current.filter((_, idx) => idx !== indexToRemove);
    onChange(updated.join(", "));
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = manualUrl.trim();
    if (!cleanUrl) return;
    
    if (multiple) {
      const current = getImagesArray();
      if (!current.includes(cleanUrl)) {
        onChange([...current, cleanUrl].join(", "));
      }
    } else {
      onChange(cleanUrl);
    }
    setManualUrl("");
  };

  return (
    <div className="space-y-2 text-xs font-mono text-neutral-300">
      <div className="flex items-center justify-between">
        <label className="text-neutral-500 uppercase tracking-wider font-bold">{label}</label>
        {multiple && images.length > 0 && (
          <span className="text-[10px] text-zinc-500">{images.length} item(s) uploaded</span>
        )}
      </div>

      {/* Main Drag-and-Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative flex flex-col items-center justify-center p-6 border border-dashed rounded-lg transition duration-200 cursor-pointer min-h-[120px] ${
          dragActive
            ? "border-cyan-500 bg-cyan-950/20 text-cyan-400"
            : "border-neutral-800 bg-neutral-950 hover:border-neutral-700 hover:bg-neutral-900/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          onChange={handleChange}
          accept="image/*"
        />

        <div className="flex flex-col items-center justify-center text-center space-y-2 pointer-events-none">
          <Upload className={`w-6 h-6 ${dragActive ? "text-cyan-400 animate-bounce" : "text-neutral-500"}`} />
          <p className="text-[11px] font-sans text-neutral-450">{placeholderText}</p>
          <span className="text-[9px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-850 text-neutral-550">
            Supports PNG, JPEG, WEBP, GIF (Max {maxSizeMB}MB)
          </span>
        </div>
      </div>

      {/* Optional: Add manual image link input */}
      <form onSubmit={handleAddManualUrl} className="flex gap-1">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-505" />
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-white/10 rounded-sm text-white placeholder-neutral-700 focus:border-cyan-500 focus:outline-none text-[11px]"
            placeholder="Or enter complete image URL manually..."
          />
        </div>
        <button
          type="submit"
          disabled={!manualUrl.trim()}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 rounded-sm transition text-[10px] uppercase font-bold disabled:opacity-50"
        >
          Add URL
        </button>
      </form>

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-1.5 p-2 rounded bg-red-950/40 border border-red-900/40 text-red-400 text-[10px]">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2">
          {images.map((img, idx) => {
            const isBase64 = img.startsWith("data:");
            return (
              <div key={idx} className="relative group aspect-video rounded-md overflow-hidden bg-neutral-950 border border-white/10">
                <img
                  src={img}
                  alt={`Upload preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Delete button overlay */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/75 hover:bg-red-600 hover:scale-105 transition text-white"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Base64 vs Web indicator badge */}
                <span className="absolute bottom-1 left-1 px-1 py-0.5 text-[7px] font-bold rounded bg-black/75 text-zinc-400">
                  {isBase64 ? "Local Asset" : "External URL"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
