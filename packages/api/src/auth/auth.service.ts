import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private auditService: AuditService,
    ) { }

    async register(dto: RegisterDto) {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(dto.password, 12);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role: Role.EMPLOYEE,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });

        // Generate token
        const token = await this.generateToken(user.id, user.email, user.role);

        // Audit log
        await this.auditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'REGISTER',
            module: 'auth',
            entityType: 'User',
            entityId: user.id,
            description: `New user registered: ${user.email}`,
        });

        return {
            user,
            accessToken: token,
        };
    }

    async login(dto: LoginDto, metadata?: { ip?: string; userAgent?: string }) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account is disabled');
        }

        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

        if (!passwordValid) {
            // Log failed login attempt
            await this.auditService.log({
                userId: user.id,
                userEmail: user.email,
                userRole: user.role,
                action: 'LOGIN_FAILED',
                module: 'auth',
                description: `Failed login attempt for ${user.email}`,
                metadata: metadata || {},
            });
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = await this.generateToken(user.id, user.email, user.role);

        // Audit log successful login with IP/device info
        await this.auditService.log({
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: 'LOGIN',
            module: 'auth',
            entityType: 'Session',
            description: `User logged in: ${user.email}`,
            metadata: {
                ip: metadata?.ip || 'unknown',
                userAgent: metadata?.userAgent || 'unknown',
                loginTime: new Date().toISOString(),
            },
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
            },
            accessToken: token,
        };
    }

    async validateUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                avatar: true,
            },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Invalid or inactive user');
        }

        return user;
    }

    private async generateToken(userId: string, email: string, role: string) {
        const payload = { sub: userId, email, role };
        return this.jwtService.signAsync(payload);
    }
}
