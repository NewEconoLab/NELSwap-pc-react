import { observable, action } from 'mobx';
import { ISearchStore, ISearchInfo, ILikeList } from '../interface/search.interface';
import { getAssectList, searchLikeAssetList } from '../api/search.api';

class SearchPage implements ISearchStore
{
    @observable public searchInfo:ISearchInfo|null = null;
    @observable public likeCount: number = 0; 
    @observable public likeList: ILikeList[] = []; 
    @observable public searchStar:boolean = false;
    @action public async getExchange(assetid:string){
        console.log(assetid);
    }

    @action public async getAssets(){
        try {
            const result = (await getAssectList(1,100))[0]['list'];
            const list =result.map(asset=>{
                return {assetid:asset['assetid'].replace('0x',''),name:asset['name'],symbole:asset['symbol'],decimal:asset['decimals'],iconurl:asset['picUrl']}
            })
            return list;
        } catch (error) {
            return [];   
        }
    }

    @action public async searchLikeAsset(value:string)
    {
        try {
            const result = (await searchLikeAssetList(value,1,10))[0]['list'];
            const list =result.map(asset=>{
                return {assetid:asset['assetid'].replace('0x',''),name:asset['name'],symbole:asset['symbol'],decimal:asset['decimals'],iconurl:asset['picUrl']}})
            return list;            
        } catch (error) {
            return [];
        }
    }
}
export default new SearchPage();