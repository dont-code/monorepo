import {Plugin, DontCodeModel, PluginConfig, Core} from '@dontcode/core';

/**
 * This plugin demonstrate 2 things:
 * - how to declare a new field type that can be selected in the Builder and how to manage the display and edition of this new type in the Previewer.
 * - As well it adds a new attribute 'seed' to any Entity and provides a viewer for the Previewer when its value is Yes or Maybe.
 */
export class CommercePlugin implements Plugin {

  public static readonly SHOP_ENTITY_NAME='Online Shop';

  getConfiguration(): PluginConfig {
    return {
      plugin: {
        id: 'CommercePlugin',
        'display-name': 'Commerce Plugin for anything related to products, prices, shops.',
        version: '1.0.0'
      },
      'schema-updates': [{
        id: 'price-field',
        description: 'A price of a product in a shop',
        changes: [{
          location: {
            parent: '#/$defs/field',
            id: 'type'
          },
          update: {
            enum: [{
              Commerce: {
                enum: [
                  'Price',
                  'Shop',
                  'Shop type'
                ]}
              }
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
                Commerce: {
                  enum: [
                    'Price'
                  ]}
            }]
          },
          class: {
            name: 'PriceComponent',
            source: 'commerce'
          }
        },
        {
          location: {
            parent: DontCodeModel.APP_FIELDS,
            id: 'type',
            values: [{
              Commerce: {
                enum: [
                  'Shop'
                ]}
            }]
          },
          class: {
            name: 'ShopHandlerComponent',
            source: 'commerce'
          }
        },
        {
          location: {
            parent: DontCodeModel.APP_FIELDS,
            id: 'type',
            values: [{
              Commerce: {
                enum: [
                  'Shop type'
                ]}
            }]
          },
          class: {
            name: 'ShopTypeHandlerComponent',
            source: 'commerce'
          }
        }
      ]
    }
  }

  pluginInit(dontCode: Core): void {
    // Nothing to do here
  }
}
