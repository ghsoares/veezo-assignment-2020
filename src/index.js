import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {getFiletree, saveFile} from './js/file-fetch';
import {TreeItem} from './js/filetree-components';
import {Editor} from './js/editor';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            treeLoaded: false,
            tree: [],
        };
        this.editor = null;
    }
    componentDidMount() {
        getFiletree().then(data => {
            this.setState({
                treeLoaded: true,
                tree: data
            });
            console.log(JSON.stringify(data, null, 4));
        });
    }
    onFileLoaded(contents) {
        this.editor.loadFile(contents);
    }
    onFileSave(contents) {
        saveFile(contents.id, contents)
        .then(response => {
            this.editor.onFileSaved();
        });
    }
    render() {
        if (this.state.treeLoaded) {
            return (
            <div className="app">
                <div className="top">

                </div>
                <div className="center">
                    <div className="sidebar">
                        <div className="filetree-filelist">
                            {
                                this.state.tree.map((value, id) => {
                                    if (value.isDirectory) {
                                        return (<TreeItem key={value.id} onFileLoaded={(contents) => this.onFileLoaded(contents)} fileId={value.id} isDirectory={true} children={value.children} filename={value.name}></TreeItem>)
                                    } else {
                                        return (<TreeItem key={value.id} onFileLoaded={(contents) => this.onFileLoaded(contents)} isDirectory={false} filename={value.name}></TreeItem>)
                                    }
                                })
                            }
                        </div>
                    </div>
                    <Editor onSave={contents => {this.onFileSave(contents)}} ref={c => this.editor = c}></Editor>
                </div>
                <div className="bottom">

                </div>
            </div>);
        } else {
            return (<h1>Loading...</h1>);
        }
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
)