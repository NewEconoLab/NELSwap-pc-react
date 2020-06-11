/**
 * 我的挂单
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import { ITranProps } from '../interface/tran.interface';
import Input from '@/components/Input';
import Button from '@/components/Button';
import SearchGroup from '@/containers/search';
import { IAssetInfo } from '@/containers/search/interface/search.interface';
import { getTotals } from '@/store/api/common.api';
import { HASH_CONFIG } from '@/config';
import tranStore from '../store/tran.store';
import { toBigNumber, toBigIntger, asNumber, toFixed } from '@/utils/numberTool';
import common from '@/store/common';
import poolStore from '../store/pool.store';
import Hint from '@/components/hint';

@observer
export default class AddFluidity extends React.Component<ITranProps, any> {
    public state = {
        option1:{
            iconurl:require('@/img/nnc.png'),
            name:'NEO Name Credit',
            assetid:'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
            symbole:'NNC',
            decimal:2
        },
        option2:
        {
            iconurl:'',
            name:'',
            assetid:'',
            symbole:'',
            decimal:0
        },
        amount1:'',
        amount2:"",
        total1:0,
        total2:0,
        balance1:'',
        balance2:'',
        isReckonAsset:false, // 是否是计算Asset (nnc)
        nnccount:'',
        shareholding:'0', // 已持股份额
        tokenCount:'',
        assetCount:'',
        amount1error:false,
        amount2error:false,
        assetlist:
        [{
            iconurl:require('@/img/nnc.png'),
            name:'NEO Name Credit',
            assetid:'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
            symbole:'NNC',
            decimal:2
        },
        {
            iconurl:require('@/img/cgas.png'),
            name:'NEP5 GAS',
            assetid:'74f2dc36a68fdc4682034178eb2220729231db76',
            symbole:'CGAS',
            decimal:8
        }]
    }
    private assetlist:IAssetInfo[]=
    [{
        iconurl:require('@/img/nnc.png'),
        name:'NEO Name Credit',
        assetid:'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
        symbole:'NNC',
        decimal:2
    },
    {
        iconurl:require('@/img/cgas.png'),
        name:'NEP5 GAS',
        assetid:'74f2dc36a68fdc4682034178eb2220729231db76',
        symbole:'CGAS',
        decimal:8
    }];
    private assetSelect=React.createRef<SearchGroup>(); // 金额选择框的ref载体
    private tokenSelect=React.createRef<SearchGroup>(); // 金额选择框的ref载体

    public componentDidMount()
    {
        poolStore.clearMessage();
        this.initBalance();
    }

    public render()
    {
        return (
            <>
                <div className="line-title">
                    存入
                </div>
                <div className="line-group">
                <div className="line-content">
                <Input
                    placeholder="金额"
                    value={this.state.amount1}
                    onChange={this.amountChange1}
                    type='text'
                    state={this.state.amount1error?'error':''}
                />
                </div>
                <div className="line-content line-btn">            
                    <SearchGroup onSelect={this.onAssetSelect1} defaultAssetList={this.state.assetlist} defaultAsset={this.assetlist[0]} ref={this.assetSelect} />
                </div>
                </div>
                <div className="line-group">
                <div className="line-content">
                    {this.state.nnccount!==''?
                    <div className="input-message">≈ {this.state.nnccount} NNC<Hint text="存入CGAS时会以当前兑换比例兑换为等值的NNC后加入资金池。"/></div>:
                    <div className="input-message"/>
                    }
                </div>
                <div className="line-btn">
                    <div className={`amount-message ${this.state.amount1error?'error':''}`}>{this.state.balance1!==''?`余额：${this.state.balance1}`:''}</div>
                </div>
                </div>
                <div className="line-icon">
                    <img src={require('@/img/sum.png')} alt=""/>
                </div>
                <div className="line-title">
                存入（估计）
                </div>
                <div className="line-group">
                    <div className="line-content">
                    <Input
                        placeholder="金额"
                        value={this.state.amount2}
                        onChange={this.amountChange2}
                        type='text'
                        state={this.state.amount2error?'error':''}
                    />
                    </div>
                    <div className="line-btn">
                        <SearchGroup onSelect={this.onAssetSelect2} hideAssetId={HASH_CONFIG.ID_NNC} ref={this.tokenSelect} />
                    </div>
                </div>
                <div className="line-group">
                    <div className="line-content"><div className="input-message"> {} </div></div>
                    <div className="line-btn">
                        <div className={`amount-message ${this.state.amount2error?'error':''}`}>{this.state.balance2!==''?`余额：${this.state.balance2}`:''}</div>
                    </div>
                </div>
                <div className="info-message">
                {this.state.option2.assetid!==""?
                    <>                    
                    <div className="message-content">
                        <div className="message-title">当前兑换比率</div>
                        <div className="message-value message-number">
                            1 {this.state.option2.symbole} = {toBigNumber(this.state.total1).div(this.state.total2).toFixed(2).toString()} NNC
                        </div>
                    </div>
                    <div className="message-content">
                        <div className="message-title">当前资金池</div>
                        <div className="message-value message-number">
                            {this.state.total2} {this.state.option2.symbole} ；{this.state.total1} NNC
                        </div>
                    </div>
                    <div className="message-content">
                        <div className="message-title">已持股份额（{this.state.shareholding}%）</div>
                        <div className="message-value message-number">
                            {this.state.tokenCount} {this.state.option2.symbole} ；{this.state.assetCount} NNC
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
                {this.state.amount1 && this.state.amount2 && this.state.option1.assetid!=='' && this.state.option2.assetid!=="" && !this.state.amount1error && !this.state.amount2error?                    
                    <Button text='存入资金池' btnSize='bg-btn' onClick={this.addLiquidity} /> :                    
                    <Button text='存入资金池' btnSize='bg-btn' btnColor="gray-btn" />
                }
                </div>
            </>
        );
    }

    public initBalance = () =>{
        if(this.state.option1.assetid!=='')
        {
            tranStore.getBalance(this.state.option1.assetid)
            .then(res=>{
                this.setState({balance1:res})
            })
        }
        if(this.state.option2.assetid!=='')
        {
            tranStore.getBalance(this.state.option2.assetid)
            .then(res=>{
                this.setState({balance2:res})
            })
        }
    }

    public amountChange1 = (event:any) =>{
        if(event==="")
        {
            this.setState({
                amount1:'',
                amount2:"",
                isReckonAsset:false,
                amount2error:false,
                amount1error:false
            })
        }
        else
        {
            this.setState({
                amount1:asNumber(event),
                isReckonAsset:false
            },()=>{
                this.estimate()
            })    
        }    
    }

    public amountChange2 = (event:any) =>{
        if(event==="")
        {
            this.setState({
                amount1:'',
                amount2:"",
                isReckonAsset:true,
                amount2error:false,
                amount1error:false
            })
        }
        else
        {
            this.setState({
                amount2:asNumber(event),
                isReckonAsset:true
            },()=>{
                this.estimate()
            })
        }
    }

    public onAssetSelect1=(asset:IAssetInfo)=>
    {
        // let option2 = this.state.option2;
        // if(asset.assetid===HASH_CONFIG.ID_CGAS)
        // {
        //     option2={
        //         iconurl:"",
        //         name:'',
        //         assetid:'',
        //         symbole:'',
        //         decimal:2
        //     };
        //     if(this.tokenSelect.current)
        //     {
        //         this.tokenSelect.current.onSelect(option2);
        //     }
        // }
        this.setState({option1:asset},()=>{ 
            this.initBalance();            
            this.estimate();
        }) 
    }
    public onAssetSelect2=(asset:IAssetInfo)=>
    {
        let option1 = this.state.option1;
        if(asset.assetid===HASH_CONFIG.ID_CGAS)
        {
            option1={
                iconurl:require('@/img/nnc.png'),
                name:'NEO Name Credit',
                assetid:'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
                symbole:'NNC',
                decimal:2
            };
            if(this.assetSelect.current)
            {
                this.assetSelect.current.onSelect(option1);
            }
            this.setState({
                assetlist:
                [option1]
            })
        }
        else
        {
            this.setState({
                assetlist:
                this.assetlist
            })
        }
        this.setState(
            {option1,option2:asset},
            ()=>{
                this.initBalance();
                this.estimate();
            }
        ) 
    }

    /**
     * 计算
     */
    public estimate=async()=>
    {
        const token={hash:this.state.option2.assetid,decimal:this.state.option2.decimal};
        const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2}
        const result = await getTotals(token,asset);
        const nnctools = result[HASH_CONFIG.ID_NNC];
        const tokentools = result[this.state.option2.assetid];
        const total1 = toBigNumber(nnctools).div(Math.pow(10,2)).value;
        const total2 = toBigNumber(tokentools).div(Math.pow(10,this.state.option2.decimal)).value;
        this.setState({
            total1,total2
        })
        if(this.state.isReckonAsset && this.state.amount2)
        {
            const tokencount = toBigIntger(this.state.amount2,this.state.option2.decimal);
            // const assetcount = tokencount.mul(98).div(100).sub(1).mul(nnctools).div(tokentools).toFloat(2);
            const assetcount = tokencount.sub(1).mul(nnctools).div(tokentools).toFloat(2);
            if(this.state.option1.assetid===this.state.option2.assetid)
            {
                const tokeninfo = {hash:HASH_CONFIG.ID_CGAS,decimal:8}
                const assetinfo = {hash:HASH_CONFIG.ID_NNC,decimal:2}
                const amount1 = await common.GetTokenToAssetOutputAmount(assetcount,tokeninfo,assetinfo);
                this.setState({
                    amount1:toFixed(amount1,this.state.option1.decimal)
                })
            }
            else
            {
                this.setState({
                    amount1:assetcount.toString()
                })
            }
        }
        else if(!this.state.isReckonAsset && this.state.amount1)
        {
            const assetcount = toBigIntger(this.state.amount1,this.state.option1.decimal);
            const tokencount = assetcount.mul(tokentools).div(nnctools).add(1).toFloat(this.state.option2.decimal).toFixed(4);
            // const tokencount = assetcount.mul(tokentools).div(nnctools).add(1).mul(102).div(100).toFloat(this.state.option2.decimal).toFixed(4);
            this.setState({
                amount2:tokencount.toString()
            })
        }
        if(this.state.amount1!=='' && this.state.balance1!=='')
        {
            const amount1error = parseFloat(this.state.amount1)>parseFloat(this.state.balance1);
            this.setState({amount1error})
            if(this.state.option1.assetid===this.state.option2.assetid && this.state.option1.assetid ===HASH_CONFIG.ID_CGAS)
            {
                const error = toBigNumber(this.state.amount1).add(this.state.amount2).value>parseFloat(this.state.balance1);
                this.setState({
                    amount1error:error,
                    amount2error:error
                })
            }
            // if(this.state.option1.assetid===this.state.option2.assetid)
            // {
            //     const balance2 = toBigNumber(this.state.balance2).sub(this.state.amount1)
            //     if(balance2.value>0)
            //     {
            //         this.setState({balance2})
            //     }
            //     else
            //     {
            //         this.setState({balance2:'0'})
            //     }
            // }
        }
        if(this.state.amount2!=='' && this.state.balance2!=='')
        {
            const amount2error = parseFloat(this.state.amount2)>parseFloat(this.state.balance2);
            this.setState({amount2error})
        }
        if(this.state.option1.assetid===this.state.option2.assetid && this.state.option1.assetid ===HASH_CONFIG.ID_CGAS)
        {
            const error = toBigNumber(this.state.amount1).add(this.state.amount2).value>parseFloat(this.state.balance1);
            this.setState({
                amount1error:error,
                amount2error:error
            })
        }
        this.getShareholding();
        this.CGASToNNC();
    }

    public getShareholding = async()=>
    {
        if(this.state.option2.assetid)
        {
            const uniResult = await common.getUniTotal(HASH_CONFIG.ID_NNC,this.state.option2.assetid);
            if(uniResult.available==="" || uniResult.available==="0")
            {
                this.setState({shareholding:0,assetCount:0,tokenCount:0})
            }
            else
            {
                const current = toBigNumber(uniResult.available);
                const shareholding =current.div(uniResult.total);
                const percentage = shareholding.mul(100).toFixed(2);
                const assetCount = shareholding.mul(this.state.total1).toFixed(2);
                const tokenCount = shareholding.mul(this.state.total2).toFixed(4);
                this.setState({shareholding:percentage,assetCount,tokenCount});
            }
        }
    }

    public CGASToNNC= async()=>
    {
        if( this.state.option1.assetid===HASH_CONFIG.ID_CGAS && this.state.amount1!=='')
        {
            const token = {hash:HASH_CONFIG.ID_CGAS,decimal:8};
            const asset = {hash:HASH_CONFIG.ID_NNC,decimal:2};
            const result = await common.GetTokenToAssetInputAmount(parseFloat(this.state.amount1),token,asset);
            this.setState({nnccount:result.toFixed(2)})
        }
        else 
        {
            this.setState({nnccount:''})
        }
    }

    public addLiquidity=async()=>
    {
        const assetAmount: number=parseFloat(this.state.amount1); 
        let maxTokenAmout=toBigNumber(this.state.amount2).mul(1.02);
        if(maxTokenAmout.compareTo(this.state.balance2)>0)
        {
            maxTokenAmout = toBigNumber(this.state.balance2)
        }
        const token={hash:this.state.option2.assetid,decimal:this.state.option2.decimal}
        const asset={hash:this.state.option1.assetid,decimal:this.state.option1.decimal}
        if(asset.hash===HASH_CONFIG.ID_CGAS && this.state.nnccount!=="")
        {
            tranStore.addLiquidity(assetAmount,maxTokenAmout.value,token,asset,parseFloat(this.state.nnccount));
        }
        else
        {
            tranStore.addLiquidity(assetAmount,maxTokenAmout.value,token,asset);
        }
    }

}