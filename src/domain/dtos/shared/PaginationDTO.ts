export class PaginationDTO {
    private constructor(
        public readonly page: number,
        public readonly limit: number
    ) {}

    static create(page: number = 1, limit: number = 10): [string?, PaginationDTO?] {
        if( isNaN(page) || isNaN(limit)) {
            return ['Invalid pagination parameters'];
        }
        if (page <= 0 || limit < 1) {
            return ['Invalid pagination parameters'];
        }
        return [undefined, new PaginationDTO(page, limit)];
    }
}