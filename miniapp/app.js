const BASE_URL = "https://caixianglab.online";

App({
  globalData: { baseUrl: BASE_URL, token: "" },
  onLaunch() {
    this.globalData.token = wx.getStorageSync("caixiang_token") || "";
    if (!this.globalData.token) this.login();
  },
  login() {
    wx.login({
      success: ({ code }) => {
        if (!code) return;
        wx.request({
          url: `${BASE_URL}/api/wechat/login`, method: "POST", data: { code },
          success: ({ statusCode, data }) => {
            if (statusCode === 200 && data.token) {
              this.globalData.token = data.token;
              wx.setStorageSync("caixiang_token", data.token);
            }
          }
        });
      }
    });
  }
});
