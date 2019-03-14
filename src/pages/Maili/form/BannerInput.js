import { Icon } from 'antd';
import React from 'react';
import styles from './BannerGroup.less';
import Banner from './banner';
import { Motion, spring } from 'react-motion';
//重新插入
function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

//重新排序
function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}
const rowHeight = 190;
const springConfig = { stiffness: 300, damping: 50 };
class BannerInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalPosOfLastPressed: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }
  handleTouchStart = (key, pressLocation, e) => {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  };

  handleTouchMove = e => {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  };

  handleMouseDown = (pos, pressY, { pageY }) => {
    this.setState({
      topDeltaY: pageY - pressY,
      mouseY: pressY,
      isPressed: true,
      originalPosOfLastPressed: pos,
    });
  };

  handleMouseMove = ({ pageY }) => {
    const { isPressed, topDeltaY, originalPosOfLastPressed } = this.state;
    const { value, onChange } = this.props;
    if (isPressed) {
      const mouseY = pageY - topDeltaY;
      const currentRow = clamp(Math.round(mouseY / rowHeight), 0, value.length - 1);
      let newOrder = value;

      if (currentRow !== value.indexOf(originalPosOfLastPressed)) {
        newOrder = reinsert(value, value.indexOf(originalPosOfLastPressed), currentRow);
      }
      onChange(newOrder);
      this.setState({ mouseY: mouseY });
    }
  };

  handleMouseUp = () => {
    this.setState({ isPressed: false, topDeltaY: 0 });
  };

  render() {
    const { mouseY, isPressed, originalPosOfLastPressed, order } = this.state;
    const { value = [], onChange } = this.props;
    return (
      <>
        <div className={styles.alertEscalationPolicy}>
          <div className={styles.alertEscalationRules}>
            <div>
              <div className={styles.alertEscalationPolicyLayer}>
                <div className={styles.alertEscalationPolicyCircle}>
                  <Icon style={{ fontSize: 15 }} type="exclamation" />
                </div>
                <div className={styles.alertEscalationPolicyLayerContent}>
                  <p>请添加Banner信息</p>
                </div>
              </div>
              <div className={styles.alertEscalationRulesContainer}>
                <div
                  className={styles.alertEscalationRuleList}
                  style={{ height: rowHeight * value.length }}
                >
                  {value.map((item, idx) => {
                    const style =
                      originalPosOfLastPressed === item && isPressed
                        ? {
                            scale: spring(1.1, springConfig),
                            shadow: spring(16, springConfig),
                            y: mouseY,
                          }
                        : {
                            scale: spring(1, springConfig),
                            shadow: spring(1, springConfig),
                            y: spring(idx * rowHeight, springConfig),
                          };
                    return (
                      <Motion key={idx} style={style}>
                        {({ scale, shadow, y }) => {
                          return (
                            <div
                              style={{
                                position: 'absolute',
                                // boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                                transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                                WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                              }}
                            >
                              <Banner
                                onMouseDown={this.handleMouseDown.bind(null, item, y)}
                                onTouchStart={this.handleTouchStart.bind(null, item, y)}
                                removeRule={() => {
                                  const tmp = [...value];
                                  tmp.splice(idx, 1);
                                  onChange(tmp);
                                }}
                                setRule={rule => {
                                  const tmp = [...value];
                                  tmp[idx] = rule;
                                  onChange(tmp);
                                }}
                                rule={item}
                                level={idx + 1}
                                key={idx + 1}
                              />
                            </div>
                          );
                        }}
                      </Motion>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.alertEscalationPolicyLayer}>
          <div
            onClick={() => {
              const tmp = [...value];
              tmp.push({ type: 1, tyepVal: '', pics: [] });
              onChange(tmp);
            }}
            className={styles.EscalationPpolicyLayerAdd}
          >
            <div className={styles.alertEscalationPolicyCircle}>
              <Icon style={{ fontSize: 15 }} type="plus" />
            </div>
            <div className={styles.alertEscalationPolicyLayerContent}>
              <p>添加</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default BannerInput;
