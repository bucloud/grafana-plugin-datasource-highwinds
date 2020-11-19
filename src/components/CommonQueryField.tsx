import React from 'react';
import { ST3Query, GroupBy, PoPInfo, Granularity } from 'types';
import { HorizontalGroup, Select, MultiSelect, Button, Icon, AsyncMultiSelect, AsyncSelect } from '@grafana/ui';
import { getFilterOptions, statusFilter, platformsDef } from 'utils';
import { SelectableValue } from '@grafana/data';
import uniqueId from 'lodash/uniqueId';
import { ST3DataSource } from 'DataSource';

interface Props {
  options: ST3Query;
  ds: ST3DataSource;
  onChange: (options: ST3Query) => void;
}

interface QueryFilter {
  name: string;
  value: SelectableValue[];
  id: string;
  customOptions?: Array<SelectableValue<string>>;
}

interface State {
  metrics: Array<SelectableValue<any>> | any[];
  filter?: QueryFilter[];
  platforms: Array<SelectableValue<any>> | any[];
  groupBy: GroupBy;
  type: 'transfer' | 'status' | 'storage';
  accountHash: SelectableValue;
  interval?: Granularity;
}

export class CommonQueryField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { options, ds } = this.props;
    const f = statusFilter.map(v => {
      return v.value;
    });
    this.state = {
      metrics: options.metrics?.split(',') || [],
      filter: Object.entries(options.filters)
        .filter(v => f.includes(v[0]))
        .map(v => {
          return { name: v[0], value: v[1].split(','), id: uniqueId() };
        }),
      // filter: Object.keys(options).filter((v)=>{f.includes[v}).map((v)=>{return {[v]:options[v].split(',')}})
      groupBy: (options.filters?.groupBy || 'ACCOUNT') as GroupBy,
      platforms: options.filters?.platforms.split(','),
      type: 'transfer',
      accountHash: {
        label: 'default: ' + ds.dsSettings.jsonData.defaultAccountHash,
        value: ds.dsSettings.jsonData.defaultAccountHash,
      },
      interval: Granularity.PT1H,
    };
    // console.log(this.state.metrics, this.state.metrics.length);
  }
  updateOptions = () => {
    //Parse metrics
    const { options, onChange } = this.props;
    let filters = {};
    Object.assign(
      filters,
      ...this.state.filter?.map(v => {
        return { [v.name]: v.value.map(v => v.value).join(',') };
      })
    );
    onChange({
      ...options,
      metrics: this.state.metrics?.join(','),
      type: this.state.type,
      accountHash: this.state.accountHash.value,
      filters: {
        ...filters,
        groupBy: this.state.groupBy,
        platforms: this.state.platforms.join(','),
        granularity: this.state.interval,
      },
    });
  };

  render() {
    const selectOptions = getFilterOptions(this.state.type);
    if (this.state.metrics.length === 0) {
      this.setState({
        ...this.state,
        metrics: Array<SelectableValue<any>>(selectOptions.Metrics[0]),
      });
    }
    const onSingleValueChange = (v: any) => {
      this.setState(state => {
        return {
          ...state,
          ...v,
        };
      }, this.updateOptions);
    };

    const onFilterChange = (obj: QueryFilter) => {
      let { filter } = this.state;
      if (filter?.filter(v => v.id === obj.id).length === 0) {
        filter.push(obj);
      } else {
        filter = filter?.map(o => (o.id === obj.id ? { ...o, ...obj } : o));
      }
      this.setState(
        state => {
          return {
            ...state,
            filter: filter,
          };
        },
        obj.value.length === 0 ? () => {} : this.updateOptions
      );
    };

    const onFilterRemove = (i: string) => {
      const { filter } = this.state;
      this.setState(state => {
        return {
          ...state,
          filter: filter?.filter(v => v.id !== i),
        };
      }, this.updateOptions);
    };

    const onFilterAdd = (i: any) => {
      const { filter } = this.state;
      this.setState(state => {
        return {
          ...state,
          filter: [...filter, i],
        };
      });
    };

    const onCreateCustomOptions = (fid: string, v: string) => {
      this.setState(state => {
        return {
          ...state,
          filter: state.filter?.map(f => {
            if (f.id === fid) {
              return {
                ...f,
                value: [...f.value, { label: v, value: v }],
                customOptions: [{ value: v, label: v }, ...(f.customOptions || [])],
              };
            } else {
              return f;
            }
          }),
        };
      }, this.updateOptions);
    };

    const loadOptions = (query: string, type = 'pops') => {
      // console.log(this.state.filter?.filter(v => v.id === customOptionsID).map((fv)=>{return fv.customOptions}));
      // let co = this.state.filter?.filter(v => v.id === customOptionsID).splice(0,1).map((v)=>{return v.customOptions || []})[0] as SelectableValue<string>[];
      const { ds } = this.props;
      return new Promise<Array<SelectableValue<string>>>(resolve =>
        resolve(
          type === 'pops'
            ? ds.get('/api/v1/pops').then(res => {
                return res.list.map((p: PoPInfo) => {
                  return { label: p.country + ': ' + p.code, value: p.code };
                });
              })
            : type === 'accounts' || type === 'hosts'
            ? ds.get('/api/v1/accounts/' + this.state.accountHash.value + '/search?search=' + query).then(res => {
                if (type === 'hosts') {
                  return res['hostnames'].map(
                    (host: {
                      hostHash: string;
                      name: string;
                      accountHash: string;
                      accountName: string;
                      scopeId: string;
                    }) => {
                      return {
                        label:
                          host.name +
                          '(' +
                          host.hostHash +
                          (host.accountHash !== this.state.accountHash.value
                            ? ' below to account' + host.accountHash
                            : '') +
                          ')',
                        value: host.hostHash,
                      };
                    }
                  );
                } else if (type === 'accounts') {
                  return res['accounts'].map(
                    (account: {
                      accountHash: string;
                      accountName: string;
                      displayName: string;
                      grandparent: string;
                      parent: string;
                      id: string;
                    }) => {
                      return {
                        label: account.accountHash + '(' + account.accountName + ' => ' + account.parent + ')',
                        value: account.accountHash,
                      };
                    }
                  );
                } else {
                  return;
                }
                // return Object.entries(res).filter(v=>v[0]===(type==='HOST'?'hostnames':(type==='ACCOUNT'?'accounts':''))).map((o:any[])=>{
                //     return o[1].map(v=>{
                //         return {label:(type==='HOST'?)}
                //     })
                // })
              })
            : type === 'billingRegions'
            ? [
                { label: 'North America + Europe', value: 'us' },
                { label: 'Asia', value: 'as' },
                { label: 'South America', value: 'sa' },
                { label: 'Oceania', value: 'oc' },
              ]
            : []
        )
      );
    };
    return (
      <>
        <div style={{ marginBottom: 4 }}>
          <HorizontalGroup>
            <label className={'gf-form-label width-6 query-keyword'} style={{ marginRight: 0 }}>
              Metrics Type
            </label>
            <Select
              options={[
                { label: 'Transfer/Bandwidth', value: 'transfer' },
                { label: 'statusCode', value: 'status' },
                { label: 'CachedObjects', value: 'storage' },
              ]}
              onChange={v => onSingleValueChange({ type: v.value })}
              defaultValue={'transfer'}
              value={this.state.type}
            />
            <label className={'gf-form-label width-6 query-keyword'} style={{ marginRight: 0 }}>
              For Account
            </label>
            <AsyncSelect
              loadOptions={v => loadOptions(v, 'accounts')}
              defaultOptions
              onChange={v => onSingleValueChange({ accountHash: v })}
              value={this.state.accountHash}
            />
          </HorizontalGroup>
        </div>
        <div style={{ marginBottom: 4 }}>
          <HorizontalGroup>
            <label className={'gf-form-label width-6 query-keyword'} style={{ marginRight: 0 }}>
              Metrics
            </label>
            <MultiSelect
              options={selectOptions.Metrics}
              onChange={v =>
                onSingleValueChange({
                  metrics: v.map(v => {
                    return v.value;
                  }),
                })
              }
              value={this.state.metrics}
              defaultValue={selectOptions.Metrics[0]}
              // allowCustomValue
              // onCreateOption={(v) => onSingleValueChange({ metrics: v })}
              placeholder="Choose metrics to display"
              invalid={this.state.metrics?.length === 0}
              width={75}
            />
          </HorizontalGroup>
        </div>
        <div style={{ marginBottom: 4 }}>
          <HorizontalGroup>
            <label className={'gf-form-label width-6 query-keyword'} style={{ marginRight: 0 }}>
              *Platforms
            </label>
            <MultiSelect
              options={
                this.state.platforms.find(v => {
                  return ['DELIVERY', 'INGEST', 'SHIELDING'].includes(v);
                })
                  ? platformsDef.slice(0, 3)
                  : this.state.platforms.length
                  ? platformsDef.slice(3)
                  : platformsDef
              }
              onChange={v => {
                onSingleValueChange({
                  platforms: v.map(v => {
                    return v.value;
                  }),
                });
              }}
              width={25}
              value={this.state.platforms}
              invalid={this.state.platforms.length === 0}
              // defaultValue={["DELIVERY"]}
            />
          </HorizontalGroup>
        </div>
        <div style={{ marginBottom: 4 }}>
          <HorizontalGroup>
            <label className={'gf-form-label width-6 query-keyword'} style={{ marginRight: 0 }}>
              GroupBy
            </label>
            <Select
              options={selectOptions.GroupBy}
              onChange={v => {
                onSingleValueChange({ groupBy: v.value });
              }}
              width={25}
              value={this.state.groupBy}
            />
          </HorizontalGroup>
        </div>
        <div style={{ marginBottom: 4 }}>
          <HorizontalGroup>
            <label className={'gf-form-label width-6 query-keyword'} style={{ marginRight: 0 }}>
              Granularity
            </label>
            <Select
              options={[
                { value: 'PT5M', label: '5 Minutes' },
                { value: 'PT1H', label: '1 Hour' },
                { value: 'P1D', label: '1 Day' },
                { value: 'P1M', label: '1 Month' },
              ]}
              onChange={v => {
                onSingleValueChange({ interval: v.value });
              }}
              width={25}
              value={this.state.interval}
            />
          </HorizontalGroup>
        </div>

        {this.state.filter?.map(f => (
          // <FilterRow
          // onOptionsUpdate={()=>{}}
          // onRemove={()=>{}}
          // loadOptions={(q)=>{return loadAsyncOptions(q,"asd")}}
          // filterOptions={selectOptions.Filter.filter(v => (!this.state.filter?.map(fv => fv.name).includes(v.value)) || v.value === f.name)}

          // />
          <div style={{ marginBottom: 4, width: '100%' }}>
            <HorizontalGroup>
              <label className={'gf-form-label width-6 query-keyword'} style={{ marginRight: 0 }}>
                Filter
              </label>
              <Select
                width={25}
                options={selectOptions.Filter.filter(
                  v => !this.state.filter?.map(fv => fv.name).includes(v.value) || v.value === f.name
                )}
                onChange={v => {
                  onFilterChange({ id: f.id, name: v.value || 'empty', value: [] });
                }}
                value={f.name}
              />
              <AsyncMultiSelect
                loadOptions={v => loadOptions(v, f.name)}
                // options={[]}
                value={f.value}
                width={42}
                defaultOptions
                onChange={v => {
                  onFilterChange({ id: f.id, name: f.name, value: v });
                }}
                allowCustomValue
                disabled={f.name === 'empty'}
                onCreateOption={customValue => {
                  onCreateCustomOptions(f.id, customValue);
                  // onFilterChange({ id: f.id, name: f.name, value: [...f.value, customValue] });
                }}
                // formatCreateLabel={s=>s}
              />
              <Button
                variant="secondary"
                size="xs"
                onClick={e => {
                  onFilterRemove(f.id);
                }}
              >
                <Icon name="trash-alt" />
              </Button>
            </HorizontalGroup>
          </div>
        ))}
        {/* {selectOptions.Filter.filter(v => (!this.state.filter?.map(fv => fv.name).includes(v.value))).length>0 && */}
        {selectOptions.Filter.length > (this.state.filter?.length || 0) && (
          <div className="gf-form">
            <Button
              variant="secondary"
              icon="plus"
              onClick={e => {
                onFilterAdd({ id: uniqueId(), name: 'empty', value: [] });
              }}
            >
              Add addtional filter
            </Button>
          </div>
        )}
      </>
    );
  }
}
