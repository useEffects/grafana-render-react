import React from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions } from 'types';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import * as grafanaRuntime from '@grafana/runtime';
import { tw } from 'twind';
import axios from "axios"

interface Props extends PanelProps<PanelOptions> {}

export const Panel: React.FC<Props> = ({ options: { code }, data, width, height }) => {
  return (
    <div>
      <LiveProvider code={code} scope={{ data, width, height, React, grafanaRuntime, axios, tw }} noInline={true}>
        <LiveError />
        <LivePreview />
      </LiveProvider>
    </div>
  );
};
