import { RouteComponentProps } from "react-router";
import { ICommonStore } from "@/store/interface/common.interface";

export interface IAskBuyMarketStore{
    askbuyList:IAskBuyList[],
    askbuyListCount:number,
    askbuyStar:boolean, // 关注与取消关注结果
    getAskBuyList:(addr:string,page:number,size:number,orderby:string,asset:string,star:string)=>Promise<boolean>,
    setAskbuyStarDomain:(addr:string,asktype:number,orderid:string,startype:number)=>Promise<boolean>
}
export interface IAskBuyMarketProps extends RouteComponentProps{
    askbuymarket:IAskBuyMarketStore,
    common:ICommonStore
    intl:any
}
export interface IAskBuyList{
    orderid:string, // 订单号
    fullDomain:string, // 域名
    assetName:string, // 资产名称
    buyer:string, // 求购人
    price:string, // 资产价格
    isNewly:boolean, // 是否最新（3天内）
    canSell:boolean, // 是否可以出售给他
    isStar:boolean // 是否标记关注
}