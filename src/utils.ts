import { ST3Query } from './types';
// const queryOptions = [
//     {descript}
// ]
// export const getFilterOptions: (options: ST3QueryFilter) => {

// }

export interface EditorFilter {
  Metrics: [];
  Filter: [];
  GroupBy: [];
}

export const statusMetrics = [
  { label: 'RequestsCount', value: 'requestsCountTotal', description: 'total requests' },
  {
    label: 'RequestPerSecond',
    value: 'rps',
    description: 'requests per second, calculated as total requests divided by number of seconds in bucket',
  },
];

export const transferMetrics = [
  { value: 'xferUsedTotalMB', description: 'total MB transferred', label: 'xferUsedTotalMB' },
  { value: 'xferUsedMinMB', description: 'minimum five minute bucket of MB transferred', label: 'xferUsedMinMB' },
  { value: 'xferUsedMaxMB', description: 'maximum five minute bucket of MB transferred', label: 'xferUsedMaxMB' },
  { value: 'xferUsedMeanMB', description: 'average of five minute buckets of MB transferred', label: 'xferUsedMeanMB' },
  { value: 'xferAttemptedTotalMB', description: 'total MB attempted', label: 'xferAttemptedTotalMB' },
  { value: 'durationTotal', description: 'total transfer time of all requests', label: 'durationTotal' },
  { value: 'xferRateMaxMbps', description: 'maximum transfer rate', label: 'xferRateMaxMbps' },
  {
    value: 'xferRateMaxUsageTime',
    description: 'timestamp at which maximum transfer rate occurred',
    label: 'xferRateMaxUsageTime',
  },
  { value: 'xferRateMinMbps', description: 'minimum transfer rate', label: 'xferRateMinMbps' },
  {
    value: 'xferRateMinUsageTime',
    description: 'timestamp at which minimum transfer rate occurred',
    label: 'xferRateMinUsageTime',
  },
  { value: 'xferRateMeanMbps', description: 'average transfer rate', label: 'xferRateMeanMbps' },
  {
    value: 'requestsCountMin',
    description: 'minimum five minute bucket of requests per second',
    label: 'requestsCountMin',
  },
  {
    value: 'requestsCountMax',
    description: 'maximum five minute bucket of requests per second',
    label: 'requestsCountMax',
  },
  {
    value: 'requestsCountMean',
    description: 'average of five minute bucket requests per second',
    label: 'requestsCountMean',
  },
  { value: 'rpsMax', description: 'maximum requests per second', label: 'rpsMax' },
  {
    value: 'rpsMaxUsageTime',
    description: 'timestamp at which maximum requests per second occurred',
    label: 'rpsMaxUsageTime',
  },
  { value: 'rpsMin', description: 'minimum requests per second', label: 'rpsMin' },
  {
    value: 'rpsMinUsageTime',
    description: 'timestamp at which minimum requests per second occurred',
    label: 'rpsMinUsageTime',
  },
  { value: 'rpsMean', description: 'mean requests per second', label: 'rpsMean' },
  { value: 'lastUpdatedTime', description: 'last time this bucket was updated', label: 'lastUpdatedTime' },
  { value: 'xferRateMbps', description: 'average transfer rate in Mbps', label: 'xferRateMbps' },
  { value: 'userXferRateMbps', description: 'total transfer divided by duration', label: 'userXferRateMbps' },
  {
    value: 'completionRatio',
    description: 'completed requests divided by attempted requests',
    label: 'completionRatio',
  },
  {
    value: 'responseSizeMeanMB',
    description: 'total MB transferred divided by number of requests',
    label: 'responseSizeMeanMB',
  },
  {
    value: 'peakToMeanMBRatio',
    description: 'maximum transfer rate divided by mean transfer rate',
    label: 'peakToMeanMBRatio',
  },
  {
    value: 'peakToMeanRequestsRatio',
    description: 'maximum requests per second divided by mean requests per second',
    label: 'peakToMeanRequestsRatio',
  },
  ...statusMetrics,
];

export const storageMetrics = [
  {
    value: 'edgeStorageTotalB',
    description: 'total bytes stored on every edge, may contain duplicate assets',
    label: 'edgeStorageTotalB',
  },
  { value: 'edgeStorageMaxB', description: 'maximum five minute bucket of bytes stored', label: 'edgeStorageMaxB' },
  {
    value: 'edgeStorageMaxUsageTime',
    description: 'timestamp at which maximum bytes stored occurred',
    label: 'edgeStorageMaxUsageTime',
  },
  { value: 'edgeStorageMinB', description: 'minimum five minute bucket of bytes stored', label: 'edgeStorageMinB' },
  {
    value: 'edgeStorageMinUsageTime',
    description: 'timestamp at which minimum bytes stored occurred',
    label: 'edgeStorageMinUsageTime',
  },
  { value: 'edgeStorageMeanB', description: 'average of five minute bucket bytes stored', label: 'edgeStorageMeanB' },
  {
    value: 'edgeFileCountTotal',
    description: 'total assets stored on every edge, may contain duplicate assets',
    label: 'edgeFileCountTotal',
  },
  { value: 'edgeFileCountMax', description: 'maximum five minute bucket of files stored', label: 'edgeFileCountMax' },
  {
    value: 'edgeFileCountMaxUsageTime',
    description: 'timestamp at which maximum files stored occurred',
    label: 'edgeFileCountMaxUsageTime',
  },
  { value: 'edgeFileCountMin', description: 'minimum five minute bucket of files stored', label: 'edgeFileCountMin' },
  {
    value: 'edgeFileCountMinUsageTime',
    description: 'timestamp at which minimum files stored occurred',
    label: 'edgeFileCountMinUsageTime',
  },
  { value: 'edgeFileCountMean', description: 'average of five minute bucket files stored', label: 'edgeFileCountMean' },
  { value: 'edgeFileSizeMeanB', description: 'average of five minute bucket bytes stored', label: 'edgeFileSizeMeanB' },
  { value: 'lastUpdatedTime', description: 'last time this bucket was updated', label: 'lastUpdatedTime' },
];

export const commonFilter = [
  { value: 'billingRegions', description: 'region to filter by', label: 'Region' },
  { value: 'pops', description: 'pop list to filter by', label: 'POPs' },
  { value: 'accounts', description: 'account hashes to filter by', label: 'accountHashs' },
  { value: 'hosts', description: 'host hashes to filter by', label: 'Hosts' },
];

export const statusFilter = [
  { value: 'statusCodes', description: '3 digit http status codes to filter by', label: 'StatusCodes' },
  {
    value: 'statusCategories',
    description: '1 digit http status codes categories to filter by',
    label: 'StatusCategories',
  },
  ...commonFilter,
];

export const commonGroupBy = [
  { value: 'PLATFORM', description: 'group by platform', label: 'PLATFORM' },
  { value: 'REGION', description: 'group by region', label: 'REGION' },
  { value: 'ACCOUNT', description: 'group by account', label: 'ACCOUNT' },
  { value: 'POP', description: 'group by pop', label: 'POP' },
  { value: 'HOST', description: 'group by host', label: 'HOST' },
];

export const statusGroupBy = [
  { value: 'STATUS', description: 'group by status code', label: 'STATUS_CODE' },
  { value: 'STATUS_CATEGORY', description: 'group by status category', label: 'STATUS_CATEGORY' },
  ...commonGroupBy,
];

export const platformsDef = [
  { value: 'DELIVERY', description: 'Delivery(include http&https)', label: 'Delivery' },
  { value: 'SHIELDING', description: 'Origin Shield', label: 'Origin Shield' },
  { value: 'INGEST', description: 'Ingest (include http&https ingest)', label: 'Ingest' },
  { value: 'CDS', description: 'Delivery(only http)', label: 'Http Delivery' },
  { value: 'SDS', description: 'Delivery(only https)', label: 'Https Delivery' },
  { value: 'CDD', description: 'Origin Shield(only http)', label: 'Http Shield' },
  { value: 'SDD', description: 'Origin Shield(only https)', label: 'Https Shield' },
  { value: 'CDI', description: 'Ingest(only http)', label: 'Http Ingest' },
  { value: 'SDI', description: 'Ingest(only https)', label: 'Https Ingest' },
];

export function getFilterOptions(options: ST3Query | string) {
  switch (typeof options === 'object' ? options.type : options) {
    case 'status':
      return {
        Metrics: statusMetrics,
        Filter: statusFilter,
        GroupBy: statusGroupBy,
      };
    case 'storage':
      return {
        Metrics: storageMetrics,
        Filter: commonFilter,
        GroupBy: commonGroupBy,
      };
    default:
      return {
        Metrics: transferMetrics,
        Filter: commonFilter,
        GroupBy: commonGroupBy,
      };
  }
}

//Convert intervalMS to Granularity string
export function intervalMsToGranularity(interval = 1000) {
  //Get interval to 5 minutes multiples
  console.log(interval);
  const c5 = Math.floor(interval / (5 * 60 * 1000));
  //5m 1hour 1day 1month
  const cHour = c5 / 12;
  const cDay = cHour / 24;
  return 'P' + (cHour < 1 ? 'T5M' : cDay > 30 ? '1M' : cDay >= 1 ? '1D' : 'T1H');
}
