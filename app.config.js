import 'dotenv/config';

export default {
  expo: {
    name: 'kiosk_homepage2',
    slug: 'your-app-slug',
    version: '1.0.0',
    extra: {
      BACK_SERVER: process.env.BACK_SERVER,
    },
  },
};
