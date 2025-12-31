import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';
import { User } from '../../../../shared/interfaces/user.interface';

@Component({
    selector: 'app-users-table',
    templateUrl: './table.component.html',
    styleUrl: './table.component.css',
    imports: [
        RouterModule,
        CommonModule,
    ]
})

export class UsersTableComponent implements OnInit {

    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    users: User[] = []

    ngOnInit(): void {
        this.loadUsers()
    }

    async loadUsers() {
        const users = await this.userService.getUsers();
        if(users){
            this.users = [...users]
        }
    }

    // Navega al formulario de registro con el ID
    editUser(user: User) {
    this.router.navigate(['/dashboard/users/create'], { queryParams: { _id: user._id } });
    }
}