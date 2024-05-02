module.exports = {
  name: 'plugin-tester',
  exposes: {
    './Fields': './node_modules/@dontcode/plugin-std/dist/libs/std/esm2020/lib/fields.module.mjs',
    './Basic': './node_modules/@dontcode/plugin-std/dist/libs/std/esm2020/lib/basic.module.mjs'
  },
  shared: (name, config) => {
    return {
      "@dontcode/core": {...config,singleton: true, strictVersion: false},
      "@dontcode/plugin-common": {...config,singleton: true, strictVersion: false},
      "@dontcode/sandbox": {...config,singleton: true, strictVersion: false},
      "@dontcode/plugin-std": {...config,singleton: true, strictVersion: false},
      "broadcast-channel": {...config, requiredVersion:"0"}
    }[name];
/*    return {
      "@angular/core": {...config,singleton: true, strictVersion: true},
      "@angular/common": {...config,singleton: true, strictVersion: true},
      "@angular/common/http": {...config,singleton: true, strictVersion: true},
      "@angular/router": {...config,singleton: true, strictVersion: true},
      "@angular/forms": {...config,singleton: true, strictVersion: true},
      "@dontcode/core": {...config,singleton: true, strictVersion: false},
      "@dontcode/plugin-common": {...config,singleton: true, strictVersion: false},
      "@dontcode/sandbox": {...config,singleton: true, strictVersion: false}
    }[name];*/
  }
};
