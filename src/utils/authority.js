import router from 'umi/router';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function setUserInfo(userInfo) {
  return localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

export function getUserInfo() {
  const userInfo = localStorage.getItem('userInfo');
  let userInfoObj;
  if (userInfo) {
    try {
      userInfoObj = JSON.parse(userInfo);
    } catch (error) {
      // router.push('/user/login');
    }
  } else {
    // router.push('/user/login');
  }
  return userInfoObj;
}

export function getAuthToken() {
  // const state = window.g_app._store.getState();
  const userInfo = localStorage.getItem('userInfo');
  const userInfoObj = getUserInfo();
  const token = userInfoObj && userInfoObj.token;
  if (!token) {
    router.push('/user/login');
    return {};
  }
  return { 'Auth-Token': token };
}
