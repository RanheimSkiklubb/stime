import React from 'react';
import Event from '../../model/event';
import _ from 'lodash';
import MaterialTable from 'material-table';
import Firebase from '../Firebase';
import Participant from '../../model/participant';
import EventClass from '../../model/event-class';
import Registration from '../registration/Registration';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";

interface Props {
    event: Event;
}

interface Row {
    name: string,
    club: string,
    eventClass: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
        },
    }));

const ParticipantEdit: React.FC<Props> = (props: Props) => {
    const classes = useStyles({});
    const eventClasses:any = {};
    props.event.eventClasses.forEach(ec => eventClasses[ec.name] = ec.name);

    const startListColumns = [
        {title: 'Startnr', field: 'startNumber', type: 'numeric'},
        {title: 'Starttid', field: 'startTime'},
        {title: 'Fornavn', field: 'firstName'},
        {title: 'Etternavn', field: 'lastName'},
        {title: 'Klubb', field: 'club'},
        {title: 'Klasse', field: 'eventClass', lookup: eventClasses}
    ];

    const participantListColumns = [
        {title: 'Fornavn', field: 'firstName'},
        {title: 'Etternavn', field: 'lastName'},
        {title: 'Klubb', field: 'club'},
        {title: 'Klasse', field: 'eventClass', lookup: eventClasses}
    ];

    const eventClassOrder:any = props.event.eventClasses.reduce((p:any, c:EventClass) => {
        p[c.name] = c.order; 
        return p
    }, {});

    const sortMapping: Record<string, number> = {};
    props.event.eventClasses.forEach((ec, idx) => sortMapping[ec.name] = idx);
    const participants = props.event.participants;
    const sortedParticipants = props.event.startListGenerated ? _.sortBy(participants, "startTime") : _.sortBy(participants, (p:Participant) => eventClassOrder[p.eventClass] + p.firstName + p.lastName);
    const data:Participant[] = sortedParticipants;

    const typefixInput = (participant: any) => {
        if (participant.startNumber) {
            participant.startNumber = +participant.startNumber;
        }
    }

    const handleGenerate = () => {
        const participants = props.event.participants;
        let startNumber = 1;
        let startTime = moment(props.event.startTime);
        for (let eventClass of props.event.eventClasses) {
            const participantsInClass = _.shuffle(participants.filter(p => p.eventClass === eventClass.name));
            for (let p of participantsInClass) {
                p.startNumber = startNumber++;
                p.startTime = startTime.format("HH:mm:ss");
                startTime = startTime.add(eventClass.startInterval, 's')
            }
            startNumber += eventClass.reserveNumbers;
            startTime = startTime.add(eventClass.reserveNumbers * eventClass.startInterval, 's');
        }
        props.event.startListGenerated = true;
        (async () => {
            await Firebase.updateParticipants(props.event.id, props.event.participants);
            await Firebase.setStartListGenerated(props.event.id);
        })();
    }

    const handlePublish = () => {
        (async () => {
            await Firebase.setStartListPublished(props.event.id);
        })();
        alert("Startliste publisert!");
    }

    return (
        <>
            <div className={classes.root}>
                {!props.event.startListGenerated ? <><Registration event={props.event} />&nbsp;</> : null}
                {!props.event.startListPublished ? (<>
                    <Button variant="contained" color="primary" onClick={handleGenerate} disabled={props.event.startListPublished}>Generer Startliste</Button>&nbsp;
                    <Button variant="contained" color="primary" onClick={handlePublish} >Publiser Startliste</Button>
                </>) : null}
            </div>
            <MaterialTable
                title=""
                columns = {props.event.startListGenerated ? startListColumns : participantListColumns}
                data = {data}
                options={{
                    sorting: false,
                    paging: false,
                    padding: "dense",
                    exportButton: true,
                    exportDelimiter: ';'
                }}
                editable={{
                    onRowAdd: newData =>
                        new Promise(resolve => {
                            resolve();
                            typefixInput(newData);
                            data.push(newData);
                            (async () => {
                                await Firebase.updateParticipants(props.event.id, data)
                            })();
                        }),
                    onRowUpdate: async (newData, oldData) =>
                        new Promise(resolve => {
                            resolve();
                            if (oldData) {
                                typefixInput(newData);
                                data[data.indexOf(oldData)] = newData;
                                (async () => {
                                    await Firebase.updateParticipants(props.event.id, data)
                                })();
                            }
                        }),
                    onRowDelete: oldData =>
                        new Promise(resolve => {
                            resolve();
                            data.splice(data.indexOf(oldData), 1);
                            (async () => {
                                await Firebase.updateParticipants(props.event.id, data)
                            })();
                        })
                }}
            />
        </>

    ); 
}

export default ParticipantEdit;