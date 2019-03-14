import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Divider,
  Input,
  Popconfirm,
  Select,
  Icon,
  Tooltip,
} from 'antd';
import { routerRedux } from 'dva/router';
import BizTable from '@/components/BizTable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { statusMap, statusList } from './const';

import styles from './Banner.less';
import CreateUpdateForm from './form/BannerForm';

const FormItem = Form.Item;
const { Option } = Select;

const createTitle = '新建';

const disPlayLink = (banners, name) => {
  banners = banners || [];
  return banners.map((item, index) => {
    return (
      <Tooltip
        key={item.pic}
        overlayStyle={{ wordBreak: 'break-all' }}
        placement="topLeft"
        title={<img alt={item.pic} style={{ width: 140, height: 140 }} src={item.pic} />}
      >
        <a style={{ marginRight: 6, display: 'block' }} target="blank" href={item.pic}>
          {`${name}${index + 1}`}
        </a>
      </Tooltip>
    );
  });
};
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ mailibanner, loading }) => ({
  mailibanner,
  loading: loading.models.mailibanner,
}))
@Form.create()
export default class Biz extends PureComponent {
  state = {
    createUpdateModalVisible: false,
    pagination: {},
    formValues: {},
    formTitle: createTitle,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mailibanner/fetch',
    });
  }

  setForm = form => {
    this.form = form;
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...formValues,
      ...filters,
      current: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.setState({ pagination });
    dispatch({
      type: 'mailibanner/fetch',
      payload: params,
    });
  };

  handleCreateUpdateModalVisible = flag => {
    this.setState({
      createUpdateModalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { formValues, pagination } = this.state;
    dispatch({
      type: 'mailibanner/add',
      payload: {
        ...fields,
      },
      callback: () => {
        dispatch({
          type: 'mailibanner/fetch',
          payload: {
            ...formValues,
            current: pagination.current ? pagination.current : 1,
            pageSize: pagination.pageSize ? pagination.pageSize : 20,
          },
        });
      },
    });
    this.setState({
      createUpdateModalVisible: false,
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues, pagination } = this.state;
    dispatch({
      type: 'mailibanner/add',
      payload: {
        ...fields,
      },
      callback: () => {
        dispatch({
          type: 'mailibanner/fetch',
          payload: {
            ...formValues,
            current: pagination.current ? pagination.current : 1,
            pageSize: pagination.pageSize ? pagination.pageSize : 20,
          },
        });
      },
    });
    this.setState({
      createUpdateModalVisible: false,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });

    dispatch({
      type: 'mailibanner/fetch',
      payload: {
        current: 1,
        pageSize: 20,
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { pagination } = this.state;
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      const param = {
        ...values,
        current: pagination.current ? pagination.current : 1,
        pageSize: pagination.pageSize ? pagination.pageSize : 20,
      };
      dispatch({ type: 'mailibanner/fetch', payload: param });
    });
  };

  delete = id => {
    const { dispatch } = this.props;
    const { formValues, pagination } = this.state;
    dispatch({
      type: 'mailibanner/remove',
      payload: { id },
      callback: () => {
        dispatch({
          type: 'mailibanner/fetch',
          payload: {
            ...formValues,
            current: pagination.current ? pagination.current : 1,
            pageSize: pagination.pageSize ? pagination.pageSize : 20,
          },
        });
      },
    });
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/maili/bannerc/create'));
  };

  update = item => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/maili/bannerc/${item.slug || 'create'}`));
  };

  renderForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select style={{ width: '100%' }} placeholder="状态">
                  {statusList.map(item => {
                    return (
                      <Option key={item[0]} value={item[0]}>
                        {item[1]}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="Slug">
              {getFieldDecorator('slug')(<Input placeholder="请输入Slug" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const {
      mailibanner: { data = {} },
      loading,
    } = this.props;
    const { createUpdateModalVisible, formTitle } = this.state;

    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: 'Banner ID',
        dataIndex: 'id',
      },
      {
        title: 'Slug',
        dataIndex: 'slug',
      },
      {
        title: '幻灯片',
        dataIndex: 'banners',
        render: item => {
          return disPlayLink(item, '查看');
        },
      },
      {
        title: '操作人',
        dataIndex: 'opname',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: val => {
          return statusMap[val] ? statusMap[val] : '未知';
        },
      },
      {
        title: '操作时间',
        dataIndex: 'updateTime',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: row => {
          if (row.status === 1) {
            return (
              <Fragment>
                <Popconfirm
                  title="确定删除吗？"
                  onConfirm={() => {
                    this.delete(row.id);
                  }}
                >
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a
                  onClick={() => {
                    this.update(row);
                  }}
                >
                  编辑
                </a>
              </Fragment>
            );
          }
          return <Icon type="close-circle" theme="outlined" />;
        },
      },
    ];

    const parentMethods = {
      resetFields: this.resetFields,
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      setForm: this.setForm,
      handleCreateUpdateModalVisible: this.handleCreateUpdateModalVisible,
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                className={styles.mr18}
                style={{ marginRight: 18 }}
                icon="plus"
                type="primary"
                onClick={() => this.add()}
              >
                {createTitle}
              </Button>
            </div>
            <BizTable
              rowKey="id"
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateUpdateForm
          formTitle={formTitle}
          {...parentMethods}
          modalVisible={createUpdateModalVisible}
        />
      </PageHeaderLayout>
    );
  }
}
