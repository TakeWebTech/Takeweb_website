// Centralized API client for admin dashboard
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:4000';

interface ApiError {
    message: string;
    statusCode: number;
}

class ApiClient {
    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getToken();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'An error occurred' }));
            if (response.status === 401 || response.status === 403) {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('api-auth-error', { detail: { status: response.status } }));
                    if (response.status === 401) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('user');
                    }
                }
            }
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        // Handle empty responses (204 No Content)
        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    // GET request
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    // POST request
    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // PUT request
    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // PATCH request
    async patch<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // DELETE request
    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    // Upload file (multipart)
    async upload<T>(endpoint: string, formData: FormData): Promise<T> {
        const token = this.getToken();

        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(error.message);
        }

        return response.json();
    }
}

export const api = new ApiClient();

// API Endpoints
export const endpoints = {
    // Auth
    auth: {
        login: '/api/v1/auth/login',
        register: '/api/v1/auth/register',
        me: '/api/v1/auth/me',
    },
    // Blog Posts
    posts: {
        list: '/api/v1/blog/posts',
        adminList: '/api/v1/blog/admin/posts',
        create: '/api/v1/blog/admin/posts',
        get: (id: string) => `/api/v1/blog/admin/posts/${id}`,
        update: (id: string) => `/api/v1/blog/admin/posts/${id}`,
        delete: (id: string) => `/api/v1/blog/admin/posts/${id}`,
    },
    // Projects
    projects: {
        list: '/api/v1/projects',
        adminList: '/api/v1/projects/admin/all',
        create: '/api/v1/projects/admin',
        get: (id: string) => `/api/v1/projects/admin/${id}`,
        update: (id: string) => `/api/v1/projects/admin/${id}`,
        delete: (id: string) => `/api/v1/projects/admin/${id}`,
    },
    // Services
    services: {
        list: '/api/v1/services',
        adminList: '/api/v1/services/admin/all',
        create: '/api/v1/services/admin',
        get: (id: string) => `/api/v1/services/admin/${id}`,
        update: (id: string) => `/api/v1/services/admin/${id}`,
        delete: (id: string) => `/api/v1/services/admin/${id}`,
    },
    // Team
    team: {
        list: '/api/v1/team',
        adminList: '/api/v1/team/admin/all',
        create: '/api/v1/team/admin',
        get: (id: string) => `/api/v1/team/admin/${id}`,
        update: (id: string) => `/api/v1/team/admin/${id}`,
        delete: (id: string) => `/api/v1/team/admin/${id}`,
    },
    // Careers
    careers: {
        list: '/api/v1/careers',
        adminList: '/api/v1/careers/admin/all',
        create: '/api/v1/careers/admin',
        get: (id: string) => `/api/v1/careers/admin/${id}`,
        update: (id: string) => `/api/v1/careers/admin/${id}`,
        delete: (id: string) => `/api/v1/careers/admin/${id}`,
        applications: (id: string) => `/api/v1/careers/admin/${id}/applications`,
    },
    // Contact
    contact: {
        list: '/api/v1/contact',
        adminList: '/api/v1/contact/admin',
        get: (id: string) => `/api/v1/contact/admin/${id}`,
        update: (id: string) => `/api/v1/contact/admin/${id}`,
        delete: (id: string) => `/api/v1/contact/admin/${id}`,
    },
    // Media
    media: {
        list: '/api/v1/media',
        upload: '/api/v1/media/upload',
        delete: (id: string) => `/api/v1/media/${id}`,
    },
    // Activity
    activity: {
        list: '/api/v1/activity',
        get: (id: string) => `/api/v1/activity/${id}`,
    },
    // Users
    users: {
        list: '/api/v1/users',
        create: '/api/v1/users',
        get: (id: string) => `/api/v1/users/${id}`,
        update: (id: string) => `/api/v1/users/${id}`,
        delete: (id: string) => `/api/v1/users/${id}`,
        invite: '/api/v1/users/invite',
    },
    // Testimonials
    testimonials: {
        list: '/api/v1/testimonials',
        adminList: '/api/v1/testimonials/admin',
        create: '/api/v1/testimonials/admin',
        get: (id: string) => `/api/v1/testimonials/admin/${id}`,
        update: (id: string) => `/api/v1/testimonials/admin/${id}`,
        delete: (id: string) => `/api/v1/testimonials/admin/${id}`,
    },
    // Pages
    pages: {
        list: '/api/v1/pages',
        adminList: '/api/v1/pages/admin',
        create: '/api/v1/pages/admin',
        get: (id: string) => `/api/v1/pages/admin/${id}`,
        update: (id: string) => `/api/v1/pages/admin/${id}`,
        delete: (id: string) => `/api/v1/pages/admin/${id}`,
    },
};
