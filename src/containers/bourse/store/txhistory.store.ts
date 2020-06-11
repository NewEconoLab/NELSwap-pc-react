import { observable, action } from 'mobx';
import * as Api from '../api/bourse.api'
import { ITxHistoryStore, ITxHistoryList } from '../interface/txhistory.interface';

class TxHistory implements ITxHistoryStore
{
    @observable public txhistoryList: ITxHistoryList[] = []; // 所有交易列表
    @observable public txhistoryListCount: number = 0; // 所有交易总数

    /**
     * 获取Nep5交易列表（默认获取所有交易）
     * @param page 当前页码
     * @param size 每页条数
     */
    @action public async getTxHistoryList(addr:string,page: number, size: number, orderby: string, asset: string)
    {
        let result: any = null;
        try
        {
            result = await Api.gethistorylist(addr, page, size, orderby, asset);
        } catch (error)
        {
            this.txhistoryListCount = 0;
            this.txhistoryList = [];
            return false;
        }
        this.txhistoryListCount = result[0].count || 0;
        this.txhistoryList = result ? result[0].list : [];
        console.log(result[0].list)
        return true; 
    }
}
export default new TxHistory();