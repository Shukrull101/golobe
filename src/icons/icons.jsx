// Набор лёгких SVG-иконок без внешних зависимостей —
// чтобы модуль Header/Footer/Auth не тянул за собой icon-библиотеку,
// которой может не быть в общем проекте команды.

export const PlaneIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M21 15.5v-2l-8-5V5a1.5 1.5 0 0 0-3 0v3.5l-8 5v2l8-2.5V17l-2.5 1.8V20l3.5-1 3.5 1v-1.2L12 17v-4.5l9 2.5Z" fill="currentColor"/>
  </svg>
);

export const StaysIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M4 10.5V19a1 1 0 0 0 1 1h4v-4.5a3 3 0 0 1 6 0V20h4a1 1 0 0 0 1-1v-8.5M2 11l10-7 10 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronLeft = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const EyeIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

export const EyeOffIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3 3l18 18M10.6 10.7a3 3 0 0 0 4.2 4.2M6.6 6.9C4 8.5 1.5 12 1.5 12s3.5 7 10.5 7c1.9 0 3.5-.4 4.9-1.1M17.9 17.5C20.6 15.7 22.5 12 22.5 12s-1-2-3-3.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const FacebookIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.7-1.6h1.5V3.2C15.9 3.1 14.9 3 13.7 3 11.2 3 9.5 4.5 9.5 7.4v2.4H7v3.2h2.5V21h4Z" fill="currentColor"/>
  </svg>
);

export const GoogleIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...props}>
    <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z" fill="#4285F4"/>
    <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" fill="#34A853"/>
    <path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z" fill="#FBBC05"/>
    <path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 3.1 14.7 2 12 2 8 2 4.5 4.3 3.1 7.4l3.3 2.6C7.2 7.8 9.4 6 12 6Z" fill="#EA4335"/>
  </svg>
);

export const AppleIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M17.1 12.4c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2 1-.1 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.2-3.1ZM14.9 6.1c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z" fill="currentColor"/>
  </svg>
);

export const CameraIcon = (props) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M4 8.5h3l1.5-2h7L17 8.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

export const MailIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3 6.5h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11Z" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M3.5 6.8 12 13l8.5-6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const HeartIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 20.5s-8.5-5-8.5-11A4.9 4.9 0 0 1 12 6.6a4.9 4.9 0 0 1 8.5 2.9c0 6-8.5 11-8.5 11Z" fill="currentColor"/>
  </svg>
);

export const PencilIcon = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3Z" fill="currentColor"/>
  </svg>
);

export const UploadIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M7 18.5A4.5 4.5 0 0 1 6.3 9.6a6 6 0 0 1 11.5 1.2A3.9 3.9 0 0 1 17 18.5h-2.5v-4h2L12 10l-4.5 4.5h2v4H7Z" fill="currentColor"/>
  </svg>
);

export const TrashIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M9 3h6l1 2h4v2H4V5h4l1-2ZM5.5 8.5h13l-1 11.6A2 2 0 0 1 15.5 22h-7a2 2 0 0 1-2-1.9l-1-11.6Z" fill="currentColor"/>
  </svg>
);

export const PlusCircleIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const ChevronRight = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronDown = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="m5 9 7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CloseIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CalendarIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const ClockIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const DoorIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17H5Zm10-10.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM3 21h18" fill="currentColor"/>
    <path d="M3 21h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const SeatIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M7 3h6a2 2 0 0 1 2 2v7h3a2 2 0 0 1 2 2v2H9a2 2 0 0 1-2-2V3ZM8 18h11M10 18v3M17 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LogoutIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const UserIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const TwitterIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M17.8 3h3.2l-7 8 8.2 10h-6.4l-5-6.2L5 21H1.8l7.5-8.6L1.5 3H8l4.5 5.7L17.8 3Zm-1.1 16.2h1.8L7.4 4.7H5.5l11.2 14.5Z" fill="currentColor"/>
  </svg>
);

export const YoutubeIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.4-1.2.4-3.8.4-3.8s0-2.6-.4-3.8ZM10 15V9l5.2 3L10 15Z" fill="currentColor"/>
  </svg>
);

export const InstagramIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/>
  </svg>
);
