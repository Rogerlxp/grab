import * as React from 'react';
import handy from '../lib/handy';
import {
    Button,
    Menu,
    Tooltip,
    Dropdown,
    Rate
} from 'antd';
import buttonActions from '../action/buttonActions';
import miscellaneousActions from '../action/miscellaneous';
import {Link} from 'react-router-dom';
import {
    EMPTY_IMAGE
} from '../const/MISC';
const timeFormat = require('lc-time-format');
const URI = require('urijs');
const defaultImg = require('../img/default.jpg');
const render = function(val, record, index, field){
    let show;
    let valText = '';
    if(handy.isValuePath(field.keyName)){
        val = handy.getValueByPath(record, field.keyName);
    }
    if(field.isShowRawValue){
        show = val;
        valText = show;
    }else if(field.type === 'select'){
        if(field.valueType === 'bit'){
            val = +val;
            if(val < 0){
                throw new Error('Value type is bit. The value should not negative.');
            }
            val = handy.transferIntToBitIndex(val);
        }
        if(field.mode === 'multiple'){
            valText = show = val.map(each=>{
                const found = field.options.find(o=>o.value === each);
                if(found){
                    return found.name;
                }else{
                    return false;
                }
            }).filter(each=>each !== false).join(field.joinSymbol || ',');
        }else{
            const found = field.options.find(option=>{
                if(typeof option.value === 'number'){
                    return option.value === (+val);
                }else{
                    return option.value === val;
                }
            });
            // console.log('val: ', val);
            // console.log('found: ', found);
            // console.log('field.options: ', field.options);
            if(found){
                show = found.name;
                valText = show;
            }else{
                show = '-';
            }
        }
    }else if(['update-time', 'create-time', 'date', 'time'].includes(field.type)){
        show = timeFormat(new Date(val), `Y-M-D H:N:S`);
    }else if(field.type === 'button'){
        const defaultButtonType = field.buttonType || 'link';
        const buttons = [];
        const dropdownMenu = [];
        for(const button of field.buttons){
            let isShow = true;
            // wether show this button
            // console.log(button);
            if(button.isShow !== undefined){
                if(typeof button.isShow === 'string'){
                    isShow = button.isShow(record);
                }else if(button.isShow.keyName){
                    if(Array.isArray(button.isShow.keyValue)){
                        if(button.isShow.keyValue.includes(record[button.isShow.keyName]) === false){
                            isShow = false;
                        }
                    }else{
                        if(button.isShow.keyValue !== record[button.isShow.keyName]){
                            isShow = false;
                        }
                    }
                }else{
                    isShow = !!button.isShow;
                }
            }
            if(button.isShow && button.isShow.isNotEqual){
                isShow = !isShow;
            }
            if(!isShow){
                continue;
            }
            const buttonProps:any = {
                className: 'link'
            };
            buttonProps.key = button.name;
            buttonProps.type = button.type || defaultButtonType;
            if(button.actionName){
                const buttonAction = buttonActions.find(action=>action.name === button.actionName);
                buttonProps.onClick = buttonAction.action.bind(this, record);
            }
            if(button.isDisabled === true){
                buttonProps.disabled = true;
            }
            if(button.isDropdown){
                dropdownMenu.push(<Menu.Item key={button.actionName + '-' + index}>{button.name}</Menu.Item>);
            }else if(button.link){
                const linkUri = new URI(button.link.href);
                Object.keys(button.link.argMap).forEach((targetKey)=>{
                    const valueKey = button.link.argMap[targetKey];
                    linkUri.setQuery(targetKey, record[valueKey]);
                });
                const linkUrl = linkUri.toString();
                buttons.push(<Button {...buttonProps}><Link key={button.name} to={linkUrl}>{button.name}</Link></Button>);
            } else{
                const btn = <Button {...buttonProps}>{button.name}</Button>
                if(button.tooltip){
                    buttons.push(<Tooltip key={button.name} title={button.tooltip.title}>{btn}</Tooltip>);
                }else{
                    buttons.push(btn);
                }
            }
        };
        if(dropdownMenu.length){
            const dropdownButtons = <Menu onClick={this.overlayClick.bind(this, record)}>{dropdownMenu}</Menu>;
            const dpProps:any = {};
            dpProps.type = field.dropdownType || defaultButtonType;
            dpProps.icon = 'ellipsis';
            buttons.push(<Dropdown key="dropdown-menu" trigger={["click"]} overlay={dropdownButtons}>
                <Button {...dpProps}></Button>
            </Dropdown>);
        }
        show = <Button.Group>{buttons}</Button.Group>
    }else if(field.type === 'image'){
        if(val){
            if(field.split){
                val = val.split(',')[0];
            }
            show = <img src={val} />
        }else{
            if(field.isBlank){
                show = <img src={EMPTY_IMAGE} />
            }else{
                show = <img src={defaultImg} />
            }
        }
    }
    else if(field.type === 'rate'){
        if(field.listType === 'text'){
            show = val;
        }else{
            show = <Rate disabled defaultValue={val}></Rate>;
        }
    }else{
        show = val;
        valText = show;
    }
    if(typeof show === 'string'){
        if(field.link){
            const aProps:any = {};
            aProps.target = '_blank';
            if(field.link.target){
                aProps.target = field.link.target;
            }
            if(field.link.query){
                let href = field.link.prefix;
                let hrefUri = new URI(href);
                if(field.link.query){
                    hrefUri.setQuery(field.link.query.key, record[field.link.query.value]);
                }
                aProps.href = hrefUri.toString();
            }else if(field.link.keyName){
                aProps.href = record[field.link.keyName];
            }
            show = <a {...aProps}>{show}</a>
        }
    }
    let spanProps:any = {};
    spanProps.style = {};
    if(field.width){
        if(typeof field.width === 'number'){
            spanProps.style.width = field.width + 'px';
        }else{
            spanProps.style.width = field.width;
        }
    }
    spanProps.className = 'field-value';
    if(!field.hasTooltip && !field.tooltip){
        spanProps.title = valText;
    }
    // console.log('record: ', record);
    if(record.key === 'sum' && field.maxRed){
        const maxDef = miscellaneousActions.find(acDef => acDef.name === field.maxRed);
        const max = maxDef.action();
        if(max < val){
            // console.log('add max red class');
            spanProps.className += ' max-red';
        }
    }
    if(field.click){
        const actionDef = buttonActions.find(def=>def.name === field.click.actionName);
        spanProps.onClick = actionDef.action.bind(this, record);
        spanProps.className += ' clickable';
    }
    // console.log(show);
    show = <span {...spanProps}>{show}</span>;
    if(field.hasTooltip === true || field.tooltip){
        // console.log('title: ', show);
        if(field.tooltip){
            let title = '';
            if(field.tooltip.title){
                title = field.tooltip.title;
            }else if(field.tooltip.keyName){
                title = record[field.tooltip.keyName];
            }
            if(title){
                show = <Tooltip arrowPointAtCenter={true} title={title}><span className="clickable">{show}</span></Tooltip>;
            }
        }else{
            show = <Tooltip arrowPointAtCenter={true} title={valText}>{show}</Tooltip>;
        }
    }
    return show;
}
export default render;