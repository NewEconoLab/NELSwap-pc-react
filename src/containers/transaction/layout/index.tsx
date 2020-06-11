/**
 * 域名交易
 */
import * as React from 'react';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';
import { History } from 'history'
// import Button from '@/components/Button';
import './index.less';
import { ICommonStore } from '@/store/interface/common.interface';
import { inject, observer } from 'mobx-react';

interface IProps
{
  route: {
    [key: string]: any
  };
  history: History,
  common:ICommonStore
}
@inject('common')
@observer
export default class TransactionLayout extends React.Component<IProps> {

  public render()
  {
    return (
      <div className="transaction-layout-container">
        <div className="trans-content">
        <div className="trans-header">
          <div className="header-box">
            <ul>
              <li>
                <Link to="/transaction/tran">
                  {
                    this.mapChildUnderline('/transaction/tran')
                      ? <span className="trans-title trans-active">交易</span>
                      : <span className="trans-title">交易</span>
                  }

                </Link>
              </li>
              <li>
                <Link to="/transaction/pool">
                  {
                    this.mapChildUnderline('/transaction/pool')
                      ? <span className="trans-title trans-active">资金池</span>
                      : <span className="trans-title">资金池</span>
                  }
                  {/* <img className="trans-icon" src={require('@/img/boughtmarket.png')} alt="" /> */}
                  {/* <span className="trans-title">求购市场</span> */}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="transaction-content-wrapper">
          {
            renderRoutes(this.props.route.children)
          }
        </div>
        </div>
      </div>
    )
  }
  // 跳转到我要出售挂单
  // private toSelltable = ()=>{
  //   // const base = this.props.common.network === 'MainNet'?'':'/test';
  //   if(!this.props.common.address)
  //   {
  //     this.props.common.login();
  //     // this.props.history.goBack();
  //     return
  //   }
  //   this.props.history.push('/selltable');
  // }
  // 二级菜单选择
  private mapChildUnderline = (path) =>
  {
    if (path instanceof Array)
    {
      for (const i in path)
      {
        if (new RegExp(path[i], 'i').test(this.props.history.location.pathname))
        {
          return true;
        }
      }
    }
    if (path === this.props.history.location.pathname)
    {
      return true;
    }
    return false;
  }
}