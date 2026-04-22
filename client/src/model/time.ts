import dayjs from 'dayjs';

export default class TimeString {
    static fromDate = (date:Date|undefined):string => {
        if (!date) {
            return "";
        }
        return dayjs(date).format('HH:mm');
    }
    static toDate = (date:Date, timeString:string):Date => {
        const parts = timeString.split(':');
        const hour = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        return dayjs(date).hour(hour).minute(minutes).toDate();
    }

    static isValid = (timeString: string):boolean => {
        const regex = /^\d\d:\d\d$/;
        return regex.test(timeString);
    }
}