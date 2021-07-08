module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/normal',
          permanent: true,
        },
      ]
    },
  }