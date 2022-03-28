import React from 'react';
import MaterialTable, { Column } from 'material-table';
import StartGroup from '../../model/start-group';
import Firebase from '../Firebase';
import Event from '../../model/event';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import TimeString from '../../model/time';

interface Props {
    event: Event
}

const columns: Array<Column<StartGroup>> = [
    { title: 'Pulje', field: 'name'},
    { title: 'Første starttid', field: 'firstStartTimeStr', type: 'string', validate: (rowData:any) => TimeString.validate(rowData.firstStartTimeStr)},
    { title: 'Egen nummerserie', field: 'separateNumberRange', type: 'boolean'},
    { title: 'Første startnummer', field: 'firstNumber', type: 'numeric'}
]

const StartGroupEdit: React.FC<Props> = (props: Props) => {
    const data:any[] = props.event.startGroups;
    data.forEach(item => item.firstStartTimeStr = TimeString.fromDate(item.firstStartTime));

    const validateInput = (data: any) => {
        if ('firstStartTimeStr' in data) {
            data.firstStartTime = TimeString.toDate(props.event.startTime, data.firstStartTimeStr);
        }
        if (!('separateNumberRange' in data)) {
            data.separateNumberRange = false;
        }
    }

    const useStyles = makeStyles((theme: Theme) => ({
            warning: {
                fontWeight: 'bold',
                color: theme.palette.warning.main
            },
        }
    ));
    const classes = useStyles();

    return (
        <>
        { props.event.startListPublished ?
                <p className={classes.warning}>
                    Endringer i eksisterende puljer har ingen effekt etter at startliste er publisert.
                </p> : null}
            <MaterialTable
                title="Puljer"
                columns={columns}
                data={data}
                options={{
                    sorting: true,
                    paging: false,
                    search: false
                }}
                editable={{
                    onRowAdd: newData =>
                        new Promise<void>(resolve => {
                            resolve();
                            validateInput(newData);
                            data.push(newData);
                            (async () => {
                                await Firebase.updateStartGroups(props.event.id, data)
                            })();
                        }),
                    onRowUpdate: async (newData, oldData) =>
                        new Promise<void>(resolve => {
                            resolve();
                            if (oldData) {
                                validateInput(newData);
                                data[data.indexOf(oldData)] = newData;
                                (async () => {
                                    await Firebase.updateStartGroups(props.event.id, data)
                                })();
                            }
                        }),
                    onRowDelete: oldData =>
                        new Promise<void>(resolve => {
                            resolve();
                            data.splice(data.indexOf(oldData), 1);
                            (async () => {
                                await Firebase.updateStartGroups(props.event.id, data)
                            })();
                        }),
                }}
            />
        </>
    );
}

export default StartGroupEdit;
