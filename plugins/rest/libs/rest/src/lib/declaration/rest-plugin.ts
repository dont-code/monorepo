import {Plugin, DontCodeModel, PluginConfig, Core} from '@dontcode/core';

/**
 * This plugin enables loading / saving entities from any rest services.
 */
export class RestPlugin implements Plugin
{
  getConfiguration(): PluginConfig {
    return {
      plugin: {
        id: 'RestPlugin',
        'display-name': 'A plugin for entities managed through Rest APIs .',
        version: '1.0.0'
      },
      'schema-updates': [{
        id: 'rest-source',
        description: 'Add rest type of source',
        changes: [{
          location: {
            parent: '#/$defs/source',
            id: 'type'
          },
          update: {
            enum: [
              'Rest'
            ]
          },
          props: {
            url: {
              type: 'string'
            }
          },
          replace: false
        }]
      }],
      'global-handlers': [
        {
          location: {
            parent: DontCodeModel.ROOT+'/sources',
            id: 'type',
            values: ['Rest']
          },
          class: {
            name: 'SourceHandler',
            source: 'rest'
          }
        }
        ]

    }
  }

  pluginInit(dontCode: Core): void {
    // Nothing to do
  }
}
