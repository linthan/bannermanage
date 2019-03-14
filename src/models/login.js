import { accountLogin } from '@/services/api';
import { stringify } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import check from '@/utils/check';
import { setUserInfo } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { editMyPassword } from '@/services/user';
export default {
    namespace: 'login',

    state: {
        status: undefined,
    },
    effects: {
        *login({ payload }, { call, put }) {
            const response = yield call(accountLogin, payload);
            //校验返回结果是否合法
            if (check(response)) {
                yield put({
                    type: 'changeLoginStatus',
                    payload: response,
                });
                yield put(routerRedux.push('/'));
            }
        },
        *editMyPassword({ payload }, { call, put }) {
            const response = yield call(editMyPassword, payload);
            if (check(response)) {
                message.success(response.message ? response.message : '操作成功');
                yield put(routerRedux.push('/'));
            }
        },
        *logout(_, { put }) {
            localStorage.clear();
            yield put({
                type: 'changeLoginStatus',
                payload: {
                    status: false,
                    currentAuthority: 'guest',
                },
            });
            reloadAuthorized();
            yield put(
                routerRedux.push({
                    pathname: '/user/login',
                    search: stringify({
                        redirect: window.location.href,
                    }),
                })
            );
        },
    },
    reducers: {
        changeLoginStatus(state, { payload }) {
            setUserInfo(payload.data);
            return {
                ...state,
            };
        },
    },
};
