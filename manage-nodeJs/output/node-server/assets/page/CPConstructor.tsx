import * as React from 'react';
import {connect} from 'react-redux';
import Component from '../lib/Component';

class CPConstructor extends Component{
    render(){
        return <div>

        </div>
    }
}
const container = connect()(CPConstructor);

export default container;