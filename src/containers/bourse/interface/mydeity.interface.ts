import { RouteComponentProps } from "react-router";
import { ICommonStore } from "@/store/interface/common.interface";

export interface IMyDeityStore{
    mydeityList:IMyDeityList[],
    mydeityListCount:number,
    getMyDeityList:(addr:string,type:number,page:number,size:number)=>Promise<boolean>,
}
export interface IMyDeityProps extends RouteComponentProps{
    mydeity:IMyDeityStore,
    common:ICommonStore,
    intl:any
}
export interface IMyDeityList{
    orderid:string, // 订单号
    orderType:string, // 类型
    sellType:number, // 出售类型，0为降价，1为一口价，-1为已成交或求购状态
    fullDomain:string, // 域名
    nowPrice:string, // 资产价格
    saleRate:string, // 降价幅度
    assetName:string, // 资产名称
    isDeal:boolean // 是否成交
}