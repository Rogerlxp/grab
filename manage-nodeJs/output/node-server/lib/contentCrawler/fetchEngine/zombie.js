const Zombie = require('zombie');

module.exports = async function (url) {
    const browserOptions = {
        loadCSS: false,
        waitDuration: '30s',
        debug: true
    };
    const browser = new Zombie(browserOptions);
    const error = await browser.visit(url);
    const html = browser.html();
    if(html){
        console.log('got content.');
        return html;
    }else{
        console.error('can not get content');
        throw error;
    }
}