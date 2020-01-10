## STime MongoDB setup

### Run MongoDb locally
Run MongoDB locally using Docker with:  `docker-compose up -d` from the `/mongo` directory. Make sure the mounted database directory in `docker-compose.yml` matches your local setup

### First time setup of MongoDb database
1. Add admin password and application user password to the script files `admin.js` and `user.js`. Do not check this into Git.
2. Copy the content of the `script` folder into you running container. E.g. by copying into a temporary directory under your file mount (e.g. `/opt/data/stime/mongodb/temp`)
3. Attach to the mongodb container by running `docker exec -it stime-mongo /bin/bash`
4. Find the mounted directory within the container and run the `init_mongo.sh` script
5. Create the collection `event`
6. Create a unique index on the `id` key in the event collection, by running: `db.event.createIndex( { "id": 1 }, { unique: true } )`
7. Create the collection `config`. Populate it with a single object with `_id=1`. A template for the `config` collection can be found in [`templates/config.json`](templates/config.json)

### Add a new event
To add a new event, insert a new document into the `event` collection. [`templates/event.json`](templates/config.json) contains a template for an object in the `event` collection.
