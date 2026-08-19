import type { SVGProps } from "react";

const p = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Base({ children, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...rest}>
      <g {...p}>{children}</g>
    </svg>
  );
}

export const PhoneIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.2 2 2 0 0 1 5 3h1.5Z" /></Base>
);
export const WhatsAppIcon = (s: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor" {...s}>
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.35-1.4a9.8 9.8 0 0 0 4.69 1.2h.01c5.43 0 9.84-4.4 9.84-9.84A9.78 9.78 0 0 0 12.04 2Zm5.76 14.02c-.24.68-1.4 1.3-1.94 1.34-.5.05-.98.24-3.3-.69-2.78-1.1-4.54-3.94-4.68-4.13-.13-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.27a1 1 0 0 1 .72-.34h.51c.17 0 .39-.06.6.46l.83 2c.07.14.11.3.02.48l-.3.5-.44.48c-.14.14-.29.3-.12.58.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07l.86-1c.2-.24.36-.19.6-.11l1.72.81c.25.12.42.18.48.28.06.1.06.58-.18 1.26Z" />
  </svg>
);
export const MapPinIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></Base>
);
export const ClockIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><circle cx="12" cy="12" r="9" /><path d="M12 7v5.2l3.2 2" /></Base>
);
export const MailIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.6 7 8.4 6 8.4-6" /></Base>
);
export const SearchIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></Base>
);
export const CheckIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="m4.5 12.5 5 5 10-11" /></Base>
);
export const XIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="m6 6 12 12M18 6 6 18" /></Base>
);
export const MenuIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M4 7h16M4 12h16M4 17h16" /></Base>
);
export const ChevronRightIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="m9 5 7 7-7 7" /></Base>
);
export const TruckIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M3 7h10v9H3zM13 10h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></Base>
);
export const ShieldIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6l7-3Z" /><path d="m9 12 2 2 4-4" /></Base>
);
export const SparkIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 20l-1.8-7.4L4.5 10.8 10.2 9 12 3.5Z" /></Base>
);
export const TrashIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M4 7h16M9 7V5h6v2M6.5 7l.8 12.2A1.8 1.8 0 0 0 9.1 21h5.8a1.8 1.8 0 0 0 1.8-1.8L17.5 7" /></Base>
);
export const PlusIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M12 5v14M5 12h14" /></Base>
);
export const EditIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5 4 20Z" /></Base>
);
export const UploadIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" /><path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" /></Base>
);
export const BoxIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z" /><path d="M4 7.2 12 11.5l8-4.3M12 11.5V21" /></Base>
);
export const TagIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M3.5 11.3V4.5a1 1 0 0 1 1-1h6.8a1 1 0 0 1 .7.3l8.2 8.2a1 1 0 0 1 0 1.4l-6.8 6.8a1 1 0 0 1-1.4 0L3.8 12a1 1 0 0 1-.3-.7Z" /><circle cx="8" cy="8" r="1.4" /></Base>
);
export const GridIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></Base>
);
export const LogoutIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" /><path d="M10 12h10m0 0-3-3m3 3-3 3" /></Base>
);
export const AlertIcon = (s: SVGProps<SVGSVGElement>) => (
  <Base {...s}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16h.01" /></Base>
);
