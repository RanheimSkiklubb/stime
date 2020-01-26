import React from 'react';
import MaterialTable, { Column } from 'material-table';
import EventClass from '../../model/event-class';



interface TableState {
  columns: Array<Column<EventClass>>;
  data: EventClass[];
}

interface Props {
    eventClasses: EventClass[]
}

const MaterialTab: React.FC<Props> = (props: Props) => {
    const [state, setState] = React.useState<TableState>({
        columns: [
            { title: 'Klasse', field: 'name'},
            { title: 'Løype', field: 'course'},
            { title: 'Intervall', field: 'startInterval', lookup: {15: 15, 30: 30, 60: 60}},
            { title: 'Ant. resevernummer', field: 'reserveNumber', type: 'numeric'}
        ],
        data: props.eventClasses,
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
                    setTimeout(() => {
                    resolve();
                    setState(prevState => {
                        const data = [...prevState.data];
                        data.push(newData);
                        return { ...prevState, data };
                    });
                    }, 600);
                }),
                onRowUpdate: (newData, oldData) =>
                new Promise(resolve => {
                    setTimeout(() => {
                    resolve();
                    if (oldData) {
                        setState(prevState => {
                        const data = [...prevState.data];
                        data[data.indexOf(oldData)] = newData;
                        return { ...prevState, data };
                        });
                    }
                    }, 600);
                }),
                onRowDelete: oldData =>
                new Promise(resolve => {
                    setTimeout(() => {
                    resolve();
                    setState(prevState => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                    });
                    }, 600);
                }),
            }}
        />
    );
}

export default MaterialTab;