export class CreateCategoryDTO {
    
    private constructor(
        public readonly name: string,
        public readonly available: boolean
    ) {}

    static create( object: {[key: string]: any}): [string?, CreateCategoryDTO?] {
        const { name, available } = object;
        let availableBoolean = available
        if(!name || typeof name !== 'string')
            return ['Invalid name', undefined];
        
        if(typeof availableBoolean !== 'boolean') 
            availableBoolean = available === 'true' || available === true;
        
        return [undefined, new CreateCategoryDTO(name, availableBoolean)];
    }
}