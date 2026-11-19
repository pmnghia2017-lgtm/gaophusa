import { useState } from 'react';
import { Wheat } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackLabel: string;
  className?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackLabel,
  className = 'h-full w-full object-cover',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#F2F1EC] p-6 text-center text-[#565B52]"
        role="img"
        aria-label={alt}
      >
        <Wheat className="h-8 w-8 stroke-[1.5] text-[#1E4D2B]" aria-hidden="true" />
        <span className="text-sm font-medium text-[#171A17]">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
