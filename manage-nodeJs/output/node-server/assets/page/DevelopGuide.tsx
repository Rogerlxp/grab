import * as React from 'react';
import {connect} from 'react-redux';
import Component from '../lib/Component';
class DevelopGuide extends Component{
    render(){
        return <div>

        </div>
    }
}
// const mapState = (state)=>{
//     return state.table;
// }
const container = connect()(DevelopGuide);

export default container;