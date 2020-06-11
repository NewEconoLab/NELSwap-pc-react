/**
 * 我的挂单
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import { ITranProps, ITranState } from '../interface/tran.interface';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { IAssetInfo } from '@/containers/search/interface/search.interface';
import { asNumber, toBigNumber, toFixed, toBigIntger } from '@/utils/numberTool';
import tranStore from '../store/tran.store';
import SearchGroup from '@/containers/search';
import common from '@/store/common';
import { HASH_CONFIG } from '@/config';
import { getTotals } from '@/store/api/common.api';
import Toast from '@/components/Toast';

@observer
export default class Tran extends React.Component<ITranProps, ITranState> {

    public state:ITranState={
        payAsset:{
            iconurl:require('@/img/nnc.png'),
            name:'NEO Name Credit',
            assetid:'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
            symbole:'NNC',
            decimal:2
        },
        retAsset:{
            iconurl:"",
            name:'',
            assetid:'',
            symbole:'',
            decimal:0
        },
        amount:"",              // 输入的金额
        receive:"",             // 获得的金额
        balance:"",             // 余额
        amounterror:false,      // 输入金额是否有异常
        receiveerror:false,
        isReckonAmount:false,   // 是否是估算价格
        openTranInfo:false,
        change:'0',
        price:"",
        receivePrice:'',
        receiveToAsset:''
    }

    public payAssetSelect=React.createRef<SearchGroup>(); // 金额选择框的ref载体
    public retAssetSelect=React.createRef<SearchGroup>(); // 获得的选择框ref载体

    public componentDidMount()
    {
        if(!common.address)
        {
            common.login();
        }
        else
        {
            tranStore.getBalance(this.state.payAsset.assetid)
            .then(value=>{
                this.setState({
                    balance:value  
                })
            })
        }
    }

    public render()
    {
        return (
            <div className="transaction-content">
                <div className="line-title">
                  支付{this.state.isReckonAmount?'（估计）':''}
                </div>
                <div className="line-group">
                    <div className="line-content">
                      <Input
                        placeholder="金额"
                        type='text'
                        value={this.state.amount}
                        onChange={this.amountChange}
                        state={this.state.amounterror?'error':''}
                      />
                    </div>
                  <div className="line-content line-btn">
                      <SearchGroup {...this.props} onSelect={this.onPayAssetSelect} defaultAsset={this.state.payAsset} ref={this.payAssetSelect} />
                  </div>
                </div>
                <div className="line-group">
                    <div className="line-content">
                        {
                            this.state.payAsset.assetid!=='' && this.state.amount!=='' &&this.state.price ?                            
                            <div className="input-message">
                                {
                                    this.state.price!=="" && this.state.price!=='0' &&
                                    <>
                                    { 
                                        common.exchangeType==='cny'?`≈ ￥ ${toBigNumber(this.state.price).mul(common.exchangeRate).toFixed(4)}`:`≈ $ ${this.state.price}`
                                    }
                                    </>
                                }
                            </div>:
                            <div className="input-message"/>
                        }
                    </div>
                    <div className="line-btn"><div className={`amount-message ${this.state.amounterror?'error':''}`}>余额：{this.state.balance}</div></div>
                </div>
                <div className="line-icon">
                    <img src={require('@/img/transform.png')} alt="" onClick={this.exchange}/>
                </div>
                <div className="line-title">
                    获得{this.state.isReckonAmount?'':'（估计）'}
                </div>
                <div className="line-group">
                    <div className="line-content">
                        <Input
                          placeholder="金额"
                          value={this.state.receive}
                          onChange={this.receiveChange}
                          state={this.state.receiveerror?'error':''}
                          type='text'
                        />
                    </div>
                    <div className="line-btn">
                        <SearchGroup {...this.props} onSelect={this.onRetAssetSelect} ref={this.retAssetSelect} />
                    </div>
                </div>
                <div className="line-group">
                    <div className="line-content">
                        <div className="input-message">
                        {
                            !this.state.receiveerror && this.state.receiveToAsset &&
                            <>
                            {
                                this.state.receiveToAsset!==""?`比率：1${this.state.retAsset.symbole} = ${this.state.receiveToAsset} ${this.state.payAsset.symbole}`:""
                            }
                            {
                                this.state.receivePrice && 
                                <>
                                {
                                    common.exchangeType==='cny'?` (￥ ${toBigNumber(this.state.receivePrice).mul(common.exchangeRate).toFixed(4)})`:` ($ ${toBigNumber(this.state.receivePrice).toFixed(4)})`
                                }
                                </>
                            }
                            </>
                        }
                        </div>
                    </div>
                    <div className="line-btn">
                        {/* <div className="amount-message">余额：30000</div> */}
                    </div>
                </div>
                {
                    this.state.receiveerror?
                    <div className="line-title line-info" > 流动性不足 </div>:
                    <>
                    <div className="line-title line-info" onClick={this.viewTranInfo}> {this.state.amounterror?'余额不足':'交易详情'} <span className={this.state.openTranInfo?'reverse':'triangle'}/></div>
                    {this.state.openTranInfo&&
                    <>                    
                        <div className="info-message">
                        {this.state.isReckonAmount ?
                        <>
                            你将获得 <span className="message-number">{this.state.receive} {this.state.retAsset.symbole}</span> <br/>
                            最多会支付 <span className="message-number">{toBigNumber(this.state.amount).mul(1.02).toFixed(this.state.payAsset.assetid===HASH_CONFIG.ID_NNC?2:4)} {this.state.payAsset.symbole}</span>，否则交易失败<br/>
                            交易将导致价格波动 <span className="message-number">{this.state.change}%</span>
                        </>:
                        <>
                            你将支付 <span className="message-number">{this.state.amount} {this.state.payAsset.symbole}</span> <br/>
                            至少会获得 <span className="message-number">{toBigNumber(this.state.receive).mul(0.98).toFixed(this.state.retAsset.assetid===HASH_CONFIG.ID_NNC?2:4)} {this.state.retAsset.symbole}</span>，否则交易失败<br/>
                            交易将导致价格波动 <span className="message-number">{this.state.change}%</span>
                        </>
                        }
                        </div>
                    </>
                    }
                    </>
                }
                <div className="confrim">          
                {this.state.payAsset.assetid!=='' && this.state.retAsset.assetid!=="" && this.state.amount!=='' && this.state.receive!=='' && !this.state.amounterror && !this.state.receiveerror ?
                    <Button text='交易' btnSize='bg-btn' onClick={this.transfer} />  :                    
                    <Button text='交易' btnSize='bg-btn' btnColor="gray-btn" />
                }
                </div>
            </div>
        );
    }
    
    /**
     * 计算各个状态和钱
     */
    public estimate=async()=>{
        
        if(this.state.payAsset.assetid!=="")
        {
            const balance = await tranStore.getBalance(this.state.payAsset.assetid)
            this.setState({balance});
            if(this.state.isReckonAmount && this.state.receive && this.state.payAsset.assetid!=='') // 判断是否是计算支付金额 获得金额输入不得为空
            {
                if(this.state.payAsset.assetid===HASH_CONFIG.ID_NNC.toString() && this.state.retAsset.assetid!=='') // 判断支付金额选择的是否是nnc(asset)
                {
                    // 查询 asset换取token，当token数量确定。需要多少个asset
                    const token = {hash:this.state.retAsset.assetid,decimal:this.state.retAsset.decimal}
                    const asset = {hash:this.state.payAsset.assetid,decimal:this.state.payAsset.decimal}
                    const value = await common.GetAssetToTokenOutputAmount(parseFloat(this.state.receive),token,asset)
                    const amount = value>0?toFixed(value,2):0;
                    const amounterror = amount>parseFloat(balance);
                    this.setState({
                        amount:amount.toString(),
                        amounterror
                    })
                }
                else if(this.state.retAsset.assetid===HASH_CONFIG.ID_NNC.toString() && this.state.payAsset.assetid!=='')
                {
                    const token = {hash:this.state.payAsset.assetid,decimal:this.state.payAsset.decimal}
                    const asset = {hash:this.state.retAsset.assetid,decimal:this.state.retAsset.decimal}
                    const value = await common.GetTokenToAssetOutputAmount(parseFloat(this.state.receive),token,asset)     
                    const amount = value>0?toFixed(value,4):0;
                    const amounterror = amount>parseFloat(balance);
                    this.setState({
                        amount:amount.toString(),
                        amounterror
                    })
                }
                else if( this.state.payAsset.assetid!=='' && this.state.retAsset.assetid!=='')
                {
                    const tokenSold = {hash:this.state.payAsset.assetid,decimal:this.state.payAsset.decimal}
                    const tokenBought = {hash:this.state.retAsset.assetid,decimal:this.state.retAsset.decimal}
                    const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2}
                    const value = await common.GetTokenToTokenInputAmount(parseFloat(this.state.receive),tokenSold,tokenBought,asset);
                    const amount = value>0?toFixed(value,4):0;
                    const amounterror = amount>parseFloat(balance);
                    this.setState({
                        amount:amount.toString(),
                        amounterror
                    })
                }
            }
            else if(!this.state.isReckonAmount &&this.state.amount && this.state.retAsset.assetid!=='') // 推算获得的资金 支付资金不为空
            {
                const amounterror = parseFloat(this.state.amount)>parseFloat(balance); 
                if(this.state.retAsset.assetid===HASH_CONFIG.ID_NNC) // 获得资金是nnc的情况下 （获得的代币是asset）
                {
                    const token = {hash:this.state.payAsset.assetid,decimal:this.state.payAsset.decimal}
                    const asset = {hash:this.state.retAsset.assetid,decimal:this.state.retAsset.decimal}
                    // 查询 token换取asset，token数量确定。可以换取多少个asset
                    const value = await common.GetTokenToAssetInputAmount(parseFloat(this.state.amount),token,asset)
                    this.setState({
                        receive:toFixed(value,2).toString(),
                        amounterror
                    })
                }
                else if(this.state.payAsset.assetid===HASH_CONFIG.ID_NNC.toString()) // 支付资金是nnc的情况下 （获得的代币是asset）
                {
                    const token = {hash:this.state.retAsset.assetid,decimal:this.state.retAsset.decimal}
                    const asset = {hash:this.state.payAsset.assetid,decimal:this.state.payAsset.decimal}
                    // 查询 asset换取token，当token数量确定。需要多少个asset
                    const value = await common.GetAssetToTokenInputAmount(parseFloat(this.state.amount),token,asset)
                    this.setState({
                        receive:toFixed(value,4).toString(),
                        amounterror
                    })
                }
                else
                {
                    const tokenSold = {hash:this.state.payAsset.assetid,decimal:this.state.payAsset.decimal}
                    const tokenBought = {hash:this.state.retAsset.assetid,decimal:this.state.retAsset.decimal}
                    const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2}
                    const value = await common.GetTokenToTokenOutputAmount(parseFloat(this.state.amount),tokenBought,tokenSold,asset)
                    this.setState({
                        receive:toFixed(value,4).toString(),
                        amounterror
                    })
                }
            }
        }
        else
        {
            this.setState({balance:'0'});
        }
        this.getPrice();
        this.getChange();
    }

    public transfer = async()=>
    {
        const sold = {hash:this.state.payAsset.assetid,decimal:this.state.payAsset.decimal}
        const bought = {hash:this.state.retAsset.assetid,decimal:this.state.retAsset.decimal}
        try 
        {
            let amount = toBigNumber(this.state.amount);
            let receive = toBigNumber(this.state.receive);
            if(this.state.isReckonAmount)
            {
                amount = amount.mul(1.02);
                if(amount.compareTo(this.state.balance)>0)
                {
                    amount = toBigNumber(this.state.balance)
                }
            }
            else
            {
                receive = receive.mul(0.98);
            }
            const result = await tranStore.exchangeToken(amount.value,receive.value,sold,bought,this.state.isReckonAmount?'output':'input');
            if(result)
            {
                Toast("发送成功","success");
            }
        }
        catch (error)
        {
            if(error)
            {
                Toast("发送失败","error");
            }
        }
        
    }

    public getChange= async()=>
    {
        const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2}
        if(this.state.payAsset.assetid===HASH_CONFIG.ID_NNC && this.state.amount!=='' && this.state.receive!=='')
        {
            const token = {hash:this.state.retAsset.assetid,decimal:this.state.retAsset.decimal}
            const result = await getTotals(token,asset);
            const toolamount = toBigNumber(result[this.state.payAsset.assetid]);
            const toolreceive = toBigNumber(result[this.state.retAsset.assetid]);
            const bigAmount = toBigNumber(this.state.amount).mul(Math.pow(10,this.state.payAsset.decimal));
            const bigReceive = toBigNumber(this.state.receive).mul(Math.pow(10,this.state.retAsset.decimal));
            const raite = bigAmount.add(toolamount).div(toolreceive.sub(bigReceive)).div(toolamount.div(toolreceive)).sub(1).toFixed(2);            
            const receiveToAsset = toBigNumber(this.state.amount).div(this.state.receive).toFixed(4).toString();
            const receiveerror = toBigIntger(parseFloat(this.state.receive),this.state.retAsset.decimal).value>toolreceive.value;
            this.setState({
                change:raite.toString(),
                receiveToAsset,
                receiveerror
            })
        }
        else if(this.state.retAsset.assetid===HASH_CONFIG.ID_NNC && this.state.amount!=='' && this.state.receive!=='')
        {
            const token = {hash:this.state.payAsset.assetid,decimal:this.state.payAsset.decimal}
            const result = await getTotals(token,asset);
            const toolamount = toBigNumber(result[this.state.payAsset.assetid]);
            const toolreceive = toBigNumber(result[this.state.retAsset.assetid]);
            const bigAmount = toBigNumber(this.state.amount).mul(Math.pow(10,this.state.payAsset.decimal));
            const bigReceive = toBigNumber(this.state.receive).mul(Math.pow(10,this.state.retAsset.decimal));
            const raite = bigAmount.add(toolamount).div(toolreceive.sub(bigReceive)).div(toolamount.div(toolreceive)).sub(1).toFixed(2);
            const receiveToAsset = toBigNumber(this.state.amount).div(this.state.receive).toFixed(4).toString()
            const receiveerror = toBigIntger(parseFloat(this.state.receive),this.state.retAsset.decimal).value>toolreceive.value;
            this.setState({
                change:raite.toString(),
                receiveToAsset,
                receiveerror
            })
        }
        else if(this.state.retAsset.assetid !== '' && this.state.payAsset.assetid!=="" && this.state.amount!=="" && this.state.receive!=="")
        {
            const sold = {hash:this.state.payAsset.assetid,decimal:this.state.payAsset.decimal}
            const bought = {hash:this.state.retAsset.assetid,decimal:this.state.retAsset.decimal};
            const boughtTotals = toBigNumber((await getTotals(bought,asset))[bought.hash]);
            const soldTotals = toBigNumber((await getTotals(sold,asset))[sold.hash]);
            const bigIntSold = toBigNumber(this.state.amount).mul(Math.pow(10,this.state.payAsset.decimal));
            const bigIntBouht = toBigNumber(this.state.receive).mul(Math.pow(10,this.state.retAsset.decimal));
            const raite = bigIntSold.add(soldTotals).div(boughtTotals.sub(bigIntBouht)).div(soldTotals.div(boughtTotals)).sub(1).toFixed(2);
            const receiveToAsset = toBigNumber(this.state.amount).div(this.state.receive).toFixed(4).toString()
            const receiveerror =  toBigIntger(parseFloat(this.state.receive),this.state.retAsset.decimal).value>boughtTotals.value;
            this.setState({
                change:raite.toString(),
                receiveToAsset,
                receiveerror
            })
        }
    }


    /**
     * 
     */
    public getPrice = async()=>
    {
        if(this.state.payAsset.assetid===HASH_CONFIG.ID_CGAS && this.state.amount!=="")
        {
            const price = toBigNumber(common.exchangePrice).mul(this.state.amount).toString();
            this.setState({price})
        }
        else if(this.state.payAsset.assetid===HASH_CONFIG.ID_NNC && this.state.amount!=="")
        {
            const token = {hash:HASH_CONFIG.ID_CGAS,decimal:8}
            const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2}
            const value = await common.GetAssetToTokenInputAmount(parseFloat(this.state.amount),token,asset)
            const price = toBigNumber(common.exchangePrice).mul(value).toString();
            this.setState({price})
        }
        else if(this.state.payAsset.assetid!==''&& this.state.amount!=='')
        {
            const token = {hash:this.state.payAsset.assetid,decimal:this.state.payAsset.decimal}
            const cgas = {hash:HASH_CONFIG.ID_CGAS,decimal:8};
            const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2}
            const value = await common.GetTokenToTokenInputAmount(parseFloat(this.state.amount),cgas,token,asset);
            const price = toBigNumber(common.exchangePrice).mul(value).toString();
            this.setState({price})
        }

        if(this.state.retAsset.assetid===HASH_CONFIG.ID_CGAS && this.state.receive!=="")
        {            
            const receivePrice = (await common.getCurrentPrice(1)).toString();
            this.setState({receivePrice})
        }
        else if(this.state.retAsset.assetid===HASH_CONFIG.ID_NNC && this.state.receive!=="")
        {
            const token = {hash:HASH_CONFIG.ID_CGAS,decimal:8};
            const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2};
            const cgascount = await common.GetAssetToTokenInputAmount(parseFloat(this.state.receive),token,asset)
            const receivePrice = (await common.getCurrentPrice(toBigNumber(cgascount).div(this.state.receive).toFixed(8))).toString();
            this.setState({receivePrice})
        }
        else if(this.state.retAsset.assetid!=="" && this.state.receive!=="")
        {
            const token = {hash:HASH_CONFIG.ID_CGAS,decimal:8};
            const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2};
            const tokensold = {hash:this.state.retAsset.assetid,decimal:this.state.retAsset.decimal}
            const cgascount = await common.GetTokenToTokenInputAmount(parseFloat(this.state.receive),token,tokensold,asset)
            const receivePrice = (await common.getCurrentPrice(toBigNumber(cgascount).div(this.state.receive).toFixed(8))).toString();
            this.setState({receivePrice})
        }
    }

    /**
     * 交易信息显示
     */
    public viewTranInfo=()=>
    {
        this.setState({openTranInfo:!this.state.openTranInfo})
    }

    /**
     * 金额更改
     */
    public amountChange = (event:string) =>
    {
        if(event==="")
        {
            this.setState({amount:'',isReckonAmount:false,receive:'',change:'0',receiveToAsset:'',amounterror:false,receiveerror:false});
        }
        else if(event==="0")
        {
            this.setState({amount:'0',isReckonAmount:false,receive:'',change:'0',receiveToAsset:'',amounterror:false,receiveerror:false});
        }
        else
        {
            let amount;
            if(this.state.payAsset.assetid===HASH_CONFIG.ID_NNC.toString())
            {
                amount = asNumber(event,2);
            }
            else
            {
                amount = asNumber(event,4);
            }
            this.setState({amount,isReckonAmount:false},
                ()=>{ 
                    if(parseFloat(asNumber(event))>0)
                    {
                        this.estimate();
                    }
                }
            );
        }
    }

    /**
     * 获得更改
     */
    public receiveChange = (event:string)=>
    {
        if(event==="")
        {
            this.setState({amount:'',isReckonAmount:true,receive:'',change:'0',receiveToAsset:'',amounterror:false,receiveerror:false});
        }
        else if(event==="0")
        {
            this.setState({amount:'',isReckonAmount:true,receive:'0',change:'0',receiveToAsset:'',amounterror:false,receiveerror:false});
        }
        else
        {
            const receive = asNumber(event);
            this.setState({receive,isReckonAmount:true},
                ()=>{
                    if(parseFloat(asNumber(event))>0)
                    {
                        this.estimate();
                    }
                }
            );
        }
    }

    /**
     * 选择金额的资产框返回资产信息
     */
    public onPayAssetSelect=(asset:IAssetInfo)=>
    {
        let retasset = this.state.retAsset;
        if(asset.assetid===this.state.retAsset.assetid && this.retAssetSelect.current)
        {
            this.retAssetSelect.current.onSelect(this.state.payAsset);
            retasset = this.state.payAsset;
        }
        this.setState({
            payAsset:asset,
            retAsset:retasset
        },()=>{
            this.estimate();
        })
    }

    /**
     * 当选中后触发
     */
    public onRetAssetSelect=(asset:IAssetInfo)=>
    {
        let payasset = this.state.payAsset;
        if(asset.assetid===this.state.payAsset.assetid && this.payAssetSelect.current)
        {
            this.payAssetSelect.current.onSelect(this.state.retAsset);
            payasset = this.state.retAsset;
        }
        this.setState({
            retAsset:asset,
            payAsset:payasset
        },()=>{
            this.estimate()
        })
    }

    /**
     * 点击互换按钮触发
     */
    public exchange=()=>
    {
        if(this.retAssetSelect.current && this.payAssetSelect.current)
        {
            this.retAssetSelect.current.onSelect(this.state.payAsset);
            this.payAssetSelect.current.onSelect(this.state.retAsset);
        }
        this.setState
        ({
            amount:this.state.receive,
            receive:this.state.amount,
            payAsset:this.state.retAsset,
            retAsset:this.state.payAsset
        },()=>{
            this.estimate();
        })
        // const amount = this.state.receive;
        // const receive = this.state.amount;
        // this.amountChange(amount);
        // this.receiveChange(receive);
    }

}