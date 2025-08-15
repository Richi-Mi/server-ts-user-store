import { Request, Response } from "express";
import { CreateCategoryDTO, CustomError, PaginationDTO } from "../../domain";
import { CategoryService } from "../services/category.service";

export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) {}
    private handdleError = (error: unknown, res: Response) => {
        if( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    public createCategory = (req: Request, res: Response) => {        
        const [error, categoryDTO] = CreateCategoryDTO.create(req.body);
        if (error) return res.status(400).json({ error });

        this.categoryService.createCategory(categoryDTO!, req.body.user)
            .then( category => res.status(201).json(category))
            .catch(err => this.handdleError(err, res));
    }
    public getCategories = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query
        const [error, paginationDTO] = PaginationDTO.create( +page, +limit );

        if (error) return res.status(400).json({ error });

        this.categoryService.getCategories(paginationDTO!)
            .then( categories => res.status(200).json(categories))
            .catch(err => this.handdleError(err, res))
    }

}