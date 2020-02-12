import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';

admin.initializeApp();

export const addAdminRole = functions.auth.user().onCreate(async (user) => {
    const adminUsers = [
        'jorn@olmheim.com',
        'oyvind.ronne@gmail.com',
        'tor.erik.rabben@gmail.com'
    ];

    if (user.emailVerified && _.includes(adminUsers, user.email)) {
        try {
            await admin.auth().setCustomUserClaims(user.uid, {
                admin: true
            });
            console.log('User with email ' + user.email + ' has been updated with the admin claim.');
        } catch (err) {
            console.log('Creating admin claim failed: ', err);
        }
    }
});