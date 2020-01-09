export interface IGroupConfig {
  name: string;
  subGroupConfigs?: IGroupConfig[];
}
