# Let's Estimate Service
##### “Let's estimate" is a simple and open source planning estimation app that will speed up estimation in remote planning sessions“

## Installation Database

You need to download mongodb and you should run it locally. The default port is `27017`

You can find the `connection string` into `.development.env` file.
`MONGODB_URI=mongodb://localhost:27017/letsestimate`

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```


