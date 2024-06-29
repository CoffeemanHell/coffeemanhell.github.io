function shortenUrl(longUrl) {
    // Basit bir hash fonksiyonu
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36).substr(0, 6);
    }

    const shortCode = simpleHash(longUrl);
    const shortUrl = `https://coffeemanhell.github.io/link/${shortCode}`;

    // Normalde burada shortCode ve longUrl'yi sunucuya kaydederdik
    // Ancak GitHub Pages statik olduğu için, bunu manuel olarak urls.json dosyasına eklemeniz gerekecek
    console.log(`Short URL created: ${shortUrl}`);
    console.log(`Add this to urls.json: "${shortCode}": "${longUrl}"`);

    return shortUrl;
}

// Kullanım örneği
// const shortUrl = shortenUrl('https://www.example.com/very/long/url');
// console.log(shortUrl);