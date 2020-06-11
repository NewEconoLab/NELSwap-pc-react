import * as React from 'react';
import { injectIntl } from 'react-intl';
import { observer} from 'mobx-react';
import './index.less';
import Borderbox from '@/components/Borderbox';
import classnames from 'classnames';
// import { AlertType } from '@/store/interface/common.interface';
interface IProps
{
  intl: any,
  type?: string, // alertb-wrapper为大弹窗，默认小窗口
  title: string,
  onClose?: () => void,
  imgFlag?:number// 是否添加图片
  bgtype?:string // 弹框背景颜色
  //   onConfirm: () => void
}
// @inject('home')
@observer
class Alertbox extends React.Component<IProps,any> {
  public onClose = () =>
  {
    if (this.props.onClose)
    {
      this.props.onClose();
    }
  }
  //   public onConfirm = () => {
  //     if (this.props.onConfirm) {
  //       this.props.onConfirm();      
  //     }
  //   }
  public render()
  {
    const titleClassName = classnames('alert-title',
			{
				'alert-title-img': this.props.imgFlag ? true : false
			})
    return (
      <div className="comp-alert-container">
        <div className="mask" onClick={this.onClose} />
        <div className={this.props.type ? this.props.type : 'alert-wrapper'}>
          <div className="close" onClick={this.onClose} />
          <div className="alert-img"><img src={require('@/img/icon-bonus.png')} alt=""/>
          </div>
          <Borderbox type={this.props.bgtype ? this.props.bgtype : "blue-color"}>
            <div className="alert-content">
              <div className={titleClassName}>
                <h3>{this.props.title}</h3>
              </div>
              {this.props.children}
            </div>
          </Borderbox>
        </div>
      </div>
    )
  }
}

export default injectIntl(Alertbox)