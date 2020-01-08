import { Observable } from 'rxjs';
import { IGroupConfig } from './group-config.interface';
export interface IMultiSelectFacet<T> {
    result: Observable<T[]>;
    groups: {
        [key: string]: Observable<T[]>;
    };
    initGroups: (groupConfig: IGroupConfig[]) => void;
    bindDataSource: (data: T[]) => void;
    filterByItem: (item: T) => void;
    filterByGroup: (groupName: string, values: string[]) => void;
}
