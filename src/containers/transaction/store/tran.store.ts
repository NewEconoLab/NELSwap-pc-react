import { observable, action } from 'mobx';
import { ITranStore } from '../interface/tran.interface';
import * as Wallet from '@/utils/wallet';
import { ITokenInfo } from '@/store/interface/icon.interface';
import { HASH_CONFIG } from '@/config';
import { Contract } from '@/utils/contract';
import common from '@/store/common';
import { getBlockHeight } from '@/store/api/common.api';
import { toBigNumber } from '@/utils/numberTool';

class Tran implements ITranStore{
    @observable public balance: string="";
    @observable public deadline:number=10;

    @action public getBalance=async(assetid:string)=>{
        if(assetid==='')
        {
            return '0';
        }
        try {
            const result = await Wallet.getBalance(assetid);
            return result[0].amount;
        } catch (error) {
            return '0'
        }
    }

    /**
     * 
     * @param amount 要兑换的金额
     * @param sold 卖出的币 即 支付币种
     * @param bought 买入的币 即 获得的币种
     */
    @action public exchangeToken=async(soldAmount:number,boughtAmount:number,sold:ITokenInfo,bought:ITokenInfo,type:string)=>
    {
        const height = (await getBlockHeight())[0]['blockcount'];
        const deadline = toBigNumber(height).add(this.deadline).value;
        console.log(deadline);
        
        if(type==="output") // output代表获得金额是确定的，支付金额不确定
        {
            if(sold.hash===HASH_CONFIG.ID_NNC)  // sold是asset
            {
                return Contract.assetToTokenOutput(common.address,boughtAmount,soldAmount,common.address,deadline,bought,sold)
            }
            else if(bought.hash===HASH_CONFIG.ID_NNC)
            {
                return Contract.tokenToAssetOutput(common.address,boughtAmount,soldAmount,common.address,deadline,sold,bought)
            }
            else
            {
                const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2};
                return Contract.tokenToTokenInput(common.address,boughtAmount,soldAmount,0,common.address,deadline,sold,bought,asset);
            }
        }
        else
        {
            if(sold.hash===HASH_CONFIG.ID_NNC)
            {
                const params = await Contract.assetToTokenInput(common.address,soldAmount,boughtAmount,common.address,deadline,bought,sold)
                return Wallet.invokeGroup(params)
            }
            else if(bought.hash===HASH_CONFIG.ID_NNC)
            {
                return Contract.tokenToAssetInput(common.address,soldAmount,boughtAmount,common.address,deadline,sold,bought)
            }
            else
            {
                const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2};
                return Contract.tokenToTokenInput(common.address,soldAmount,boughtAmount,0,common.address,deadline,bought,sold,asset);
            }
        }
    }

    /**
     * 
     */
    @action public addLiquidity=async(assetAmount: number, maxTokenAmout: number, token: ITokenInfo, asset: ITokenInfo,nnccount?:number)=>
    {
        const height = (await getBlockHeight())[0]['blockcount'];
        const deadline = toBigNumber(height).add(this.deadline).value;
        const minUniAmount=0 // 先默认给个0 之后是需要计算的
        // const sender: string
        // const assetAmount: number
        // const maxTokenAmout: number
        // const minUniAmount: number 
        // const deadLine: number 
        // const token: ITokenInfo 
        // const asset: ITokenInfo
        return Contract.addLiquidity(common.address,assetAmount,maxTokenAmout,minUniAmount,deadline,token,asset,nnccount)
    }
}
export default new Tran();