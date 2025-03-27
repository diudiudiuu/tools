<?php

class Aes
{
    // 动态生成密钥和初始向量（IV）
    private function generateKeyAndIv() {
        $key = bin2hex(openssl_random_pseudo_bytes(32)); // 256位
        $iv = bin2hex(openssl_random_pseudo_bytes(16));  // 128位
        return [$key, $iv];
    }

    // 加密函数
    private function encrypt($data, $key, $iv) {
        $ciphertext = openssl_encrypt($data, 'AES-256-CBC', hex2bin($key), OPENSSL_RAW_DATA, hex2bin($iv));
        return base64_encode($ciphertext);
    }

    // 解密函数
    private function decrypt($ciphertext, $key, $iv) {
        $data = openssl_decrypt(base64_decode($ciphertext), 'AES-256-CBC', hex2bin($key), OPENSSL_RAW_DATA, hex2bin($iv));
        return $data;
    }
}