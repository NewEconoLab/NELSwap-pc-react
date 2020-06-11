import { observable, action } from 'mobx';
import { IPoolStore } from '../interface/pool.interface';
import common from '@/store/common';
import { HASH_CONFIG } from '@/config';
import { ITokenInfo } from '@/store/interface/icon.interface';
import { getTotals, getBlockHeight } from '@/store/api/common.api';
import { toBigIntger, toBigNumber } from '@/utils/numberTool';
import { IAssetInfo } from '@/containers/search/interface/search.interface';
import tranStore from './tran.store';
import { Contract } from '@/utils/contract';

class Pool implements IPoolStore{
    @observable public uniAvailable=0;
    @observable public uniTotals=0;
    @observable public assetObtainable=0;
    @observable public cgasObtainable=0;
    @observable public tokenObtainable=0;
    @observable public removeToken={hash:'',decimal:0}
    @observable public uniAmountError=false;

    @action public clearMessage(){
        this.uniAmountError=false;
        this.assetObtainable=0;
        this.cgasObtainable=0;
        this.tokenObtainable=0;
        this.uniTotals=0;
        this.uniAvailable=0;
        this.removeToken={hash:'',decimal:0};
    }

    @action public setRemoveToken=(token:IAssetInfo)=>
    {
        this.removeToken = {hash:token.assetid,decimal:token.decimal};
        this.initUniInfo()
    }

    @action public initUniInfo=async()=>
    {
        const uniResult = await common.getUniTotal(HASH_CONFIG.ID_NNC,this.removeToken.hash);
        this.uniTotals = toBigIntger(uniResult.total).toFloat(2);
        this.uniAvailable = toBigIntger(uniResult.available).toFloat(2);
    }

    @action public getTokenAmountByUni=async(token:ITokenInfo,unicount:string|number,tocgas?)=>
    {        
        const uniResult = await common.getUniTotal(HASH_CONFIG.ID_NNC,token.hash);
        const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2}
        const result = await getTotals(token,asset);
        const nnctools = result[HASH_CONFIG.ID_NNC];
        const tokentools = result[token.hash];
        this.tokenObtainable = toBigIntger(unicount,2).mul(tokentools).div(uniResult.total).toFloat(token.decimal);
        this.assetObtainable = toBigIntger(unicount,2).mul(nnctools).div(uniResult.total).toFloat(asset.decimal);
        const cgas = {hash:HASH_CONFIG.ID_CGAS,decimal:8};
        this.cgasObtainable = await common.GetAssetToTokenInputAmount(this.assetObtainable,cgas,asset)
    }

    /**
     * 删除流动性
     */
    @action public removeLiquidity = async (uniAmount: number,tocgas?) =>
    {
        const height = (await getBlockHeight())[0]['blockcount'];
        const deadline = toBigNumber(height).add(tranStore.deadline).value;
        const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2}
        // sender: string, uniAmount: number, minTokenAmount: number, minAssetAmount: number, deadLine: number, asset: ITokenInfo, token: ITokenInfo
        const params = await Contract.removeLiquidity(common.address,uniAmount,this.tokenObtainable,this.assetObtainable,deadline,asset,this.removeToken);
        if(tocgas)
        {
            const cgas = {hash:HASH_CONFIG.ID_CGAS,decimal:8};
            const group = await Contract.assetToTokenInput(common.address,this.assetObtainable,this.cgasObtainable,common.address,deadline,cgas,asset);
            group.group.unshift(params)
            return Teemo.NEO.invokeGroup(group)
        }
        else
        {
            return Teemo.NEO.invoke(params);
        }
    }
}
export default new Pool();