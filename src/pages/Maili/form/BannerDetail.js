import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Modal, Upload, Tooltip, Icon, Button, Row, Col } from 'antd';
import BannerInput from './BannerInput';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { getPictures, getPics } from '@/utils/pic';

const FormItem = Form.Item;
@connect(({ skinbase, mailibanner, loading }) => ({
  skinbase,
  mailibanner,
  loading: loading.effects['mailibanner/add'],
}))
@Form.create()
export default class CreateUpdateForm extends PureComponent {
  componentDidMount() {
    const { form } = this.props;
    const slug = this.getSlug();
    if (slug === 'create') {
      form.setFieldsValue({
        id: 0,
      });
    } else {
      this.fetchDetail(slug);
    }
  }
  //获取slug
  getSlug = () => {
    const { match } = this.props;
    return (match && match.params && match.params.slug) || 'create';
  };
  //获取详情
  fetchDetail(slug) {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'mailibanner/detail',
    //   payload: {
    //     slug: slug,
    //   },
    //   callback: res => {
    //     //初始化form
    //     this.initForm(res);
    //   },
    // });
  }
  //初始化form
  initForm = res => {
    const { form } = this.props;
    const banners =
      (res.banners &&
        res.banners
          .map(item => {
            return {
              type: item.type || 1,
              typeVal: item.typeVal || '',
              pics: getPictures(item.pic),
            };
          })
          .filter(item => {
            return true;
          })) ||
      [];
    form.setFieldsValue({
      id: res.id || 0,
      name: res.name || '',
      slug: res.slug || '',
      banners,
    });
  };
  customRequestFactor = sizeType => {
    return ({ onSuccess, onError, file }) => {
      const checkInfo = _file => {
        const { dispatch } = this.props;
        const data = new FormData();
        data.append('file', _file);
        data.append('sizeType', sizeType);
        dispatch({ type: 'skinbase/uploadPic', payload: data, onSuccess, onError });
      };
      checkInfo(file);
    };
  };

  render() {
    const { dispatch, form, loading } = this.props;
    const slug = this.getSlug();
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        let param = {};
        param.id = fieldsValue.id;
        param.name = fieldsValue.name;
        param.slug = fieldsValue.slug;
        param.banners =
          (fieldsValue.banners &&
            fieldsValue.banners
              .map(item => {
                return {
                  pic: getPics(item.pics),
                  type: item.type,
                  typeVal: item.typeVal,
                };
              })
              .filter(item => {
                return true;
              })) ||
          [];
        dispatch({
          type: 'mailibanner/add',
          payload: param,
          callback: () => {
            dispatch(routerRedux.push('/maili/banner'));
          },
        });
      });
    };
    return (
      <div>
        <FormItem
          style={{ display: 'none' }}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="id"
        >
          {form.getFieldDecorator('id', {})(<InputNumber placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称:">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请填写名称...' }],
          })(<Input maxLength={6} placeholder="请输入名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Slug:">
          {form.getFieldDecorator('slug', {
            rules: [{ required: true, message: '请填写slug...' }],
          })(<Input disabled={slug !== 'create'} placeholder="请填写slug" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="banner信息">
          {form.getFieldDecorator('banners', {
            rules: [{ required: true, message: '请输入banner信息...' }],
          })(<BannerInput />)}
        </FormItem>
        <Row>
          <Col span={5} />
          <Col span={15}>
            <Button
              loading={loading}
              onClick={okHandle}
              style={{ float: 'right', marginRight: 12 }}
              type="primary"
            >
              确定
            </Button>
            <Button
              onClick={() => {
                dispatch(routerRedux.push('/maili/banner'));
              }}
              style={{ float: 'right', marginRight: 12 }}
            >
              取消
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
