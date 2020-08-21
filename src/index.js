import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ReactComponent as LoadingIcon} from './svg/loading.svg';
import {getFiletree, saveFile, deleteFile} from './js/file-fetch';
import {TreeItem} from './js/filetree-components';
import {Editor} from './js/editor';
import {FaSave, FaMoon, FaSun, FaTrashAlt} from 'react-icons/fa/index.esm';

// Main app component
class App extends React.Component {
    // Called when instantiated
    constructor() {
        super();
        this.state = {
            treeLoaded: false,      // Status of the filetree
            tree: [],               // The filetree returned by the API
            saving: false,          // Status of the current file saving
            deleting: false,        // Status of deleting the current file
            currentTheme: 'dark'    // Current app theme ('light' or 'dark')
        };
        this.editor = null;         // The Editor instanciated component
        window.mainApp = this;      // The global reference of the root component
    }
    // Called after the component is inserted at the tree
    componentDidMount() {
        // Get the filetree from the API (async)
        getFiletree().then(data => {
            // Set the new state after the data is returned from the server
            this.setState({
                treeLoaded: true,
                tree: data
            });
        });
    }
    // Called when a file is returned from the server from its fileId
    onFileLoaded(contents) {
        this.editor.loadFile(contents);
        this.forceUpdate();
    }
    // Called when needs to save the file (from the save button or 'CTRL+S' shortcut)
    onFileQuerySave(contents) {
        // If is not passed any parameter, saves the current file
        contents = contents ?? this.editor.state.currentFile;
        // Set this state to render the saving animation
        this.setState({
            saving: true
        });
        // Save the file to the server (async), this doesn't truely save the file, but
        // the server returns OK code.
        saveFile(contents.id, contents)
        .then(response => {
            // Call the Editor component onFileSaved function to update
            // its state
            this.editor.onFileSaved();
            // Set this state to stop renderering the saving animation
            this.setState({
                saving: false
            });
        });
    }
    // Called when needs to delete the file (from the delete button)
    onFileQueryDelete() {
        // Set this state to render the deleting animation
        this.setState({
            deleting: true
        });
        // Delete the file to the server (async), this doesn't truely delete the file, but
        // the server returns OK code.
        deleteFile(this.editor.state.currentFile.id)
        .then(response => {
            // Call the Editor component onFileClose function to update
            // its state
            this.editor.onFileClose();
            // Set this state to stop renderering the deleting animation
            this.setState({
                deleting: false
            });
        });
    }
    // Hack: the provided ReactJS React.Component.forceUpdate don't work in some cases,
    // so this override function force a state update to force render (and force render for its childs)
    forceUpdate() {
        this.setState(this.state);
    }
    // Called when the theme switch button is pressed
    onThemeSwitch() {
        // Switch between 'dark' and 'light'
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
    // Called when is needed to render the component
    render() {
        // Change the document body className to match the current theme
        // to apply the desired theme in CSS
        document.body.className = this.state.currentTheme;
        // Render this block after the filetree is loaded
        if (this.state.treeLoaded) {
            // The save button, is disabled by default
            var saveBtn = (<button className="save" title="Save the current file (CTRL+S)" disabled><FaSave /></button>);
            // The delete button, is disabled by default
            var deleteBtn = (<button className="delete" title="Delete the current open file" disabled><FaTrashAlt /></button>);
            // Icon to show while saving the current opened file
            var savingIcon;
            // Button to switch between the themes
            var themeBtn;
            // Change the save and delete button when the current file is opened to a button not disabled
            if (this.editor && this.editor.state.currentFile !== null) {
                saveBtn = (<button className="save" title="Save the current file (CTRL+S)" onClick={() => this.onFileQuerySave()}><FaSave /></button>);
                deleteBtn = (<button className="delete" title="Delete the current open file" onClick={() => this.onFileQueryDelete()}><FaTrashAlt /></button>);
            }
            // Show the saving icon if saving
            if (this.state.saving) {
                savingIcon = <span className="saving-icon" />
            }
            // Change the theme switch button icon to Font-Awesome FaSun icon if the current theme is 'dark'
            if (this.state.currentTheme == "dark") {
                themeBtn = (
                    <button onClick={() => this.onThemeSwitch()} className="theme-switch">
                        <FaSun></FaSun>
                    </button>
                );
            // Change the theme switch button icon to Font-Awesome FaMoon icon if the current theme is 'light'
            } else {
                themeBtn = (
                    <button onClick={() => this.onThemeSwitch()} className="theme-switch">
                        <FaMoon></FaMoon>
                    </button>
                );
            }
            // Render the main UI
            return (
            <div className="app">
                <div className="top">
                    {deleteBtn}
                    {saveBtn}
                    {savingIcon}
                </div>
                <div className="center">
                    <div className="sidebar">
                        <div className="filetree-filelist">
                            {
                                // Pass for every file loaded in the tree root to render a TreeItem component, with the props:
                                //      'key' as the map index;
                                //      'file' as the map value (object representing the file);
                                //      'onFileLoaded' as the App function called when a file is loaded.
                                this.state.tree.map((value, index) => {
                                    return (<TreeItem key={index} file={value} onFileLoaded={(contents) => this.onFileLoaded(contents)}/>)
                                })
                            }
                        </div>
                    </div>
                    <Editor onSave={contents => {this.onFileQuerySave(contents)}} ref={c => this.editor = c} />
                </div>
                <div className="bottom">
                    <span className="copyright">Copyright @ 2020, Gabriel H. P. Soares</span>
                    {themeBtn}
                </div>
            </div>);
        // Render this block while loading the filetree
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

// Render the App component at the #root html element
ReactDOM.render(
    <App />,
    document.getElementById("root")
)