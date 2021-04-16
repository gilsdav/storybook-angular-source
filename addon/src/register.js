import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const ADDON_ID = 'gilsdav/source';
export const PANEL_ID = `${ADDON_ID}/panel`;

function isOutput(arg) {
  if (arg instanceof Function && arg.name === 'actionHandler') {
    return true;
  } else {
    return false;
  }
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function asInput(key, arg) {
  return `[${key}]="${typeof arg === "string" ? `'${arg}'` : arg}"`;
}

function asOutput(key) {
  return `(${key})="on${capitalize(key)}($event)"`;
}

addons.register(ADDON_ID, api => {
  addons.addPanel(PANEL_ID, {
    type: types.PANEL,
    title: 'Source',
    render: ({ active, key }) => {
      if (active && api.getCurrentStoryData()) {
        const storyData = api.getCurrentStoryData();
        let code;
        try {
          const source = document.querySelector('#storybook-preview-iframe').contentDocument
            .querySelector('storybook-dynamic-app-root').children[0];
          const tag = source.tagName.toLowerCase();
          const params = Object.keys(storyData.args).map(key => {
            if (isOutput(storyData.args[key])) {
              return asOutput(key);
            } else {
              return asInput(key, storyData.args[key]);
            }
          });

          code = `
<${tag}
    ${params.join('\n    ')}
></${tag}>
`;
        } catch (e) {
          console.error(e);
          return '';
        }
        return (<AddonPanel active={active} key={key}>
          <SyntaxHighlighter language="wiki" style={coy}>
            {code}
          </SyntaxHighlighter>
        </AddonPanel>);
      } else {
        return '';
      }
    },
  });

});
