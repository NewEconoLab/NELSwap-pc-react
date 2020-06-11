/**
 * 搜索页
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import { ISelectState, IAssetInfo, ISearchSelectProps } from './interface/search.interface';
import Search from '@/components/search';
import searchStore from './store/search.store';
@observer
export default class SearchWindow extends React.Component<ISearchSelectProps, ISelectState> {
    public state:ISelectState = {
        assetlist:[],
        searchValue:''
    }
    public async componentDidMount()
    {
        let assetlist: IAssetInfo[] = [];
        if(this.props.defaultAssetList)
        {
            assetlist = this.props.defaultAssetList;
        }
        else
        {
            assetlist= await searchStore.getAssets();
        }
        if(this.props.hideAssetId)
        {
            assetlist = assetlist.filter(asset=>asset.assetid!==this.props.hideAssetId)
        }
        this.setState({assetlist})
    }
    public onSelect=(event,asset:IAssetInfo)=>
    {
        this.props.onSelect(asset);
    }
    public onChange=async(event:string)=>
    {
        this.setState({searchValue:event})
        let assetlist: IAssetInfo[] = [];
        if(this.props.defaultAssetList)
        {
            assetlist = this.props.defaultAssetList.filter(asset=>asset.symbole.toLowerCase().includes(event.toLowerCase()))
        }
        else
        {
            assetlist= await searchStore.searchLikeAsset(event)
        }
        if(this.props.hideAssetId)
        {
            assetlist = assetlist.filter(asset=>asset.assetid!==this.props.hideAssetId)
        }
        this.setState({assetlist})
    }
    public render()
    {
        return(
            <div className="search-warp">
                <div className="search-model">
                    <div className="search-header">选择币种
                        <div className="search-close" onClick={this.props.onClose}>
                            <img src={require('@/img/close.png')} alt="" />
                        </div>
                    </div>
                    <div className="search-input-model">
                        <Search placeholder="搜索币种" value={this.state.searchValue} type="text" onChange={this.onChange} styleType="onfous" />
                    </div>
                    <div className="assetinfo-list">
                        {
                            this.state.assetlist.map((asset,index)=>{
                                return(                                 
                                <div className="assetinfo-group" key={index} onClick={this.props.onSelect.bind(this,asset)}>
                                    <div className="asset-info">
                                        <span className="asset-icon">
                                            <img src={asset.iconurl} alt=""/>
                                        </span>
                                        <span className="asset-symbol">{asset.symbole}</span>
                                        <span className="asset-name">{asset.name}</span>
                                    </div>
                                </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
