import React from 'react';
import MaterialTable, { Column } from 'material-table';
import EventClass from '../../model/event-class';
import Firebase from '../Firebase';
import Event from '../../model/event';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import _ from 'lodash';


interface TableState {
    columns: Array<Column<EventClass>>;
    data: EventClass[];
}

interface Props {
    event: Event
}

const MaterialTab: React.FC<Props> = (props: Props) => {
    const [state, setState] = React.useState<TableState>({
        columns: [
            { title: 'Rekkefølge', field: 'order', editable: 'never'},
            { title: 'Klasse', field: 'name'},
            { title: 'Løype', field: 'course'},
            { title: 'Beskrivelse', field: 'description'},
            { title: 'Intervall', field: 'startInterval', lookup: {15: 15, 30: 30, 60: 60}},
            { title: 'Ant. resevernummer', field: 'reserveNumbers', type: 'numeric'}
        ],
        data: props.event.eventClasses,
    });

    const moveUp = (index: number) => {
        if (index === 0) return;
        const eventClassToMoveDown = _.find(state.data, {order: (index - 1)});
        const eventClassToMoveUp = _.find(state.data, {order: (index)});
        if (!eventClassToMoveDown || !eventClassToMoveUp) {
            console.error("Cannot find event class to move!");
            return;
        }
        eventClassToMoveDown.order = eventClassToMoveDown.order + 1;
        eventClassToMoveUp.order = eventClassToMoveUp.order - 1;
        (async () => {
            await Firebase.updateEventClasses(props.event.id, state.data)
        })();
    }

    const moveDown = (index: number) => {
        if (index === maxOrder) return;
        const eventClassToMoveDown = _.find(state.data, {order: (index)});
        const eventClassToMoveUp = _.find(state.data, {order: (index + 1)});
        if (!eventClassToMoveDown || !eventClassToMoveUp) {
            console.error("Cannot find event class to move!");
            return;
        }
        eventClassToMoveDown.order = eventClassToMoveDown.order + 1;
        eventClassToMoveUp.order = eventClassToMoveUp.order - 1;
        (async () => {
            await Firebase.updateEventClasses(props.event.id, state.data)
        })();
    }

    const maxOrder = _.max(state.data.map(ec => ec.order)) || 0;

    return (
        <>
            <MaterialTable
                title="Klasser"
                columns={state.columns}
                data={_.sortBy(state.data, 'order')}
                options={{
                    sorting: true,
                    paging: false,
                    search: false
                }}
                actions={[
                    rowData => ({
                        icon: () => <ArrowUpwardIcon/>,
                        tooltip: 'Flytt opp',
                        onClick: (event, rowData) => moveUp((rowData as EventClass).order),
                        disabled: (rowData as EventClass).order === 0
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
                        new Promise(resolve => {
                            resolve();
                            setState(prevState => {
                                const data = [...prevState.data];
                                newData.order = maxOrder + 1;
                                data.push(newData);
                                (async () => {
                                    await Firebase.updateEventClasses(props.event.id, data)
                                })();
                                return { ...prevState, data };
                            });
                        }),
                    onRowUpdate: async (newData, oldData) =>
                        new Promise(resolve => {
                            resolve();
                            if (oldData) {
                                setState(prevState => {
                                const data = [...prevState.data];
                                data[data.indexOf(oldData)] = newData;
                                (async () => {
                                    await Firebase.updateEventClasses(props.event.id, data)
                                })();
                                return { ...prevState, data };
                                });
                            }
                        }),
                    onRowDelete: oldData =>
                        new Promise(resolve => {
                            resolve();
                            setState(prevState => {
                                const data = [...prevState.data];
                                data.splice(data.indexOf(oldData), 1);
                                return { ...prevState, data };
                            });
                        }),
                }}
            />
        </>
    );
}

export default MaterialTab;