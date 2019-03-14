import React, { PureComponent } from 'react';
import { Row, Col, Card, Icon, Form, List, Avatar } from 'antd';
import { connect } from 'dva';
import styles from './World.less';
import { getUserInfo } from '@/utils/authority';
// import PageHeaderLayout from '@/layouts';

@connect(({ loading }) => ({
  loading: loading.models.rule,
}))
@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { user: {}, version: '', buildTime: 0 };
  }

  componentWillMount() {}

  render() {
    const { version = {}, buildTime = {} } = this.state;
    const user = getUserInfo();
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>您好, {user && user.username}，祝你开心每一天！</div>
        </div>
      </div>
    );

    return (
      <>
        <Card style={{ marginBottom: 12 }}>{pageHeaderContent}</Card>
        <Card bordered={false}>
          <Row gutter={20}>
            <Card>
              <Col span={10}>
                <Row className={styles.activitiesList}>
                  <Icon type="sound" style={{ fontSize: 20, color: '#f75' }} />
                  <span style={{ fontSize: 14, color: '#4383B4', marginLeft: 5 }}>用户信息</span>
                </Row>
                <Row>
                  <div>
                    <List className={styles.activitiesList} style={{ paddingTop: 15 }} size="large">
                      当前用户：{user && user.username}
                    </List>
                  </div>
                </Row>
              </Col>
              <Col span={10}>
                <Row className={styles.activitiesList}>
                  <Icon type="info-circle" style={{ fontSize: 20, color: '#f75' }} />
                  <span style={{ fontSize: 14, color: '#4383B4', marginLeft: 5 }}>系统信息</span>
                </Row>
                <Row>
                  <div>
                    <List className={styles.activitiesList} style={{ paddingTop: 15 }}>
                      程序版本：{version}
                    </List>
                    <List className={styles.activitiesList} style={{ paddingTop: 15 }}>
                      更新时间：{buildTime}
                    </List>
                  </div>
                </Row>
              </Col>
            </Card>
          </Row>
        </Card>
      </>
    );
  }
}
