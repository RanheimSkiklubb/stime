db.createUser(
    {
        user: 'admin',
        pwd: '<add admin password>',
        roles: [{ role: "userAdminAnyDatabase", db: "admin" } ]
    }
);
