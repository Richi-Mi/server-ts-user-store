import { CategoryModel, ProductModel } from "../../data";
import { CustomError, PaginationDTO } from "../../domain";
import { CreateProductDTO } from "../../domain/dtos/products/CreateProductDTO";

export class ProductService {
    public async createProduct(productDTO: CreateProductDTO ) {
        const productExists = await ProductModel.findOne({ name: productDTO.name });
        if( productExists )
            throw CustomError.badRequest('Product already exists');

        try {
            const product = new ProductModel(productDTO)
            await product.save()

            return product
        }
        catch(err) {            
            throw CustomError.internalServerError('Error creating product');
        }
    }
    public async getProducts( paginationDTO : PaginationDTO ) {
        const { page, limit } = paginationDTO;
        try {
            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find({})
                    .skip( (page - 1) * limit )
                    .limit( limit )
                    .populate('user')
                    .populate('category')
            ])
            return {
                page,
                limit,
                next: `?page=${page + 1}&limit=${limit}`,
                prev: `?page=${page - 1}&limit=${limit}`,
                total,
                products
            };
        }
        catch( error ) {
            throw CustomError.internalServerError('Error Getting products')
        }
    }
}