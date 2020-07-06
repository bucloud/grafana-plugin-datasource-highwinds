import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms, Legend, Button, Icon } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { ST3DataSourceOptions, CustomHeader } from './types';
import uniqueId from 'lodash/uniqueId';

const { FormField } = LegacyForms;
interface Props extends DataSourcePluginOptionsEditorProps<ST3DataSourceOptions> {}

export interface State {
  headers: CustomHeader[];
}

interface CustomHeaderRowProps {
  header: CustomHeader;
  onReset: (id: string) => void;
  onRemove: (id: string) => void;
  onChange: (value: CustomHeader) => void;
  onBlur: () => void;
}

const CustomHeaderRow: React.FC<CustomHeaderRowProps> = ({ header, onBlur, onChange, onRemove, onReset }) => {
  return (
    <div style={{ display: 'flex', marginBottom: '4px' }}>
      <FormField
        label={'Header'}
        name={'name'}
        placeholder={'X-Custom-Header'}
        labelWidth={5}
        value={header.name || ''}
        onChange={e => onChange({ ...header, name: e.target.value })}
        onBlur={onBlur}
      />
      <FormField
        label={'Value'}
        name={'value'}
        type={'password'}
        value={header.value}
        labelWidth={5}
        inputWidth={header.configured ? 11 : 12}
        placeholder={'Header Value'}
        onReset={() => onReset(header.id)}
        onChange={e => onChange({ ...header, value: e.target.value })}
        onBlur={onBlur}
      />
      <Button variant={'secondary'} size={'xs'} onClick={_e => onRemove(header.id)}>
        <Icon name={'trash-alt'} />
      </Button>
    </div>
  );
};

export class ConfigEditor extends PureComponent<Props, State> {
  state: State = {
    headers: [],
  };

  constructor(props: Props) {
    super(props);
    const { jsonData } = this.props.options;
    console.log(jsonData.customHeaders);
    const preHeaders = (jsonData.customHeaders || []) as CustomHeader[];
    this.state = {
      headers: preHeaders,
    };
  }

  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        apiKey: event.target.value,
      },
    });
  };

  onApiBaseChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      url: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onAccountHashChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      defaultAccountHash: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  updateSettings = () => {
    const { headers } = this.state;
    let { jsonData } = this.props.options;
    const secureJsonData = this.props.options.secureJsonData || {};
    jsonData.customHeaders = headers;

    this.props.onOptionsChange({
      ...this.props.options,
      jsonData,
      secureJsonData,
    });
  };

  onHeaderAdd = () => {
    this.setState(prevState => {
      return { headers: [...prevState.headers, { id: uniqueId(), name: '', value: '', configured: false }] };
    }, this.updateSettings);
  };

  onHeaderChange = (headerIndex: number, value: CustomHeader) => {
    this.setState(({ headers }) => {
      return {
        headers: headers.map((item, index) => {
          if (headerIndex !== index) {
            return item;
          }
          return { ...value };
        }),
      };
    }, this.updateSettings);
  };

  onHeaderReset = (headerId: string) => {
    this.setState(({ headers }) => {
      return {
        headers: headers.map((h, i) => {
          if (h.id !== headerId) {
            return h;
          }
          return {
            ...h,
            value: '',
            configured: false,
          };
        }),
      };
    });
  };

  onHeaderRemove = (headerId: string) => {
    this.setState(
      ({ headers }) => ({
        headers: headers.filter(h => h.id !== headerId),
      }),
      this.updateSettings
    );
  };

  render() {
    const { options } = this.props;
    const { jsonData } = options;
    let headers = (jsonData.customHeaders || []) as CustomHeader[];
    return (
      <div className={'gf-form-group'}>
        <Legend>Striketracker3 Settings</Legend>
        <div className={'gf-form'}>
          <FormField
            label={'ApiBase'}
            labelWidth={10}
            inputWidth={20}
            onChange={this.onApiBaseChange}
            value={jsonData.url || ''}
            placeholder={'Striketracker API hostname'}
          />
        </div>
        <div className={'gf-form'}>
          <FormField
            label={'AccessToken'}
            labelWidth={10}
            inputWidth={20}
            type={'password'}
            onChange={this.onAPIKeyChange}
            value={jsonData.apiKey || ''}
            placeholder={'AccessToken to access endpoint'}
          />
        </div>
        <div className={'gf-form'}>
          <FormField
            label={'DefaultAccountHash'}
            labelWidth={10}
            inputWidth={20}
            onChange={this.onAccountHashChange}
            value={jsonData.defaultAccountHash || ''}
            placeholder={'Default accountHash like a1b1c1d1'}
          />
        </div>
        <Legend style={{ marginTop: '20px' }}>Custom Headers Settings</Legend>
        <div className={'gf-form-group'}>
          {headers.map((header, i) => (
            <CustomHeaderRow
              key={header.id}
              header={header}
              onChange={h => {
                this.onHeaderChange(i, h);
              }}
              onBlur={() => {}}
              onRemove={this.onHeaderRemove}
              onReset={this.onHeaderReset}
            />
          ))}
        </div>
        <div className={'gf-form'}>
          <Button
            variant={'secondary'}
            icon={'plus'}
            onClick={e => {
              this.onHeaderAdd();
            }}
          >
            Add header
          </Button>
        </div>
      </div>

      // </div>
    );
  }
}
