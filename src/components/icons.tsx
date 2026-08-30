import React from 'react';

export type IconProps = React.SVGProps<SVGSVGElement>;

const base = (children: React.ReactNode, props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const IconTafqeet = (props: IconProps) =>
  base(
    <>
      <path d="M4 7h11M4 12h7M4 17h11" />
      <path d="M17 15l2.5 2.5L22 15" />
      <path d="M19.5 17.5V6" />
    </>,
    props,
  );

export const IconFinancial = (props: IconProps) =>
  base(
    <>
      <path d="M4 19.5V4.5" />
      <path d="M4 19.5h16" />
      <path d="M8 16.5v-4M12.5 16.5V8M17 16.5v-7" />
      <circle cx="18.5" cy="6.5" r="1.6" />
    </>,
    props,
  );

export const IconDocument = (props: IconProps) =>
  base(
    <>
      <path d="M7 3.5h7l4 4V20a1 1 0 01-1 1H7a1 1 0 01-1-1V4.5a1 1 0 011-1z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12.5h6M9 15.5h6M9 9.5h2.5" />
    </>,
    props,
  );

export const IconSun = (props: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </>,
    props,
  );

export const IconMoon = (props: IconProps) =>
  base(<path d="M20 14.5A8.5 8.5 0 1110 3.2a7 7 0 0010 11.3z" />, props);

export const IconGlobe = (props: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
    </>,
    props,
  );

export const IconMenu = (props: IconProps) => base(<path d="M4 7h16M4 12h16M4 17h16" />, props);

export const IconClose = (props: IconProps) => base(<path d="M6 6l12 12M18 6L6 18" />, props);

export const IconCopy = (props: IconProps) =>
  base(
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h10" />
    </>,
    props,
  );

export const IconCheck = (props: IconProps) => base(<path d="M5 13l4 4L19 7" />, props);

export const IconPrinter = (props: IconProps) =>
  base(
    <>
      <path d="M7 8.5V4h10v4.5" />
      <rect x="4" y="8.5" width="16" height="8" rx="2" />
      <path d="M7 15.5h10V20H7z" />
    </>,
    props,
  );

export const IconArrowStart = (props: IconProps) => base(<path d="M18 12H6M11 6l-6 6 6 6" />, props);
export const IconArrowEnd = (props: IconProps) => base(<path d="M6 12h12M13 6l6 6-6 6" />, props);

export const IconSwap = (props: IconProps) =>
  base(
    <>
      <path d="M7 4l-4 4 4 4" />
      <path d="M3 8h13" />
      <path d="M17 20l4-4-4-4" />
      <path d="M21 16H8" />
    </>,
    props,
  );

export const IconTrash = (props: IconProps) =>
  base(
    <>
      <path d="M4 7h16" />
      <path d="M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" />
      <path d="M9 7V4.5a1 1 0 011-1h4a1 1 0 011 1V7" />
      <path d="M10 11v6M14 11v6" />
    </>,
    props,
  );

export const IconChevronDown = (props: IconProps) => base(<path d="M6 9l6 6 6-6" />, props);

export const IconSparkles = (props: IconProps) =>
  base(
    <>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
    </>,
    props,
  );

export const IconShield = (props: IconProps) =>
  base(<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z" />, props);

export const IconBolt = (props: IconProps) => base(<path d="M13 3L5 14h5l-1 7 8-11h-5l1-7z" />, props);

export const IconLanguages = (props: IconProps) =>
  base(
    <>
      <path d="M3 6.5h9M7.5 4v2.5M4.5 10.5a11 11 0 006-4M6 8a10 10 0 006 3.5" />
      <path d="M14 20l3.5-9L21 20M15.2 17h4.6" />
    </>,
    props,
  );

export const IconStar = (props: IconProps) =>
  base(<path d="M12 3l2.6 5.8 6.2.6-4.7 4.1 1.4 6.2L12 16.9 6.5 19.7l1.4-6.2-4.7-4.1 6.2-.6L12 3z" />, props);

export const IconInfo = (props: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 8v.01" />
    </>,
    props,
  );

export const IconMail = (props: IconProps) =>
  base(
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>,
    props,
  );

export const IconPalette = (props: IconProps) =>
  base(
    <>
      <path d="M12 3a9 9 0 100 18c1.1 0 1.8-.9 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a4 4 0 004-4c0-4.4-3.6-8.2-8-8.2z" />
      <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="8" r="1" fill="currentColor" stroke="none" />
    </>,
    props,
  );

export const IconBold = (props: IconProps) =>
  base(
    <>
      <path d="M6.5 4.5h6a3.5 3.5 0 010 7h-6z" />
      <path d="M6.5 11.5h7a3.5 3.5 0 010 7h-7z" />
    </>,
    props,
  );

export const IconItalic = (props: IconProps) =>
  base(<path d="M10 4.5h7M7 19.5h7M13.5 4.5l-3 15" />, props);

export const IconUnderline = (props: IconProps) =>
  base(
    <>
      <path d="M6 4.5v6a6 6 0 0012 0v-6" />
      <path d="M5 19.5h14" />
    </>,
    props,
  );

export const IconAlignRight = (props: IconProps) =>
  base(<path d="M4 5.5h16M10 10.5h10M4 15.5h16M10 20.5h10" />, props);

export const IconAlignCenter = (props: IconProps) =>
  base(<path d="M4 5.5h16M7 10.5h10M4 15.5h16M7 20.5h10" />, props);

export const IconAlignLeft = (props: IconProps) =>
  base(<path d="M4 5.5h16M4 10.5h10M4 15.5h16M4 20.5h10" />, props);

export const IconAlignJustify = (props: IconProps) =>
  base(<path d="M4 5.5h16M4 10.5h16M4 15.5h16M4 20.5h16" />, props);

export const IconType = (props: IconProps) =>
  base(
    <>
      <path d="M5 6.5h14M12 6.5v11" />
      <path d="M8.5 17.5h7" />
    </>,
    props,
  );

export const IconLineHeight = (props: IconProps) =>
  base(
    <>
      <path d="M4 5.5h6M4 12h6M4 18.5h6" />
      <path d="M15 3.5l3 3-3 3M18 6.5H13M15 20.5l3-3-3-3M18 17.5H13" />
    </>,
    props,
  );

export const IconDirection = (props: IconProps) =>
  base(
    <>
      <path d="M4 6.5h9M4 12h6M4 17.5h9" />
      <path d="M17 9.5l3-3-3-3M20 6.5h-6" />
    </>,
    props,
  );

export const IconBookmark = (props: IconProps) =>
  base(<path d="M6 3.5h12v17l-6-4-6 4z" />, props);

export const IconUser = (props: IconProps) =>
  base(
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </>,
    props,
  );

export const IconBuilding = (props: IconProps) =>
  base(
    <>
      <rect x="4" y="3.5" width="11" height="17" rx="1" />
      <path d="M9 8h1M9 12h1M13 8h1M13 12h1M9 16h1M13 16h1" />
      <path d="M15 9.5h5v11h-5" />
    </>,
    props,
  );

export const IconHash = (props: IconProps) =>
  base(<path d="M9 3.5L7.5 20.5M16.5 3.5L15 20.5M4 8.5h16M3.5 15.5h16" />, props);

export const IconLayoutTemplate = (props: IconProps) =>
  base(
    <>
      <rect x="3.5" y="3.5" width="17" height="6" rx="1.5" />
      <rect x="3.5" y="12.5" width="7.5" height="8" rx="1.5" />
      <rect x="13" y="12.5" width="7.5" height="8" rx="1.5" />
    </>,
    props,
  );
