export default () => ({
  region: process.env.APP_AWS_REGION || 'sa-east-1',
  storage: {
    cdnBucket: process.env.AWS_CDN_BUCKET || 'cdn.brz.gg',
  },
});
