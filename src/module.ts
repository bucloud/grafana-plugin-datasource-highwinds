import { DataSourcePlugin } from '@grafana/data';
import { ST3DataSource } from './DataSource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { ST3Query, ST3DataSourceOptions,ST3SecureJsonData } from './types';
import ExploreQueryEditor from './ExploreQueryEditor';
import ExploreStartPage from './ExploreStartPage';


export const plugin = new DataSourcePlugin<ST3DataSource, ST3Query, ST3DataSourceOptions,ST3SecureJsonData>(ST3DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor)
  .setExploreQueryField(ExploreQueryEditor)
  .setExploreStartPage(ExploreStartPage);