import { useState, useEffect } from "react";

interface UseImageLoadingResult {
  imageUrl: string | null;
  isLoading: boolean;
  hasError: boolean;
  setImageUrl: (url: string | null) => void;
}

export const useImageLoading = (
  initialUrl?: string | null,
  apiDomain?: string
): UseImageLoadingResult => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (initialUrl) {
      setIsLoading(true);
      setHasError(false);
      
      // Construct full URL if needed
      const fullUrl = initialUrl.startsWith("http") 
        ? initialUrl 
        : apiDomain 
          ? `${apiDomain}${initialUrl}` 
          : initialUrl;
      
      // Test if image can be loaded
      const img = new Image();
      img.onload = () => {
        setImageUrl(fullUrl);
        setIsLoading(false);
        setHasError(false);
      };
      img.onerror = () => {
        setImageUrl(null);
        setIsLoading(false);
        setHasError(true);
      };
      img.src = fullUrl;
    } else {
      setImageUrl(null);
      setIsLoading(false);
      setHasError(false);
    }
  }, [initialUrl, apiDomain]);

  const handleSetImageUrl = (url: string | null) => {
    if (url) {
      setIsLoading(true);
      setHasError(false);
      
      const fullUrl = url.startsWith("http") 
        ? url 
        : apiDomain 
          ? `${apiDomain}${url}` 
          : url;
      
      const img = new Image();
      img.onload = () => {
        setImageUrl(fullUrl);
        setIsLoading(false);
        setHasError(false);
      };
      img.onerror = () => {
        setImageUrl(null);
        setIsLoading(false);
        setHasError(true);
      };
      img.src = fullUrl;
    } else {
      setImageUrl(null);
      setIsLoading(false);
      setHasError(false);
    }
  };

  return {
    imageUrl,
    isLoading,
    hasError,
    setImageUrl: handleSetImageUrl,
  };
};

export default useImageLoading;