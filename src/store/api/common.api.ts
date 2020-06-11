import request from 'utils/request';
import { ITokenInfo } from '../interface/icon.interface';
/**
 * 获取交易所 GAS价格（USD）
 */
export const getExchangePrice =  () => {
    const opts = {
        method:'getExchangePrice',
        params:[]
    }
    return request(opts);
}
/**
 * 获取 USD-CNY 汇率
 */
export const getExchangeRate =  () => {
    const opts = {
        method:'getExchangeRate',
        params:[]
    }
    return request(opts);
}

/**
 * 获得
 * @param assethash 
 * @param tokenhash 
 */
export const getLiquidityRate=(assethash:string,tokenhash:string)=>
{
    return request({
        method:'getLiquidityRate',
        params:[assethash,tokenhash]
    })
}

/**
 * 获得asset和token的总量
 * @param assethash 
 * @param tokenhash 
 */
export const getLiquidityInfo = async(assethash:string,tokenhash:string)=>
{
    const opts = {
        method:'getLiquidityInfo',
        params:[assethash,tokenhash]
    }
    return request(opts);
}

/**
 * 获得资金池合约的hash
 * @param assethash 
 * @param tokenhash 
 */
export const getLiquidityHash = async(assethash:string,tokenhash:string)=>
{
    return request({
        method:'getLiquidityHash',
        params:[assethash,tokenhash]
    })
}

/**
 * 查询 Uni总量或者地址下的Uni数量
 * @param hash 
 * @param address 
 */
export const getUinTotal = async(hash:string,address?:string)=>
{
    return request({
        method:'getUinTotal',
        params:address?[hash,address]:[hash]
    })
}

export const getBlockHeight = async()=>
{
    return request({
        method:'getblockcount',
        params:[],
        baseUrl:'common'
    })
}

/**
 * 伪造假的资金池数据
 * @param tokenHash 
 * @param assetHash 
 */
export const getTotals=async(token:ITokenInfo,asset:ITokenInfo)=>
{
    try {        
        const result = (await getLiquidityInfo(asset.hash,token.hash))[0];
        return {[token.hash]:parseFloat(result['tokenTotal']).toFixed(),[asset.hash]:result['assetTotal']}
    } catch (error) {
        return{[token.hash]:'0',[asset.hash]:'0'}
    }
}