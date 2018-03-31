function isExternal(module) {
    var context = module.context;
  
    if (typeof context !== 'string') {
      return false;
    }
  
    return context.indexOf('node_modules') !== -1;
  }

  plugins: [
    new CommonsChunkPlugin({
      name: 'common',
      minChunks: function(module, count) {
        return !isExternal(module) && count >= 2; // adjustable
      }
    }),
    new CommonsChunkPlugin({
      name: 'vendors',
      chunks: ['common'],
      // or if you have an key value object for your entries
      // chunks: Object.keys(entry).concat('common')
      minChunks: function(module) {
        return isExternal(module);
      }
    })
  ]