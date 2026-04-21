/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly REACT_APP_API_KEY?: string;
    readonly REACT_APP_AUTH_DOMAIN?: string;
    readonly REACT_APP_DATABASE_URL?: string;
    readonly REACT_APP_PROJECT_ID?: string;
    readonly REACT_APP_STOREAGE_BUCKET?: string;
    readonly REACT_APP_MESSAGING_SENDER_ID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
