import { useMemo } from 'react';
import Event from '../../model/event';
import EventClass from '../../model/event-class';
import _ from 'lodash';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { unparse } from 'papaparse';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { createStartTimeRowStyle } from '../../utils/startTimeRowStyle';

interface Props {
    event: Event;
}

interface Row {
    startNumber?: number;
    startTime?: string;
    name: string;
    club: string;
    eventClass: string;
    sort1: number;
    sort2: string;
}

const ParticipantList = (props: Props) => {

    const sortMapping: Record<string, number> = props.event.eventClasses.reduce((p:any, c:EventClass) => {
        p[c.name] = c.order;
        return p
    }, {});

    const participants: Row[] = props.event.participants.map(p => {
        const name = `${p.firstName} ${p.lastName}`;
        return {startNumber: p.startNumber, startTime: p.startTime, name, club: p.club, eventClass: p.eventClass, sort1: sortMapping[p.eventClass], sort2: name.toLowerCase()};
    });
    const sortedParticipants = props.event.startListPublished ? _.sortBy(participants, ["startTime", "startNumber"]) : _.sortBy(participants, ["sort1", "sort2"]);

    const rowStyle = props.event.startListPublished ? createStartTimeRowStyle() : undefined;

    const columns = useMemo<MRT_ColumnDef<Row>[]>(() => (
        props.event.startListPublished
            ? [
                {header: 'Startnr', accessorKey: 'startNumber'},
                {header: 'Navn', accessorKey: 'name'},
                {header: 'Klubb', accessorKey: 'club'},
                {header: 'Klasse', accessorKey: 'eventClass'},
                {header: 'Starttid', accessorKey: 'startTime'},
            ]
            : [
                {header: 'Navn', accessorKey: 'name'},
                {header: 'Klubb', accessorKey: 'club'},
                {header: 'Klasse', accessorKey: 'eventClass'},
            ]
    ), [props.event.startListPublished]);

    const table = useMaterialReactTable({
        columns,
        data: sortedParticipants,
        enablePagination: false,
        enableSorting: !props.event.startListPublished,
        enableColumnActions: false,
        enableHiding: false,
        enableBottomToolbar: false,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        initialState: { density: 'compact' },
        renderTopToolbarCustomActions: () => (
            <Box sx={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <h3 style={{margin: 0, padding: '4px 8px'}}>
                    {props.event.startListPublished ? `Startliste ${props.event.name}` : `Deltakerliste ${props.event.name}`}
                </h3>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => {
                        const csv = unparse(sortedParticipants.map(({sort1, sort2, ...rest}) => rest), {delimiter: ';'});
                        const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
                        saveAs(blob, `${props.event.name || 'deltakere'}.csv`);
                    }}
                >
                    Eksporter CSV
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={() => {
                        const headers = props.event.startListPublished
                            ? ['Startnr', 'Navn', 'Klubb', 'Klasse', 'Starttid']
                            : ['Navn', 'Klubb', 'Klasse'];
                        const body = sortedParticipants.map(p => props.event.startListPublished
                            ? [p.startNumber ?? '', p.name, p.club, p.eventClass, p.startTime ?? '']
                            : [p.name, p.club, p.eventClass]
                        );
                        const rowColors: [number, number, number][] = [];
                        if (props.event.startListPublished) {
                            const palette: [number, number, number][] = [[255, 255, 255], [211, 233, 251]];
                            let currentStartTime: string | undefined;
                            let idx = 1;
                            sortedParticipants.forEach(p => {
                                if (p.startTime !== currentStartTime) {
                                    currentStartTime = p.startTime;
                                    idx = (idx + 1) % 2;
                                }
                                rowColors.push(palette[idx]);
                            });
                        }
                        const doc = new jsPDF();
                        const title = props.event.startListPublished
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
                            alternateRowStyles: props.event.startListPublished
                                ? undefined
                                : { fillColor: [245, 245, 245] },
                            didParseCell: props.event.startListPublished
                                ? (cellData) => {
                                    if (cellData.section === 'body') {
                                        const color = rowColors[cellData.row.index];
                                        if (color) cellData.cell.styles.fillColor = color;
                                    }
                                }
                                : undefined,
                        });
                        doc.save(`${props.event.name || 'deltakere'}.pdf`);
                    }}
                >
                    Eksporter PDF
                </Button>
            </Box>
        ),
        muiTableBodyRowProps: rowStyle ? ({row}) => ({sx: rowStyle(row.original)}) : undefined,
    });

    return <MaterialReactTable table={table} />;
}

export default ParticipantList;
