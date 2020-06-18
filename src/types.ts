import { DataQuery, DataSourceJsonData, MutableVector } from '@grafana/data';

export enum Granularity {
  PT5M = "PT5M",
  PT1H = "PT1H",
  P1D = "P1D",
  P1M = "P1M"
}

export enum GroupBy {
  ACCOUNT = "ACCOUNT",
  HOST = "HOST",
  PLATFORM = "PLATFORM",
  POP = "POP",
  REGION = "REGION",
  STATUS = "STATUS",
  STATUS_CATEGORY = "STATUS_CATEGORY"
}

export interface ST3Query extends DataQuery {
  type: "transfer" | "status" | "storage";
  accountHash?: string;
  hostHash?: string;
  scopeID?: string;
  metrics?:string;
  filters:ST3MetricQuery;
}

export const defaultQuery: Partial<ST3Query> = {
  type: "transfer",
  filters:{
    platforms:"DELIVERY",
    groupBy: GroupBy.ACCOUNT,
    granularity: Granularity.PT1H
  }
};

/**
 * These are options configured for each DataSource instance
 */
export interface ST3DataSourceOptions extends DataSourceJsonData {
  url: string;
  defaultAccountHash: string;
  apiKey: string;
  customHeaders?: CustomHeader[];
}

export interface CustomHeader {
  id: string;
  name: string;
  value: string;
  configured: boolean;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface ST3SecureJsonData {
  apiKey?: string;
}

export type DataLinkConfig = {
  field: string;
  url: string;
};

export interface ST3MetricQuery {
  startDate?: string;
  endDate?: string;
  granularity?: Granularity;//"PT5M" |  "PT1H" | "P1D" | "P1M";
  platforms: string;
  pops?: string;
  billingRegions?: string;
  accounts?: string;
  hosts?: string;
  groupBy: GroupBy;//"ACCOUNT" | "HOST" | "PLATFORM" | "POP" | "REGION" | "STATUS" | "STATUS_CATEGORY";
  statusCodes?: string;
  statusCategories?: string;
}

export interface queryOptions {
  url: string;
  method: "GET" | "POST";
  query: string;
}

export interface metricsData {
  data: number[][];
  key: string;
  metrics: string[];
  type: string;
}

export interface metricsDataList {
  series: metricsData[];
}

export interface addtionalData {
  accounts?: any;
  hosts?:any;
  pops?:any;
}

export interface PoPInfo{
  id: number;
  code: string;
  name: string;
  group: string;
  region: string;
  country: string;
  latitude: number;
  scannable: boolean;
  longitude: number
  analyzable: boolean;
}

export interface PoPList{
  list: Array<PoPInfo>;
}