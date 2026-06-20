import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-users-roles',
  templateUrl: './users-roles.component.html'
})
export class UsersRolesComponent implements OnInit {
  users: any[] = [];
  roles: any[] = [];
  permissions: any[] = [];

  newRole = {
    name: '',
    code: '',
    description: '',
    permissions: [] as string[]
  };

  newUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: ''
  };

  successMsg = '';
  errorMsg = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
    this.loadPermissions();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error(err)
    });
  }

  loadRoles() {
    this.apiService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        if (data.length > 0) {
          this.newUser.roleId = data[0].id;
        }
      },
      error: (err) => console.error(err)
    });
  }

  loadPermissions() {
    this.apiService.getPermissions().subscribe({
      next: (data) => this.permissions = data,
      error: (err) => console.error(err)
    });
  }

  toggleRolePermission(permCode: string) {
    const idx = this.newRole.permissions.indexOf(permCode);
    if (idx > -1) {
      this.newRole.permissions.splice(idx, 1);
    } else {
      this.newRole.permissions.push(permCode);
    }
  }

  createRole() {
    this.apiService.createRole(this.newRole).subscribe({
      next: () => {
        this.loadRoles();
        this.newRole = { name: '', code: '', description: '', permissions: [] };
        this.successMsg = 'Role created successfully!';
      },
      error: (err) => console.error(err)
    });
  }

  createUser() {
    this.errorMsg = '';
    this.successMsg = '';
    const payload = {
      ...this.newUser,
      roleId: Number(this.newUser.roleId)
    };

    this.apiService.createUser(payload).subscribe({
      next: () => {
        this.loadUsers();
        this.newUser = { firstName: '', lastName: '', email: '', password: '', roleId: this.roles[0]?.id || '' };
        this.successMsg = 'Staff user account created successfully!';
      },
      error: (err) => {
        this.errorMsg = err.error || 'Failed to create staff user account.';
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Deactivate and delete this staff user account?')) {
      this.apiService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error(err)
      });
    }
  }
}
