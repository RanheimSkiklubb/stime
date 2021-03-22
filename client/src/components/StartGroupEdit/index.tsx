import React from 'react';
import MaterialTable, { Column } from 'material-table';
import StartGroup from '../../model/start-group';
import Firebase from '../Firebase';
import Event from '../../model/event';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {createStyles} from "@material-ui/styles";

interface Props {
    event: Event
}

const columns: Array<Column<StartGroup>> = [
    { title: 'Pulje', field: 'name'},
    { title: 'Første starttid', field: 'firstStartTime', type: 'datetime'},
    { title: 'Egen nummerserie', field: 'separateNumberRange', type: 'boolean'},
    { title: 'Første startnummer', field: 'firstNumber', type: 'numeric'}
]

const EventClassEdit: React.FC<Props> = (props: Props) => {
    const data:StartGroup[] = props.event.startGroups;

    const validateInput = (data: any) => {
        if ('firstStartTime' in data) {
            data.firstStartTime = new Date(data.firstStartTime);
        }
        if (!('separateNumberRange' in data)) {
            data.separateNumberRange = false;
        }
    }

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
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

export default EventClassEdit;