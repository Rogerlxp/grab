const puppeteer = '';//require('puppeteer');

module.exports = async function (url, rule) {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    });
    if(rule.titleRule){
        console.log('wait title dom...');
        await page.waitForSelector(rule.titleRule);
    }
    page.on('console', msg => {
        for (let i = 0; i < msg.args().length; ++i){
            console.log(`${msg.args()[i]}`);
        }
    });
    const args = {
        isNeedScroll: rule.isNeedScroll
    };
    let bodyHTML = await page.evaluate(async (args) => {
        const html = await new Promise((resolve, reject) => {
            if(!args.isNeedScroll){
                console.log('no need to scroll page.');
                setTimeout(() => {
                    resolve(document.body.innerHTML);
                }, 100);
                return;
            }
            setTimeout(() => {
                const body = document.body,
                html = document.documentElement;
                const height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
                console.log('page height: ' + height);
                const step = 100;
                let scrollTo = 0;
                const intervalIndex = setInterval(function(){
                    scrollTo = scrollTo + step;
                    if(scrollTo > height){
                        setTimeout(() => {
                            const bodyHTML = document.body.innerHTML;
                            // console.log(bodyHTML);
                            resolve(bodyHTML);
                        }, 1000);
                        window.clearInterval(intervalIndex);
                        console.log('scroll end.');
                    }else{
                        console.log('scroll to : ' + scrollTo);
                        window.scrollBy(0, scrollTo);
                    }
                }, 500);
            }, 1000);
        });
        return html;
    }, args);
    // console.log(bodyHTML);
    await browser.close();
    return bodyHTML;
}