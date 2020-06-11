import { RouteComponentProps } from "react-router";
import { ICommonStore } from "@/store/interface/common.interface";

export interface ISaleMarketStore{
    saleList:ISaleList[],
    saleListCount:number,
    resStar:boolean, // 关注与取消关注结果
    getSaleList:(addr:string,page:number,size:number,orderby:string,asset:string,star:string)=>Promise<boolean>,
    setStarDomain:(addr:string,asktype:number,orderid:string,startype:number)=>Promise<boolean>
}
export interface ISaleMarketProps extends RouteComponentProps{
    salemarket:ISaleMarketStore,
    common:ICommonStore,
    intl:any
}
export interface ISaleList{
    orderid:string, // 订单号
    fullDomain:string, // 域名
    sellType:number, // 出售类型：0表示降价出售，1表示一口价
    assetName:string, // 资产名称
    ttl:string, // 到期事件
    nowPrice:string, // 当前价格
    saleRate:string, // 降价比例
    isMine:boolean, // 是否是自己的
    isStar:boolean // 是否标记关注
}