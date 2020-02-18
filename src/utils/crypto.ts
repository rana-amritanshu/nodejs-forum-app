import crypto from 'crypto'

export const getRandomBytes = async (): Promise<string> => {
    const buf: Buffer = await crypto.randomBytes(256);

    return buf.toString('hex');
}

export const createHash = (data: string, algo: string = 'sha256'): string => {
    const hash = crypto.createHash(algo);

    hash.update(data);
    return hash.digest('hex');
}
