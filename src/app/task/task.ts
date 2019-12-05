export interface ITask{
    taskID:number;
    task:string;
    parentTask:string;
    startDate:string;
    endDate:string;
    priority:number;
    isTaskComplete:boolean;
}