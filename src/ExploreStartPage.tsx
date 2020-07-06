import React from 'react';
import { ExploreStartPageProps, DataQuery } from '@grafana/data';

const examples = [
  {
    title: 'Addition',
    expression: '1 + 2',
    label: 'Add two integers',
  },
  {
    title: 'Subtraction',
    expression: '2 - 1',
    label: 'Subtract an integer from another',
  },
];
export default (props: ExploreStartPageProps) => {
  return (
    <div>
      <h2>Cheat Sheet</h2>
      {examples.map((item, index) => (
        <div className="cheat-sheet-item" key={index}>
          <div className="cheat-sheet-item__title">{item.title}</div>
          {item.expression ? (
            <div
              className="cheat-sheet-item__example"
              onChange={e => props.exploreMode}
              onClick={e => props.onClickExample({ refId: 'A', queryText: item.expression } as DataQuery)}
            >
              <code>{item.expression}</code>
            </div>
          ) : null}
          <div className="cheat-sheet-item__label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};
