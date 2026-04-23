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
import EventClass from '../../model/event-class';
import Firebase from '../Firebase';
import Event from '../../model/event';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { max, sortBy } from 'lodash';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import TimeString from '../../model/time';

interface Props {
    event: Event
}

interface EventClassRow extends EventClass {
    firstStartTimeStr?: string;
}

const intervalLookup: Record<string, string> = { 0: 'Fellesstart', 15: '15', 30: '30', 60: '60' };

const EventClassEdit = (props: Props) => {
    const data: EventClassRow[] = useMemo(() => props.event.eventClasses.map(ec => ({
        ...ec,
        firstStartTimeStr: TimeString.fromDate(ec.firstStartTime),
    })), [props.event.eventClasses]);
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

    const startGroupNames = props.event.startGroups.map(sg => sg.name);

    const persist = (next: EventClassRow[]) => {
        (async () => {
            await Firebase.updateEventClasses(props.event.id, next);
        })();
    };

    const validateInput = (row: EventClassRow): EventClassRow => {
        const next = { ...row };
        next.reserveNumbers = next.reserveNumbers ? +next.reserveNumbers : 0;
        next.startInterval = next.startInterval ? +next.startInterval : 0;
        next.description = next.description ?? "";
        if (next.firstStartTimeStr && next.firstStartTimeStr.length > 0) {
            next.firstStartTime = TimeString.toDate(props.event.startTime, next.firstStartTimeStr);
        } else {
            delete next.firstStartTime;
        }
        if (next.firstStartNumber !== undefined && next.firstStartNumber !== null) {
            next.firstStartNumber = +next.firstStartNumber;
        }
        if (next.lastStartNumber !== undefined && next.lastStartNumber !== null) {
            next.lastStartNumber = +next.lastStartNumber;
        }
        return next;
    };

    const useStyles = makeStyles((theme: Theme) => ({
        warning: {
            fontWeight: 'bold',
            color: theme.palette.warning.main
        },
    }));
    const classes = useStyles();

    const sorted = useMemo(() => sortBy(data, 'order'), [data]);
    const maxOrder = max(data.map(ec => ec.order)) || 0;

    const columns = useMemo<MRT_ColumnDef<EventClassRow>[]>(() => [
        { header: 'Klasse', accessorKey: 'name', size: 110, muiEditTextFieldProps: { required: true } },
        { header: 'Løype', accessorKey: 'course', size: 110 },
        { header: 'Beskrivelse', accessorKey: 'description', size: 160 },
        {
            header: 'Intervall',
            accessorKey: 'startInterval',
            size: 100,
            Cell: ({ cell }) => intervalLookup[String(cell.getValue())] ?? String(cell.getValue() ?? ''),
            editVariant: 'select',
            editSelectOptions: Object.entries(intervalLookup).map(([value, label]) => ({ value: Number(value), label })),
        },
        {
            header: 'Pulje',
            accessorKey: 'startGroup',
            size: 100,
            editVariant: 'select',
            editSelectOptions: startGroupNames.map(name => ({ value: name, label: name })),
        },
        { header: 'Ant. reservenr.', accessorKey: 'reserveNumbers', size: 100, muiEditTextFieldProps: { type: 'number' } },
        { header: 'Første startnr.', accessorKey: 'firstStartNumber', size: 100, muiEditTextFieldProps: { type: 'number' } },
        {
            header: 'Første starttid',
            accessorKey: 'firstStartTimeStr',
            size: 110,
            muiEditTextFieldProps: ({ cell }) => ({
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
        { header: 'Siste startnr.', accessorKey: 'lastStartNumber', size: 100, muiEditTextFieldProps: { type: 'number' } },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [validationErrors, startGroupNames.join(',')]);

    const moveUp = (order: number) => {
        if (order <= 1) return;
        const next = data.map(ec => {
            if (ec.order === order) return { ...ec, order: order - 1 };
            if (ec.order === order - 1) return { ...ec, order: order };
            return ec;
        });
        persist(next);
    };

    const moveDown = (order: number) => {
        if (order >= maxOrder) return;
        const next = data.map(ec => {
            if (ec.order === order) return { ...ec, order: order + 1 };
            if (ec.order === order + 1) return { ...ec, order: order };
            return ec;
        });
        persist(next);
    };

    const handleCreate: NonNullable<Parameters<typeof useMaterialReactTable<EventClassRow>>[0]['onCreatingRowSave']> =
        ({ values, table }) => {
            if (Object.values(validationErrors).some(Boolean)) return;
            const validated = validateInput(values as EventClassRow);
            validated.order = maxOrder + 1;
            persist([...data, validated]);
            table.setCreatingRow(null);
        };

    const handleSave: NonNullable<Parameters<typeof useMaterialReactTable<EventClassRow>>[0]['onEditingRowSave']> =
        ({ values, row, table }) => {
            if (Object.values(validationErrors).some(Boolean)) return;
            const validated = validateInput({ ...row.original, ...values } as EventClassRow);
            const next = data.map(ec => ec.order === row.original.order ? validated : ec);
            persist(next);
            table.setEditingRow(null);
        };

    const handleDelete = (row: MRT_Row<EventClassRow>) => {
        if (!window.confirm('Slette denne klassen?')) return;
        const remaining = data.filter(ec => ec.order !== row.original.order);
        const reordered = sortBy(remaining, 'order').map((ec, idx) => ({ ...ec, order: idx + 1 }));
        persist(reordered);
    };

    const table = useMaterialReactTable<EventClassRow>({
        columns,
        data: sorted,
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
        layoutMode: 'grid',
        defaultColumn: { minSize: 60, size: 100 },
        displayColumnDefOptions: {
            'mrt-row-actions': { size: 150, grow: false },
        },
        positionActionsColumn: 'last',
        onCreatingRowSave: handleCreate,
        onEditingRowSave: handleSave,
        onCreatingRowCancel: () => setValidationErrors({}),
        onEditingRowCancel: () => setValidationErrors({}),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => table.setCreatingRow(true)}
            >
                Legg til klasse
            </Button>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                <Tooltip title="Flytt opp">
                    <span>
                        <IconButton
                            size="small"
                            disabled={row.original.order <= 1}
                            onClick={() => moveUp(row.original.order)}
                        >
                            <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Flytt ned">
                    <span>
                        <IconButton
                            size="small"
                            disabled={row.original.order === maxOrder}
                            onClick={() => moveDown(row.original.order)}
                        >
                            <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
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
        muiTableBodyCellProps: { sx: { fontSize: 12, padding: '4px 8px' } },
        muiTableHeadCellProps: { sx: { fontSize: 12, padding: '4px 8px' } },
    });

    return (
        <>
            {props.event.startListPublished ?
                <p className={classes.warning}>
                    Endringer i eksisterende klasser utover navn og løypenavn har ingen effekt etter at startliste er publisert.<br />
                    Ved innlegging av nye klasser for etteranmelding, må første/siste startnummer og første starttid settes manuelt.
                </p> : null}
            <h3 style={{ margin: '8px 0' }}>Klasser</h3>
            <MaterialReactTable table={table} />
        </>
    );
}

export default EventClassEdit;
