import { Tooltip } from 'antd';
export const disPlayLink = (banners, name) => {
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

//getPictures 将string换成upload能识别的图片
export const getPictures = str => {
  str = str || '';
  const tmps = str.split(',');
  const pics = tmps
    .filter(item => {
      return item !== '';
    })
    .map((item, index) => {
      return {
        uid: index,
        name: item.substring(item.lastIndexOf('/') + 1),
        url: item,
        status: 'done',
      };
    });
  return pics;
};

//将图片转化为str
export const getPics = pics => {
  pics = pics || [];
  pics = pics
    .map(pic => {
      return pic.url || '';
    })
    .filter(item => {
      return item !== '';
    });
  return pics.join(',');
};

//获取value
export const getFieldValueFactory = (size = 1) => {
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

//上传图片
export const customRequestFactor = (props, sizeType) => {
  return ({ onSuccess, onError, file }) => {
    const checkInfo = _file => {
      const { dispatch } = props;
      const data = new FormData();
      data.append('file', _file);
      data.append('sizeType', sizeType);
      dispatch({ type: 'mailibanner/uploadPic', payload: data, onSuccess, onError });
    };
    checkInfo(file);
  };
};
