"use client";
import { useState } from "react";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showVerification?: boolean;
  isVerified?: boolean;
  showAvailability?: boolean;
  isAvailable?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm", 
  lg: "w-16 h-16 text-xl",
  xl: "w-20 h-20 text-2xl"
};

export default function Avatar({
  src,
  alt,
  fallback,
  size = "lg",
  className = "",
  showVerification = false,
  isVerified = false,
  showAvailability = false,
  isAvailable = false
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const sizeClass = sizeClasses[size];
  const baseClasses = `${sizeClass} rounded-2xl flex items-center justify-center font-bold text-white shadow-lg relative overflow-hidden`;

  return (
    <div className={`${baseClasses} ${className}`}>
      {src && !imageError ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] flex items-center justify-center">
              <div className="animate-pulse text-white font-bold">
                {fallback.charAt(0)}
              </div>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] flex items-center justify-center">
          {fallback.charAt(0)}
        </div>
      )}
      
      {/* Verification Badge */}
      {showVerification && isVerified && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
          <User className="w-3 h-3 text-white fill-current" />
        </div>
      )}
      
      {/* Availability Indicator */}
      {showAvailability && (
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
          isAvailable ? 'bg-green-500' : 'bg-orange-500'
        }`} title={isAvailable ? 'Available' : 'Busy'} />
      )}
    </div>
  );
}


