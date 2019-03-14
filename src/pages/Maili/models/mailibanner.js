import { message } from 'antd';
import check from '@/utils/check';
import {
  bannerQuery,
  bannerRemove,
  bannerCreateOrUpdate,
  bannerDetail,
  uploadPic,
} from '@/services/maili';

export default {
  namespace: 'mailibanner',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // const response = yield call(bannerQuery, payload);
      // if (check(response)) {
      //   yield put({
      //     type: 'save',
      //     payload: response.data,
      //   });
      // }
    },
    *detail({ payload, callback }, { call, put }) {
      // const response = yield call(bannerDetail, payload);
      // if (check(response)) {
      //   if (callback) {
      //     callback(response.data);
      //   }
      // }
    },
    *add({ payload, callback }, { call }) {
      // const response = yield call(bannerCreateOrUpdate, payload);
      // if (check(response)) {
      //   message.success(response.msg ? response.msg : '操作成功');
      //   if (callback) callback();
      // }
    },
    *remove({ payload, callback }, { call }) {
      // const response = yield call(bannerRemove, payload);
      // if (check(response)) {
      //   message.success(response.msg ? response.msg : '删除成功');
      //   if (callback) callback();
      // }
    },
    *uploadPic({ payload, onSuccess, onError }, { call }) {
      // const response = yield call(uploadPic, payload);
      // if (check(response)) {
      //   message.success(response.msg ? response.msg : '上传成功');
      //   if (onSuccess) onSuccess(response.data);
      // } else if (onError) onError(null, response.msg);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
