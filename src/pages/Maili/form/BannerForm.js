import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Modal, Upload, Tooltip, Icon, Button } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
@connect(({ skinbase, loading }) => ({
  skinbase,
  loading: loading.models.skinbase,
}))
@Form.create()
export default class CreateUpdateForm extends PureComponent {
  componentDidMount() {
    const { form, setForm } = this.props;
    setForm(form);
  }
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
  getFieldValueFactory = (size = 1) => {
    return (e, _size = size) => {
      let tmpList;
      if (Array.isArray(e)) {
        tmpList = e;
      } else {
        tmpList = e && e.fileList;
      }
      tmpList = tmpList.slice(-_size);
      // 2. Read from response and show file link
      tmpList = tmpList.map(file => {
        const tmp = file;
        if (file.response) {
          // Component will show file.url as link
          tmp.url = file.response.url;
          if (tmp.url) {
            tmp.name = tmp.url.substring(tmp.url.lastIndexOf('/') + 1);
          } else {
            tmp.name = '';
          }
        }
        return tmp;
      });
      return tmpList;
    };
  };

  render() {
    const {
      formTitle,
      modalVisible,
      form,
      handleAdd,
      handleUpdate,
      handleCreateUpdateModalVisible,
    } = this.props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if (fieldsValue.id === 0) {
          handleAdd(fieldsValue);
        } else {
          handleUpdate(fieldsValue);
        }
      });
    };
    return (
      <Modal
        maskClosable={false}
        title={
          <span>
            <span style={{ fontWeight: 700, color: 'rgba(0, 0, 0, 0.647058823529412)' }}>
              {formTitle}
            </span>
          </span>
        }
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleCreateUpdateModalVisible()}
      >
        <FormItem
          style={{ display: 'none' }}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="id"
        >
          {form.getFieldDecorator('id', {})(<InputNumber placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名称:">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请填写分类名称...' }],
          })(<Input maxLength={6} placeholder="请输入分类名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="位置权重:">
          {form.getFieldDecorator('rank', {
            rules: [{ required: true, message: '请填写展示位置...' }],
          })(<InputNumber min={1} style={{ width: '100%' }} placeholder="请填写位置权重" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="皮肤封面">
          {form.getFieldDecorator('cover', {
            rules: [{ required: true, message: '请上传皮肤封面...' }],
            valuePropName: 'fileList',
            getValueFromEvent: this.getFieldValueFactory(1),
          })(
            <Upload listType="picture" customRequest={this.customRequestFactor('1')}>
              <Button style={{ marginRight: 6 }}>
                <Icon type="upload" /> 点击上传
              </Button>
              <Tooltip placement="topLeft" title="图片尺寸: 官方皮肤(339*216),其他皮肤( 357x525)">
                <Icon type="info-circle" theme="outlined" />
              </Tooltip>
            </Upload>
          )}
        </FormItem>
      </Modal>
    );
  }
}
