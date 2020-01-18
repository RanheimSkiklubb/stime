import React from "react";

export interface WithFirebaseProps {
    firebase: firebase.app.App;
}

const FirebaseContext = React.createContext<firebase.app.App|null>(null);

export const withFirebase = <P extends object>(
    Component: React.ComponentType<P>
): React.FC<P & WithFirebaseProps> => ({
    firebase,
    ...props
}: WithFirebaseProps) => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props as P} firebase={firebase} />}
    </FirebaseContext.Consumer>
)

export default FirebaseContext;