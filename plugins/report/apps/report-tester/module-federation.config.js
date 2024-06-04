module.exports = {
  name: 'report-tester',
  exposes: {
    './Report': './libs/report/src/lib/report.module.ts',
  },
  shared: (name, config) => {
    return {
      '@angular/core': { ...config, singleton: true, strictVersion: true },
      '@angular/common': { ...config, singleton: true, strictVersion: true },
      '@angular/common/http': {
        ...config,
        singleton: true,
        strictVersion: true,
      },
      '@angular/router': { ...config, singleton: true, strictVersion: true },
      '@angular/forms': { ...config, singleton: true, strictVersion: true },
      '@dontcode/core': { singleton: true, strictVersion: false },
      '@dontcode/plugin-common': { singleton: true, strictVersion: false },
      '@dontcode/sandbox': { singleton: true, strictVersion: false },
      '@dontcode/plugin-std': { singleton: true, strictVersion: false }
    }[name];
  },
};
