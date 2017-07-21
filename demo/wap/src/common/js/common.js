// export const IMG_URL = "http://192.168.10.17";
// export const IMG_URL = "http://image.e-cantonfair.com";
export const LOGO_URL = "http://static.e-cantonfair.com/global/images/supplierCert/";

export const IMG_URL = String(window.location).indexOf("m.e-cantonfair.com") > -1 ? "http://image.e-cantonfair.com" : "http://192.168.10.17";

// 跳转应用中心链接
export const appLink = {
    // 987 
    android: "https://play.google.com/store/apps/details?id=com.cantonfair&referrer=utm_source=h5",
    ios: "https://itunes.apple.com/app/apple-store/id628980015?pt=1984774&ct=h5&mt=8"
};