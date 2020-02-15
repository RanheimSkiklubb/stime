export default interface EventClass {
    startInterval: number;
    reserveNumbers: number;
    order: number;
    name: string;
    course: string;
    description: string;
    firstStartNumber?: number;
    lastStartNumber?: number 
}