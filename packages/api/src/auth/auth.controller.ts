import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    HttpCode,
    HttpStatus,
    Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { CurrentUser } from './decorators';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto, @Req() req: any) {
        const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        return this.authService.login(dto, { ip, userAgent });
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getMe(@CurrentUser() user: any) {
        return { user };
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@CurrentUser() user: any) {
        return user;
    }
}
