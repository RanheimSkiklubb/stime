import moment from 'moment';

export default class TimeString {
    static fromDate = (date:Date|undefined):string => {
        return moment(date).format('HH:mm');
    }
    static toDate = (date:Date, timeString:string):Date => {
        const parts = timeString.split(':');
        const hour = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        return moment(date).hour(hour).minutes(minutes).toDate();
    }
    
    static validate = (timeString:string):boolean => {
        const regex = /\d\d:\d\d/;
        return regex.test(timeString);
    }
}