import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../interfaces/user.interface';
import { AlertService } from '../../../../shared/services/alert.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-users-table',
    templateUrl: './table.component.html',
    styleUrl: './table.component.css',
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
    ]
})

export class UsersTableComponent implements OnInit {

    constructor(
        private userService: UserService,
        private router: Router,
        private alertService: AlertService,
    ) {}

    users: User[] = [];
    searchQuery = signal('');

    ngOnInit(): void {
        this.loadUsers()
    }

    async loadUsers() {
        const users = await this.userService.getUsers();
        if(users){
            this.users = [...users]
        }
    }

    get filteredUsers(): User[] {
        const query = this.searchQuery().toLowerCase();
        if (!query) return this.users;
        
        return this.users.filter(user =>
          user.nameUser.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.userType && user.userType.toLowerCase().includes(query))
        );
    }

    // Navega al formulario de registro con el ID
    editUser(user: User) {
    this.router.navigate(['/dashboard/users/create'], { queryParams: { _id: user._id } });
    }        

    async deleteUser(user: User) {

        if (!user._id) return;

        const confirmed = confirm(
            `¿Deseas eliminar al usuario "${user.nameUser}"?`
        );

        if (!confirmed) return;

        try {
            const response = await this.userService.deactivateUser(user._id);

            if (response?.message === 'Usuario desactivado con éxito.') {
            // Eliminación lógica inmediata (UX premium)
            this.alertService.show('Usuario eliminado con éxito.', 'success');
            this.loadUsers()
            }
        } catch (error) {
            this.alertService.show('Error al desactivar usuario', 'error');
        }
    }


}