import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  ExploreMode,
  MutableDataFrame,
  ScopedVars,
} from '@grafana/data';
import { Observable, merge } from 'rxjs';

import { getBackendSrv } from '@grafana/runtime';
import { getTemplateSrv } from '@grafana/runtime';

import { ST3Query, ST3DataSourceOptions, defaultQuery, metricsDataList, ST3MetricQuery } from './types';

export class ST3DataSource extends DataSourceApi<ST3Query, ST3DataSourceOptions> {
  dsSettings: DataSourceInstanceSettings<ST3DataSourceOptions>;
  constructor(instanceSettings: DataSourceInstanceSettings<ST3DataSourceOptions>) {
    super(instanceSettings);
    this.dsSettings = instanceSettings;
  }

  //Going to add support for metric find query
  metricFindQuery(query: any) {
    return this.get('/api/v1/pops').then(res=>res.list.map((v:any)=>{
      return {label:v.name,value: v.code}
    }));

    return Promise.resolve([]);
  } 
  query(options: DataQueryRequest<ST3Query>): Observable<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.format("YYYY-MM-DDTHH:mm:ss\\Z");
    const to = range!.to.format("YYYY-MM-DDTHH:mm:ss\\Z");
    console.log(getTemplateSrv().getVariables().map(v=>{console.log(v,v.label,v.name,v.type,v.toString())}));
    // const q = getTemplateSrv().replace('SELECT * FROM services WHERE id = "$service"'));
    // const interval = intervalMsToGranularity(options.intervalMs) as ST3MetricQuery["granularity"]
    options.targets.map(v => {
      v.filters.startDate = from;
      v.filters.endDate = to;
      return v;
    });
    const streams = options.targets.map(target => {
      const query = defaults(target, defaultQuery);
      console.log(getTemplateSrv().replace(Object.entries(target.filters).map(v=>v[0]+'='+v[1]).join('&'),options.scopedVars));
      if (ExploreMode.Logs == options.exploreMode) {
        return this.log(query).then((res: any) => { return { data: [res], key: target.refId } });
      } else {
        return this.analytics(query,options.scopedVars).then((res: any) => { return { data: [res], key: target.refId } });
      }

    });
    return merge(...streams);
  }

  log(options: ST3Query) {
    return this.get('/api/v1/accounts/' + (options.accountHash || this.dsSettings.jsonData.defaultAccountHash) + '/analytics/' + options.type + '?' + (Object.entries(options.filters).map(v => v[0] + '=' + v[1]).join('&')))
      .then(res => {
        const metrics = options.metrics?.split(',') || [];
        // const metricsCount = metrics.length;
        const { series } = (res) as metricsDataList;
        // debugger;
        const metricsData = series.filter(v => v.data.length > 0);
        if (metricsData.length == 0) {
          throw {
            message: 'null data'
          };
        }

        let columnIndexs = Object.entries(metricsData[0].metrics).filter(v => metrics.includes(v[1])).map(v => parseInt(v[0]));//metricsData[0].metrics.filter(v=> metrics.includes(v) ).map((v,i)=>i);
        if (columnIndexs.length == 0) {
          throw {
            message: 'Metrics not found'
          }
        }
        let dataFields = [];
        dataFields.push({
          name: 'usageTime', values: (metricsData[0].data.map((v: number[]) => { return v[0] })), type: FieldType.time
        })
        metrics.forEach((m, i) => {
          dataFields.push(...(metricsData.map(v => {
            return {
              // name: metricsCount==1?v.key:(metricsData.length==1?m:v.key +'.'+m),
              name: v.key + '.' + m,
              values: v.data.map(dp => dp[columnIndexs[i]]),
              type: m.endsWith('Time') ? FieldType.time : FieldType.string
            }
          })))
        })
        return {
          refId: options.refId,
          fields: dataFields
        };
      })
  }

  analytics(options: ST3Query,scopedVars: ScopedVars={}) {
    if (options.metrics?.split(',').length == 0) {
      throw {
        message: "Mertics not set"
      }
    }
    return this.get('/api/v1/accounts/' + (options.accountHash || this.dsSettings.jsonData.defaultAccountHash) + '/analytics/' + options.type + '?' + getTemplateSrv().replace((Object.entries(options.filters).map(v => v[0] + '=' + v[1]).join('&')),scopedVars))
      .then(res => {
        const metrics = options.metrics?.split(',') || [];
        // const metricsCount = metrics.length;
        const { series } = (res) as metricsDataList;
        // debugger;
        const metricsData = series.filter(v => v.data.length > 0);
        if (metricsData.length == 0) {
          throw {
            message: 'null data'
          };
        }

        let columnIndexs = Object.entries(metricsData[0].metrics).filter(v => metrics.includes(v[1])).map(v => parseInt(v[0]));//metricsData[0].metrics.filter(v=> metrics.includes(v) ).map((v,i)=>i);
        if (columnIndexs.length == 0) {
          throw {
            message: 'Metrics not found'
          }
        }
        let dataFields = [];
        dataFields.push({
          name: 'usageTime', values: (metricsData[0].data.map((v: number[]) => { return v[0] })), type: FieldType.time
        })
        metrics.forEach((m, i) => {
          dataFields.push(...(metricsData.map(v => {
            return {
              // name: metricsCount==1?v.key:(metricsData.length==1?m:v.key +'.'+m),
              name: v.key + '.' + m,
              values: v.data.map(dp => dp[columnIndexs[i]]),
              type: m.endsWith('Time') ? FieldType.time : FieldType.number
            }
          })))
        })
        return {
          refId: options.refId,
          fields: dataFields
        };
      })
  }

  get(url: string, data?: undefined) {
    return this.request('GET', url, data)
      .then((results: any) => {
        // results.data.$$config = results.config;
        return results.data;
      })
      .catch((err: any) => {
        if (err.data && err.data.error) {
          throw {
            message: 'Request error: ' + err.data.error,
            error: err.data.error,
          };
        }

        throw err;
      });
  }

  //Request path /api/v1/accounts/{account_hash}/analytics/transfer?
  private request(method: string, uri: string, data?: undefined) {
    // debugger;
    // options=options.target[0];
    let requestOptions: any = {
      url: this.dsSettings.url + uri,
      method: method,
      headers: {
        Authorization: 'Bearer ' + this.dsSettings.jsonData.apiKey
      }
    }
    Object.assign(requestOptions.headers, ...(this.dsSettings.jsonData.customHeaders?.map(v => { return { [v.name]: v.value }; })));
    requestOptions.withCredentials = false;
    return getBackendSrv().datasourceRequest(requestOptions);
  }
  async testDatasource() {
    // Implement a health check for your data source.
    return this.get('/api/v1/users/me').then(res => {
      if (res) {
        return {
          status: 'success',
          message: 'Success'
        }
      } else {
        return {
          status: 'failed',
          message: 'unknow error'
        }
      }
    }).catch(failed => {
      return {
        status: 'failed',
        message: failed.message + ", Please check your accessToken"
      }
    });
  }
}