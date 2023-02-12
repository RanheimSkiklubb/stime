import Event from '../../model/event';
import {padStart, shuffle, sortBy} from 'lodash';
import MaterialTable from 'material-table';
import Firebase from '../Firebase';
import Participant from '../../model/participant';
import EventClass from '../../model/event-class';
import Registration from '../registration/Registration';
import Button from '@mui/material/Button';
import moment from 'moment';
import LateRegistration from '../LateRegistration';
import {Theme} from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import ContactDownload from './ContactDownload';
import StartGroup from '../../model/start-group';
import ImportParticipants from '../ImportParticipants';

interface Props {
    event: Event;
}

const useStyles = makeStyles((theme: Theme) => ({
        root: {
            padding: theme.spacing(1),
        },
    }));

const ParticipantEdit = (props: Props) => {
    const classes = useStyles();
    const eventClasses:any = {};
    sortBy(props.event.eventClasses, 'order').forEach(ec => eventClasses[ec.name] = ec.name);

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

    const participants = props.event.participants;
    const sortedParticipants = props.event.startListGenerated ? sortBy(participants, ["startTime", "startNumber"]) : sortBy(participants, (p:Participant) => padStart(eventClassOrder[p.eventClass], 3, "0") + p.firstName + p.lastName);
    const data:Participant[] = sortedParticipants;

    const typefixInput = (participant: any) => {
        if (participant.startNumber) {
            participant.startNumber = +participant.startNumber;
        }
    }

    interface Group {
        startGroup: StartGroup;
        eventClasses: EventClass[];
    }

    const handleGenerate = () => {
        const eventClasses = sortBy(props.event.eventClasses, 'order');
        const startGroups:{[id: string] : Group} = {
            default: {
                startGroup: {name: 'default', firstStartTime: props.event.startTime, separateNumberRange: false},
                eventClasses: []
            }
        };
        props.event.startGroups.forEach(sg => {
            startGroups[sg.name] = {
                startGroup: sg,
                eventClasses: []
            }
        });
        for (let eventClass of eventClasses) {
            if (eventClass.startGroup) {
                startGroups[eventClass.startGroup].eventClasses.push(eventClass)
            }
            else {
                startGroups.default.eventClasses.push(eventClass);
            }
        }

        const participants = props.event.participants;
        let startNumber = 1;
        for (const startGroupName in startGroups) {
            const group = startGroups[startGroupName];
            let startTime = moment(group.startGroup.firstStartTime);
            if (group.startGroup.separateNumberRange) {
                startNumber = group.startGroup.firstNumber || startNumber;
            }
            for (const eventClass of group.eventClasses) {
                eventClass.firstStartNumber = startNumber;
                eventClass.firstStartTime = startTime.toDate();
                const participantsInClass = shuffle(participants.filter(p => p.eventClass === eventClass.name));
                for (let p of participantsInClass) {
                    p.startNumber = startNumber++;
                    p.startTime = startTime.format("HH:mm:ss");
                    startTime = startTime.add(eventClass.startInterval, 's')
                }
                startNumber += eventClass.reserveNumbers;
                eventClass.lastStartNumber = startNumber - 1;
                startTime = startTime.add(eventClass.reserveNumbers * eventClass.startInterval, 's');
            }
        }
        props.event.startListGenerated = true;
        (async () => {
            await Firebase.updateParticipants(props.event.id, props.event.participants);
            await Firebase.updateEventClasses(props.event.id, props.event.eventClasses)
            await Firebase.setStartListGenerated(props.event.id);
        })();
    }

    const handlePublish = () => {
        (async () => {
            await Firebase.setStartListPublished(props.event.id);
        })();
    }
    
    const colors = ["white", "aliceblue"];
    let startTime:any;
    let backgroundColor:string = colors[0];

    return (
        <>
            <div className={classes.root}>
                {!props.event.startListGenerated ?
                    <><Registration event={props.event} />&nbsp;<ImportParticipants event={props.event} />&nbsp;</> :
                    <><LateRegistration event={props.event} caption="Etteranmelding"/>&nbsp;</>
                }
                {!props.event.startListPublished ? (<>
                    <Button variant="contained" color="primary" onClick={handleGenerate} disabled={props.event.startListPublished || props.event.participants.length === 0}
                        >Generer {props.event.startListGenerated ? 'Ny ' : ''}Startliste</Button>&nbsp;
                    <Button variant="contained" color="primary" onClick={handlePublish} disabled={!props.event.startListGenerated}
                        >Publiser Startliste</Button>&nbsp;
                </>) : null}
                <ContactDownload eventId={props.event.id} eventName={props.event.name}/>
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
                    exportDelimiter: ';',
                    rowStyle: x => {  
                        // striped rows, but color consecutive rows with same start time the same
                        if (props.event.startListGenerated && x.startTime !== startTime) {
                            startTime = x.startTime;
                            backgroundColor = colors[(colors.indexOf(backgroundColor) + 1) % 2];
                        }
                        return {backgroundColor};
                    }
                }}
                editable={{
                    onRowAdd: newData =>
                        new Promise<void>(resolve => {
                            resolve();
                            typefixInput(newData);
                            data.push(newData);
                            (async () => {
                                await Firebase.updateParticipants(props.event.id, data)
                            })();
                        }),
                    onRowUpdate: async (newData, oldData) =>
                        new Promise<void>(resolve => {
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
                        new Promise<void>(resolve => {
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
