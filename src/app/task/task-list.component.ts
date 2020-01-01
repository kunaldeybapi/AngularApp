import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { ITask } from './task'

import { TaskService } from './task.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { IProject } from '../project/project';
import { ProjectService } from '../project/project.service';

@Component({
    selector: 'tm-viewtask',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})

export class TaskComponent implements OnInit {
    filterTasks: ITask[];
    tasks: ITask[] = [];
    errorMessage: string = '';
    selectedSearch: string;
    private _taskFilter: string;
    display: string;
    projects: IProject[];
    filterProjects: IProject[];
    selectedProjectID:number;

    constructor(private route: ActivatedRoute, private projectService: ProjectService, private taskService: TaskService, private router: Router) {
        this._taskFilter = '';
    }

    ngOnInit(): void {
        this.taskService.getTasks().subscribe({
            next: tasks => {
                this.tasks = tasks;
                this.filterTasks = this.tasks;
            },
            error: err => (this.errorMessage = err)
        });
    }


    private _projectNameFilter: string;
    public get projectNameFilter(): string {
        return this._projectNameFilter;
    }
    public set projectNameFilter(v: string) {
        this._projectNameFilter = v;
        this.filterProjects = this._projectNameFilter ? this.performProjectNameFilter(this._projectNameFilter) : this.projects;
    }

    performProjectNameFilter(filterBy: string): IProject[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.projects.filter((projects: IProject) => projects.Project1.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }

    editTask(task: ITask): void {
        localStorage.removeItem("editTaskId");
        localStorage.setItem("editTaskId", task.Task_ID.toString());
        this.router.navigate(['/tasks', task.Task_ID]);
    }

    sortTaskData(sortValue: string): void {
        if (sortValue === 'startDate') {
            this.tasks.sort(this.sortByStartDate);
        }
        else if (sortValue === 'endDate') {
            this.tasks.sort(this.sortByEndDate);
        }
        else if (sortValue === 'priority') {
            this.tasks.sort(this.sortByPriority);
        }
    }

    sortByStartDate(a: ITask, b: ITask) {
        if (a.Start_Date < b.Start_Date) {
            return -1;
        } else if (a.Start_Date > b.Start_Date) {
            return 1;
        } else {
            return 0;
        }
    }

    sortByEndDate(a: ITask, b: ITask) {
        if (a.End_Date < b.End_Date) {
            return -1;
        } else if (a.End_Date > b.End_Date) {
            return 1;
        } else {
            return 0;
        }
    }

    sortByPriority(a: ITask, b: ITask) {
        if (a.Priority < b.Priority) {
            return -1;
        } else if (a.Priority > b.Priority) {
            return 1;
        } else {
            return 0;
        }
    }

    selectProject(project: IProject): void {
        document.getElementById('Project').setAttribute('value',project.Project1);
        this.selectedProjectID=project.Project_ID;
        this.taskService.getProjectTasks(this.selectedProjectID).subscribe({
            next: tasks => {
                this.tasks = tasks;
                this.filterTasks = this.tasks;
            },
            error: err => (this.errorMessage = err)
        });        
    }

    openModalDialog(searchFilter: string) {
        if (searchFilter == 'projects') {
            this.selectedSearch = 'projects';
            this.display = 'block'; //Set block css
            this.projectService.getProjects().subscribe({
                next: projects => {
                    this.projects = projects;
                    this.filterProjects = this.projects;
                },
                error: err => (this.errorMessage = err)
            });
        }
    }

    closeModalDialog() {
        this.display = 'none'; //set none css after close dialog
    }

    endTask(task: ITask) {
        return this.taskService.completeTask(task).pipe().subscribe(
            data => {
                window.location.reload();
            },
            error => {
                alert(error);
            }
        );
    }
}