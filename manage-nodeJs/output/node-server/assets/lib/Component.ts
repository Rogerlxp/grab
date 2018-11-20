import * as React from 'react';
import handy from './handy';
export default class Component extends React.Component<any, any>{
    constructor(props){
        super(props);
        handy.setTitle(props);
    }
}