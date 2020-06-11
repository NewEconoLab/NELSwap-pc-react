import { RouteComponentProps } from "react-router";
import { ICommonStore } from "@/store/interface/common.interface";

export interface ITxHistoryStore{
    txhistoryList:ITxHistoryList[],
    txhistoryListCount:number,
    getTxHistoryList:(addr:string,page:number,size:number,orderby:string,asset:string)=>Promise<boolean>,
}
export interface ITxHistoryProps extends RouteComponentProps{
    txhistory:ITxHistoryStore,
    common:ICommonStore,
    intl:any
}
export interface ITxHistoryList{
    orderid:string, // 订单号
    fullDomain:string, // 域名
    assetName:string, // 资产名称
    price:string, // 资产价格
}