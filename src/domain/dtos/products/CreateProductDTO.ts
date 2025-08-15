import { Validators } from "../../../config";

export class CreateProductDTO {
    private constructor(
        public readonly name: string,
        public readonly price: number,
        public readonly available : boolean,
        public readonly description: string,
        public readonly category: string,
        public readonly user: string
    ) {}

    static create(object: {[key:string]:any}): [string?, CreateProductDTO?] {
        const { name, price, available, description, category, user } = object;

        if (!name || !price || !category || !user) {
            return ['Missing required fields'];
        }
        if( !Validators.isMongoId(category) || !Validators.isMongoId(user) ) {
            return ['Invalid category or user ID'];
        }

        const productDTO = new CreateProductDTO(
            name,
            price,
            !!available,
            description,
            category,
            user
        );

        return [undefined, productDTO];
    }
}