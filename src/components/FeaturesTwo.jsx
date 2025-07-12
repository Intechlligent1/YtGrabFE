// import React from "react";
// import { useId } from "react";

// export function FeaturesSectionDemoTwo() {
//   return (
//     <div className="py-20 lg:py-40">
//       <div
//         className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
//         {grid.map((feature) => (
//           <div
//             key={feature.title}
//             className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden">
//             <Grid size={20} />
//             <p
//               className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
//               {feature.title}
//             </p>
//             <p
//               className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
//               {feature.description}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// const grid = [
//   {
//     title: "HIPAA and SOC2 Compliant",
//     description:
//       "Our applications are HIPAA and SOC2 compliant, your data is safe with us, always.",
//   },
//   {
//     title: "Automated Social Media Posting",
//     description:
//       "Schedule and automate your social media posts across multiple platforms to save time and maintain a consistent online presence.",
//   },
//   {
//     title: "Advanced Analytics",
//     description:
//       "Gain insights into your social media performance with detailed analytics and reporting tools to measure engagement and ROI.",
//   },
//   {
//     title: "Content Calendar",
//     description:
//       "Plan and organize your social media content with an intuitive calendar view, ensuring you never miss a post.",
//   },
//   {
//     title: "Audience Targeting",
//     description:
//       "Reach the right audience with advanced targeting options, including demographics, interests, and behaviors.",
//   },
//   {
//     title: "Social Listening",
//     description:
//       "Monitor social media conversations and trends to stay informed about what your audience is saying and respond in real-time.",
//   },
//   {
//     title: "Customizable Templates",
//     description:
//       "Create stunning social media posts with our customizable templates, designed to fit your brand's unique style and voice.",
//   },
//   {
//     title: "Collaboration Tools",
//     description:
//       "Work seamlessly with your team using our collaboration tools, allowing you to assign tasks, share drafts, and provide feedback in real-time.",
//   },
// ];

// export const Grid = ({
//   pattern,
//   size
// }) => {
//   const p = pattern ?? [
//     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
//     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
//     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
//     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
//     [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
//   ];
//   return (
//     <div
//       className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
//       <div
//         className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
//         <GridPattern
//           width={size ?? 20}
//           height={size ?? 20}
//           x="-12"
//           y="4"
//           squares={p}
//           className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10" />
//       </div>
//     </div>
//   );
// };

// export function GridPattern({
//   width,
//   height,
//   x,
//   y,
//   squares,
//   ...props
// }) {
//   const patternId = useId();

//   return (
//     <svg aria-hidden="true" {...props}>
//       <defs>
//         <pattern
//           id={patternId}
//           width={width}
//           height={height}
//           patternUnits="userSpaceOnUse"
//           x={x}
//           y={y}>
//           <path d={`M.5 ${height}V.5H${width}`} fill="none" />
//         </pattern>
//       </defs>
//       <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
//       {squares && (
//         <svg x={x} y={y} className="overflow-visible">
//           {squares.map(([x, y]) => (
//             <rect
//               strokeWidth="0"
//               key={`${x}-${y}`}
//               width={width + 1}
//               height={height + 1}
//               x={x * width}
//               y={y * height} />
//           ))}
//         </svg>
//       )}
//     </svg>
//   );
// }



import React from "react";
import { useId } from "react";

export function FeaturesSectionDemoTwo() {
  return (
    <div className="py-20 lg:py-40 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {grid.map((feature) => (
          <div
            key={feature.title}
            className="relative bg-gradient-to-b dark:from-neutral-800/50 dark:to-neutral-900 from-neutral-50 to-white p-6 rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-300 group hover:scale-[1.02]">
            <Grid size={24} />
            <p className="text-lg font-bold text-neutral-800 dark:text-white relative z-20 mb-3">
              {feature.title}
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-6 font-normal relative z-20">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const grid = [
  // ... keep the same grid array content
  {
        title: "HIPAA and SOC2 Compliant",
        description:
          "Our applications are HIPAA and SOC2 compliant, your data is safe with us, always.",
      },
      {
        title: "Automated Social Media Posting",
        description:
          "Schedule and automate your social media posts across multiple platforms to save time and maintain a consistent online presence.",
      },
      {
        title: "Advanced Analytics",
        description:
          "Gain insights into your social media performance with detailed analytics and reporting tools to measure engagement and ROI.",
      },
      {
        title: "Content Calendar",
        description:
          "Plan and organize your social media content with an intuitive calendar view, ensuring you never miss a post.",
      },
      {
        title: "Audience Targeting",
        description:
          "Reach the right audience with advanced targeting options, including demographics, interests, and behaviors.",
      },
      {
        title: "Social Listening",
        description:
          "Monitor social media conversations and trends to stay informed about what your audience is saying and respond in real-time.",
      },
      {
        title: "Customizable Templates",
        description:
          "Create stunning social media posts with our customizable templates, designed to fit your brand's unique style and voice.",
      },
      {
        title: "Collaboration Tools",
        description:
          "Work seamlessly with your team using our collaboration tools, allowing you to assign tasks, share drafts, and provide feedback in real-time.",
      },
];

export const Grid = ({ pattern, size }) => {
  const p = pattern ?? [
    [2, 1],
    [6, 2],
    [3, 4],
    [8, 5],
    [5, 7],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-blue-900/20 from-blue-100/30 to-blue-200/20 dark:to-blue-900/20 opacity-50">
        <GridPattern
          width={size ?? 24}
          height={size ?? 24}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/5 dark:stroke-white/5 stroke-black/5 fill-black/5" />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
              className="transition-all duration-300 ease-out"
            />
          ))}
        </svg>
      )}
    </svg>
  );
}