export const PERSONAL_PROFILE = {
  displayName: '你的名字',
  avatarUrl: 'https://simonsun.cc/static/img/logo.png?v=1.0.8',
  location: '你的城市',
  role: '你的职位',
  headlinePrefix: "Hello I'm",
  introLine: {
    prefix: '👦',
    highlight: '你的领域',
    suffix: 'Engineer',
  },
  mottoLine: {
    prefix: '📝',
    highlightFirst: '你的关键词 1',
    middle: ',',
    highlightSecond: '你的关键词 2',
    suffix: '.',
  },
  contacts: {
    github: 'https://github.com/openai',
    email: 'support@openai.com',
    sponsorImage: 'https://api.qrserver.com/v1/create-qr-code/?size=720x720&data=https%3A%2F%2Fopenai.com',
    qqImage: 'https://api.qrserver.com/v1/create-qr-code/?size=720x720&data=https%3A%2F%2Fim.qq.com%2Findex%2F',
  },
  footer: {
    brand: '你的名字',
    siteUrl: 'https://your-site.com',
    siteLabel: "Your Home",
  },
  snakeMap: {
    Light: 'https://raw.githubusercontent.com/Tendo33/Tendo33/output/github-snake.svg',
    Dark: 'https://raw.githubusercontent.com/Tendo33/Tendo33/output/github-snake-dark.svg',
  },
} as const;
