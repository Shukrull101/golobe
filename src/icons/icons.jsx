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
