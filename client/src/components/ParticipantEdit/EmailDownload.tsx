import React from 'react';
import Button from '@material-ui/core/Button';
import Firebase from '../Firebase';
import { saveAs } from 'file-saver';

interface Props {
    eventId: string,
    eventName: string
}

const EmailDownload: React.FC<Props> = (props: Props) => {
    const separator = ';'
    const handleDownload = async () => {
        const contacts:any = await Firebase.fetchContacts(props.eventId);
        const data = contacts.contacts
                .map((item:any) => `${item.name}${separator}${item.email}`)
                .reduce((p:string, c:string) => `${p}${c}\n`, "");
        const blob = new Blob([data], { type: "text/csv;charset=utf-8" });
        const fileName = props.eventName.toLowerCase().replace(/ /g, '') + '.csv';
        saveAs(blob, fileName);
    }

    return (
        <Button variant="contained" color="primary" size="medium" onClick={handleDownload}>Last ned epostadresser</Button>
    );
}

export default EmailDownload;