/**
 * 求购市场
 */
import * as React from 'react';
import { observer, inject } from 'mobx-react';
import './index.less';
import { injectIntl } from 'react-intl';
import Checkbox from '@/components/Checkbox';
import Page from '@/components/Page';
import Select from '@/components/select';
import Card from '@/components/card';
import { IAskBuyMarketProps, IAskBuyList } from '../interface/askbuymarket.interface';

@inject('askbuymarket','common')
@observer
class AskBuyMarket extends React.Component<IAskBuyMarketProps, any> {
  public state = {
    askbuyPage: 1,
    askbuySize: 15,
    askbuyOrderBy: 'MortgagePayments_High',// 筛选排序方式
    askbuyAsset: 'All',   // 筛选币种
    askbuyStar: 'All', // 是否只看关注
    // askbuyLoading: true, // 是否正在加载
    askbuyFistLoad: true // 是否初次加载
  }
  // 求购市场排序方式
  private askbuyOrder = [
    {
      id: 'MortgagePayments_High',
      name: '默认',
    },
    {
      id: 'LaunchTime_New',
      name: '最新上架',
    },
    {
      id: 'Price_High',
      name: '价格最高',
    },
    {
      id: 'Price_Low',
      name: '价格最低',
    },
    {
      id: 'StarCount_High',
      name: '关注数量',
    }
  ]
  // 币种
  private askbuyAssetOpt = [
    {
      id: 'All',
      name: '全部',
    },
    {
      id: 'CGAS',
      name: 'CGAS',
    },
    {
      id: 'NNC',
      name: 'NNC',
    }
  ]
  public componentWillUnmount()
  {
    this.props.askbuymarket.askbuyList = [];
    this.props.askbuymarket.askbuyListCount = 0;
  }
  public render()
  {
    return (
      <div className="buy-page">
        <div className="orderby-wrap">
          <div className="orderby-one">
            <Select defaultValue='MortgagePayments_High' options={this.askbuyOrder} text='排序' onCallback={this.onAskbuyOrderBy} />
          </div>
          <div className="orderby-two">
            <Select defaultValue='All' options={this.askbuyAssetOpt} text='筛选' onCallback={this.onAskbuyAssetSelect} />
          </div>
          <Checkbox text="只看我的关注" onClick={this.onAskbuyMyAttention} />
        </div>
        <div className="buy-table">
          <ul className="table-ul">
            <li className="table-th">
              <ul className="th-ul">
                <li className="th-li">域名</li>
                <li className="th-li">价格</li>
                <li className="th-li">关注</li>
              </ul>
            </li>
            {
              this.props.askbuymarket.askbuyListCount === 0 && <li className="table-td li-no-data">没有相关数据</li>
            }
            {
              this.props.askbuymarket.askbuyListCount > 0 && this.props.askbuymarket.askbuyList.map((item: IAskBuyList, index: number) =>
              {
                return (
                  <li className="table-td" key={index} onClick={this.onGoDomainInfo.bind(this, item)} >
                    <ul className="td-ul">
                      <li className="td-li">
                        <span>{item.fullDomain}</span>
                        {
                          item.canSell && <Card text="可出售" style={{ 'marginLeft': '15px' }} cardsize="sm-card" colortype="cs-green" />
                        }
                        {
                          item.isNewly && <Card text="新" style={{ 'marginLeft': '15px' }} cardsize="sm-card" colortype="cs-yellow" />
                        }
                      </li>
                      <li className="td-li"><span>{item.price + ' ' + item.assetName}</span></li>
                      <li className="td-li" >
                        <span className="star-icon" onClick={this.onStarClick.bind(this, item)}>
                          {item.isStar ? <img src={require('@/img/star.png')} alt="" /> : <img src={require('@/img/star-un.png')} alt="" />}
                        </span>
                      </li>
                    </ul>
                  </li>
                )
              })
            }
          </ul>
          <Page
            totalCount={this.props.askbuymarket.askbuyListCount}
            pageSize={this.state.askbuySize}
            currentPage={this.state.askbuyPage}
            onChange={this.onChangeAskbuyPage}
          />
        </div>

      </div>
    );
  }

  // 获取数据
  private getAskbuyData = () =>
  {
    this.props.askbuymarket.getAskBuyList(this.props.common.address,this.state.askbuyPage, this.state.askbuySize, this.state.askbuyOrderBy, this.state.askbuyAsset, this.state.askbuyStar)
  }
  // 排序显示
  private onAskbuyOrderBy = (item) =>
  {
    this.setState({
      askbuyPage: 1,
      askbuyOrderBy: item.id,
      // askbuyLoading: true,
    }, () =>
      {
        this.getAskbuyData();
      })
  }
  // 筛选条件待定
  private onAskbuyAssetSelect = (item) =>
  {
    this.setState({
      askbuyPage: 1,
      askbuyAsset: item.id,
      // askbuyLoading: true
    }, () =>
      {
        if (!this.state.askbuyFistLoad)
        {
          this.getAskbuyData();
        } else
        {
          this.setState({
            askbuyFistLoad: false
          })
        }
      })
  }
  // 只看关注 todo
  private onAskbuyMyAttention = (flag: boolean) =>
  {
    console.log('flag:' + flag + ',' + typeof (flag))
    const starFlag = flag ? 'Mine' : 'All';
    console.log(starFlag)
    this.setState({
      askbuyStar: starFlag
    }, () =>
      {
        this.getAskbuyData();
      })
  }
  // 翻页
  private onChangeAskbuyPage = (index: number) =>
  {
    this.setState({
      askbuyPage: index,
      // askbuyLoading: true
    }, () =>
      {
        this.getAskbuyData();
      })
  }
  // 跳转到详情页
  private onGoDomainInfo = (item:IAskBuyList) =>
  {
    this.props.history.push('/askbuyinfo/' + item.orderid + '?addr=' + item.buyer)
  }
  // 关注或取消关注
  private  onStarClick = async (item: IAskBuyList, event: any) =>
  {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    if (!this.props.common.address)
    {
      this.props.common.login();
      return
    }
    const isStar = item.isStar?0:1;
    await this.props.askbuymarket.setAskbuyStarDomain(this.props.common.address,1,item.orderid,isStar)
    if(this.props.askbuymarket.askbuyStar){
      item.isStar = !item.isStar
    }
  }
}

export default injectIntl(AskBuyMarket);
