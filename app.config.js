import 'dotenv/config';

export default {
  expo: {
    name: "kiosk_homepage2",
    slug: "kiosk_homepage2",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    platforms: ["ios", "android", "web"],
    web: {
      shortName: "kiosk_homepage2",
      name: "kiosk_homepage2"
    },
    extra: {
      BACK_SERVER: process.env.BACK_SERVER
    }
  }
};
