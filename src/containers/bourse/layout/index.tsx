/**
 * 域名交易
 */
import * as React from 'react';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';
import { History } from 'history'
import Button from '@/components/Button';
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
export default class BourseLayout extends React.Component<IProps> {

  public render()
  {
    return (
      <div className="bourse-layout-container">
        <div className="trans-header">
          <div className="header-box">
            <ul>
              <li>
                <Link to="/bourse/salemarket">
                  {
                    this.mapChildUnderline('/bourse/salemarket')
                      ? <><img className="trans-icon" src={require('@/img/salemarket.png')} alt="" /><span className="trans-title trans-active">出售市场</span></>
                      : <><img className="trans-icon" src={require('@/img/salemarket-un.png')} alt="" /><span className="trans-title">出售市场</span></>
                  }

                </Link>
              </li>
              <li>
                <Link to="/bourse/askbuymarket">
                  {
                    this.mapChildUnderline('/bourse/askbuymarket')
                      ? <><img className="trans-icon" src={require('@/img/boughtmarket.png')} alt="" /><span className="trans-title trans-active">求购市场</span></>
                      : <><img className="trans-icon" src={require('@/img/boughtmarket-un.png')} alt="" /><span className="trans-title">求购市场</span></>
                  }
                  {/* <img className="trans-icon" src={require('@/img/boughtmarket.png')} alt="" /> */}
                  {/* <span className="trans-title">求购市场</span> */}
                </Link>
              </li>
              <li>
                <Link to="/bourse/txhistory">
                  {
                    this.mapChildUnderline('/bourse/txhistory')
                      ? <><img className="trans-icon" src={require('@/img/history.png')} alt="" /><span className="trans-title trans-active">成交历史</span></>
                      : <><img className="trans-icon" src={require('@/img/history-un.png')} alt="" /><span className="trans-title">成交历史</span></>
                  }
                  {/* <img className="trans-icon" src={require('@/img/history.png')} alt="" /> */}
                  {/* <span className="trans-title">成交历史</span> */}
                </Link>
              </li>
              <li>
                <Link to="/bourse/mydeity">
                  {
                    this.mapChildUnderline('/bourse/mydeity')
                      ? <><img className="trans-icon" src={require('@/img/mylist.png')} alt="" /><span className="trans-title trans-active">我的挂单</span></>
                      : <><img className="trans-icon" src={require('@/img/mylist-un.png')} alt="" /><span className="trans-title">我的挂单</span></>
                  }
                  {/* <img className="trans-icon" src={require('@/img/mylist.png')} alt="" /> */}
                  {/* <span className="trans-title">我的挂单</span> */}
                </Link>
              </li>
              <li>
                <a href="javascript:;" onClick={this.toSelltable}>
                  <Button text="我要出售" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="bourse-content-wrapper">
          {
            renderRoutes(this.props.route.children)
          }
        </div>
      </div>
    )
  }
  // 跳转到我要出售挂单
  private toSelltable = ()=>{
    // const base = this.props.common.network === 'MainNet'?'':'/test';
    if(!this.props.common.address)
    {
      this.props.common.login();
      // this.props.history.goBack();
      return
    }
    this.props.history.push('/selltable');
  }
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