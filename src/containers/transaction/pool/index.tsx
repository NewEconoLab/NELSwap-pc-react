/**
 * 我的挂单
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import { ITranProps } from '../interface/tran.interface';
import Select from '@/components/select';
import AddFluidity from './addfluidity';
import DelFluidity from './delfluidity';

@observer
export default class Pool extends React.Component<ITranProps, any> {
    public state={
        currentOption:'add'
    }
    public onCallback=(event:any)=>{
        this.setState({
            currentOption:event.id
        })
    }
    public render()
    {
        return (
        <div className="transaction-content">
            <div className="line-title">选择</div>
            <div className="line-select">            
                <Select  options={[{id:'add',name:'增加流动性'},{id:'del',name:'移除流动性'}]} text="" size="long-box" onCallback={this.onCallback} />
            </div>
            {this.state.currentOption==='add'?<AddFluidity {...this.props} />:<DelFluidity {...this.props}/>}
        </div>
        );
    }
}