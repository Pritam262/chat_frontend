import crypto from 'crypto';

// Function to generate a random key
function generateKey(length: number = 32): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(length, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
}




// Function to encrypt text
export default async function encryptText(text: string, ): Promise<string> {
    const bufferKey = Buffer.from([0x8e, 0x60, 0x5e, 0xfe, 0xc7, 0x5f, 0xda, 0xda, 0xad, 0xcf, 0x4c, 0x9b, 0xea, 0x33, 0xde, 0x82, 0x2a, 0x4a, 0xf5, 0x77, 0x32, 0x25, 0xba, 0x43, 0xd6, 0x4b, 0x9a, 0xa8, 0xe1, 0xd2, 0x20, 0x0d]);
    // console.log(bufferKey)
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16); // 128-bit IV

    const cipher = crypto.createCipheriv(algorithm, bufferKey, iv);
    const encryptedData = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

    return `${iv.toString('hex')}:${encryptedData}`; // Combine IV and encrypted data
}