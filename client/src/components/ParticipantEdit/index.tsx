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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import Event from '../../model/event';
import { padStart, shuffle, sortBy } from 'lodash';
import Firebase from '../Firebase';
import Participant from '../../model/participant';
import EventClass from '../../model/event-class';
import Registration from '../registration/Registration';
import dayjs from 'dayjs';
import LateRegistration from '../LateRegistration';
import ContactDownload from './ContactDownload';
import StartGroup from '../../model/start-group';
import ImportParticipants from '../ImportParticipants';
import { createStartTimeRowStyle } from '../../utils/startTimeRowStyle';
import { unparse } from 'papaparse';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
    event: Event;
}

const ParticipantEdit = (props: Props) => {
    const eventClasses: Record<string, string> = {};
    sortBy(props.event.eventClasses, 'order').forEach(ec => eventClasses[ec.name] = ec.name);
    const eventClassNames = Object.keys(eventClasses);

    const eventClassOrder = useMemo<Record<string, number>>(() => (
        props.event.eventClasses.reduce((p: Record<string, number>, c: EventClass) => {
            p[c.name] = c.order;
            return p;
        }, {})
    ), [props.event.eventClasses]);

    const sortedInitial = useMemo(() => (
        props.event.startListGenerated
            ? sortBy(props.event.participants, ["startTime", "startNumber"])
            : sortBy(props.event.participants, (p: Participant) => padStart(String(eventClassOrder[p.eventClass]), 3, "0") + p.firstName + p.lastName)
    ), [props.event.participants, props.event.startListGenerated, eventClassOrder]);

    const data = sortedInitial;

    const persist = (next: Participant[]) => {
        (async () => {
            await Firebase.updateParticipants(props.event.id, next);
        })();
    };

    const typefixInput = (participant: Participant): Participant => {
        const next = { ...participant };
        if (next.startNumber !== undefined && next.startNumber !== null) {
            next.startNumber = +next.startNumber;
        }
        return next;
    };

    interface Group {
        startGroup: StartGroup;
        eventClasses: EventClass[];
    }

    const handleGenerate = () => {
        const eventClassesSorted = sortBy(props.event.eventClasses, 'order');
        const startGroups: { [id: string]: Group } = {
            default: {
                startGroup: { name: 'default', firstStartTime: props.event.startTime, separateNumberRange: false },
                eventClasses: []
            }
        };
        props.event.startGroups.forEach(sg => {
            startGroups[sg.name] = {
                startGroup: sg,
                eventClasses: []
            }
        });
        for (let eventClass of eventClassesSorted) {
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
            let startTime = dayjs(group.startGroup.firstStartTime);
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

    const rowStyle = props.event.startListGenerated ? createStartTimeRowStyle() : undefined;

    const columns = useMemo<MRT_ColumnDef<Participant>[]>(() => (
        props.event.startListGenerated
            ? [
                { header: 'Startnr', accessorKey: 'startNumber', size: 80, muiEditTextFieldProps: { type: 'number' } },
                { header: 'Starttid', accessorKey: 'startTime', size: 90 },
                { header: 'Fornavn', accessorKey: 'firstName', size: 120 },
                { header: 'Etternavn', accessorKey: 'lastName', size: 120 },
                { header: 'Klubb', accessorKey: 'club', size: 140 },
                {
                    header: 'Klasse',
                    accessorKey: 'eventClass',
                    size: 110,
                    editVariant: 'select',
                    editSelectOptions: eventClassNames.map(name => ({ value: name, label: name })),
                },
            ]
            : [
                { header: 'Fornavn', accessorKey: 'firstName', size: 140 },
                { header: 'Etternavn', accessorKey: 'lastName', size: 140 },
                { header: 'Klubb', accessorKey: 'club', size: 160 },
                {
                    header: 'Klasse',
                    accessorKey: 'eventClass',
                    size: 120,
                    editVariant: 'select',
                    editSelectOptions: eventClassNames.map(name => ({ value: name, label: name })),
                },
            ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [props.event.startListGenerated, eventClassNames.join(',')]);

    const handleCreate: NonNullable<Parameters<typeof useMaterialReactTable<Participant>>[0]['onCreatingRowSave']> =
        ({ values, table }) => {
            const next = typefixInput(values as Participant);
            persist([...data, next]);
            table.setCreatingRow(null);
        };

    const handleSave: NonNullable<Parameters<typeof useMaterialReactTable<Participant>>[0]['onEditingRowSave']> =
        ({ values, row, table }) => {
            const next = typefixInput({ ...row.original, ...values } as Participant);
            const updated = [...data];
            updated[row.index] = next;
            persist(updated);
            table.setEditingRow(null);
        };

    const handleDelete = (row: MRT_Row<Participant>) => {
        if (!window.confirm('Slette denne deltakeren?')) return;
        const next = data.filter((_, idx) => idx !== row.index);
        persist(next);
    };

    const handleExport = () => {
        const rows = data.map(p => {
            if (props.event.startListGenerated) {
                return {
                    Startnr: p.startNumber ?? '',
                    Starttid: p.startTime ?? '',
                    Fornavn: p.firstName,
                    Etternavn: p.lastName,
                    Klubb: p.club,
                    Klasse: p.eventClass,
                };
            }
            return {
                Fornavn: p.firstName,
                Etternavn: p.lastName,
                Klubb: p.club,
                Klasse: p.eventClass,
            };
        });
        const csv = unparse(rows, { delimiter: ';' });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${props.event.name || 'deltakere'}.csv`);
    };

    const handleExportPdf = () => {
        const headers = props.event.startListGenerated
            ? ['Startnr', 'Starttid', 'Fornavn', 'Etternavn', 'Klubb', 'Klasse']
            : ['Fornavn', 'Etternavn', 'Klubb', 'Klasse'];
        const body = data.map(p => props.event.startListGenerated
            ? [p.startNumber ?? '', p.startTime ?? '', p.firstName, p.lastName, p.club, p.eventClass]
            : [p.firstName, p.lastName, p.club, p.eventClass]
        );
        const rowColors: [number, number, number][] = [];
        if (props.event.startListGenerated) {
            const palette: [number, number, number][] = [[255, 255, 255], [211, 233, 251]];
            let currentStartTime: string | undefined;
            let idx = 1;
            data.forEach(p => {
                if (p.startTime !== currentStartTime) {
                    currentStartTime = p.startTime;
                    idx = (idx + 1) % 2;
                }
                rowColors.push(palette[idx]);
            });
        }
        const doc = new jsPDF();
        const title = props.event.startListGenerated
            ? `Startliste ${props.event.name}`
            : `Deltakerliste ${props.event.name}`;
        doc.setFontSize(14);
        doc.text(title, 14, 16);
        autoTable(doc, {
            head: [headers],
            body,
            startY: 22,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [63, 81, 181] },
            alternateRowStyles: props.event.startListGenerated
                ? undefined
                : { fillColor: [245, 245, 245] },
            didParseCell: props.event.startListGenerated
                ? (cellData) => {
                    if (cellData.section === 'body') {
                        const color = rowColors[cellData.row.index];
                        if (color) cellData.cell.styles.fillColor = color;
                    }
                }
                : undefined,
        });
        doc.save(`${props.event.name || 'deltakere'}.pdf`);
    };

    const table = useMaterialReactTable<Participant>({
        columns,
        data,
        enablePagination: false,
        enableSorting: false,
        enableColumnActions: false,
        enableHiding: false,
        enableBottomToolbar: false,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        enableEditing: true,
        editDisplayMode: 'row',
        createDisplayMode: 'row',
        initialState: { density: 'compact' },
        layoutMode: 'grid',
        defaultColumn: { minSize: 60, size: 120 },
        displayColumnDefOptions: {
            'mrt-row-actions': { size: 120, grow: false },
        },
        positionActionsColumn: 'last',
        onCreatingRowSave: handleCreate,
        onEditingRowSave: handleSave,
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => table.setCreatingRow(true)}
                >
                    Legg til rad
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExport}
                >
                    Eksporter CSV
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={handleExportPdf}
                >
                    Eksporter PDF
                </Button>
            </Box>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '0.25rem' }}>
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
        muiTableBodyRowProps: rowStyle ? ({ row }) => ({ sx: rowStyle(row.original) }) : undefined,
        muiTableBodyCellProps: { sx: { padding: '4px 8px' } },
        muiTableHeadCellProps: { sx: { padding: '4px 8px' } },
    });

    return (
        <>
            <Box sx={{ p: 1 }}>
                {!props.event.startListGenerated ?
                    <><Registration event={props.event} />&nbsp;<ImportParticipants event={props.event} />&nbsp;</> :
                    <><LateRegistration event={props.event} caption="Etteranmelding" />&nbsp;</>
                }
                {!props.event.startListPublished ? (<>
                    <Button variant="contained" color="primary" onClick={handleGenerate} disabled={props.event.startListPublished || props.event.participants.length === 0}
                    >Generer {props.event.startListGenerated ? 'Ny ' : ''}Startliste</Button>&nbsp;
                    <Button variant="contained" color="primary" onClick={handlePublish} disabled={!props.event.startListGenerated}
                    >Publiser Startliste</Button>&nbsp;
                </>) : null}
                <ContactDownload eventId={props.event.id} eventName={props.event.name} />
            </Box>
            <MaterialReactTable table={table} />
        </>
    );
}

export default ParticipantEdit;
