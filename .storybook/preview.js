
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  a11y: {
    element: '#root',
    config: {},
    options: {},
    manual: true,
  }
}