export default class EventClass {
    startInterval: number;
    reserveNumbers: number;
    order: number;
    constructor(
        readonly name: string,
        readonly course: string,
        readonly description: string,
        startInterval: number,
        reserveNumbers: number, 
        order: number) {
            this.startInterval = startInterval;
            this.reserveNumbers = reserveNumbers;
            this.order = order;
        }
}