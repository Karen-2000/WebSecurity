import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../../users/data-access/users.service';
import { User } from '../../../users/models/user.model';
import { AuditService } from '../../data-access/audit.service';
import { AuditFilters, AuditLog } from '../../models/audit-log.model';

type AuditFilterKey = 'event_type' | 'user_id' | 'date_from' | 'date_to';
type AuditFilterValue = string | number | null;

@Component({
  selector: 'app-audit-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-page.component.html',
  styleUrl: './audit-page.component.scss'
})
export class AuditPageComponent implements OnInit {
  private auditService = inject(AuditService);
  private usersService = inject(UsersService);

  logs: AuditLog[] = [];
  users: User[] = [];
  loading = true;
  filtersLoading = false;
  errorMessage = '';
  private filterRequestId = 0;

  filters = {
    event_type: '',
    user_id: '',
    date_from: '',
    date_to: '',
    limit: 100
  };

  readonly eventTypes = [
    'LOGIN_SUCCESS',
    'LOGIN_FAILED',
    'ACCESS_DENIED',
    'RATE_LIMIT_TRIGGERED',
    'PRODUCT_CREATED',
    'PRODUCT_UPDATED',
    'PRODUCT_DELETED',
    'USER_CREATED',
    'USER_UPDATED',
    'USER_DELETED',
    'ROLE_CHANGED',
    'PERMISSION_CHANGED'
  ];

  async ngOnInit(): Promise<void> {
    await this.loadInitialData();
  }

  get errorLogCount(): number {
    return this.logs.filter((log) => (log.status_code || 0) >= 400).length;
  }

  get uniqueUsersCount(): number {
    return new Set(this.logs.map((log) => log.user_id).filter((id) => id !== null)).size;
  }

  onFilterChange(filter: AuditFilterKey, value: AuditFilterValue): void {
    if (filter === 'user_id') {
      this.filters.user_id = String(value || '');
    } else {
      this.filters[filter] = String(value || '');
    }

    void this.applyFilters();
  }

  private getActiveFilters(): AuditFilters {
    const filters: AuditFilters = {
      limit: this.filters.limit
    };

    if (this.filters.event_type) {
      filters.event_type = this.filters.event_type;
    }

    if (this.filters.user_id) {
      filters.user_id = this.filters.user_id;
    }

    if (this.filters.date_from) {
      filters.date_from = this.filters.date_from;
    }

    if (this.filters.date_to) {
      filters.date_to = this.filters.date_to;
    }

    return filters;
  }

  private filterLogsLocally(logs: AuditLog[]): AuditLog[] {
    const dateFrom = this.filters.date_from ? new Date(this.filters.date_from) : null;
    const dateTo = this.filters.date_to ? new Date(this.filters.date_to) : null;

    if (dateTo) {
      dateTo.setHours(23, 59, 59, 999);
    }

    return logs.filter((log) => {
      const logDate = new Date(log.created_at);

      if (this.filters.event_type && log.event_type !== this.filters.event_type) {
        return false;
      }

      if (this.filters.user_id && log.user_id !== this.filters.user_id) {
        return false;
      }

      if (dateFrom && logDate < dateFrom) {
        return false;
      }

      if (dateTo && logDate > dateTo) {
        return false;
      }

      return true;
    });
  }

  async loadInitialData(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const [users, logs] = await Promise.all([
        this.usersService.getUsers(),
        this.auditService.getAuditLogs({ limit: this.filters.limit })
      ]);
      this.users = users;
      this.logs = logs;
    } catch (error: any) {
      if (this.isUnauthorizedError(error)) {
        return;
      }

      console.error('Error cargando auditoria:', error);
      this.errorMessage = 'No se pudo cargar la auditoria.';
    } finally {
      this.loading = false;
    }
  }

  async applyFilters(): Promise<void> {
    const requestId = ++this.filterRequestId;
    this.filtersLoading = true;
    this.errorMessage = '';

    try {
      const logs = await this.auditService.getAuditLogs(this.getActiveFilters());

      if (requestId === this.filterRequestId) {
        this.logs = this.filterLogsLocally(logs);
      }
    } catch (error: any) {
      if (requestId === this.filterRequestId) {
        if (this.isUnauthorizedError(error)) {
          return;
        }

        console.error('Error filtrando auditoria:', error);
        this.errorMessage = error?.error?.message || 'No se pudo aplicar el filtro.';
      }
    } finally {
      if (requestId === this.filterRequestId) {
        this.filtersLoading = false;
      }
    }
  }

  async resetFilters(): Promise<void> {
    this.filters = {
      event_type: '',
      user_id: '',
      date_from: '',
      date_to: '',
      limit: 100
    };
    await this.applyFilters();
  }

  resolveUsername(userId: string | null): string {
    if (!userId) {
      return 'Sistema';
    }

    return this.users.find((user) => user.id === userId)?.username || `Usuario #${userId}`;
  }

  formatDetails(details: Record<string, unknown> | null): string {
    return details ? JSON.stringify(details) : 'Sin detalles';
  }

  private isUnauthorizedError(error: any): boolean {
    return error?.status === 401;
  }
}
