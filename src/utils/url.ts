/**
 * Encodes an object into a query string.
 *
 * @param data The object to encode.
 * @returns The encoded query string.
 */
export function encodeQueryData(data: object) {
    const ret = [];
    for (let d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}
