// import _ from 'lodash';
// // import flatten from 'app/core/utils/flatten';
// // import * as queryDef from './query_def';
// // import TableModel from 'app/core/table_model';
// import { DataQueryResponse, DataFrame, toDataFrame, FieldType, MutableDataFrame } from '@grafana/data';
// // import { ElasticsearchAggregation } from './types';

// export class ST3ResponseHandler {
//   constructor(/*private targets: any, */private response: any) {
//     // this.targets = targets;
//     this.response = response;
//   }

//   convert = () => {
//       return this.response.list
//   }
// }

// type Doc = {
//   _id: string;
//   _type: string;
//   _index: string;
//   _source?: any;
// };

// /**
//  * Flatten the docs from response mainly the _source part which can be nested. This flattens it so that it is one level
//  * deep and the keys are: `level1Name.level2Name...`. Also returns list of all properties from all the docs (not all
//  * docs have to have the same keys).
//  * @param hits
//  */
// const flattenHits = (hits: Doc[]): { docs: Array<Record<string, any>>; propNames: string[] } => {
//   const docs: any[] = [];
//   // We keep a list of all props so that we can create all the fields in the dataFrame, this can lead
//   // to wide sparse dataframes in case the scheme is different per document.
//   let propNames: string[] = [];

//   for (const hit of hits) {
//     const flattened = hit._source ? flatten(hit._source, null) : {};
//     const doc = {
//       _id: hit._id,
//       _type: hit._type,
//       _index: hit._index,
//       _source: { ...flattened },
//       ...flattened,
//     };

//     for (const propName of Object.keys(doc)) {
//       if (propNames.indexOf(propName) === -1) {
//         propNames.push(propName);
//       }
//     }

//     docs.push(doc);
//   }

//   propNames.sort();
//   return { docs, propNames };
// };

// /**
//  * Create empty dataframe but with created fields. Fields are based from propNames (should be from the response) and
//  * also from configuration specified fields for message, time, and level.
//  * @param propNames
//  * @param timeField
//  * @param logMessageField
//  * @param logLevelField
//  */
// const createEmptyDataFrame = (
//   propNames: string[],
//   timeField: string,
//   logMessageField?: string,
//   logLevelField?: string
// ): MutableDataFrame => {
//   const series = new MutableDataFrame({ fields: [] });

//   series.addField({
//     name: timeField,
//     type: FieldType.time,
//   });

//   if (logMessageField) {
//     series.addField({
//       name: logMessageField,
//       type: FieldType.string,
//     }).parse = (v: any) => {
//       return v || '';
//     };
//   } else {
//     series.addField({
//       name: '_source',
//       type: FieldType.string,
//     }).parse = (v: any) => {
//       return JSON.stringify(v, null, 2);
//     };
//   }

//   if (logLevelField) {
//     series.addField({
//       name: 'level',
//       type: FieldType.string,
//     }).parse = (v: any) => {
//       return v || '';
//     };
//   }

//   const fieldNames = series.fields.map(field => field.name);

//   for (const propName of propNames) {
//     // Do not duplicate fields. This can mean that we will shadow some fields.
//     if (fieldNames.includes(propName)) {
//       continue;
//     }

//     series.addField({
//       name: propName,
//       type: FieldType.string,
//     }).parse = (v: any) => {
//       return v || '';
//     };
//   }

//   return series;
// };

// const addPreferredVisualisationType = (series: any, type: string) => {
//   let s = series;
//   s.meta
//     ? (s.meta.preferredVisualisationType = type)
//     : (s.meta = {
//         preferredVisualisationType: type,
//       });

//   return s;
// };
