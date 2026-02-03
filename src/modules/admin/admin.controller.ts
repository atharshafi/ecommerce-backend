import { Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
// import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.gaurd';
@Controller('Admin')
export class AdminController {
    //constructor(private readonly adminService: AdminService) {}
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile() {
        return { message: 'You are authenticated as an admin' };
    }
//       @Get('test')
//       async test() {
//     return this.adminService.getAdmins();
//   }
//   getAdminById(@Param('id') id: string) {
//     //return this.adminService.getAdminById(Number(id));
//   }


    @Post()
    createAdminData() {
        return { message: 'Admin data created successfully' };
    }
    @Put()
    updateAdminData() {
        return { message: 'Admin data updated successfully' };
    }
    @Delete()
    deleteAdminData() {
        return { message: 'Admin data deleted successfully' };
    }
}
