// config.js
const config = {
  bankInfo: {
    bankId: '970422',
    bankAccount: '4250126032002',
    accountName: 'TRINH MINH PHUC',
    template: 'compact2'
  },
  casso: {
    apiUrl: 'https://oauth.casso.vn/v2',
    apiKey: process.env.CASSO_API_KEY
  }
};

export default config;
