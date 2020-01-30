import React from 'react';
import MaterialTable, { Column } from 'material-table';
import EventClass from '../../model/event-class';
import Firebase from '../Firebase';
import Event from '../../model/event';


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
            { title: 'Klasse', field: 'name'},
            { title: 'Løype', field: 'course'},
            { title: 'Intervall', field: 'startInterval', lookup: {15: 15, 30: 30, 60: 60}},
            { title: 'Ant. resevernummer', field: 'reserveNumbers', type: 'numeric'}
        ],
        data: props.event.eventClasses,
      });

    return (
        <MaterialTable
            title="Editable Example"
            columns={state.columns}
            data={state.data}
            options={{
                sorting: true,
                paging: false,
                search: false
            }}
            editable={{
                onRowAdd: newData =>
                    new Promise(resolve => {
                        resolve();
                        setState(prevState => {
                            const data = [...prevState.data];
                            data.push(newData);
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
    );
}

export default MaterialTab;