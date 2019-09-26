db.createUser(
    {
        user: "stime",
        pwd: '<add user password>',
        roles: [{ role: "readWrite", db: "stime" }]
    }
);
