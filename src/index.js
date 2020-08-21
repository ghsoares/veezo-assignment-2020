import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ReactComponent as LoadingIcon} from './svg/loading.svg';
import {getFiletree, saveFile} from './js/file-fetch';
import {TreeItem} from './js/filetree-components';
import {Editor} from './js/editor';
import {FaSave, FaMoon, FaSun} from 'react-icons/fa/index.esm';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            treeLoaded: false,
            tree: [],
            saving: false,
            currentTheme: 'dark'
        };
        this.editor = null;
        window.mainApp = this;
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
        this.forceUpdate();
    }
    onFileSave(contents) {
        contents = contents ?? this.editor.state.currentFile;
        this.setState({
            saving: true
        });
        saveFile(contents.id, contents)
        .then(response => {
            console.log(response);
            this.editor.onFileSaved();
            this.setState({
                saving: false
            });
        });
    }
    forceUpdate() {
        this.setState(this.state);
    }
    onThemeSwitch() {
        if (this.state.currentTheme === 'dark') {
            this.setState({
                currentTheme: 'light'
            });
        } else {
            this.setState({
                currentTheme: 'dark'
            });
        }
    }
    render() {
        document.body.className = this.state.currentTheme;
        if (this.state.treeLoaded) {
            var saveBtn = (<button className="save" title="Save the current file (CTRL+S)" disabled><FaSave /></button>);
            var savingIcon;
            var themeBtn;
            if (this.editor && this.editor.state.currentFile !== null) {
                saveBtn = (<button className="save" title="Save the current file (CTRL+S)" onClick={() => this.onFileSave()}><FaSave /></button>);
            }
            if (this.state.saving) {
                savingIcon = <span className="saving-icon" />
            }
            if (this.state.currentTheme == "dark") {
                themeBtn = (
                    <button onClick={() => this.onThemeSwitch()} className="theme-switch">
                        <FaSun></FaSun>
                    </button>
                );
            } else {
                themeBtn = (
                    <button onClick={() => this.onThemeSwitch()} className="theme-switch">
                        <FaMoon></FaMoon>
                    </button>
                );
            }
            return (
            <div className="app">
                <div className="top">
                    {saveBtn}
                    {savingIcon}
                </div>
                <div className="center">
                    <div className="sidebar">
                        <div className="filetree-filelist">
                            {
                                this.state.tree.map((value, index) => {
                                    return (<TreeItem key={index} file={value} onFileLoaded={(contents) => this.onFileLoaded(contents)}/>)
                                })
                            }
                        </div>
                    </div>
                    <Editor onSave={contents => {this.onFileSave(contents)}} ref={c => this.editor = c} />
                </div>
                <div className="bottom">
                    <span className="copyright">Copyright @ 2020, Gabriel H. P. Soares</span>
                    {themeBtn}
                </div>
            </div>);
        } else {
            return (<div className="app-loading">
                <LoadingIcon className="loading-circle"/>
                <h1>
                    Booting up the awesome editor
                </h1>
            </div>);
        }
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
)