import React, { useState } from "react";
import ImagePlaceholder from "./ImagePlaceholder";

interface SafeImageProps {
  src?: string | null;
  alt?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  placeholderText?: string;
  fallbackSrc?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = "Image",
  width = "100%",
  height = 300,
  style = {},
  placeholderText = "No Image",
  fallbackSrc,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no src provided, show placeholder immediately
  if (!src) {
    return (
      <ImagePlaceholder
        width={width}
        height={height}
        text={placeholderText}
        style={style}
      />
    );
  }

  // If error occurred and no fallback, show placeholder
  if (hasError && !fallbackSrc) {
    return (
      <ImagePlaceholder
        width={width}
        height={height}
        text={placeholderText}
        style={style}
      />
    );
  }

  const handleError = () => {
    if (fallbackSrc && src !== fallbackSrc) {
      // Try fallback src if available and not already tried
      setHasError(false);
      setIsLoading(true);
    } else {
      // Show placeholder if no fallback or fallback also failed
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div style={{ position: "relative", width, height }}>
      {isLoading && (
        <ImagePlaceholder
          width={width}
          height={height}
          text="Loading..."
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}

      <img
        src={hasError && fallbackSrc ? fallbackSrc : src}
        alt={alt}
        style={{
          width,
          height,
          objectFit: "cover",
          display: isLoading ? "none" : "block",
          ...style,
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default SafeImage;
