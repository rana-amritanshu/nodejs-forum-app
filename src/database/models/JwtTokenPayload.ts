export default interface JwtTokenPayload {
    id: number,
    name: string,
    email: string,
    iat?: number | string,
    exp?: number | string
};