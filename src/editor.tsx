import { StandardEditorProps } from '@grafana/data';
import { CodeEditor } from '@grafana/ui';
import React from 'react';
import { PanelOptions } from 'types';

export const Editor = ({ value, onChange }: StandardEditorProps<string, any, PanelOptions>) => {
  return (
    <CodeEditor
      value={value}
      onSave={onChange}
      onBlur={onChange}
      showLineNumbers={true}
      showMiniMap={false}
      width={'100%'}
      height={'500px'}
      language="plaintext"
    />
  );
};
