import  crypto from 'crypto';


// Generate keys
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // Key size
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
    }
});

console.log(publicKey, privateKey);
// Encryption function
export function encrypt(text: string): string {
    const encryptedBuffer = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, Buffer.from(text));

    return encryptedBuffer.toString('base64');
}

// Decryption function
export function decrypt(encryptedText: string): string {
    const decryptedBuffer = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, Buffer.from(encryptedText, 'base64'));

    return decryptedBuffer.toString('utf8');
}

// Example usage
const plaintext = 'The quick brown fox jumps over the lazy dog';

const encryptedText = encrypt(plaintext);
console.log('Encrypted Text:', encryptedText);

const decryptedText = decrypt(encryptedText);
console.log('Decrypted Text:', decryptedText);
