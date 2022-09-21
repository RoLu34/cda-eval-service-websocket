function genKey(keyLength) {

    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i = 0; i < keyLength; i++) {
        result += characters.charAt(
            Math.floor( Math.random() * characters.length )
        );
    }

    return result;

}

export default {
    genKey
}