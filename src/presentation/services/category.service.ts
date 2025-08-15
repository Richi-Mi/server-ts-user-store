import { CategoryModel } from "../../data";
import { CreateCategoryDTO, CustomError, PaginationDTO, UserEntity } from "../../domain";

export class CategoryService {
    public async createCategory(categoryDTO: CreateCategoryDTO, user: UserEntity ) {
        const categoryExists = await CategoryModel.findOne({ name: categoryDTO.name });
        if( categoryExists )
            throw CustomError.badRequest('Category already exists');

        try {
            const category = new CategoryModel({ ...categoryDTO, user: user.id })
            await category.save()

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }
        }
        catch(err) {
            throw CustomError.internalServerError('Error creating category');
        }
    }
    public async getCategories( paginationDTO : PaginationDTO ) {
        const { page, limit } = paginationDTO;
        try {
            // const total = await CategoryModel.countDocuments();
            // const dbCategories = await CategoryModel.find({})
            //     .skip( (page - 1) * limit )
            //     .limit( limit )
            const [total, dbCategories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find({})
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ])
            const categories = dbCategories.map( dbCategory => { 
                const { _id, name, available } = dbCategory
                return {
                    id: _id,
                    name,
                    available
                }
            });
            return {
                page,
                limit,
                next: `?page=${page + 1}&limit=${limit}`,
                prev: `?page=${page - 1}&limit=${limit}`,
                total,
                categories
            };
        }
        catch( error ) {
            throw CustomError.internalServerError('Error Getting categories')
        }
    }
}