// 整体布局
import * as React from 'react';
import * as PropTypes from 'prop-types';
import Header from '@/containers/header';
import { zh_CN, en_US } from '@/language';
import store from '@/store/common';
import HomeStore from '@/containers/home/store/home.store';
import CommonStore from '@/store/common';
import ScrollToTop from '@/components/scrolltotop';
import './index.less';

export default class LayoutIndex extends React.Component<any, any> {
  public static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
      }).isRequired
    }).isRequired
  }
  public state = {
    lang: store.language === 'en' ? 'en' : 'zh', // zh为中，en为英
    isSearch: false // 是否在搜索中，默认false
  }
  // 切换语言
  public onChangeLanguage = (lang: string) =>
  {
    if (lang === "zh")
    {
      store.setLanguage('zh');
      sessionStorage.setItem('language', 'zh');
      this.setState({
        lang: 'zh'
      })
    } else
    {
      store.setLanguage('en');
      sessionStorage.setItem('language', 'en');
      this.setState({
        lang: 'en'
      })
    }
  }
  public onSearch = (flag: boolean) =>
  {
    this.setState({
      isSearch: flag
    }, () =>
    {
      console.log(!this.state.isSearch)
    })
  }
  public render()
  {
    return (
      <div className="layout-container">
        <ScrollToTop>
          <Header
            home={HomeStore}
            history={this.context.router.history}
            locale={this.state.lang === 'en' ? en_US.header : zh_CN.header}
            btn={this.state.lang === 'en' ? en_US.btn : zh_CN.btn}
            input={this.state.lang === 'en' ? en_US.input : zh_CN.input}
            onChangeLanguage={this.onChangeLanguage}
            onSearch={this.onSearch}
            common={CommonStore}
          />
          <div className="layout-main">
            {this.state.isSearch && <div className="black-wrap" />}
            {this.props.children}
          </div>
        </ScrollToTop>
      </div>
    );
  }
}
