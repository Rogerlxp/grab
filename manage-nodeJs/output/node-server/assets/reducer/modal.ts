let defaultModalState = {
    editor: {
        isOpen: false,
        options: {}
    },
    crawlConfig: {
        isOpen: false,
        options: {}
    },
    crawlTest: {
        isOpen: false,
        options: {}
    },
    contentEditModal: {
        isOpen: false,
        options: {}
    }
};
let modal = function(state = defaultModalState, action){
    let newState = JSON.parse(JSON.stringify(state));
    switch(action.type){
        case 'modal.toggle':
            const modalName = action.key || action.modalName;
            if(!newState[modalName]){
                newState[modalName] = {
                    isOpen: false,
                    options: {}
                };
            }
            if(action.isOpen === undefined){
                newState[modalName].isOpen = !newState[modalName].isOpen;
            }else{
                newState[modalName].isOpen = action.isOpen;
            }
            if(action.options){
                let keys = Object.keys(action.options);
                for(let key of keys){
                    newState[modalName].options[key] = action.options[key];
                }
            }
            break;
    }
    return newState;
}
export default modal;