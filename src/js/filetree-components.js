import React from 'react';
import {getFileContents} from './file-fetch';
import {FaCaretDown, FaCaretRight, FaFolder, FaFolderOpen, FaFileAlt} from 'react-icons/fa/index.esm';

// Indentation (padding) addition between the depth (folders) in the tree
const HIERARCHY_INDENTATION = 8;
// The current component that is loading a file
var loadingComponent = null;

// Main TreeItem UI to interact with the files in the tree
class TreeItem extends React.Component {
    // Called when instantiated
    constructor() {
        super();
        this.state = {
            open: false,    // In case the TreeItem 'isDirectory' prop is true, this is used
            loading: false  // Status of the file load
        };
    }
    // Called when this item is pressed
    onItemPressed() {
        // In case this TreeItem 'isDirectory' prop is true, change the state 'open' to render or not its children
        if (this.props.file.isDirectory) {
            this.setState(prevState => ({
                open: !prevState.open
            }));
        // In case this TreeItem 'isDirectory' prop is false, by any means, is a file, handles differently
        } else {
            // Set the state to render the loading animation
            this.setState({
                loading: true
            });
            // Force the root render to update full filetree, so if another TreeItem is loading,
            // hide the loading animation of this another TreeItem.
            window.mainApp.forceUpdate();
            // Change the current global loading TreeItem
            loadingComponent = this;
            // Get from the server the file contents by the fileId provided in the props (async)
            getFileContents(this.props.file.id).then(contents => {
                // Set the state to stop rendering the loading animation
                this.setState({
                    loading: false
                });
                // In case the current global loading TreeItem is this, by any means,
                // no other TreeItem than this is loading, continue
                if (loadingComponent !== this) return;
                // Call the 'onFileLoaded' function provided in the props,
                // the root TreeItem calls the App 'onFileLoaded', the sibbling calls
                // the parent TreeItem 'onFileLoaded' recursively until reaches the root
                this.props.onFileLoaded(contents);
                // The current global loading TreeItem is now null, as finished loading
                loadingComponent = null;
                // Force render update to hide the loading animation
                this.forceUpdate();
            });
        }
    }
    // Hack: the provided ReactJS React.Component.forceUpdate don't work in some cases,
    // so this override function force a state update to force render (and force render for its childs)
    forceUpdate() {
        this.setState(this.state);
    }
    // Called when is needed to render the component
    render() {
        // Renders this block in case 'isDirectory' prop is true
        if (this.props.file.isDirectory) {
            // Store the children TreeItem in a array
            var children = [];
            // In case this TreeItem is opened, pass for every children in the file provided in the props,
            // this creates a recursive TreeItem tree, being able to show all files from the tree
            if (this.state.open) {
                // For every childre, the indendation is this TreeItem indentation + the HIERARCHY_INDENTATION constant
                children = this.props.file.children.map((value, index) => {
                    return (<TreeItem key={index} file={value} onFileLoaded={(contents) => this.props.onFileLoaded(contents)} indentation={this.props.indentation + HIERARCHY_INDENTATION}/>)
                });
            }
            // Array storing two icons: a caret (right or down) and the folder icon (closed or opened)
            var icons;
            if (this.state.open) {
                icons = [(<FaCaretDown key={0} />), (<FaFolderOpen key={1} />)];
            } else {
                icons = [(<FaCaretRight key={0} />), (<FaFolder key={1} />)];
            }
            // Render this TreeItem
            return (
                <div className="filetree-filelist">
                    <button onClick={() => this.onItemPressed()} className="filetree-item" style={{paddingLeft: this.props.indentation+"px"}}>
                        <span className="filetree-item-icons folder">
                            {icons}
                        </span>
                        <span className="filetree-item-filename">{this.props.file.name}</span>
                    </button>
                    {children}
                </div>
            )
        // Render this block is case 'isDirectory' prop is false
        } else {
            // The current className, is stored in a variable to be able to change after
            var className = "filetree-item";
            // The element showed while the file is loading
            var loading;
            // In case the current global loading component is this TreeItem, show a loading animation
            if (loadingComponent === this) {
                loading = (<span className="filetree-item-loading"><span/><span/><span/></span>)
            }
            // In case a editor is open, the currentFile of the editor is not null and the the id of the file
            // is the same as this TreeItem file id, add a class to this component
            if (window.mainApp.editor && window.mainApp.editor.state.currentFile) {
                if (window.mainApp.editor.state.currentFile.id === this.props.file.id) {
                    className += " currentfile";
                }
            }
            // Render this TreeItem
            return (
                <button onClick={() => this.onItemPressed()} className={className} style={{paddingLeft: this.props.indentation+"px"}}>
                    <span className="filetree-item-icons file">
                        <FaFileAlt />
                    </span>
                    <span className="filetree-item-filename">{this.props.file.name}</span>
                    {loading}
                </button>
            )
        }
    }
}

// Change the default props of the TreeItem to indent once
TreeItem.defaultProps = {
    indentation: HIERARCHY_INDENTATION,
}

// Export the TreeItem component from this tree
export {TreeItem}