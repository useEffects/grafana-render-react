import React from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions } from 'types';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import * as grafanaRuntime from '@grafana/runtime';
import { tw } from 'twind';
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import * as grafanaUi from "@grafana/ui"

interface Props extends PanelProps<PanelOptions> { }

export const Panel = ({ options: { code }, data, width, height }: Props) => {
  return (
    <div>
      <LiveProvider code={code} scope={{ data, width, height, React, grafanaRuntime, axios, tw, FontAwesomeIcon, icons, grafanaUi }} noInline={true}>
        <LiveError />
        <LivePreview />
      </LiveProvider>
    </div>
  );
};
