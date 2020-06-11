import request from 'utils/request';

/**
 * 出售列表
 * @param addr 当前地址
 * @param page 当前页码
 * @param size 每页显示条数
 * @param orderby 排序方式
 * @param asset 资产类型过滤条件
 * @param star 是否关注过滤条件
 */
export const getselllist = (addr:string,page:number,size:number,orderby:string,asset:string,star:string) =>
{
  const opts = {
    method: 'getDexDomainSellList',
    params: [
      addr,
      page,
      size,
      orderby,
      asset,
      star
    ]
  }
  return request(opts);
}
/**
 * 求购列表
 * @param addr 当前地址
 * @param page 当前页码
 * @param size 每页显示条数
 * @param orderby 排序方式
 * @param asset 资产类型过滤条件
 * @param star 是否关注过滤条件
 */
export const getakybuylist = (addr:string,page:number,size:number,orderby:string,asset:string,star:string) =>
{
  const opts = {
    method: 'getDexDomainBuyList',
    params: [
      addr,
      page,
      size,
      orderby,
      asset,
      star
    ]
  }
  return request(opts);
}
/**
 * 成交列表
 * @param addr 当前地址
 * @param page 当前页码
 * @param size 每页显示条数
 * @param orderby 排序方式
 * @param asset 资产类型过滤条件
 */
export const gethistorylist = (addr:string,page:number,size:number,orderby:string,asset:string) =>
{
  const opts = {
    method: 'getDexDomainDealHistList',
    params: [
      addr,
      page,
      size,
      orderby,
      asset
    ]
  }
  return request(opts);
}
/**
 * 获取我的挂单列表
 * @param addr 当前地址
 * @param type 成交类型，0为未成交，1为已成交
 * @param page 当前页码
 * @param size 每页显示条数
 */
export const getmydeitylist = (addr:string,type:number,page:number,size:number) =>
{
  const opts = {
    method: 'getDexDomainOrder',
    params: [
      addr,
      type,
      page,
      size
    ]
  }
  return request(opts);
}
/**
 * 关注发送接口
 * @param addr 当前地址
 * @param asktype 关注类型，0表示出售类型的，1表示求购类型的
 * @param orderid 订单
 * @param type 关注状态 0为取消，1为关注
 */
export const stardomain = (addr:string,asktype:number,orderid:string,type:number) =>
{
  const opts = {
    method: 'starDexDomain',
    params: [
      addr,
      asktype,
      orderid,
      type
    ]
  }
  return request(opts);
}