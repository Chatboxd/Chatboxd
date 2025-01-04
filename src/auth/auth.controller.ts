import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { RequestWithUser } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor (
        private readonly authService : AuthService,
        private readonly userService: UserService,
    ){}
   
    @Post('login')
    async login(@Body() authBody: LogUserDto){
        return await this.authService.login({
            authBody
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async authenticateUser(@Request() request: RequestWithUser){
        return await this.userService.getUser({
            userId:request.user.userId,
        });
    }


    @Post('register')
    async register(@Body() registerBody: CreateUserDto){
        return await this.authService.register({
            registerBody
        });
    }

   
}
