/**
 * 搜索页
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import { ISearchProps, IAssetInfo } from './interface/search.interface';
import SearchWindow from './searchwindow';
@observer
export default class SearchGroup extends React.Component<ISearchProps, any> {
    public state = {
        currentid:"",
        currentname:"",
        currenticon:"",
        currentsymbole:"",
        openSelect:false,
    }
    public componentDidMount()
    {
        if(this.props.defaultAsset)
        {
            this.setState({
                currentid:this.props.defaultAsset.assetid,
                currenticon:this.props.defaultAsset.iconurl,
                currentname:this.props.defaultAsset.name,
                currentsymbole:this.props.defaultAsset.symbole
            })
        }
        else
        {
            this.setState({
                currentid:"",
                currenticon:"",
                currentname:"",
                currentsymbole:""
            })
        }
    }
    public onClick=()=>
    {
        this.setState({openSelect:true})
    }
    public onCloseSelect=()=>
    {
        this.setState({openSelect:false})
    }
    public onSelect=(asset:IAssetInfo)=>{
        this.setState({
            currentid:asset.assetid,
            currentname:asset.name,
            currenticon:asset.iconurl,
            currentsymbole:asset.symbole,
            openSelect:false
        },()=>{
            this.props.onSelect(asset)
        })
    }
    public render()
    {
		return (
            <>
			<div className="select-wrapper big-box" onClick={this.onClick} >
				<div className="selected-text" >
					<span><img src={this.state.currenticon} alt=""/></span>
					<span>{this.state.currentsymbole===""?"选择货币":this.state.currentsymbole}</span>
					<span className="triangle" />
				</div>
			</div>
            {this.state.openSelect&&<SearchWindow onClose={this.onCloseSelect} onSelect={this.onSelect} defaultAssetList={this.props.defaultAssetList} hideAssetId={this.props.hideAssetId} />}
            </>
		);
    }
}