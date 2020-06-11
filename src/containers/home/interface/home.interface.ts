import { RouteComponentProps } from 'react-router-dom';
import { ICommonStore } from '@/store/interface/common.interface';
export interface IHomeStore {
    blockCount: string,    
}
export interface IHomeProps extends RouteComponentProps {
    intl: any,
    home: IHomeStore,
    common:ICommonStore
}
