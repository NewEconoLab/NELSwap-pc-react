import { observable } from 'mobx';
// import * as Api from '../api/home.api'
import { IHomeStore } from '../interface/home.interface';
// import { toThousands } from '@/utils/numberTool'

class Home implements IHomeStore
{
    @observable public blockCount: string = '0';  // 区块高度
}
export default new Home();