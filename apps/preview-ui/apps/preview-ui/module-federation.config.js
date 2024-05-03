module.exports = {
  name: 'preview-ui',
  remotes: [],
  shared: (name, config) => {
    return {
      '@dontcode/core': {...config, singleton: true, strictVersion: false},
      '@dontcode/plugin-common': {...config, singleton: true, strictVersion: false},
      '@dontcode/sandbox': {...config, singleton: true, strictVersion: false}
    }[name]??config;
  }
};
