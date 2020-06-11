// tslint:disable-next-line:no-reference
/// <reference path="./inject.d.ts" />
import { HASH_CONFIG } from "@/config";
import * as Wallet from '@/utils/wallet';
import { ITokenInfo, toTokenInteger } from "@/store/interface/icon.interface";
import { getLiquidityHash } from "@/store/api/common.api";

export class Contract
{

    /**
     * 添加合约流动性
     * @param sender 交易发起者
     * @param assetAmount nnc的数量
     * @param maxTokenAmout 最大可以接受的nnd数量
     * @param minUniAmount 最小可以接受的uni数量
     * @param deadLine 最后截至交易的高度
     * @param token nnd的HASH
     * @param asset nnc的HASH
     */
    public static async addLiquidity(sender:string,assetAmount:number,maxTokenAmout:number,minUniAmount:number,deadLine:number,token:ITokenInfo,asset:ITokenInfo,nncAmount?:number)
    {
        if(asset.hash===HASH_CONFIG.ID_NNC)
        {
            const assetcount = toTokenInteger(asset,assetAmount);
            const tokencount = toTokenInteger(token,maxTokenAmout);
            const contracthash = (await getLiquidityHash(asset.hash,token.hash))[0]['contractHash'];
            const hash = (await Teemo.NEO.TOOLS.reverseHexstr(contracthash))
            const toAddr = (await Teemo.NEO.TOOLS.getAddressFromScriptHash(hash))
            const params:InvokeGroup={
                merge:true,
                group:[
                    {
                        scriptHash:HASH_CONFIG.ID_NNC,
                        operation:"transfer",
                        arguments: [
                            { type: "Address", value: sender },
                            { type: "Address", value: toAddr },
                            { type: "Integer", value: assetcount }
                        ]
                    },
                    {
                        scriptHash:HASH_CONFIG.SWAP_HASH,
                        operation:'addLiquidity',
                        arguments:[
                            { type: 'Hash160', value: token.hash },
                            { type: 'Hash160', value: asset.hash },
                            {  type: 'Array', value: [
                                { type: 'Address', value: sender },
                                { type: "Integer", value: assetcount },
                                { type: 'Integer', value: tokencount },
                                { type: 'Integer', value: minUniAmount },
                                { type: 'Integer', value: deadLine },
                            ]}
                        ],
                        sys_fee:'20',
                        fee:'0.05'
                    }
                ]
            }
            return Wallet.invokeGroup(params);
        }
        else if(asset.hash===HASH_CONFIG.ID_CGAS && nncAmount)
        {
            const nnccount = parseFloat(nncAmount.toFixed(2).replace(".",""))
            const assetcount = toTokenInteger(asset,assetAmount);
            const tokencount = toTokenInteger(token,maxTokenAmout);
            // 获得将要转账到的合约地址
            const contracthash = (await getLiquidityHash(HASH_CONFIG.ID_NNC,token.hash))[0]['contractHash'];
            const hash = (await Teemo.NEO.TOOLS.reverseHexstr(contracthash))
            const recipient = (await Teemo.NEO.TOOLS.getAddressFromScriptHash(hash))
            const params:InvokeGroup={
                merge:true,
                group:[
                    {
                        scriptHash: HASH_CONFIG.SWAP_HASH,
                        operation: "tokenToAssetInput",
                        arguments: [
                            { type: "Hash160", value: asset.hash },
                            { type: "Hash160", value: HASH_CONFIG.ID_NNC },
                            { type: "Array", value: [
                                { type: 'Address', value: sender },
                                { type: 'Integer', value: assetcount },
                                { type:'Integer',value: nnccount },
                                { type:"Address",value: recipient },
                                { type:"Integer",value: deadLine }
                            ]}
                        ],
                        sys_fee:"20",
                        fee:"0.01"
                    },
                    {
                        scriptHash:HASH_CONFIG.SWAP_HASH,
                        operation:'addLiquidity',
                        arguments:[
                            {type:'Hash160',value:token.hash},
                            {type:'Hash160',value:HASH_CONFIG.ID_NNC},
                            {type:'Array',value:[
                                {type:'Address',value:sender},
                                {type:"Integer",value:nnccount},
                                {type:'Integer',value:tokencount},
                                {type:'Integer',value:minUniAmount},
                                {type:'Integer',value:deadLine},
                            ]}
                        ]
                    }
                ]
            }
            return Wallet.invokeGroup(params);
        }
        else
        {
            throw new Error("当前 Asset 必须为 CGAS或者 NNC")
        }
    }

    // public static async addLiquidityCgas()
    // {
    // }

    /**
     * 删除流动性
     * @param sender 
     * @param uniAmount 
     * @param minTokenAmount 
     * @param minAssetAmount 
     * @param deadLine 
     * @param asset 
     * @param token 
     */
    public static async removeLiquidity(sender:string,uniAmount:number,minTokenAmount:number,minAssetAmount:number,deadLine:number,asset:ITokenInfo,token:ITokenInfo)
    {
        const uincount = toTokenInteger(asset,uniAmount);
        const tokencount = toTokenInteger(token,minTokenAmount);
        const assetcount = toTokenInteger(asset,minAssetAmount);
        const params:InvokeArgs = 
        {
            scriptHash:HASH_CONFIG.SWAP_HASH,
            operation:'removeLiquidity',
            arguments:[
                {type:'Hash160',value:token.hash},
                {type:'Hash160',value:asset.hash},
                {type:'Array',value:[
                    {type:'Address',value:sender},
                    {type:"Integer",value:uincount},
                    {type:'Integer',value:tokencount},
                    {type:'Integer',value:assetcount},
                    {type:'Integer',value:deadLine},
                ]}
            ],
            sys_fee:'20',
            fee:'0.01'
        };
        return params;
    }

    /**
     * nnc兑换nnd nnc的数量明缺
     * @param sender 
     * @param assetAmount 
     * @param minTokenAmount 
     * @param recipient 
     * @param deadline 
     * @param token 
     * @param asset 
     */
    public static async assetToTokenInput(sender:string,assetAmount:number,minTokenAmount:number,recipient:string,deadline:number,token:ITokenInfo,asset:ITokenInfo)
    {
        const amountStr = assetAmount.toFixed(asset.decimal).replace(".", "");
        const amount = parseFloat(amountStr);
        const tokenCountStr = minTokenAmount.toFixed(token.decimal).replace(".", "");
        const tokencount = parseFloat(tokenCountStr);
        const contracthash = (await getLiquidityHash(asset.hash,token.hash))[0]['contractHash'];
        const hash = (await Teemo.NEO.TOOLS.reverseHexstr(contracthash))
        const toAddr = (await Teemo.NEO.TOOLS.getAddressFromScriptHash(hash))
        
        const params: InvokeGroup = {
            merge:true,
            group:[
                {
                    scriptHash:HASH_CONFIG.ID_NNC,
                    operation:"transfer",
                    arguments: [
                        { type: "Address", value: sender },
                        { type: "Address", value: toAddr },
                        { type: "Integer", value: amount }
                    ]
                },
                {
                    scriptHash: HASH_CONFIG.SWAP_HASH,
                    operation: "assetToTokenInput",
                    arguments: [
                        { type: "Hash160", value: token.hash },
                        { type: "Hash160", value: asset.hash },
                        { type: "Array", value: [
                            { type: 'Address', value: sender},
                            { type: 'Integer', value: amount},
                            {type:'Integer',value:tokencount},
                            {type:"Address",value:recipient},
                            {type:"Integer",value:deadline}
                        ]}
                    ],
                    sys_fee:'20',
                    fee:'0.05'
                }
            ]
        }
        return params;
    }

    /**
     * nnc换nnd nnd数量明
     * @param sender 
     * @param tokenAmount 
     * @param maxAssetAmount 
     * @param recipient 
     * @param deadline 
     * @param token 
     * @param asset 
     */
    public static async assetToTokenOutput(sender:string,tokenAmount:number,maxAssetAmount:number,recipient:string,deadline:number,token:ITokenInfo,asset:ITokenInfo)
    {
        const amountStr = maxAssetAmount.toFixed(asset.decimal).replace(".", "");
        const amount = parseFloat(amountStr);
        const tokenCountStr = tokenAmount.toFixed(token.decimal).replace(".", "");
        const tokencount = parseFloat(tokenCountStr);
        const contracthash = (await getLiquidityHash(asset.hash,token.hash))[0]['contractHash'];
        const hash = (await Teemo.NEO.TOOLS.reverseHexstr(contracthash))
        const toAddr = (await Teemo.NEO.TOOLS.getAddressFromScriptHash(hash))
        const params: InvokeGroup = {
            merge:true,
            group:[
                {
                    scriptHash:HASH_CONFIG.ID_NNC,
                    operation:"transfer",
                    arguments: [
                        { type: "Address", value: sender },
                        { type: "Address", value: toAddr },
                        { type: "Integer", value: amount }
                    ],
                    sys_fee:"20",
                },
                {
                    scriptHash: HASH_CONFIG.SWAP_HASH,
                    operation: "assetToTokenOutput",
                    arguments: [
                        { type: "Hash160", value: token.hash },
                        { type: "Hash160", value: asset.hash },
                        { type: "Array", value: [
                            { type: 'Address', value: sender},
                            { type: 'Integer', value: tokencount},
                            {type:'Integer',value:amount},
                            {type:"Address",value:recipient},
                            {type:"Integer",value:deadline}
                        ]}
                    ],
                    fee:"0.05"
                }
            ]
        }
        return Wallet.invokeGroup(params);
    }

    /**
     * nnd换nnc, nnd数量明确
     * @param sender 
     * @param tokenAmount 
     * @param minAssetAmount 
     * @param recipient 
     * @param deadline 
     * @param token 
     * @param asset 
     */
    public static async tokenToAssetInput(sender:string,tokenAmount:number,minAssetAmount:number,recipient:string,deadline:number,token:ITokenInfo,asset:ITokenInfo)
    {
        const assetcount = toTokenInteger(asset,minAssetAmount);
        const tokencount = toTokenInteger(token,tokenAmount);
        const arg:InvokeArgs={
            scriptHash: HASH_CONFIG.SWAP_HASH,
            operation: "tokenToAssetInput",
            arguments: [
                { type: "Hash160", value: token.hash },
                { type: "Hash160", value: asset.hash },
                { type: "Array", value: [
                    { type: 'Address', value: sender},
                    { type: 'Integer', value: tokencount},
                    {type:'Integer',value:assetcount},
                    {type:"Address",value:recipient},
                    {type:"Integer",value:deadline}
                ]}
            ],
            sys_fee:"20",
            fee:"0.01"
        }
        return Wallet.invoke(arg);
    }

    /**
     * nnd换nnc, nnc数量明确
     * @param sender 
     * @param assetAmount 
     * @param maxTokenAmount 
     * @param recipient 
     * @param deadline 
     * @param token 
     * @param asset 
     */
    public static async tokenToAssetOutput(sender:string,assetAmount:number,maxTokenAmount:number,recipient:string,deadline:number,token:ITokenInfo,asset:ITokenInfo)
    {        
        const assetcount = toTokenInteger(asset,assetAmount);
        const tokencount = toTokenInteger(token,maxTokenAmount);
        const arg:InvokeArgs={
            scriptHash: HASH_CONFIG.SWAP_HASH,
            operation: "tokenToAssetOutput",
            arguments: [
                { type: "ByteArray", value: token.hash },
                { type: "ByteArray", value: asset.hash },
                { type: "Array", value: [
                    { type: 'Address', value: sender},
                    { type: 'Integer', value: assetcount},
                    {type:'Integer', value: tokencount},
                    {type:"Address", value: recipient},
                    {type:"Integer", value: deadline}
                ]}
            ],
            fee:'0.05',
            sys_fee:'20'
        }
        return Wallet.invoke(arg);
    }

    /**
     * nnd换cgas, nnd数量明
     * @param sender 
     * @param tokenSoldAmount 
     * @param minTokenBoughtAmount 
     * @param minAssetBought 
     * @param recipient 
     * @param deadline 
     * @param tokenBough 
     * @param token 
     * @param asset 
     */
    public static async tokenToTokenInput(sender:string,tokenSoldAmount:number,minTokenBoughtAmount:number,minAssetBought:number,recipient:string,deadline:number,tokenBough:ITokenInfo,token:ITokenInfo,asset:ITokenInfo)
    {
        const tokensoldcount = toTokenInteger(token,tokenSoldAmount);
        const tokenboughtcount = toTokenInteger(tokenBough,minTokenBoughtAmount);
        const assetboughtcount = toTokenInteger(asset,minAssetBought);
        const arg:InvokeArgs={
            scriptHash: HASH_CONFIG.SWAP_HASH,
            operation: "tokenToTokenInput",
            arguments: [
                { type: "Hash160", value: token.hash },
                { type: "Hash160", value: asset.hash },
                { type: "Array", value: [
                    { type: 'Address', value: sender},
                    { type: 'Integer', value: tokensoldcount},
                    { type: 'Integer', value: tokenboughtcount},
                    { type: 'Integer', value: assetboughtcount},
                    { type: "Address", value: recipient},
                    { type: "Integer", value: deadline},
                    { type: 'Hash160', value: tokenBough.hash}
                ]}
            ],
            sys_fee:"20",
            fee:'0.05'
        }
        return Wallet.invoke(arg);
    }

    /**
     * 获取某个交易对合约的hash
     * @param tokenHash token币种的HASH
     * @param assetHash asset币种的HASH
     */
    public static async getExchange(tokenHash:string,assetHash:string)
    {
        const param: InvokeReadInput={
            scriptHash:HASH_CONFIG.SWAP_HASH,
            operation:'getExchange',
            arguments:[
                {type:'ByteArray',value:tokenHash},
                {type:'ByteArray',value:assetHash},
                {type:'Array',value:[]}
            ]
        }
        const result = await Teemo.NEO.invokeRead(param)
        console.log('getExchange result',result);
    }

    /**
     * 获取做市商抽水比例（万分制）
     * @param tokenHash token币种的HASH
     * @param assetHash asset币种的HASH
     */
    public static async getExchangeFee(tokenHash:string,assetHash:string)
    {
        const param: InvokeReadInput={
            scriptHash:(await Teemo.NEO.TOOLS.reverseHexstr(HASH_CONFIG.SWAP_HASH)),
            operation:'getExchangeFee',
            arguments:[
                {type:'Hash160',value:tokenHash},
                {type:'Hash160',value:assetHash}
            ]
        }
        const result = await Teemo.NEO.invokeRead(param)
        console.log('getExchangeFee result',result);
    }

}