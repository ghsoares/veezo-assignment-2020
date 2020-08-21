import React from 'react';
import {getFileContents, saveFile} from './file-fetch';
import {FaCaretDown, FaCaretRight, FaFolder, FaFolderOpen, FaFileAlt} from 'react-icons/fa/index.esm';

const HIERARCHY_INDENTATION = 8;
var loadingComponent = null;

class TreeItem extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
            loading: false
        };
    }

    onItemPressed() {
        if (this.props.file.isDirectory) {
            this.setState(prevState => ({
                open: !prevState.open
            }));
        } else {
            this.setState({
                loading: true
            });
            window.mainApp.forceUpdate();
            loadingComponent = this;
            getFileContents(this.props.file.id).then(contents => {
                this.setState({
                    loading: false
                });
                if (loadingComponent !== this) return;
                this.props.onFileLoaded(contents);
                loadingComponent = null;
                this.setState(this.state);
            });
        }
    }

    render() {
        if (this.props.file.isDirectory) {
            var children = [];
            if (this.state.open) {
                children = this.props.file.children.map((value, index) => {
                    return (<TreeItem key={index} file={value} onFileLoaded={(contents) => this.props.onFileLoaded(contents)} indentation={this.props.indentation + HIERARCHY_INDENTATION}/>)
                });
            }
            var icons;
            if (this.state.open) {
                icons = [(<FaCaretDown key={0} />), (<FaFolderOpen key={1} />)];
            } else {
                icons = [(<FaCaretRight key={0} />), (<FaFolder key={1} />)];
            }
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
        } else {
            var className = "filetree-item";
            var loading;
            if (loadingComponent === this) {
                loading = (<span className="filetree-item-loading"><span/><span/><span/></span>)
            }
            if (window.mainApp.editor && window.mainApp.editor.state.currentFile) {
                if (window.mainApp.editor.state.currentFile.id == this.props.file.id) {
                    className += " currentfile";
                }
            }
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

TreeItem.defaultProps = {
    indentation: HIERARCHY_INDENTATION,
    onFileLoaded: () => {}
}

export {TreeItem}