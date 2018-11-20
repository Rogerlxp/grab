import * as React from 'react';
import {
    Button,
    Icon
} from 'antd';
import '../../sass/component/JsonViewer.scss';
const typeOf = require('lc-type-of');

class JsonViewer extends React.Component<any, any>{
    constructor(props){
        super(props);
        this.state = {
            unfold: []
        };
    }
    UnFoldable = ['undefined', 'null', 'number', 'string'];
    getUnfold(){
        return JSON.parse(JSON.stringify(this.state.unfold));
    }
    addUnfold(path){
        const unfold = this.getUnfold();
        unfold.push(path);
        this.setState({unfold});
    }
    deleteUnfold(path){
        const unfold = this.getUnfold();
        const pathIndex = unfold.findIndex(each=>each === path);
        unfold.splice(pathIndex, 1);
        this.setState({unfold});
    }
    makeViewer(obj){
        if(!obj){
            return '';
        }
        console.log('target: ', obj);
        let res:any = [];
        const makeRow = (value, keyName, depth)=>{
            console.log('keyName: ', keyName);
            console.log('value: ', value);
            console.log('depth: ', depth);
            const type = typeOf(value);
            let isFoldable;
            let next:any = '';
            if(type === 'array'){
                isFoldable = !!value.length;
                next = '[...]';
            }else if(type === 'object'){
                isFoldable = !!Object.keys(value).length;
                next = '{...}';
            }else{
                isFoldable = !this.UnFoldable.includes(type);
            }
            let icon:any = '';
            if(isFoldable){
                icon = <Icon type="caret-right" />
                if(type === 'array'){
                    next = '[...]';
                }else if(type === 'object'){
                    next = '{...}';
                }
            }else{
                if(type === 'array'){
                    next = '[]';
                }else if(type === 'object'){
                    next = '{}';
                }else{
                    if(value === ''){
                        value = '""';
                    }
                    next = value;
                }
            }
            const depthPath = depth.join('.');
            const isShow = this.state.fold.includes(depthPath);
            // to be continued...
            const key = depth.join('.') + keyName;
            if(isFoldable){
                let children = [];
                depth.push(keyName)
                const dp = JSON.parse(JSON.stringify(depth));
                if(type === 'array'){
                    children = value.map(function(v, i){
                        return makeRow(v, i, dp);
                    });
                }else if(type === 'object'){
                    children = Object.keys(value).map(k=>{
                        return makeRow(value[k], k, dp);
                    });
                }
                return (
                    <div key={key} className="item">
                        <span className="icon">{icon}</span>
                        <span className="key-name">{keyName}: </span>
                        <span className={type}>{next}</span>
                        {children}
                    </div>
                );
            }else{
                return (
                    <div key={key} className="item">
                        <span className="icon">{icon}</span>
                        <span className="key-name">{keyName}: </span>
                        <span className={type}>{next}</span>
                    </div>
                );
            }
        };
        const type = typeOf(obj);
        if(type === 'array'){
            res = obj.map(function(each, index){
                return makeRow(each, index, []);
            });
        }else{
            const keys = Object.keys(obj);
            res = keys.map(key=>{
                return makeRow(obj[key], key, []);
            });
        }
        return res;
    }
    render(){
        const viewer = this.makeViewer(this.props.value);
        return (
            <div className="json-viewer">
                {viewer}
            </div>
        )
    }
}
export default JsonViewer;