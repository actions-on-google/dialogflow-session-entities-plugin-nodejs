# Dialogflow Session Entities for Actions on Google plugin

This plugin makes it easier to use [Dialogflow Session Entities](https://cloud.google.com/dialogflow/docs/entities-session#creating_session_entities_with_fulfillment)
in the [Actions on Google library](https://github.com/actions-on-google/actions-on-google-nodejs).

This plugin supports only Actions built with Dialogflow.

[![NPM Version](https://img.shields.io/npm/v/actions-on-google-dialogflow-session-entities-plugin.svg)](https://www.npmjs.org/package/actions-on-google-dialogflow-session-entities-plugin)

## Setup Instructions

Install the plugin with `npm install actions-on-google-dialogflow-session-entities-plugin`.

### Usage

This plugin adds a new method to the `conv` object to let you provide a single or set of entities
along with their synonyms.

You can use CRUD operations `add`, `get`, `set`, and `clear` to modify the array of session
entities you will be using. Call the `send` method to add these session entities to the
conversation response.

Typescript developers can import the `SessionEntity` interface for type-safety.

```javascript
const { dialogflow } = require('actions-on-google')
const { sessionEntitiesHelper } = require('actions-on-google-dialogflow-session-entities-plugin')

const app = dialogflow()
    .use(sessionEntitiesHelper())

app.intent('Default Welcome Intent', async (conv) => {
    // Get session entities through some method
    conv.ask('How can I help?')
    const entities = await asyncDatabaseCall()
    conv.sessionEntities.add(...entities)
    conv.sessionEntities.send()
})
```

## References & Issues
+ Questions? Go to [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google), [Assistant Developer Community on Reddit](https://www.reddit.com/r/GoogleAssistantDev/) or [Support](https://developers.google.com/actions/support/).
+ For bugs, please report an issue on Github.
+ Actions on Google [Documentation](https://developers.google.com/actions/extending-the-assistant)
+ Actions on Google [Codelabs](https://codelabs.developers.google.com/?cat=Assistant).

## Make Contributions
Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md).

## License
See [LICENSE](LICENSE).

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).
