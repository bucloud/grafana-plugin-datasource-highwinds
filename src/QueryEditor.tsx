import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms, Legend, Tooltip, InfoBox } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { ST3DataSource } from './DataSource';
import { defaultQuery, ST3DataSourceOptions, ST3Query } from './types';
import {CommonQueryField} from './components/CommonQueryField';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<ST3DataSource,ST3Query, ST3DataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  static templateUrl = 'partials/query.editor.html';

  onOptionsChange = (options: ST3Query) => {
    const { onChange, query, onRunQuery} = this.props;
    onChange({...query,...options});
    onRunQuery();
  }

  render() {
    const query = defaults(this.props.query, defaultQuery);

    return (
      <>
      <InfoBox title="Usage help" url={'https://grafana.com/docs/grafana/latest/variables/advanced-variable-format-options/#csv'}>
        <p>Only csv format variable is supported</p>
      </InfoBox>
      <CommonQueryField onChange={this.onOptionsChange} ds={this.props.datasource} options={query}/>
      </>
    );
  }
}
