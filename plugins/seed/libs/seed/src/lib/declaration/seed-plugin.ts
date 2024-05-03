import {Plugin, DontCodeModel, PluginConfig, Core} from '@dontcode/core';

/**
 * This plugin demonstrate 2 things:
 * - how to declare a new field type that can be selected in the Builder and how to manage the display and edition of this new type in the Previewer.
 * - As well it adds a new attribute 'seed' to any Entity and provides a viewer for the Previewer when its value is Yes or Maybe.
 */
export class SeedPlugin implements Plugin {
  getConfiguration(): PluginConfig {
    return {
      plugin: {
        id: 'SeedPlugin',
        'display-name': 'An starter project for development of Dont-code plugins.',
        version: '1.0.0'
      },
      'schema-updates': [{
        id: 'seed-field',
        description: 'Add a new type of field to Dont-code: the SeedField',
        changes: [{
          location: {
            parent: '#/$defs/field',
            id: 'type'
          },
          update: {
            enum: [
              'Seed Field'
            ]
          },
          replace: false
        }]
      }, {
        id: "seeded-entity",
        description: "Adds 'seed' attribute to any entity and display the entity if seed is Maybe or Yes",
        changes: [{
          location: {
            parent: '#/$defs/entity',
            id: 'seed',
            after: 'name'
          },
          update: {
            enum: [
              'Yes',
              'Maybe'
            ]
          },
          replace: true
        }, {
          location: {
            parent: '/$defs/entity',
            id: 'seed',
            after: 'name'
          },
          update: {
            enum: [
              'No'
            ]
          },
          replace: false
        }]
      }],
      'preview-handlers': [
        {
          location: {
            parent: DontCodeModel.APP_FIELDS,
            id: 'type',
            values: [{
              Seed: {
                enum: [
                  'Seed Field'
                ]
              }
            }]
          },
          class: {
            name: 'SeedFieldComponent',
            source: 'seed'
          }
        },
        {
          location: {
            parent: DontCodeModel.APP_ENTITIES,
            id: "seed",
            values: [
              "Yes", "Maybe"
            ]
          },
          class: {
            name: "SeededEntityComponent",
            source: "seed"
          }
        }
      ]
    }
  }

  pluginInit(dontCode: Core): void {
    // Nothing to do here
  }
}
