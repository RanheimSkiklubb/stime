const colors = ["white", "#d3e9fb"];

/**
 * Returns a MaterialTable rowStyle function that alternates background colors
 * for consecutive rows sharing the same startTime value.
 */
export function createStartTimeRowStyle(): (row: any) => { backgroundColor: string } {
    let currentStartTime: any;
    let backgroundColor: string = colors[0];
    return (row: any) => {
        if (row.startTime !== currentStartTime) {
            currentStartTime = row.startTime;
            backgroundColor = colors[(colors.indexOf(backgroundColor) + 1) % 2];
        }
        return { backgroundColor };
    };
}
