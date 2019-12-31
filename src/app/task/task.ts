export interface ITask{
    Task_ID:number;    
    Parent_ID:number;
    Project_ID:number;
    Task1:string;
    Start_Date:string;
    End_Date:string;
    Priority:number;
    Status:string;
    isTaskComplete:boolean;
}