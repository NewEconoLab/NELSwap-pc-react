// 存储全局变量
import { observable, action } from 'mobx';
import { en_US, zh_CN } from '@/language';
import * as Wallet from '@/utils/wallet';
import { ICommonStore } from './interface/common.interface';
import { toBigNumber, BigInteger, toBigIntger } from '@/utils/numberTool';
import { getTotals, getExchangePrice, getExchangeRate, getUinTotal, getLiquidityHash } from './api/common.api';
import { ITokenInfo } from './interface/icon.interface';
// import { ICommonStore } from './interface/common.interface';

let lang = navigator.language;
lang = lang.substr(0, 2);
class Common implements ICommonStore
{
    @observable public isLoadTeemo: boolean = false; // 检测是否有Teemo钱包
    @observable public language: string = lang;  // 当前语言
    @observable public message: any | null = null;// 当前显示内容
    // @observable public network: 'TestNet'|'MainNet' = process.env.REACT_APP_SERVER_ENV === 'DEV' ? 'TestNet':'MainNet';  // 当前网络
    @observable public network: 'TestNet'|'MainNet' = 'TestNet';  // 当前网络
    @observable public address:string = ''; // 当前地址
    @observable public isSetedAddress:boolean = false;
    @observable public isLoginFlag:number = 0;// 默认不显示,1表示未检查到teemo钱包,2为未登录钱包
    @observable public loginState: number = 0;// 登陆状态，用于显示登陆使用的 toast 0==不显示，1==正在登录，2==登录成功，3==登录失败
    @observable public exchangePrice:number=0;  // 当前汇率兑GAS的价格(USD/CNY)=>GAS
    @observable public exchangeType:'usd'|'cny'='usd';
    @observable public exchangeRate:number=0;

    // 用来变更登陆时候Toast的状态
    @action public toLoginState = (state:'close'|'succes'|'fail'|'login') => {
        if(state==='close')
        {
            this.loginState=0;
        }
        if(state==='succes')
        {
            this.loginState=2;
            setTimeout(() => {
                this.loginState=0;
            }, 2000);
        }
        if(state==='fail')
        {
            this.loginState=3;
            setTimeout(() => {
                this.loginState=0;
            }, 2000);
        }
        if(state==='login')
        {
            this.loginState=1;
        }
    }

    // 初始化语言
    @action public initLanguage = () =>
    {
        const sessionLanguage = sessionStorage.getItem('language');
        if (sessionLanguage)
        {
            this.language = sessionLanguage;
        }
        if (this.language === 'zh')
        {
            this.message = zh_CN;
            return;
        }
        this.message = en_US;
    }
    // 设置语言
    @action public setLanguage = (msg: string) =>
    {
        if (msg === 'zh')
        {
            this.message = zh_CN;
            this.language = 'zh'
        } else
        {
            this.message = en_US;
            this.language = 'en'
        }
    }
    // 获取登陆态
    @action public getSessionAddress = () =>
    {
        const addr = sessionStorage.getItem('dexLogin');
        if (addr && addr !== '' && this.isLoadTeemo)
        {
            this.address = addr;
            // this.initAccountBalance();
        }
    }

    /**
     * 初始化汇率的数据
     */
    @action public initExchangeInfo = async (type:string) =>
    {
        const price = toBigNumber((await getExchangePrice())[0].price);
        this.exchangePrice=price.value
        this.exchangeType=(type==='cny'?'cny':'usd')
        this.exchangeRate = (await getExchangeRate())[0].rate;
        
    }
    // 初始化资产
    // @action public initAccountBalance = async () =>
    // {
      // this.getContract();
      // const result: any = await Wallet.getBalance();
      // if (!result)
      // {
      //   this.balances.nnc = 0;
      //   this.balances.cgas = 0;
      //   return false
      // }
      // this.balances.nnc = result[this.address][0].amount;
      // this.balances.cgas = result[this.address][1].amount;
    //   return true
    // }
    // 登陆
    @action public login = async () =>
    {
        if (this.isLoadTeemo)
        {
            this.toLoginState('login');
            const loginFlag: any = await Wallet.getAccount();
            if (!loginFlag)
            {
                this.address = '';
                this.isLoginFlag = 2;
                this.toLoginState('fail');
                return
            }
            this.address = loginFlag.address;
            this.toLoginState('succes');
            sessionStorage.setItem('dexLogin', this.address);
            // this.initAccountBalance();
        } else
        {
            this.toLoginState('close');
            this.address = '';
            this.isLoginFlag = 1;
            this.loginState=0;
            return
        }
      // this.login.show();
    }
    // 登出
    // @action public loginOut = () =>
    // {  
    //   alert("测试：已登出")
    //   // WalletApi.LoginInfo.info = null;
    //   this.address = '';
    //   sessionStorage.removeItem('dexLogin');
    // }

    /**
     * 当input的值是确定时，计算可以换得多少output的币
     * @param inputAmount 
     * @param inputTotal 
     * @param outputTotal 
     */
    @action public GetInputPrice(inputAmount:BigInteger,inputTotal:BigInteger,outputTotal:BigInteger)
    {
        if (inputTotal.value <= 0 || outputTotal.value <= 0)
        {
            throw new Error("inputTotal or outputTotal need greater than 0");
        }
        const ratio_exchageFee = 30;
        const inputAmountWithFee = inputAmount.mul(10000 - ratio_exchageFee);
        const numerator = inputAmountWithFee.mul(outputTotal);
        const denominator = inputTotal.mul(10000).add(inputAmountWithFee);
        const price = numerator.div(denominator);
        return price;
    }

    
    /**
     * 当output的值确定时，计算可以换得多少input的币
     * @param inputAmount 
     * @param inputTotal 
     * @param outputTotal 
     */
    @action public GetOutputPrice(outputAmount:BigInteger,inputTotal:BigInteger,outputTotal:BigInteger)
    {
        if (inputTotal.value <= 0 || outputTotal.value <= 0)
        {
            throw new Error("inputTotal or outputTotal need greater than 0");
        }
        const ratio_exchageFee = 30;
        const numerator = inputTotal.mul(outputAmount).mul(10000);
        const denominator = outputTotal.sub(outputAmount).mul(10000 - ratio_exchageFee);
        const price = numerator.div(denominator).add(1);
        return price;
    }

    /**
     * 查询 asset换取token，当token数量确定。需要多少个asset
     * @param tokenAmount 
     * @param tokenTotal 
     * @param assetTotal 
     */
    @action public async GetAssetToTokenOutputAmount(tokenAmount:number,token:ITokenInfo,asset:ITokenInfo)
    {
        const totals = await getTotals(token,asset)
        const assetTotal = toBigIntger(totals[asset.hash]);
        const tokenTotal = toBigIntger(totals[token.hash]);
        const tokencount = toBigIntger(tokenAmount.toFixed(token.decimal).replace('.',''));        
        return this.GetOutputPrice(tokencount,assetTotal,tokenTotal).toFloat(asset.decimal);
    }
    
    /**
     * 查询 asset换取token,当asset的数量确定时，可以换取多少个token
     * @param assetAmount 
     * @param tokenTotal 
     * @param assetTotal 
     */
    @action public async GetAssetToTokenInputAmount(assetAmount:number,token:ITokenInfo,asset:ITokenInfo)
    {
        const totals = await getTotals(token,asset)
        const assetTotal = toBigIntger(totals[asset.hash]);
        const tokenTotal = toBigIntger(totals[token.hash]);
        const assetcount = toBigIntger(assetAmount.toFixed(asset.decimal).replace('.',''));        
        return (this.GetInputPrice(assetcount,assetTotal,tokenTotal)).toFloat(token.decimal);
    }

    /**
     * 查询 token换取asset，token数量确定。可以换取多少个asset
     * @param tokenAmount 
     * @param tokenTotal 
     * @param assetTotal 
     */
    @action public async GetTokenToAssetInputAmount(tokenAmount:number,token:ITokenInfo,asset:ITokenInfo)
    {
        const totals = await getTotals(token,asset)
        const tokenTotal = toBigIntger(totals[token.hash]);
        const assetTotal = toBigIntger(totals[asset.hash]);
        const tokencount = toBigIntger(tokenAmount.toFixed(token.decimal).replace('.',''))
        return this.GetInputPrice(tokencount,tokenTotal,assetTotal).toFloat(asset.decimal);
    }

    /**
     * 查询 token换取asset，asset数量确定。需要多少个token
     * @param assetAmount 
     * @param tokenTotal 
     * @param assetTotal 
     */
    @action public async GetTokenToAssetOutputAmount(assetAmount:number,token:ITokenInfo,asset:ITokenInfo)
    {
        const totals = await getTotals(token,asset)
        const assetTotal = toBigIntger(totals[asset.hash]);
        const tokenTotal = toBigIntger(totals[token.hash]);
        const assetcount = toBigIntger(assetAmount.toFixed(asset.decimal).replace('.',''))
        return this.GetOutputPrice(assetcount,tokenTotal,assetTotal).toFloat(token.decimal);
    }

    /**
     * 查询 token换取token，tokensold数量确定，可以购得多少tokenbought
     * @param tokenSoldAmount 卖出币种的金额
     * @param tokenBought 要买入的币种的信息
     * @param tokenSold 卖出币种的信息
     * @param asset NNC
     */
    @action public async GetTokenToTokenInputAmount(tokenSoldAmount:number,tokenBought:ITokenInfo,tokenSold:ITokenInfo,asset:ITokenInfo)
    {
        const totals = await getTotals(tokenSold,asset)
        const assetTotal = toBigIntger(totals[asset.hash]);
        const tokenTotal = toBigIntger(totals[tokenSold.hash]);
        const tokenSoldCount = toBigIntger(tokenSoldAmount.toFixed(tokenSold.decimal).replace('.',''));
        const assetExchangeTran = this.GetInputPrice(tokenSoldCount, tokenTotal, assetTotal);
        return this.GetAssetToTokenInputAmount(assetExchangeTran.toFloat(asset.decimal),tokenBought,asset);
    }

    /**
     * 查询 token换取token tokenbought数量确定，需要多少tokensold
     * @param tokenSoldAmount 
     * @param tokenBoughtHash 
     * @param tokenHash 
     * @param assetHash 
     */
    @action public async GetTokenToTokenOutputAmount(tokenBoughtAmount:number,tokenBought:ITokenInfo,tokenSold:ITokenInfo,asset:ITokenInfo)
    {
        return this.GetTokenToTokenInputAmount(tokenBoughtAmount,tokenBought,tokenSold,asset)
    }

    /**
     * 获得当前gas的价格，并计算
     * @param count cgas的数量
     */
    @action public async getCurrentPrice(count:string|number){
        try {
            // const price = (await getExchangePrice())[0].price;
            // console.log('price',price);
            
            const pricebn = toBigNumber(this.exchangePrice).mul(count);
            return pricebn.value;
        } catch (error) {
            return 0
        }
    }

    @action public async getUniTotal(asset,token){
        let contractHash = "";
        let uniTotal="";
        let myuni="";
        try {
            contractHash = (await getLiquidityHash(asset,token))[0]['contractHash']
        } catch (error) {
            throw error;
        }
        try {
            const amount = (await getUinTotal(contractHash))[0]["uniMinted"]
            uniTotal = parseFloat(amount).toFixed(2).replace('.','')
        } catch (error) {
            uniTotal="0"
        }
        try {
            const available = (await getUinTotal(contractHash,this.address))[0]["uniMinted"];
            myuni = parseFloat(available).toFixed(2).replace('.','')
        } catch (error) {
            myuni="0"
        }
        return {total:uniTotal,available:myuni}
    }
}

// 外部使用require
export default new Common();
