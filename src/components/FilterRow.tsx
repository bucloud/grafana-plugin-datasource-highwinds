import React, { ChangeEvent, PureComponent, useState } from 'react';
import { HorizontalGroup, Select, MultiSelect, Button, Icon, AsyncMultiSelect } from '@grafana/ui';
import { ST3Query } from "../types";
import { SelectableValue } from '@grafana/data';


interface rowProps {
    // options: ST3Query;
    onOptionsUpdate: (name: string,value: SelectableValue<string> | SelectableValue<string>[] | string[] | string ) => void;
    onRemove: (event: React.MouseEvent<HTMLButtonElement,MouseEvent> ) => void;
    loadOptions: (query: string) => Promise<SelectableValue<string>[]>;
    filterOptions: SelectableValue<string>[];
    // valueOptions: SelectableValue<string>[];
}

export class FilterRow extends PureComponent<rowProps> {
    constructor(props: rowProps) {
        super(props);
    }
    render() {
        const [filterName,setFilterName] = useState<string|undefined>("empty");
        const [filterValue, setFilterValue] = useState<SelectableValue<string>[]>([]);
        const [customOptions, setCustomOptions] = useState<SelectableValue<string>[]>([]);

        return (
            <>
            <div style={{ marginBottom: 4, width: "100%" }}>
                        <HorizontalGroup>
                            <label className={"gf-form-label width-6 query-keyword"} style={{ marginRight: 0 }}>Filter</label>
                            <Select
                                width={25}
                                options={this.props.filterOptions}
                                onChange={v=>setFilterName(v.value)}
                                value={filterName}
                            />
                            <AsyncMultiSelect
                                loadOptions={this.props.loadOptions}
                                // options={this.state.customOptions[i]?[...options,...this.state.customOptions[i]]:options}
                                value={filterValue}
                                width={42}
                                defaultOptions
                                onChange={v=>{setFilterValue(v);this.props.onOptionsUpdate(filterName||"empty",v.map(val=>val.value));}}
                                allowCustomValue
                                disabled={filterName == "empty"}
                                onCreateOption={customValue => {
                                    setCustomOptions([{value:customValue,label:customValue},...customOptions])
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