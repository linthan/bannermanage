import request from '@/utils/request';

export async function accountLogin(params) {
    return request('/api/user/login', {
        method: 'POST',
        body: params,
    });
}
