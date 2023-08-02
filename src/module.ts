import { PanelPlugin } from "@grafana/data";
import { PanelOptions } from "./types";
import { Panel } from "./main";
import { Editor } from "editor";

export const plugin = new PanelPlugin<PanelOptions>(Panel).setPanelOptions((builder) => {
  return builder
  .addCustomEditor({
    id: "code",
    path: "code",
    name: "Source code",
    description: "Source code of the react component",
    editor: Editor,
  })
});
