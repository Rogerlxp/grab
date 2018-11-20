const travelNode = require('../lib/travelNode');
module.exports = function({$body, $}){
    let $allTag = $body.find('article, div');
    let allTagMayHaveContent = [];
    $allTag.each(function(index){
        let $this = $(this);
        let countIdt = $this.find('p, br').length;
        // console.log(countIdt);
        if(countIdt < 4){
            return;
        }
        let countText = $this.text().replace(/\s/g, '').length;
        if(countText < 200){
            return;
        }
        allTagMayHaveContent.push({tag: $this, countIdt, countDiv:$this.find('div').length, countText, index});
    });
    let markedParent = allTagMayHaveContent.map(eachTag=>{
        for(let each of allTagMayHaveContent){
            if(each.index === eachTag.index){
                continue;
            }
            if($.contains(each.tag[0], eachTag.tag[0])){
                each.isParent = true;
            }
        }
        return eachTag;
    });
    // remove parent node
    let filtedTag = markedParent.filter(each=>{
        return !each.isParent;
    });
    // filtedTag.sort((a, b)=>{
    //     return b.countText - a.countText;
    // });
    // try to remove list dom
    if(filtedTag.length > 1){
        filtedTag.forEach(each=>{
            each.repeatTextTime = 0;
            let textArr = [];
            travelNode(each.tag[0], function(node){
                if(node.type === 'text'){
                    let text = node.data.trim();
                    if(!text){
                        return;
                    }
                    textArr.push({text:node.data, isFound: false, repeatTime: 0});
                }
            });
            let indexText = function(textObj, index){
                if(textObj.isFound === true){
                    return;
                }
                textObj.isFound = true;
                for(let eachText of textArr){
                    if(eachText.isFound === true){
                        continue;
                    }
                    if(textObj.text === eachText.text){
                        eachText.isFound = true;
                        textObj.repeatTime++;
                    }
                }
            }
            textArr.forEach(textObj=>{
                indexText(textObj);
            });
            textArr.forEach(textObj=>{
                each.repeatTextTime += textObj.repeatTime;
            });
        });
        filtedTag.sort((a, b)=>{
            return a.repeatTextTime - b.repeatTextTime;
        });
    }
    if(filtedTag.length){
        return filtedTag[0].tag;
    }
}