import React from 'react';
import { Icon, Input, Form, message, Select, Upload, Tooltip, Button } from 'antd';
import styles from './BannerGroup.less';
import { connect } from 'dva';
import { customRequestFactor } from '@/utils/pic';
// const FormItem = Form.Item;

const { Option, OptGroup } = Select;
const OPTIONS = [{ id: 1, name: '商品' }];

@connect(({ mailibanner, loading }) => ({
  mailibanner,
  loading: loading.models.mailibanner,
}))
class EscalationRule extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
    };
  }

  //获取fieldList
  getFieldValueFactory = (size = 1) => {
    const { rule, setRule } = this.props;
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
      const tmpRule = { ...rule, pics: tmpList };
      setRule(tmpRule);
    };
  };
  componentWillReceiveProps(nextProps) {}

  render() {
    const { rule, removeRule, setRule } = this.props;
    const { typeVal = '', pics = [], type = 1 } = rule;

    return (
      <div className={styles.alertEscalationRuleContainer}>
        <div className={styles.alertEscalationPolicyLayer}>
          <div
            onMouseDown={this.props.onMouseDown}
            onTouchStart={this.props.onTouchStart}
            className={styles.alertEscalationPolicyCircle}
          >
            <span style={{ fontSize: 15 }}>{this.props.level}</span>
          </div>
          <div
            className={styles.alertEscalationPolicyLayerContent}
            style={{ borderRadius: '3px 3px 0 0' }}
          >
            <Icon
              onClick={() => {
                removeRule();
              }}
              className={styles.removeEscalationRule}
              type="close"
            />

            <Upload
              fileList={pics}
              listType="picture"
              onChange={this.getFieldValueFactory(1)}
              customRequest={customRequestFactor(this.props, '1')}
            >
              <Button style={{ marginRight: 6 }}>
                <Icon type="upload" /> 点击上传
              </Button>
              <Tooltip placement="topLeft" title="图片尺寸: 官方皮肤(339*216),其他皮肤( 357x525)">
                <Icon type="info-circle" theme="outlined" />
              </Tooltip>
            </Upload>
          </div>
          <div
            // className={styles.bannerLink}
            style={{
              // height: 20,
              position: 'relative',
              background: '#fff',
              border: 'solid 1px #ddd ',
              borderTop: 'solid 0 #ddd ',
              borderRadius: '0 0 3px 3px',
              // lineHeight: '20px',
              padding: '8px',
            }}
          >
            <span style={{ display: 'inline-block', marginRight: 6 }}>跳转类型:</span>
            <Select value={type} style={{ width: 100, marginRight: 6, verticalAlign: 'middle' }}>
              {OPTIONS.map(item => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
            <span style={{ display: 'inline-block', marginRight: 6 }}>跳转值:</span>
            <Input
              value={typeVal}
              onChange={evt => {
                const tmpRule = { ...rule, typeVal: evt.target.value };
                setRule(tmpRule);
              }}
              min={0}
              style={{ width: 200, marginRight: 6, verticalAlign: 'middle' }}
            />
          </div>
        </div>
      </div>
    );
  }
}
// EscalationRule.propTypes = {
//   level: React.PropTypes.Number,
//   removeRule: React.PropTypes.func,
//   setContacts: React.PropTypes.func,
//   casOption: React.PropTypes.Array,
//   rule: React.PropTypes.Object,
// };
// EscalationRule.defaultProps = {
//   level: 0,
//   removeRule: () => {},
//   setContacts: () => {},
//   casOption: [],
//   rule: {},
// };

export default EscalationRule;
