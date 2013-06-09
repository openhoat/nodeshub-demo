module.exports = {
  vhosts: [
    {
      host: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? 'a.openhoat.localdomain' : 'demo1.nodeshub.com',
      port: 3000
    }
  ],
  node: '0.8.24'
};
