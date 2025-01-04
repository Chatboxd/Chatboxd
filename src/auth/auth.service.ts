import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import {hash,compare} from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { LogUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor (
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
        ) {}
    /***---------------------------------LOGIN-------------------------------------- */
    async login({ authBody } : { authBody: LogUserDto}) {
       const {email, password} = authBody;

       const existingUser = await this.prisma.user.findUnique({
            where:{
                email: authBody.email,
            }
        });

        if(!existingUser){
            throw new Error("L'utilisateur n'existe pas!");
        }
        const isPasswordValid = await this.isPasswordValid({
            password,
            hashedPassword: existingUser.password,
        })
        if(!isPasswordValid){
            throw new Error("Le mot de passe est invalide!")
        }
        return await this.authenticateUser({ userId: existingUser.id });
        //
       const hashPassword = await this.hashPassword({password});
    }

   private async hashPassword({password} : {password: string}){
        const hashedPassword = await hash(password,10);
        return hashedPassword;
    }

   private async isPasswordValid({
    password,
    hashedPassword
    }: {
        password: string,
        hashedPassword: string
    }){
        const isPasswordValid = await compare(password,hashedPassword);
        return isPasswordValid;
    }

    private async authenticateUser({userId}: UserPayload){
        const payload: UserPayload = { userId };
        return {
          access_token: this.jwtService.sign(payload),
        };
        
    }

    /***---------------------------------LOGIN-------------------------------------- */

    /***--------------------------------REGISTER---------------------------------------- */
    async register({ registerBody } : { registerBody: CreateUserDto}) {
        const {email, firstName, password } = registerBody;
 
        const existingUser = await this.prisma.user.findUnique({
             where:{
                 email: registerBody.email,
             }
         });
 
         if(existingUser){
             throw new Error("Un compte existe déjà à cette adresse email !");
         }
         const hashedPassword = await this.hashPassword({password});

         const createdUser = await this.prisma.user.create({
            data:{
                email,
                password: hashedPassword,
                firstName,
            }
         });

         return await this.authenticateUser({ userId: createdUser.id });
       
     }
    /***--------------------------------REGISTER---------------------------------------- */

}
