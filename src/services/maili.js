import { stringify } from 'qs';
import request from '@/utils/request';

// ======================================================================
// 麦丽banner
export async function bannerQuery(params) {
  return request(`/api/mailiaa/banner/list?${stringify(params)}`);
}

export async function bannerRemove(params) {
  return request('/api/mailiaa/banner/delete', { method: 'POST', body: { ...params } });
}

export async function bannerCreateOrUpdate(params) {
  return request('/api/mailiaa/banner/createOrUpdate', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function bannerDetail(params) {
  return request(`/api/mailiaa/banner/detail?${stringify(params)}`);
}

// ======================================================================
// 上传图片
export async function uploadPic(params) {
  return request('/api/mailiaa/uploadPic', { method: 'POST', body: params });
}
