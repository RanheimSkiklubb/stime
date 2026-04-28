import { useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_Row,
} from 'material-react-table';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StartGroup from '../../model/start-group';
import Firebase from '../Firebase';
import TimeString from '../../model/time';

interface Props {
    eventId: string;
    startGroups: StartGroup[];
    startTime: Date;
    startListPublished: boolean;
}

interface StartGroupRow extends StartGroup {
    firstStartTimeStr?: string;
}

const StartGroupEdit = (props: Props) => {
    const data: StartGroupRow[] = useMemo(() => props.startGroups.map(sg => ({
        ...sg,
        firstStartTimeStr: TimeString.fromDate(sg.firstStartTime),
    })), [props.startGroups]);
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

    const persist = (next: StartGroupRow[]) => {
        (async () => {
            await Firebase.updateStartGroups(props.eventId, next);
        })();
    };

    const validateInput = (row: StartGroupRow): StartGroupRow => {
        const next = {...row};
        if (next.firstStartTimeStr) {
            next.firstStartTime = TimeString.toDate(props.startTime, next.firstStartTimeStr);
        } else {
            next.firstStartTime = props.startTime;
        }
        if (next.separateNumberRange === undefined) {
            next.separateNumberRange = false;
        }
        if (next.firstNumber !== undefined && next.firstNumber !== null) {
            next.firstNumber = +next.firstNumber;
        }
        return next;
    };

    const columns = useMemo<MRT_ColumnDef<StartGroupRow>[]>(() => [
        {
            header: 'Pulje',
            accessorKey: 'name',
            muiEditTextFieldProps: {
                required: true,
            },
        },
        {
            header: 'Første starttid',
            accessorKey: 'firstStartTimeStr',
            muiEditTextFieldProps: ({cell}) => ({
                required: true,
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (e) => {
                    const value = e.target.value;
                    setValidationErrors(prev => ({
                        ...prev,
                        [cell.id]: !value || TimeString.isValid(value)
                            ? undefined
                            : 'Ugyldig tid (HH:mm)',
                    }));
                },
            }),
        },
        {
            header: 'Egen nummerserie',
            accessorKey: 'separateNumberRange',
            Cell: ({cell}) => cell.getValue<boolean>() ? 'Ja' : 'Nei',
            editVariant: 'select',
            editSelectOptions: [
                {value: false, label: 'Nei'},
                {value: true, label: 'Ja'},
            ],
        },
        {
            header: 'Første startnummer',
            accessorKey: 'firstNumber',
            muiEditTextFieldProps: {
                type: 'number',
            },
        },
    ], [validationErrors]);

    const handleCreate: NonNullable<Parameters<typeof useMaterialReactTable<StartGroupRow>>[0]['onCreatingRowSave']> =
        ({values, table}) => {
            if (Object.values(validationErrors).some(Boolean)) return;
            const validated = validateInput(values as StartGroupRow);
            persist([...data, validated]);
            table.setCreatingRow(null);
        };

    const handleSave: NonNullable<Parameters<typeof useMaterialReactTable<StartGroupRow>>[0]['onEditingRowSave']> =
        ({values, row, table}) => {
            if (Object.values(validationErrors).some(Boolean)) return;
            const validated = validateInput(values as StartGroupRow);
            const next = [...data];
            next[row.index] = validated;
            persist(next);
            table.setEditingRow(null);
        };

    const handleDelete = (row: MRT_Row<StartGroupRow>) => {
        if (!window.confirm('Slette denne puljen?')) return;
        const next = data.filter((_, idx) => idx !== row.index);
        persist(next);
    };

    const table = useMaterialReactTable<StartGroupRow>({
        columns,
        data,
        enablePagination: false,
        enableColumnActions: false,
        enableHiding: false,
        enableBottomToolbar: false,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        enableGlobalFilter: false,
        enableEditing: true,
        editDisplayMode: 'row',
        createDisplayMode: 'row',
        initialState: { density: 'compact' },
        positionActionsColumn: 'last',
        onCreatingRowSave: handleCreate,
        onEditingRowSave: handleSave,
        onCreatingRowCancel: () => setValidationErrors({}),
        onEditingRowCancel: () => setValidationErrors({}),
        renderTopToolbarCustomActions: ({table}) => (
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => table.setCreatingRow(true)}
            >
                Legg til pulje
            </Button>
        ),
        renderRowActions: ({row, table}) => (
            <Box sx={{display: 'flex', gap: '0.25rem'}}>
                <Tooltip title="Endre">
                    <IconButton size="small" onClick={() => table.setEditingRow(row)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Slett">
                    <IconButton size="small" onClick={() => handleDelete(row)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        renderTopToolbar: undefined,
    });

    return (
        <>
            { props.startListPublished ?
                <Box component="p" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    Endringer i eksisterende puljer har ingen effekt etter at startliste er publisert.
                </Box> : null}
            <h3 style={{margin: '8px 0'}}>Puljer</h3>
            <MaterialReactTable table={table} />
        </>
    );
}

export default StartGroupEdit;

