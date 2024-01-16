function generate(length) {
    var add = 0, max = 12;

    if (length > max) {
        return generate(max) + generate(length - max);
    }

    max = Math.pow(10, length+add);
    var min = max/10;
    var number = Math.floor(Math.random() * (max - min + 1)) + min;

    return ("" + number).substring(add);
}

function generate_random_number_key() {
    return generate(64);
}

function save_random_number_key_client(key) {
    localStorage.set("enc_key", key)
}

function encrypt_key_with_user_password(key, password) {
    return CryptoJS.AES.encrypt(key, password);
}

function send_encrypted_key(encrypted_key) {
    const xhr = new XMLHttpRequest();
    let postObj = {
        key: encrypted_key
    }
    let post = JSON.stringify(postObj);
    xhr.onreadystatechange(function() {
        let data = this.responseText;
        return data;
    });
    xhr.open("POST", "/crypto/create_key.php", false);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(post);
}

function generate_key_and_set(password) {
    let key = generate_random_number_key();
    save_random_number_key_client(key);
    let enckey = encrypt_key_with_user_password(key, password);
    send_encrypted_key(enckey);
}


function load_encrypted_key_from_server() {
    const xhr = new XMLHttpRequest();
    var value = null;
    xhr.onreadystatechange(function() {
        if (this.status === 200) {
            if (this.responseText.startsWith("key")) {
                let splitResponse = this.responseText.split(",");
                value =  splitResponse[1];
            } else if (this.responseText.startsWith("needscreation")) {
                value = null;
            }
        }
    });
    xhr.open("GET", "/crypto/get_encrypted_key", false);
    xhr.send();
    return value;
}

function decrypt_key(password, key) {
    return CryptoJS.AES.decrypt(key, password).toString(CryptoJS.enc.Utf8);
}

function load_random_number_key_client() {
    return localStorage.getItem("enc_key");
}

function decrypt_on_login(password) {
    let key = load_encrypted_key_from_server();
    if (key == null) {
        return false;
    }
    let decrypted_key = decrypt_key(password, key);
    save_random_number_key_client(decrypted_key);
    return true;
}

function decryptText(text) {
    let key = load_random_number_key_client();
    return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
}

function encryptText(text) {
    let key = load_random_number_key_client();
    return CryptoJS.AES.encrypt(text, key);
}
