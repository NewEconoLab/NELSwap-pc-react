export interface ISearchStore{
    searchInfo:ISearchInfo|null, // 搜索详情
    likeCount:number,// 相似列表总数
    likeList:ILikeList[],// 相似列表
    searchStar:boolean, // 关注与取消关注结果
    getAssets:()=>Promise<any>
    getExchange:(assetid:string)=>Promise<any>
}
export interface ISearchProps{
    onSelect:(asset:IAssetInfo)=> void,
    defaultAsset?:IAssetInfo,
    defaultAssetList?:IAssetInfo[],
    hideAssetId?:string
}
export interface ISearchSelectProps
{
    onClose:()=>void,
    onSelect:(asset:IAssetInfo)=> void,
    defaultAssetList?:IAssetInfo[],
    hideAssetId?:string
}
export interface ISearchInfo{
    orderid:string,
    assetName:string,
    fulldomain:string,
    state:string,
    price:string
}
export interface ILikeList{
    orderid:string,
    fullDomain:string,
    sellType:number,
    assetName:string,
    nowPrice:string,
    saleRate:string,
    isStar:boolean,
    isMine:boolean
}

export interface IAssetInfo
{
    assetid:string;
    name:string;
    symbole:string;
    iconurl:any;
    decimal:number;
}

export interface ISelectState
{
    assetlist:IAssetInfo[],
    searchValue:string
}