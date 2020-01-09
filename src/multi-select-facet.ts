import { BehaviorSubject, Observable } from 'rxjs';
import { IGroup, IGroupConfig, IMultiSelectFacet } from './models';

export class MultiSelectFacet<T> implements IMultiSelectFacet<T> {
  public result: Observable<T[]>;
  private dataSource: T[];
  private resultStream: BehaviorSubject<T[]>;
  private groupInstances: Array<IGroup<T>>;

  public get groups(): { [key: string]: Observable<T[]> } {
    return this.flattenGroupTree(this.groupInstances).reduce((previous, current) => {
      previous[current.name] = current.items;
      return previous;
    }, {} as { [key: string]: Observable<T[]> });
  }

  constructor() {
    this.dataSource = [];
    this.groupInstances = [];
    this.resultStream = new BehaviorSubject<T[]>([]);
    this.result = this.resultStream.asObservable();
  }

  public initGroups(groupConfig: IGroupConfig[]) {
    this.groupInstances = groupConfig.map(g => this.mapGroup(g));
  }

  public bindDataSource(data: T[]) {
    this.dataSource = data;
    this.execute();
  }

  public filterByGroup(groupName: string, values: string[]) {
    const group = this.flattenGroupTree(this.groupInstances).find(g => g.name === groupName);
    if (group) {
      group.filterValues = values;
      this.execute();
    }
  }

  public filterByItem(item: T) {
    this.groupInstances.forEach(g => {
      g.filterValues = (item as any)[g.name];
    });
    this.execute();
  }

  private execute() {
    this.resultStream.next(this.filterDataSource(this.dataSource, this.groupInstances));
  }

  private filterDataSource(dataSource: T[], groups: Array<IGroup<T>>): T[] {
    return groups.reduce(
      (previous, current) => {
        this.setGroupOptions(dataSource, current);
        const filteredResult = this.applyGroupFilter(previous, current);
        return current.subGroups ? this.filterDataSource(filteredResult, current.subGroups) : filteredResult;
      },
      [...dataSource],
    );
  }

  private mapGroup(config: IGroupConfig): IGroup<T> {
    return {
      filterValues: [],
      items: new BehaviorSubject<T[]>([]),
      name: config.name,
      subGroups: config.subGroupConfigs ? config.subGroupConfigs.map(sg => this.mapGroup(sg)) : undefined,
    };
  }

  private flattenGroupTree(groups: Array<IGroup<T>>): Array<IGroup<T>> {
    return groups.concat(...groups.filter(g => !!g.subGroups).map(g => this.flattenGroupTree(g.subGroups)));
  }

  private setGroupOptions(dataSource: T[], group: IGroup<T>) {
    const itemsSet = [...new Set(dataSource.map(x => (x as any)[group.name]))].map(i =>
      dataSource.find(a => (a as any)[group.name] === i),
    );
    group.items.next(itemsSet);
  }

  private applyGroupFilter(dataSource: T[], group: IGroup<T>) {
    return [
      ...dataSource.filter(
        p =>
          group.filterValues.length === 0 ||
          group.filterValues.some(c => c.toString() === (p as any)[group.name].toString()),
      ),
    ];
  }
}
