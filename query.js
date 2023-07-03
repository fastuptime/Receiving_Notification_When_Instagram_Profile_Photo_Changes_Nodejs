const { check } = require('./check.js');

async function sorgu(username, telegramId) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
        headers: { 
            'authority': 'www.instagram.com', 
            'accept': '*/*', 
            'accept-language': 'tr', 
            'cookie': 'ig_did=4593BE43-AEB7-4A60-B8E8-BBA641DF1C58; ig_nrcb=1; csrftoken=oOWv0ARCahLzQ8RC4qcLN7qRu3CB4W9g; mid=ZKLCjwALAAG4u-zaFgRSNMDzTFO4; datr=jsKiZHM0hNKZH3nXsyN8M_q0; csrftoken=VQEIFgxFg27BzkfGlDjCWYzy4qbE6Beu; ds_user_id=51870645423; ig_did=F76D79C3-D228-47D3-82BA-250C84EC0543; ig_nrcb=1; mid=ZKCCiwAEAAFq3S8OTFrpmrjoGvZh', 
            'referer': `https://www.instagram.com/${username}/`,
            'sec-ch-prefers-color-scheme': 'dark', 
            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"', 
            'sec-ch-ua-full-version-list': '"Not.A/Brand";v="8.0.0.0", "Chromium";v="114.0.5735.199", "Google Chrome";v="114.0.5735.199"', 
            'sec-ch-ua-mobile': '?0', 
            'sec-ch-ua-platform': '"Windows"', 
            'sec-ch-ua-platform-version': '"15.0.0"', 
            'sec-fetch-dest': 'empty', 
            'sec-fetch-mode': 'cors', 
            'sec-fetch-site': 'same-origin', 
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', 
            'viewport-width': '1255', 
            'x-asbd-id': '129477', 
            'x-csrftoken': 'oOWv0ARCahLzQ8RC4qcLN7qRu3CB4W9g', 
            'x-ig-app-id': '936619743392459', 
            'x-ig-www-claim': '0', 
            'x-requested-with': 'XMLHttpRequest'
        }
    };

    let response = await axios(config);
    response = JSON.stringify(response.data);
    response = JSON.parse(response);

    return await check({
        id: response.data.user.id,
        username: response.data.user.username,
        pic: response.data.user.profile_pic_url_hd,
        telegramId: telegramId
    });

}

module.exports = { sorgu };