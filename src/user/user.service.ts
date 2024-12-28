import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    getAllUser(){
        return(
            {
                id: 1,
                name:'User_1'
            }
        )
    }

    getOneUser(){
        
    }


}
