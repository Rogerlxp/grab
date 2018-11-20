import * as React from 'react';
import * as ReactDOM from 'react-dom';
const URI = require('urijs');
class VideoPlayer extends React.Component<any, any>{
    constructor(props){
        super(props);
        const uri = new URI();
        const query = uri.query(true);
        this.state = {
            videoUrl: query.videoUrl || ''
        };
        document.title = '视频播放器 | 内容平台';
    }
    render(){
        return (
            <div>
                {this.state.videoUrl && <video controls src={this.state.videoUrl}></video>}
            </div>
        );
    }
};

ReactDOM.render(<VideoPlayer />, document.getElementById('root'));