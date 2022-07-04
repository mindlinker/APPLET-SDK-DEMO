
// app.js
App({
  async onLaunch() {
    wx.onNetworkStatusChange(res => {
      this.globalData.networkStatus = res;
    });
  },
  logger: console,
  globalData: {
    userInfo: null,
    meetingInfo: null,
    networkStatus: {
      isConnected: true,
      networkType: 'wifi',
    },
  },
});
