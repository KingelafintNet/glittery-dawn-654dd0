export function sha256(r) {
    function t(r, t) {
        return (r >>> t) | (r << (32 - t));
    }
    let o,
        e,
        f = Math.pow,
        h = f(2, 32),
        n = "length",
        a = "",
        l = [],
        c = 8 * r[n],
        i = (sha256.h = sha256.h || []),
        s = (sha256.k = sha256.k || []),
        u = s[n],
        g = {};
    for (let r = 2; u < 64; r++)
        if (!g[r]) {
            for (o = 0; o < 313; o += r) g[o] = r;
            ((i[u] = (f(r, 0.5) * h) | 0), (s[u++] = (f(r, 1 / 3) * h) | 0));
        }
    for (r += ""; (r[n] % 64) - 56; ) r += "\0";
    for (o = 0; o < r[n]; o++) {
        if (((e = r.charCodeAt(o)), e >> 8)) return;
        l[o >> 2] |= e << (((3 - o) % 4) * 8);
    }
    for (l[l[n]] = (c / h) | 0, l[l[n]] = c, e = 0; e < l[n]; ) {
        let r = l.slice(e, (e += 16)),
            f = i;
        for (i = i.slice(0, 8), o = 0; o < 64; o++) {
            let e = r[o - 15],
                f = r[o - 2],
                h = i[0],
                n = i[4],
                a =
                    i[7] +
                    (t(n, 6) ^ t(n, 11) ^ t(n, 25)) +
                    ((n & i[5]) ^ (~n & i[6])) +
                    s[o] +
                    (r[o] = o < 16 ? r[o] : (r[o - 16] + (t(e, 7) ^ t(e, 18) ^ (e >>> 3)) + r[o - 7] + (t(f, 17) ^ t(f, 19) ^ (f >>> 10))) | 0);
            ((i = [(a + ((t(h, 2) ^ t(h, 13) ^ t(h, 22)) + ((h & i[1]) ^ (h & i[2]) ^ (i[1] & i[2])))) | 0].concat(i)), (i[4] = (i[4] + a) | 0));
        }
        for (o = 0; o < 8; o++) i[o] = (i[o] + f[o]) | 0;
    }
    for (o = 0; o < 8; o++)
        for (e = 3; e + 1; e--) {
            let r = (i[o] >> (8 * e)) & 255;
            a += (r < 16 ? 0 : "") + r.toString(16);
        }
    return a;
}
