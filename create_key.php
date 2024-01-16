<?php
require "../sso/common.php";
require "creds.php";

validate_token("https://infotoast.org/crypto/create_key.php");

if (!isset($_POST["key"])) {
    http_response_code(400);
    die("noinfo");
}

$user_id = get_user_id();

$creds = new CryptoCreds();

$conn = mysqli_connect($creds->get_database_host(), $creds->get_username(), $creds->get_password(), $creds->get_database());

$sql = $conn->prepare("INSERT INTO aes_keys (user_id, encrypted_key) VALUES (?, ?);");
$uid = $user_id;
$key = $_POST["key"];
$sql->bind_param('is', $user_id, $key);
$sql->execute();

$conn->commit();
$conn->close();

echo "success";
