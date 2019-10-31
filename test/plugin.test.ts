/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import test from 'ava'
import { dialogflow } from 'actions-on-google'
import { SessionEntityType, sessionEntitiesHelper, SessionEntitiesHelperConversation } from '../src/index'

test.serial('Verify CRUD operations in plugin', async t => {
  const app = dialogflow().use(sessionEntitiesHelper())
  app.fallback((conv: SessionEntitiesHelperConversation) => {
    conv.ask('How can I help?')
    const fruit: SessionEntityType = {
      name: 'fruit',
      entities: [{
        value: 'APPLE_KEY',
        synonyms: [ 'apple', 'green apple', 'crabapple' ]
      }, {
        value: 'ORANGE_KEY',
        synonyms: [ 'orange' ]
      }]
    }
    const vegetables: SessionEntityType = {
      name: 'vegetables',
      entities: [{
        value: 'OLIVE_KEY',
        synonyms: [ 'olives', 'black olives', 'green olives' ]
      }, {
        value: 'CARROT_KEY',
        synonyms: [ 'carrot', 'rabbit food' ]
      }]
    }
    const grains: SessionEntityType = {
      name: 'grains',
      entities: [{
        value: 'WHEAT_KEY',
        synonyms: [ 'wheat', 'whole grain' ]
      }, {
        value: 'RYE',
        synonyms: [ 'rye', 'wry' ]
      }]
    }

    conv.sessionEntities.add(fruit)
    t.is(1, conv.sessionEntities.get().length)
    t.deepEqual(fruit, conv.sessionEntities.get()[0])

    conv.sessionEntities.add(vegetables)
    t.is(2, conv.sessionEntities.get().length)
    t.deepEqual(fruit, conv.sessionEntities.get()[0])
    t.deepEqual(vegetables, conv.sessionEntities.get()[1])

    conv.sessionEntities.set(1, grains)
    t.is(2, conv.sessionEntities.get().length)
    t.deepEqual(fruit, conv.sessionEntities.get()[0])
    t.deepEqual(grains, conv.sessionEntities.get()[1])

    conv.sessionEntities.clear()
    t.is(0, conv.sessionEntities.get().length)

    conv.sessionEntities.add([fruit, vegetables, grains])
    t.is(3, conv.sessionEntities.get().length)
    t.deepEqual(fruit, conv.sessionEntities.get()[0])
    t.deepEqual(vegetables, conv.sessionEntities.get()[1])
    t.deepEqual(grains, conv.sessionEntities.get()[2])
  })
  t.pass(await app({}, {}))
})

test.serial('Verify response body applied', async t => {
  const expected = {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [{
            simpleResponse: {
              textToSpeech: 'How can I help?'
            }
          }]
        },
      }
    },
    sessionEntityTypes: [{
      name: 'undefined/entityTypes/fruit',
      entities: [{
        value: 'APPLE_KEY',
        synonyms: [
          'apple',
          'green apple',
          'crabapple'
        ]
      }, {
        value: 'ORANGE_KEY',
        synonyms: ['orange']
      }]
    }]
  }

  const app = dialogflow().use(sessionEntitiesHelper())
  app.fallback((conv: SessionEntitiesHelperConversation) => {
    const fruit: SessionEntityType = {
      name: 'fruit',
      entities: [{
        value: 'APPLE_KEY',
        synonyms: [ 'apple', 'green apple', 'crabapple' ]
      }, {
        value: 'ORANGE_KEY',
        synonyms: [ 'orange' ]
      }]
    }
    conv.ask('How can I help?')
    conv.sessionEntities.add(fruit)
    conv.sessionEntities.send()
    const actual = JSON.parse(JSON.stringify(conv.serialize()))
    t.deepEqual(expected, actual)
  })
  t.pass(await app({}, {}))
})
