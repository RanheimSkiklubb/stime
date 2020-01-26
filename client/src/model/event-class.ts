export default class EventClass {
    startInterval: number;
    reserveNumbers: number;
    constructor(
        readonly name: string,
        readonly course: string,
        readonly description: string,
        startInterval: number,
        reserveNumbers: number) {
            this.startInterval = startInterval;
            this.reserveNumbers = reserveNumbers;
        }
}