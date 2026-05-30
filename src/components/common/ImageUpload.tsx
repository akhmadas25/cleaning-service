"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export function ImageUpload({ onChange, onRemove, value }: ImageUploadProps) {
  const onSuccess = useCallback(
    (result: any) => {
      if (result.info && typeof result.info !== "string") {
        onChange(result.info.secure_url);
      }
    },
    [onChange]
  );

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 group"
          >
            <div className="z-10 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                className="h-7 w-7 rounded-lg"
              >
                <Trash className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onSuccess={onSuccess}
        uploadPreset={uploadPreset}
        options={{
          maxFiles: 1,
          sources: ["local", "camera"],
        }}
      >
        {({ open }) => {
          const onClick = () => {
            if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
              console.warn("Cloudinary Upload Preset is not defined in .env. Falling back to 'ml_default'.");
            }
            open();
          };

          return (
            <Button
              type="button"
              disabled={false}
              variant="secondary"
              onClick={onClick}
              className="w-full flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <ImagePlus className="h-6 w-6 text-slate-500" />
              <span className="text-slate-600 font-medium text-xs">Unggah Foto</span>
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
