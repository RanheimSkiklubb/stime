import React from 'react';
import MaterialTable, { Column } from 'material-table';
import EventClass from '../../model/event-class';
import Firebase from '../Firebase';
import Event from '../../model/event';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {max, find, sortBy} from 'lodash';
import { Theme } from '@mui/material/styles';
import {makeStyles} from '@mui/styles';

interface Props {
    event: Event
}

const EventClassEdit: React.FC<Props> = (props: Props) => {
    const data:EventClass[] = props.event.eventClasses;
    const startGroups:any = {}
    props.event.startGroups.forEach(sg => startGroups[sg.name] = sg.name);

    const columns: Array<Column<EventClass>> = [
        { title: 'Rekkefølge', field: 'order', editable: 'never', hidden: true},
        { title: 'Klasse', field: 'name'},
        { title: 'Løype', field: 'course'},
        { title: 'Beskrivelse', field: 'description'},
        { title: 'Intervall', field: 'startInterval', lookup: {0:'Fellesstart', 15: 15, 30: 30, 60: 60}},
        { title: 'Pulje', field: 'startGroup', lookup: startGroups},
        { title: 'Ant. reservenr.', field: 'reserveNumbers', type: 'numeric'},
        { title: 'Første startnr.', field: 'firstStartNumber', type: 'numeric', hidden: false},
        { title: 'Første starttid', field: 'firstStartTime', type: 'datetime', hidden: false},
        { title: 'Siste startnr.', field: 'lastStartNumber', type: 'numeric', hidden: false}
    ]

    const moveUp = (index: number) => {
        if (index === 0) return;
        const eventClassToMoveDown = find(data, {order: (index - 1)});
        const eventClassToMoveUp = find(data, {order: (index)});
        if (!eventClassToMoveDown || !eventClassToMoveUp) {
            console.error("Cannot find event class to move!");
            return;
        }
        eventClassToMoveDown.order = eventClassToMoveDown.order + 1;
        eventClassToMoveUp.order = eventClassToMoveUp.order - 1;
        (async () => {
            await Firebase.updateEventClasses(props.event.id, data)
        })();
    }

    const moveDown = (index: number) => {
        if (index === maxOrder) return;
        const eventClassToMoveDown = find(data, {order: (index)});
        const eventClassToMoveUp = find(data, {order: (index + 1)});
        if (!eventClassToMoveDown || !eventClassToMoveUp) {
            console.error("Cannot find event class to move!");
            return;
        }
        eventClassToMoveDown.order = eventClassToMoveDown.order + 1;
        eventClassToMoveUp.order = eventClassToMoveUp.order - 1;
        (async () => {
            await Firebase.updateEventClasses(props.event.id, data)
        })();
    }

    const useStyles = makeStyles((theme: Theme) => ({
            warning: {
                fontWeight: 'bold',
                color: theme.palette.warning.main
            },
        }
    ));
    const classes = useStyles();

    const maxOrder = max(data.map(ec => ec.order)) || 0;

    const validateInput = (data: any) => {
        data.reserveNumbers = ('reserveNumbers' in data ? +data.reserveNumbers : 0);
        data.startInterval = ('startInterval' in data ? +data.startInterval : 0);
        data.description = ('description' in data ? data.description : "");
        if ('firstStartTime' in data) {
            data.firstStartTime = new Date(data.firstStartTime);
        }
    }

    return (
        <>
            { props.event.startListPublished ?
                <p className={classes.warning}>
                    Endringer i eksisterende klasser utover navn og løypenavn har ingen effekt etter at startliste er publisert.<br/>
                    Ved innlegging av nye klasser for etteranmelding, må første/siste startnummer og første starttid settes manuelt.
                </p> : null}
            <MaterialTable
                title="Klasser"
                columns={columns}
                data={sortBy(data, 'order')}
                options={{
                    sorting: true,
                    paging: false,
                    padding: "dense",
                    rowStyle: {fontSize: 12},
                    search: false
                }}
                actions={[
                    rowData => ({
                        icon: () => <ArrowUpwardIcon/>,
                        tooltip: 'Flytt opp',
                        onClick: (event, rowData) => moveUp((rowData as EventClass).order),
                        disabled: (rowData as EventClass).order === 1
                    }),
                    rowData => ({
                        icon: () => <ArrowDownwardIcon/>,
                        tooltip: 'Flytt ned',
                        onClick: (event, rowData) => moveDown((rowData as EventClass).order),
                        disabled: (rowData as EventClass).order === maxOrder
                    })
                ]}
                editable={{
                    onRowAdd: newData =>
                        new Promise<void>(resolve => {
                            resolve();
                            validateInput(newData);
                            newData.order = maxOrder + 1;
                            data.push(newData);
                            (async () => {
                                await Firebase.updateEventClasses(props.event.id, data)
                            })();
                        }),
                    onRowUpdate: async (newData, oldData) =>
                        new Promise<void>(resolve => {
                            resolve();
                            if (oldData) {
                                validateInput(newData);
                                data[data.indexOf(oldData)] = newData;
                                (async () => {
                                    await Firebase.updateEventClasses(props.event.id, data)
                                })();
                            }
                        }),
                    onRowDelete: oldData =>
                        new Promise<void>(resolve => {
                            resolve();
                            data.splice(data.indexOf(oldData), 1);
                            (async () => {
                                await Firebase.updateEventClasses(props.event.id, data)
                            })();
                        }),
                }}
            />
        </>
    );
}

export default EventClassEdit;
