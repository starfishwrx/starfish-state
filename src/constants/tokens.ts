export const SIMON_TOKENS = {
  colors: {
    light: {
      mainBg: '#0f172a',
      text: '#eeeeee',
      gradient: 'linear-gradient(120deg, #bd34fe, #e0321b 30%, #41d1ff 60%)',
      cardBg: 'rgba(0, 0, 0, 0.22)',
      cardHover: 'rgba(51, 51, 51, 0.38)',
      timelineDot: '#aaffcd',
      timelineBorder: 'rgba(255, 255, 255, 0.25)',
      accent: '#747bff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    dark: {
      mainBg: '#0a0a0f',
      text: '#e8e8e8',
      gradient: 'linear-gradient(120deg, #853eff, #f76cc6 30%, #ffffff 60%)',
      cardBg: 'rgb(19, 20, 24)',
      cardHover: 'rgb(30, 33, 38)',
      timelineDot: '#aaffcd',
      timelineBorder: 'rgba(255, 255, 255, 0.15)',
      accent: '#747bff',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
  },
  typography: {
    body: 'Ubuntu, sans-serif',
    display: 'Pacifico, cursive',
    welcomeSize: 'clamp(2.2rem, 8vw, 4rem)',
    titleSize: 'clamp(1.3rem, 3.5vw, 1.75rem)',
  },
  spacing: {
    pageMaxWidth: 1150,
    sidebarWidth: 230,
    cardRadius: 13,
  },
} as const;

export type SimonTheme = keyof typeof SIMON_TOKENS.colors;
