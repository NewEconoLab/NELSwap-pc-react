/**
 * 一级标题菜单
 */
import * as React from 'react';
import { Link } from 'react-router-dom';
import { History } from 'history'
import EventHandler from 'utils/event';
import zh from '@/img/zh.png';
import en from '@/img/en.png';
import store from "@/store";
import './index.less';
import { observer } from 'mobx-react';
import { IHomeStore } from '../home/interface/home.interface';
import { getQueryString } from 'utils/function'
import { ICommonStore } from '@/store/interface/common.interface';
import DownloadTeemo from '@/containers/download';
import Select from '@/components/select';
import LoginToast from '../logintoast';
import common from '@/store/common';

interface IState {
  isShowSearch: boolean,         // 是否在首页显示search功能
  inputValue: string,            // 输入框的输入
  inputPlaceHolder: string,      // 输入框的placeholder
  isNormalSearch: boolean,      // 是否正常显示header上的search
  isShowLanguage: boolean        // 是否显示语言下拉框
  languageText: string,
  languageImg: ImageData,
  isShowOther: boolean, // 是否显示其他功能设置
  isShowMenu: boolean,
  loginText: string, // 登陆显示
  expand: boolean,
}
interface IProps {
  home: IHomeStore,
  history: History,
  locale: any,
  common: ICommonStore,
  btn: any,
  input: any,
  onChangeLanguage: (lang: string) => void;
  onSearch: (flag: boolean) => void;// 是否在搜索中
}
@observer
export default class Header extends React.Component<IProps, IState>{
  public readonly state = {
    isShowSearch: false,
    isNormalSearch: false,
    inputValue: '',
    inputPlaceHolder: this.props.input.placeholder,
    isShowLanguage: false,
    languageText: store[ 'common' ].language === 'en' ? "En" : "中",
    languageImg: store[ 'common' ].language === 'en' ? en : zh,
    isShowOther: false,
    isShowMenu: false,
    loginText: 'Login',
    expand: false,
  }
  public options = [ { id: 'usd', name: 'USD', icon: require('@/img/usd.png') }, { id: 'cny', name: 'CNY', icon: require('@/img/cny.png') } ];
  // private searchRef: React.RefObject<any> = React.createRef()
  // public prop = this.props.intl.messages;
  public componentDidMount() {
    common.initExchangeInfo(this.options[ 0 ].id)
    this.setState({
      inputValue: getQueryString('keywords') || ''
    })
    if (location.pathname !== '/search') {
      this.setState({
        isNormalSearch: true
      })
    }

    this.props.history.listen(() => {
      let isNormalSearch = false;

      if (location.pathname !== '/search') {
        isNormalSearch = true
      }

      this.setState({
        isNormalSearch,
        isShowSearch: false
      })

      // this.props.home.searchAssetList = [];
    })
    EventHandler.add(this.globalClick);
  }

  // 销毁
  public componentWillUnmount() {
    EventHandler.remove(this.globalClick);
    this.setState({
      isShowLanguage: false,
      isShowOther: false
    })
  }


  // 展开
  public onExpand = (e) => {
    // 取反
    const expand = !this.state.expand;

    this.setState({
      expand: expand
    });

    e.stopPropagation();
  }

  public onSelect = (e) => {
    common.initExchangeInfo(e[ 'id' ])
  }

  public render() {
    return (
      <header className={this.headerClass()}>
        <div className="header-box">
          <div className="header-menu">
            {/* <img src={require('@/img/logo.png')} alt="logo.png" className="logo-icon" /> */}
          </div>
          <div className="header-content">
            {
              this.state.isNormalSearch && (
                <ul>
                  {/* <li className={this.mapRouterUnderline('/')}><Link to="/bourse/salemarket">首页</Link></li> */}
                  {/* <li className={this.mapRouterUnderline('/auction')}>域名竞拍</li> */}
                  <li className={this.mapRouterUnderline([ '/transaction/tran', '/transaction/pool' ])}><Link to="/transaction/tran">交易</Link></li>
                  {/* <li className={this.mapRouterUnderline([ '/myaccount/balance', '/myaccount/mydomain', '/myaccount/bind', '/myaccount/bonus', '/myaccount/setting' ])}>
                    <a href="javascript:;" onClick={this.toMyaccount}>行情</a>
                  </li> */}
                </ul>
              )
            }
          </div>
          <div className="header-right">
            <ul>
              <li>
                <div className="function" onClick={this.onExpand}>
                  <img className="function-icon" src={require('@/img/function.png')} alt="" />
                  {this.state.expand &&
                    <div className="hint-content">
                      <div className="hint-line sel" >
                        <div className="line-name">
                          显示货币
                      </div>
                        <Select options={this.options} text="" onCallback={this.onSelect} />
                      </div>
                      <div className="hint-line" >
                        <div className="line-text">
                          帮助
                      </div>
                      </div>
                      <div className="hint-wrapper">
                        <div className="arrow" />
                      </div>
                    </div>
                  }
                </div>
              </li>
              <li>
                <div className="language-toggle" id="language">
                  <label onClick={this.toggleLanguage}>
                    <div className="language-content">
                      <span className="lang-text">中</span>
                      <img src={require('@/img/zh.png')} alt="ch.png" />
                    </div>
                    <span className="middle-line" />
                    <div className="triangle-wrap">
                      <div className="triangle" />
                    </div>
                  </label>
                  {
                    this.state.isShowLanguage &&
                    <div className="nav-wrap" id="selectlang" onClick={this.toggleLanguage}>
                      <ul>
                        <li><a onClick={this.onClickChinese}>中文</a></li>
                        <li><a onClick={this.onClickEnglish}>English</a></li>
                      </ul>
                    </div>
                  }
                </div>
              </li>
              <li>
                {
                  this.props.common.address === '' ?
                    <span className="point-login" onClick={this.onGoLogin}>Login</span> :
                    <span className="logined-text">
                      <span className="yuan-box" />
                      {this.props.common.address.replace(/^(.{4})(.*)(.{4})$/, '$1...$3')}
                    </span>
                }
                {/* {this.props.common.address !== '' && <span className="logined-text"><span className="yuan-box" /> {this.props.common.address.replace(/^(.{4})(.*)(.{4})$/, '$1...$3')}</span>} */}
              </li>
            </ul>
          </div>
        </div>
        {
          this.props.common.isLoginFlag > 0 && <DownloadTeemo {...this.props} />
        }
        {
          this.props.common.loginState > 0 && <LoginToast />
        }
      </header>
    );
  }

  private globalClick = () => {
    this.setState({
      isShowLanguage: false,
      isShowOther: false,
      expand: false,
    })
  }

  // 是否显示语言
  private toggleLanguage = (e) => {
    this.setState({
      isShowLanguage: !this.state.isShowLanguage,
      isShowOther: false
    })
    e.stopPropagation();
  }

  // private getPath = (base) =>
  // {
  //   const locations = this.props.history.location;
  //   window.location.href = `${location.origin}${base || ''}${locations.pathname}${locations.search}${locations.hash}`
  // }
  // 切换英文
  private onClickEnglish = () => {
    store[ 'common' ].setLanguage('en');
    this.setState({
      languageText: "En",
      languageImg: en
    })
    sessionStorage.setItem('language', 'en');
  }
  // 切换中文
  private onClickChinese = () => {
    store[ 'common' ].setLanguage('zh');
    this.setState({
      languageText: "中",
      languageImg: zh
    })
    sessionStorage.setItem('language', 'zh');
  }
  // 登录与登出
  private onGoLogin = () => {
    this.props.common.login();
  }
  // // 登录与登出
  // public onLogout = () =>
  // {
  //   this.props.common.loginOut();
  // }

  // 跳转到我的账户
  // private toMyaccount = () => {
  //   // const base = this.props.common.network === 'MainNet'?'':'/test';
  //   if (!this.props.common.address) {
  //     this.props.common.login();
  //     // this.props.history.goBack();
  //     return
  //   }
  //   this.props.history.push('/myaccount/balance');
  // }
  // 一级菜单选择
  private mapRouterUnderline = (path) => {
    if (path instanceof Array) {
      for (const i in path) {
        if (new RegExp(path[ i ], 'i').test(this.props.history.location.pathname)) {
          return "active"
        }
      }
    }
    if (path === this.props.history.location.pathname) {
      return "active"
    }
    return '';
  }
  // 标题样式显示
  private headerClass = () => {
    if (new RegExp('/bourse', 'i').test(this.props.history.location.pathname)) {
      return "header-wrap"
    }
    if (new RegExp('/myaccount', 'i').test(this.props.history.location.pathname)) {
      return "header-wrap"
    }
    return "header-wrap header-shadow"
  }
}