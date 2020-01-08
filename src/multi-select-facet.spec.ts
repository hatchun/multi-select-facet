import {
    MultiSelectFacet} from './multi-select-facet';
import { IMultiSelectFacet } from "./models/multi-select-facet.interface";
import { IGroupConfig } from "./models/group-config.interface";
import { take } from 'rxjs/operators';

interface IFakeType {
    name: string;
    age: number;
    height: number;
}

const data = [
    { name: 'Joe', age: 17, height: 125 },
    { name: 'Bob', age: 17, height: 221 },
    { name: 'Tom', age: 35, height: 225 },
    { name: 'Tom', age: 38, height: 185 }
];

function setup(config: IGroupConfig[]) {

    const sut = new MultiSelectFacet<IFakeType>() as IMultiSelectFacet<IFakeType>;

    sut.initGroups(config);

    sut.bindDataSource(data);

    return { sut };
}

describe('MultiSelectFacet', () => {

    describe('Groups are on the same level', () => {
        const flatGroupConfig = [
            { name: 'name' },
            { name: 'age' },
            { name: 'height' }
        ] as IGroupConfig[];


        it('returns filtered result', async () => {
            const { sut } = setup(flatGroupConfig);

            sut.filterByGroup('name', ['Tom']);

            await expectAsync(sut.result.pipe(take(1)).toPromise())
                .toBeResolvedTo([
                    { name: 'Tom', age: 35, height: 225 },
                    { name: 'Tom', age: 38, height: 185 }
                ]);
        });

        it('returns result on each filterByGroup', async () => {
            const { sut } = setup(flatGroupConfig);
            sut.filterByGroup('name', ['Tom']);
            await expectAsync(sut.result.pipe(take(1)).toPromise())
                .toBeResolvedTo([
                    { name: 'Tom', age: 35, height: 225 },
                    { name: 'Tom', age: 38, height: 185 }
                ]);
            sut.filterByGroup('height', ['185']);
            await expectAsync(sut.result.pipe(take(1)).toPromise())
                .toBeResolvedTo([{ name: 'Tom', age: 38, height: 185 }]);

        });

        it('group items are set on dataBind', async () => {
            const { sut } = setup(flatGroupConfig);
            await expectAsync(sut.groups.name.pipe(take(1)).toPromise()).toBeResolvedTo([
                { name: 'Joe', age: 17, height: 125 },
                { name: 'Bob', age: 17, height: 221 },
                { name: 'Tom', age: 35, height: 225 }]);
            await expectAsync(sut.groups.age.pipe(take(1)).toPromise()).toBeResolvedTo([
                { name: 'Joe', age: 17, height: 125 },
                { name: 'Tom', age: 35, height: 225 },
                { name: 'Tom', age: 38, height: 185 }]);

        });

        it('doesnt filter available items in same level groups on filterByGroup', async () => {
            const { sut } = setup(flatGroupConfig);
            sut.filterByGroup('name', ['Tom']);
            sut.filterByGroup('age', ['38']);

            await expectAsync(sut.groups.age.pipe(take(1)).toPromise())
                .toBeResolvedTo([
                    { name: 'Joe', age: 17, height: 125 },
                    { name: 'Tom', age: 35, height: 225 },
                    { name: 'Tom', age: 38, height: 185 }
                ]);
            await expectAsync(sut.groups.height.pipe(take(1)).toPromise())
                .toBeResolvedTo([
                    { name: 'Joe', age: 17, height: 125 },
                    { name: 'Bob', age: 17, height: 221 },
                    { name: 'Tom', age: 35, height: 225 },
                    { name: 'Tom', age: 38, height: 185 }
                ]);
        });
    });

    describe('Groups are in parent child tree', () => {

        const treeGroupConfig = [
            {
                name: 'name',
                subGroupConfigs: [
                    {
                        name: 'age',
                        subGroupConfigs: [
                            { name: 'height' }
                        ]
                    }
                ]
            }
        ] as IGroupConfig[];

        it('returns filtered result', async () => {
            const { sut } = setup(treeGroupConfig);

            sut.filterByGroup('name', ['Tom']);

            await expectAsync(sut.result.pipe(take(1)).toPromise())
                .toBeResolvedTo([
                    { name: 'Tom', age: 35, height: 225 },
                    { name: 'Tom', age: 38, height: 185 }
                ]);
        });

        it('returns result on each filterByGroup', async () => {
            const { sut } = setup(treeGroupConfig);
            sut.filterByGroup('name', ['Tom']);
            await expectAsync(sut.result.pipe(take(1)).toPromise())
                .toBeResolvedTo([
                    { name: 'Tom', age: 35, height: 225 },
                    { name: 'Tom', age: 38, height: 185 }
                ]);
            sut.filterByGroup('height', ['185']);
            await expectAsync(sut.result.pipe(take(1)).toPromise())
                .toBeResolvedTo([{ name: 'Tom', age: 38, height: 185 }]);

        });

        it('group items are set on dataBind', async () => {
            const { sut } = setup(treeGroupConfig);
            await expectAsync(sut.groups.name.pipe(take(1)).toPromise()).toBeResolvedTo([
                { name: 'Joe', age: 17, height: 125 },
                { name: 'Bob', age: 17, height: 221 },
                { name: 'Tom', age: 35, height: 225 }]);
            await expectAsync(sut.groups.age.pipe(take(1)).toPromise()).toBeResolvedTo([
                { name: 'Joe', age: 17, height: 125 },
                { name: 'Tom', age: 35, height: 225 },
                { name: 'Tom', age: 38, height: 185 }]);

        });

        it('filters available items in subGroups on filterByGroup', async () => {
            const { sut } = setup(treeGroupConfig);
            sut.filterByGroup('name', ['Tom']);
            sut.filterByGroup('age', ['38']);

            await expectAsync(sut.groups.age.pipe(take(1)).toPromise())
                .toBeResolvedTo([
                    { name: 'Tom', age: 35, height: 225 },
                    { name: 'Tom', age: 38, height: 185 }
                ]);
            await expectAsync(sut.groups.height.pipe(take(1)).toPromise())
                .toBeResolvedTo([
                    { name: 'Tom', age: 38, height: 185 }
                ]);
        });

        it('options change after parent group filtering', async () => {
            const { sut } = setup(treeGroupConfig);
            sut.filterByGroup('name', ['Tom']);

            await expectAsync(sut.groups.name.pipe(take(1)).toPromise()).toBeResolvedTo([
                { name: 'Joe', age: 17, height: 125 },
                { name: 'Bob', age: 17, height: 221 },
                { name: 'Tom', age: 35, height: 225 }]);
            await expectAsync(sut.groups.age.pipe(take(1)).toPromise()).toBeResolvedTo([
                { name: 'Tom', age: 35, height: 225 },
                { name: 'Tom', age: 38, height: 185 }]);
        });
    });
});
