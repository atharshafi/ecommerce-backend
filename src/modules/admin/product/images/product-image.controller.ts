import {
  Controller,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.gaurd';
import { ProductImageService } from './product-image.service';
import { extname } from 'path';

@UseGuards(JwtAuthGuard)
@Controller('admin/products/:id/images')
export class ProductImageController {
  constructor(private imageService: ProductImageService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageUrls = files.map(
      (file) => `/uploads/products/${file.filename}`,
    );

    return this.imageService.addImages(+id, imageUrls);
  }
}
