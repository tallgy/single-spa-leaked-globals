const defaultOpts = {
  globalVariableNames: []
};

export default function singleSpaLeakedGlobals(opts) {
  // opts 需要是对象
  opts = { ...defaultOpts, ...opts };
  // globalVariableNames 需要是数组，同时里面的 varName 需要是 string

  return {
    bootstrap: bootstrap.bind(null, opts),
    mount: mount.bind(null, opts),
    unmount: unmount.bind(null, opts)
  };
}

/**
 * 会将 window 的 opts.globalVariableNames 属性赋值到 opts.capturedGlobals
 * @param {*} opts 
 * @param {*} props 
 * @returns 
 */
function bootstrap(opts, props) {
  return Promise.resolve().then(() => {
    opts.capturedGlobals = {};
    opts.globalVariableNames.forEach(globalVarName => {
      opts.capturedGlobals[globalVarName] = window[globalVarName];
    });
  });
}

/**
 * 挂载的时候，会将 capturedGlobals 中属于 globalVariableNames 的值赋值给 window
 * @param {*} opts 
 * @param {*} props 
 * @returns 
 */
function mount(opts, props) {
  return Promise.resolve().then(() => {
    opts.globalVariableNames.forEach(globalVarName => {
      window[globalVarName] = opts.capturedGlobals[globalVarName];
    });
  });
}

/**
 * 卸载的时候
 * 直接删除 window 中 globalVariableNames 的属性
 * @param {*} opts 
 * @param {*} props 
 * @returns 
 */
function unmount(opts, props) {
  return Promise.resolve().then(() => {
    opts.globalVariableNames.forEach(globalVarName => {
      delete window[globalVarName];
    });
  });
}
