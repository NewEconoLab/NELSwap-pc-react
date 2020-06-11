
import { RouteComponentProps } from "react-router";
import { ICommonStore } from "@/store/interface/common.interface";
import { ISearchStore, IAssetInfo } from "@/containers/search/interface/search.interface";


export interface ITranStore{
    getBalance:(assetid:string)=>Promise<string>
}
export interface ITranProps extends RouteComponentProps{
    search:ISearchStore,
    tran:ITranStore,
    common:ICommonStore,
    intl:any
}
export interface ITranState
{
    payAsset: IAssetInfo;
    retAsset: IAssetInfo;
    amount: string;
    receive: string;
    balance: string;
    amounterror: boolean;
    isReckonAmount: boolean;
    openTranInfo:boolean;
    change:string;
    price:string;
    receivePrice:string
    receiveToAsset:string;
    receiveerror:boolean;
}