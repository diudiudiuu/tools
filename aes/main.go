package main

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
)

// Aes 加密工具结构体
type Aes struct {
	Key string
	IV  string
}

// 生成密钥和 IV
func NewAes() (*Aes, error) {
	key := make([]byte, 32) // 256-bit key
	iv := make([]byte, 16)  // 128-bit IV

	if _, err := io.ReadFull(rand.Reader, key); err != nil {
		return nil, err
	}
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return nil, err
	}

	return &Aes{
		Key: hex.EncodeToString(key),
		IV:  hex.EncodeToString(iv),
	}, nil
}

// PKCS7 填充
func pkcs7Pad(data []byte, blockSize int) []byte {
	padLen := blockSize - (len(data) % blockSize)
	padText := bytes.Repeat([]byte{byte(padLen)}, padLen)
	return append(data, padText...)
}

// PKCS7 去填充
func pkcs7Unpad(data []byte) ([]byte, error) {
	length := len(data)
	if length == 0 {
		return nil, errors.New("invalid padding size")
	}
	padLen := int(data[length-1])
	if padLen > length || padLen > aes.BlockSize {
		return nil, errors.New("invalid padding content")
	}
	return data[:length-padLen], nil
}

// AES 加密
func (a *Aes) Encrypt(data string) (string, error) {
	key, _ := hex.DecodeString(a.Key)
	iv, _ := hex.DecodeString(a.IV)

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	plainText := pkcs7Pad([]byte(data), block.BlockSize())
	ciphertext := make([]byte, len(plainText))

	mode := cipher.NewCBCEncrypter(block, iv)
	mode.CryptBlocks(ciphertext, plainText)

	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// AES 解密
func (a *Aes) Decrypt(ciphertextBase64 string) (string, error) {
	key, _ := hex.DecodeString(a.Key)
	iv, _ := hex.DecodeString(a.IV)
	ciphertext, _ := base64.StdEncoding.DecodeString(ciphertextBase64)

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	plaintext := make([]byte, len(ciphertext))
	mode := cipher.NewCBCDecrypter(block, iv)
	mode.CryptBlocks(plaintext, ciphertext)

	plaintext, err = pkcs7Unpad(plaintext)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}

func main() {
	aesInstance, _ := NewAes()
	fmt.Println("Key:", aesInstance.Key)
	fmt.Println("IV:", aesInstance.IV)

	data := "Hello, AES!"
	ciphertext, _ := aesInstance.Encrypt(data)
	fmt.Println("Encrypted:", ciphertext)

	decrypted, _ := aesInstance.Decrypt(ciphertext)
	fmt.Println("Decrypted:", decrypted)
}
