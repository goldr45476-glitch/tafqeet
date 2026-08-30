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

export const IconDateDiff = (props: IconProps) =>
  base(
    <>
      <rect x="3" y="4.5" width="8" height="8" rx="2" />
      <rect x="13" y="11.5" width="8" height="8" rx="2" />
      <path d="M7 4.5V2.5M17 11.5V9.5" />
      <path d="M11.5 8.5l3 3" strokeDasharray="2 2.5" />
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
