# wit-tester-bot

Starts a Slack bot that connects to a given wit.ai project and allows testing
utterances. The bot only reports the results of calling Wit.


#### What you need
* A Slack bot `token`. Set env variable `SLACK_TOKEN`.
* A Wit `token` to the project. Set env variable `WIT_TOKEN`.
* [Docker](https://www.docker.com/products/overview) - Everything is done within containers for simplicity

*Note*
> This bot uses the Slack's [RTM API](https://api.slack.com/rtm), which acts as a Slack client, so it only needs the ability to connect to Slack. For anything more sophisticated, such as buttons in messages, you will need to create a [Slack App](https://api.slack.com/slack-apps). This is something much more involved.
