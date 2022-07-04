const prefix = '_ML_';

export function storageGet(key) {
  return new Promise(resolve => {
    wx.getStorage({
      key: prefix + key,
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        console.warn('get storage fail', key, err);
        resolve(null);
      },
    });
  });
}

export function storageSet(key, value) {
  return new Promise(resolve => {
    wx.setStorage({
      key: prefix + key,
      data: value,
      success(value) {
        resolve(true);
      },
      fail(err) {
        console.warn('set storage fail', key, err);
        resolve(false);
      },
    });
  });
}

export function storageRemove(key) {
  return new Promise(resolve => {
    wx.removeStorage({
      key: prefix + key,
      complete() {
        resolve();
      },
    });
  });
}
