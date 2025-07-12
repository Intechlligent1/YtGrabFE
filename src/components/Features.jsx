import { cn } from "@/lib/utils";
import {
  IconDownload,
  IconClock,
  IconCurrencyDollar,
  IconGauge,
  IconShieldLock,
  IconHelp,
  IconAdOff,
  IconDeviceDesktop,
} from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Multiple Format Support",
      description: "Download videos in MP4, WEBM, MKV, or extract MP3 audio. Choose your preferblue quality.",
      icon: <IconDownload />,
    },
    {
      title: "One-Click Downloads",
      description: "Simple and intuitive interface. Just paste the link and download instantly.",
      icon: <IconClock />,
    },
    {
      title: "Free to Use",
      description: "100% free service with no hidden costs. No subscriptions or premium tiers.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "High-Speed Downloads",
      description: "Utilize our premium CDN for blazing fast download speeds without throttling.",
      icon: <IconGauge />,
    },
    {
      title: "Privacy Focused",
      description: "We never store your data or track your downloads. Your privacy comes first.",
      icon: <IconShieldLock />,
    },
    {
      title: "24/7 Support",
      description: "Dedicated support team ready to help with any download issues or questions.",
      icon: <IconHelp />,
    },
    {
      title: "No Ads",
      description: "Enjoy completely ad-free experience. No banners, popups, or distractions.",
      icon: <IconAdOff />,
    },
    {
      title: "Cross-Platform Access",
      description: "Works perfectly on all devices - desktop, mobile, tablet. Browser-based solution.",
      icon: <IconDeviceDesktop />,
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({ title, description, icon, index }) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {/* Hover overlay gradients */}
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-30 transition-opacity duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-blue-100 dark:from-blue-900/20 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-30 transition-opacity duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-blue-100 dark:from-blue-900/20 to-transparent pointer-events-none" />
      )}

      {/* Icon container */}
      <div className="mb-4 relative z-10 px-10 text-blue-500 dark:text-blue-400">
        {icon}
      </div>

      {/* Title with animated accent bar */}
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-blue-600 dark:text-blue-500">
          {title}
        </span>
      </div>

      {/* Description text */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};