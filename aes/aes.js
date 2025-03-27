import CryptoJS from 'crypto-js';

const xml = ""; // Base64 编码的密文
const key = ""; // Hex 编码的密钥
const iv = "";  // Hex 编码的 IV

console.log('密文:', xml);
console.log('密钥:', key);
console.log('IV:', iv);

try {
    // 解析密钥和 IV（Hex 转 WordArray）
    const parsedKey = CryptoJS.enc.Hex.parse(key);
    const parsedIv = CryptoJS.enc.Hex.parse(iv);

    // Base64 解码密文
    const encryptedData = CryptoJS.enc.Base64.parse(xml);

    // 解密数据
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedData },
        parsedKey,
        {
            iv: parsedIv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
        throw new Error('解密结果为空，可能是密钥、IV或密文错误。');
    }
    console.log('解密后的数据:', decryptedText);

} catch (error) {
    console.error('解密失败:', error.message);
}

// npm install crypto-js 
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/8.0.20/jsrsasign-all-min.js">
// <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"></script>