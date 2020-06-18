import React from 'react';
import { CommonQueryField } from 'components/CommonQueryField';
import { ExploreQueryFieldProps } from '@grafana/data';
import { ST3DataSource } from 'DataSource';
import { ST3Query, ST3DataSourceOptions, defaultQuery } from 'types';
import { defaults } from 'lodash';
type Props = ExploreQueryFieldProps<ST3DataSource, ST3Query, ST3DataSourceOptions>;
export default (props: Props) => {
  
  const query = defaults(props.query,defaultQuery)
  
  const onQueryChange = (value: ST3Query) => {
    const { query, onChange, onRunQuery } = props;

    if (onChange) {
      // Update the query whenever the query field changes.
      onChange({ ...query, ...value });

      // Run the query on Enter.
      onRunQuery();
    }
  };

  return (
    <CommonQueryField options={query} ds={props.datasource} onChange={onQueryChange}></CommonQueryField>
  );
};