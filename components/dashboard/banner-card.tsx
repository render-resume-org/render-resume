import Image from "next/image";

interface BannerCardProps {
  imageUrl?: string;
  imageAlt?: string;
}

export function BannerCard({ 
  imageUrl,
  imageAlt = "Banner Image"
}: BannerCardProps) {
  return (
    <div className="w-full h-full min-h-[12rem] bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center relative shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      {imageUrl ? (
        <Image 
          src={imageUrl} 
          alt={imageAlt}
          fill
          className="object-cover rounded-2xl"
        />
      ) : (
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {imageAlt}
        </span>
      )}
    </div>
  );
} 