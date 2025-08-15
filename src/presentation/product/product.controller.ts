import { Request, Response } from "express";
import { CustomError, PaginationDTO } from "../../domain";
import { CreateProductDTO } from "../../domain/dtos/products/CreateProductDTO";
import { ProductService } from "../services/product.service";

export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {}
    private handdleError = (error: unknown, res: Response) => {
        if( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
    public createProduct = (req: Request, res: Response) => {        
        const [error, productDTO] = CreateProductDTO.create({
            ...req.body,
            user: req.body.user.id
        });
        if (error) return res.status(400).json({ error });

        this.productService.createProduct(productDTO!)
            .then(product => res.status(201).json({ product }))
            .catch(err => this.handdleError(err, res));
    }
    public getProducts = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query
        const [error, paginationDTO] = PaginationDTO.create( +page, +limit );
        
        if (error) return res.status(400).json({ error });

        this.productService.getProducts(paginationDTO!)
            .then(products => res.status(200).json({ products }))
            .catch(err => this.handdleError(err, res));
    }
}