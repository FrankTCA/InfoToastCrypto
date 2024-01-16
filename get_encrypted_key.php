<?php
require "../sso/common.php";
require "creds.php";

validate_token("https://infotoast.org/crypto/get_encrypted_key.php");

$user_id = get_user_id();

$creds = new CryptoCreds();

$conn = mysqli_connect($creds->get_database_host(), $creds->get_username(), $creds->get_password(), $creds->get_database());

$sql = $conn->prepare("SELECT * FROM aes_keys WHERE user_id = ?;");
$uid = $user_id;
$sql->bind_param("i", $uid);
$sql->execute();

$returned_data = null;

if ($result = $sql->get_result()) {
    while ($row = $result->fetch_assoc()) {
        $returned_data = $row["encrypted_key"];
    }
}

if (is_null($returned_data)) {
    die("needscreation");
}

$sql2 = $conn->prepare("INSERT INTO key_access_log (user_id, ip_addr) VALUES (?, ?);");
$ip = getUserIP();
$uid2 = $user_id;
$sql2->bind_param('is', $uid2, $ip);
$sql2->execute();

echo "key," . $returned_data;
