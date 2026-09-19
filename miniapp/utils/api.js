function request(path, options = {}) {
  const app = getApp();
  return new Promise((resolve, reject) => wx.request({
    url: `${app.globalData.baseUrl}${path}`,
    method: options.method || "GET",
    data: options.data,
    header: { "Content-Type": "application/json", ...(app.globalData.token ? { Authorization: `Bearer ${app.globalData.token}` } : {}) },
    success: ({ statusCode, data }) => statusCode >= 200 && statusCode < 300 ? resolve(data) : reject(new Error(data?.error || "请求失败")),
    fail: reject
  }));
}

function upload(path, filePath, formData) {
  const app = getApp();
  return new Promise((resolve, reject) => wx.uploadFile({
    url: `${app.globalData.baseUrl}${path}`, filePath, name: "image", formData,
    header: app.globalData.token ? { Authorization: `Bearer ${app.globalData.token}` } : {},
    success: ({ statusCode, data }) => {
      let parsed = {}; try { parsed = JSON.parse(data); } catch (_) {}
      statusCode >= 200 && statusCode < 300 ? resolve(parsed) : reject(new Error(parsed.error || "上传失败"));
    }, fail: reject
  }));
}

module.exports = { request, upload };
