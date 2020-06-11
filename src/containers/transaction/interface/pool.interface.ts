
import { RouteComponentProps } from "react-router";
import { ICommonStore } from "@/store/interface/common.interface";
import { ITokenInfo } from "@/store/interface/icon.interface";


export interface IPoolStore{
    uniAvailable:number;
    uniTotals:number;
    assetObtainable:number;
    cgasObtainable:number;
    tokenObtainable:number;
    removeToken:{hash:string,decimal:number}
    getTokenAmountByUni: (token: ITokenInfo, unicount: number|string) => Promise<void>
}
export interface ITranProps extends RouteComponentProps{
    pool:IPoolStore,
    common:ICommonStore,
    intl:any
}