module.exports = {
  name: 'plugin-tester',
  exposes: {
    './Fields': './libs/std/src/lib/fields.module.ts',
    './Basic': './libs/std/src/lib/basic.module.ts'
  },
  shared: (name, config) => {
    return {
      "@dontcode/core": {...config,singleton: true, strictVersion: false},
      "@dontcode/plugin-common": {...config,singleton: true, strictVersion: false},
      "@dontcode/plugin-sandbox": {...config,singleton: true, strictVersion: false},
      "@dontcode/plugin-std": {...config,singleton: true, strictVersion: false},
    }[name];
  }
};
