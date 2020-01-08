import { BehaviorSubject } from 'rxjs';
export interface IGroup<T> {
    items: BehaviorSubject<T[]>;
    name: string;
    filterValues: string[];
    subGroups?: IGroup<T>[];
}
