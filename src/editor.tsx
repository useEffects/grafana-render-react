import { StandardEditorProps } from '@grafana/data';
import { CodeEditor } from '@grafana/ui';
import React, { FC } from 'react';
import { PanelOptions } from 'types';

export const Editor: FC<StandardEditorProps<string, any, PanelOptions>> = ({ value, onChange }) => {
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
