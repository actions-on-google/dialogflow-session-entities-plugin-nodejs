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

import { Plugin, DialogflowApp, Contexts, DialogflowConversation, GoogleCloudDialogflowV2WebhookResponse, GoogleCloudDialogflowV2WebhookRequest } from 'actions-on-google'

export interface SessionEntityType {
  name: string
  entities: {
    value: string
    synonyms: string[]
  }[]
}

interface ResponseBody extends GoogleCloudDialogflowV2WebhookResponse {
  sessionEntityTypes: SessionEntityType[]
}

export class SessionEntitiesPlugin {
  conv: DialogflowConversation
  entities: SessionEntityType[]

  constructor(conv: DialogflowConversation) {
    this.conv = conv
    this.entities = []
  }

  add(entity: SessionEntityType | SessionEntityType[]) {
    if (Array.isArray(entity)) {
      this.entities.push(...entity)
    } else {
      this.entities.push(entity)
    }
  }

  set(index: number, entity: SessionEntityType) {
    this.entities[index] = entity
  }

  get(): SessionEntityType[] {
    return this.entities
  }

  clear() {
    this.entities.splice(0, this.entities.length)
  }

  send() {
    const responseBody = this.conv.serialize() as ResponseBody
    const convBody = this.conv.body as GoogleCloudDialogflowV2WebhookRequest
    responseBody.sessionEntityTypes = this.entities.map(entity => {
      entity.name = `${convBody.session}/entityTypes/${entity.name}`
      return entity
    })
    this.conv.json(responseBody)
  }
}

export interface SessionEntitiesHelperConversation extends DialogflowConversation {
  sessionEntities: SessionEntitiesPlugin
}

export const sessionEntitiesHelper = (): Plugin<
  DialogflowApp<{}, {}, Contexts, DialogflowConversation<{}, {}>>,
  {}> => {
    return (app) => {
      app.middleware(conv => {
        const sessionEntities = new SessionEntitiesPlugin(conv)
        return Object.assign(conv, { sessionEntities } as SessionEntitiesHelperConversation)
      })
    }
  }
