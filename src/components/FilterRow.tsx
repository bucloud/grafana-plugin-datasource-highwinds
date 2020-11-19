import React, { PureComponent } from 'react';
import { HorizontalGroup, Select, Button, Icon, AsyncMultiSelect } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

interface RowProps {
  // options: ST3Query;
  onOptionsUpdate: (
    name: string,
    value: SelectableValue<string> | Array<SelectableValue<string>> | string[] | string
  ) => void;
  onRemove: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loadOptions: (query: string) => Promise<Array<SelectableValue<string>>>;
  filterOptions: Array<SelectableValue<string>>;
  // valueOptions: SelectableValue<string>[];
}
interface State {
  filterName?: string | undefined;
  filterValue?: Array<SelectableValue<string>>;
  customOptions?: Array<SelectableValue<string>>;
}
export class FilterRow extends PureComponent<RowProps> {
  state: State;
  constructor(props: RowProps) {
    super(props);
    this.state = {
      filterName: 'empty',
      filterValue: [],
      customOptions: [],
    };
  }

  render() {
    // const [filterName, setFilterName] = useState<string | undefined>('empty');
    // const [filterValue, setFilterValue] = useState<Array<SelectableValue<string>>>([]);
    // const [customOptions, setCustomOptions] = useState<Array<SelectableValue<string>>>([]);

    return (
      <>
        <div style={{ marginBottom: 4, width: '100%' }}>
          <HorizontalGroup>
            <label className={'gf-form-label width-6 query-keyword'} style={{ marginRight: 0 }}>
              Filter
            </label>
            <Select
              width={25}
              options={this.props.filterOptions}
              onChange={v => this.setState({ ...this.state, filterName: v.value })}
              value={this.state.filterName}
            />
            <AsyncMultiSelect
              loadOptions={this.props.loadOptions}
              // options={this.state.customOptions[i]?[...options,...this.state.customOptions[i]]:options}
              value={this.state.filterValue}
              width={42}
              defaultOptions
              onChange={v => {
                this.setState({ ...this.state, filterValue: v });
                this.props.onOptionsUpdate(
                  this.state.filterName || 'empty',
                  v.map(val => val.value)
                );
              }}
              allowCustomValue
              disabled={this.state.filterName === 'empty'}
              onCreateOption={customValue => {
                this.setState({
                  ...this.state,
                  customOptions: [{ value: customValue, label: customValue }, ...this.state.customOptions],
                });
              }}
            />
            <Button variant="secondary" size="xs" onClick={this.props.onRemove}>
              <Icon name="trash-alt" />
            </Button>
          </HorizontalGroup>
        </div>
      </>
    );
  }
}
