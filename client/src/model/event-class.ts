export default interface EventClass {
    startInterval: number;
    reserveNumbers: number;
    order: number;
    name: string;
    course: string;
    startGroup?: string;
    description: string;
    firstStartNumber?: number;
    firstStartTime?: Date;
    lastStartNumber?: number ;
}