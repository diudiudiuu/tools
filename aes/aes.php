<?php

class Aes
{
    // 动态生成密钥和初始向量（IV）
    public static function generateKeyAndIv() {
        $key = bin2hex(openssl_random_pseudo_bytes(32)); // 256位
        $iv = bin2hex(openssl_random_pseudo_bytes(16));  // 128位
        return [$key, $iv];
    }

    // 加密函数
    public static function encrypt($data, $key, $iv) {
        $ciphertext = openssl_encrypt($data, 'AES-256-CBC', hex2bin($key), OPENSSL_RAW_DATA, hex2bin($iv));
        return base64_encode($ciphertext);
    }

    // 解密函数
    public static function decrypt($ciphertext, $key, $iv) {
        $data = openssl_decrypt(base64_decode($ciphertext), 'AES-256-CBC', hex2bin($key), OPENSSL_RAW_DATA, hex2bin($iv));
        return $data;
    }
}
$ciphertext = 'sVRJZVRjabBo7eWmvI/v1g==';
$key = '2a8d252917897dfe09ab8b5e569291b3c0aeaccb8921b63d60dae16d567769c4';
$iv = '1872615fcda7ea6c15cc331cc23acf54';

$ciphertext = Aes::decrypt($ciphertext, $key, $iv);
var_dump($ciphertext);
