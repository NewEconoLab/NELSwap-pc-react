/**
 * 我的挂单
 */
import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ITranProps } from '../interface/tran.interface';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Slider from '@/components/slider';
import Checkbox from '@/components/Checkbox';
import Hint from '@/components/hint';
import SearchGroup from '@/containers/search';
import { IAssetInfo } from '@/containers/search/interface/search.interface';
import poolStore from '../store/pool.store';
import { HASH_CONFIG } from '@/config';
import { getTotals } from '@/store/api/common.api';
import { toBigNumber, toBigIntger, asNumber } from '@/utils/numberTool';
import common from '@/store/common';

@inject('tran', 'common')
@observer
export default class DelFluidity extends React.Component<ITranProps, any> {

    public state={
        amount:"",
        token:
        {
            iconurl:'',
            name:'',
            assetid:'',
            symbole:'',
            decimal:0,
        },
        available:0,
        assetToatl:0,
        tokenToatl:0,
        shareholding:'',
        assetCount:'',
        tokenCount:"",
        tokenAmount:"",
        assetAmount:"",
        toCgas:false,
        uniAmountErr:false,
    }

    public componentDidMount()
    {
        
        poolStore.clearMessage();
    }

    public render()
    {
        return (
            <>
                <div className="line-title">
                    资金池代币
                </div>
                <div className="line-group">
                <div className="line-content">
                <Input
                    placeholder="金额"
                    value={this.state.amount}
                    onChange={this.amountChange}
                    state={this.state.uniAmountErr?'error':''}
                    type='text'
                />
                </div>
                <div className="line-content line-btn">            
                    <SearchGroup onSelect={this.onTokenSelect} hideAssetId={HASH_CONFIG.ID_NNC}  />
                </div>
                </div>
                <div className="line-group">
                <div className="line-content"><div className="input-message"/></div>
                <div className="line-btn"><div className={`amount-message ${this.state.uniAmountErr?'error':''}`}>可用：{poolStore.uniAvailable}</div></div>
                </div>
                <div className="line-icon">
                <img src={require('@/img/direction.png')} alt=""/>
                </div>
                <div className="line-title">
                    <div className="left">
                        获得（估计）
                    </div>
                    <div className="right">
                    {this.state.token.assetid!==HASH_CONFIG.ID_CGAS&&
                    <>
                        <Checkbox text="将NNC兑换为CGAS" onClick={this.onChecked} />
                        <Hint text="勾选后，会将要取出的NNC以当前兑换比例兑换为等值的CGAS后取出。"/>
                    </>
                    }
                    </div>
                </div>
                <div className="line-group">
                    <div className="line-content">
                        <div className="line-input-text">
                        {poolStore.tokenObtainable && <>
                            {(this.state.toCgas && this.state.token.assetid!==HASH_CONFIG.ID_CGAS)?`${poolStore.cgasObtainable} CGAS`:`${poolStore.assetObtainable} NNC`} + {poolStore.tokenObtainable} {this.state.token.symbole}
                        </>}
                        </div>
                    </div>
                </div>
                <div className="line-group">
                    <div className="line-content">
                        <div className="input-message">
                        {
                            (this.state.toCgas && this.state.token.assetid!==HASH_CONFIG.ID_CGAS)?`比率：1 CGAS = ${toBigNumber(poolStore.assetObtainable).div(poolStore.cgasObtainable).toFixed(2)} NNC`:""
                        }
                        </div>
                    </div>
                </div>
                <div className="ratio-slider">
                    <Slider rate={1} onChange={this.onChangRatio} />
                </div>
                
                <div className="info-message">
                {this.state.token.assetid!==""?
                    <>
                    <div className="message-content">
                        <div className="message-title">当前兑换比率</div>
                        <div className="message-value message-number">1 {this.state.token.symbole} = {toBigNumber(this.state.assetToatl).div(this.state.tokenToatl).toFixed(2).toString()} NNC</div>
                    </div>
                    <div className="message-content">
                        <div className="message-title">当前资金池</div>
                        <div className="message-value message-number">
                            {this.state.tokenToatl} {this.state.token.symbole} ；{this.state.assetToatl} NNC
                        </div>
                    </div>
                    <div className="message-content">
                        <div className="message-title">已持股份额（{this.state.shareholding}%）</div>
                        <div className="message-value message-number">
                            {this.state.tokenCount} {this.state.token.symbole} ；{this.state.assetCount} NNC
                        </div>
                    </div>
                    </>:
                    <>
                        <div className="message-content">
                            <div className="message-title">当前兑换比率</div>
                            <div className="message-value message-number">---</div>
                        </div>
                        <div className="message-content">
                            <div className="message-title">当前资金池</div>
                            <div className="message-value message-number">
                                ---
                            </div>
                        </div>
                        <div className="message-content">
                            <div className="message-title">已持股份额（0%）</div>
                            <div className="message-value message-number">
                                ---
                            </div>
                        </div>
                    </>
                }
                </div>
                <div className="confrim">            
                {this.state.amount && this.state.token.assetid!=='' && !this.state.uniAmountErr ?
                    <Button text='取出资金池' btnSize='bg-btn' onClick={this.removeLiquidity} /> :                    
                    <Button text='存入资金池' btnSize='bg-btn' btnColor="gray-btn" />
                }
                </div>
            </>
        );
    }

    public amountChange = (event:any) =>{
        this.setState({amount:asNumber(event)},()=>{
            this.changeTokenAmount();
        })
    }
    public onChangRatio=(event: number)=>{
        if(poolStore.uniAvailable>0 && event>0)
        {
            const amount = toBigIntger(poolStore.uniAvailable.toFixed(2).replace('.','')).mul(event).div(100).toFloat(2);
            this.setState({amount:amount.toString()},()=>{
                this.changeTokenAmount();
            });        
        }
        else
        {
            this.setState({amount:0})
        }
    }
    public onChecked=(value:boolean)=>{
        this.setState({toCgas:value})        
    }
    public onTokenSelect=(asset:IAssetInfo)=>
    {
        this.setState({token:asset},()=>{
            this.estimate()
        });
    }

    public estimate = async()=>
    {
        if(this.state.token.assetid!=="")
        {
            poolStore.setRemoveToken(this.state.token);
        }
        this.getShareholding();
        this.getTools();
    }

    public changeTokenAmount=async()=>
    {
        const token = {hash:this.state.token.assetid,decimal:this.state.token.decimal}
        poolStore.getTokenAmountByUni(token,this.state.amount,this.state.toCgas);
        if(poolStore.uniAvailable)
        {
            const uniAmountErr = parseFloat(this.state.amount)>poolStore.uniAvailable;
            this.setState({uniAmountErr})
        }
    }

    public getTools=async()=>
    {        
        const token={hash:this.state.token.assetid,decimal:this.state.token.decimal};
        const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2}
        const result = await getTotals(token,asset);
        const nnctoatl = result[HASH_CONFIG.ID_NNC];
        const tokentoatl = result[this.state.token.assetid];
        const assetToatl = toBigNumber(nnctoatl).div(Math.pow(10,2)).value;
        const tokenToatl = toBigNumber(tokentoatl).div(Math.pow(10,this.state.token.decimal)).value;
        this.setState({
            assetToatl,tokenToatl
        })
    }

    public getShareholding = async()=>
    {
        if(this.state.token.assetid)
        {
            const uniResult = await common.getUniTotal(HASH_CONFIG.ID_NNC,this.state.token.assetid);
            if(uniResult.available==="" || uniResult.available==="0")
            {
                this.setState({shareholding:0,assetCount:0,tokenCount:0})
            }
            else
            {
                const current = toBigNumber(uniResult.available);
                const shareholding =current.div(uniResult.total);
                const percentage = shareholding.mul(100).toFixed(2);
                const assetCount = shareholding.mul(this.state.assetToatl).toFixed(2);
                const tokenCount = shareholding.mul(this.state.tokenToatl).toFixed(4);
                this.setState({shareholding:percentage,assetCount,tokenCount});
            }
        }
    }

    public removeLiquidity=()=>{
        poolStore.removeLiquidity(parseFloat(this.state.amount),this.state.toCgas)
    }
    

}

