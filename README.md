# ghost-multiplayer-online-api

API for [ghost-multiplayer-online-react](https://github.com/parsec209/ghost-multiplayer-online-react), letting you play the classic word game Ghost against other players online. Game history is stored and turns are updated in realtime with optional email alerts. Uses Auth0, Socket.IO, Express, TypeScript, Sequelize, PostgreSQL, and Twilio Sendgrid.

## Quick Start

### Install dependencies

```console
$ npm install
```

### Environment variables

Refer to [.sample-env](.sample-env)

### Start Express dev server, database, and socket.io

```console
$ npm run dev
```

### Build for production

```console
$ npm run build
```

### PostgreSQL

Use any service that provides a PostgreSQL database. [ElephantSQL](https://www.elephantsql.com/) was used in this project.

### Auth0

You will need to have a machine to machine application and a
custom API setup with their service. Details for the client-side setup can be found in the [ghost-multiplayer-online-react](https://github.com/parsec209/ghost-multiplayer-online-react) repo.

### Merriam-Webster

Get an API key for Merriam-Webster's [collegiate dictionary](https://dictionaryapi.com/products/api-collegiate-dictionary).

### Twilio Sendgrid

Get an API key for [Twilio Sendgrid](https://sendgrid.com/solutions/email-api/?utm_source=google&utm_medium=cpc&utm_term=twilio%20sendgrid&utm_campaign=SendGrid_G_S_NAMER_Brand_Tier1&cq_plac=&cq_net=g&cq_pos=&cq_med=&cq_plt=gp&gad=1&gclid=EAIaIQobChMI0MmS_q60_wIViYBaBR1IIAakEAAYASAAEgL0FfD_BwE). Unfortunately you'll need to have a custom domain to send emails with their service. You can also use an npm package like nodemailer instead of Sendgrid, but it does not seem to work with Gmail. On a side note, don't be alarmed when you see game alert emails coming from imagetocsv.com if you are trying out my website, that domain is being used in another project and I did not feel it was necessary (for now) to pay for a separate domain just for this demo app.

## App Info

### Author

Ryan Galbreath

### Version

1.0.0

### License

MIT
