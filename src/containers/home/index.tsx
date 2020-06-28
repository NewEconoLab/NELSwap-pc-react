/**
 * 主页布局
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import { injectIntl } from 'react-intl';
// import Select from '@/components/select';
// import Toast from '@/components/Toast';

@observer
class Home extends React.Component<any, any> {
  public render() {
    return (
      <div className="index-page">
        home page
        {/* <Select options={[{id:'usd',name:'USD',icon:require('@/img/usd.png')},{id:'cny',name:'CNY',icon:require('@/img/cny.png')}]} text="" big={true} /> */}
      </div>
    );
  }
}

export default injectIntl(Home);
