

const characters = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
/**
 * 生成指定长度的随机字符串
 * 
 * @param {number} len 长度
 * @returns 随机字符串
 */
exports.randChars = function (len) {
    let result = [];
    while (len-- > 0) {
        result.push(
            characters.charAt(
                Math.floor(
                    62 * Math.random()
                )
            )
        );
    }

    return result.join("");
}