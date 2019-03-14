import { stringify } from 'qs';
import request from '../utils/request';

// ======================================================================
// 麦丽商场banner
export async function bannerQuery(params) {
  return request(`/api/maili/banner/list?${stringify(params)}`);
}

export async function bannerRemove(params) {
  return request('/api/maili/banner/delete', { method: 'POST', body: { ...params } });
}

export async function bannerCreateOrUpdate(params) {
  return request('/api/maili/banner/createOrUpdate', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function bannerDetail(params) {
  return request(`/api/maili/banner/detail?${stringify(params)}`);
}

// ======================================================================
// 上传图片
export async function uploadPic(params) {
  return request('/api/maili/uploadPic', { method: 'POST', body: params });
}
