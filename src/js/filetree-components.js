import React from 'react';
import {getFileContents, saveFile} from './file-fetch';
/*import {FaCaretDown, FaCaretRight, FaFolder, FaFolderOpen, FaFileAlt} from 'react-icons/fa/index.esm'*/

const HIERARCHY_INDENTATION = 8;
class TreeItem extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false
        };
    }

    onItemPressed() {
        if (this.props.isDirectory) {
            this.setState(prevState => ({
                open: !prevState.open
            }));
        } else {
            getFileContents(this.props.fileId).then(contents => {
                this.props.onFileLoaded(contents);
            })
        }
    }

    render() {
        if (this.props.isDirectory) {
            var children = [];
            if (this.state.open) {
                children = this.props.children.map((value, index) => {
                    if (value.isDirectory) {
                        return (<TreeItem key={index} onFileLoaded={(contents) => this.props.onFileLoaded(contents)} fileId={value.id} indentation={this.props.indentation + HIERARCHY_INDENTATION} isDirectory={true} children={value.children} filename={value.name}></TreeItem>)
                    } else {
                        return (<TreeItem key={index} onFileLoaded={(contents) => this.props.onFileLoaded(contents)} fileId={value.id} indentation={this.props.indentation + HIERARCHY_INDENTATION} isDirectory={false} filename={value.name}></TreeItem>)
                    }
                })
            }
            return (
                <div className="filetree-filelist">
                    <button onClick={() => this.onItemPressed()} className="filetree-item" style={{paddingLeft: this.props.indentation+"px"}}>
                        <span className="filetree-item-filename">D {this.props.filename}</span>
                    </button>
                    {children}
                </div>
            )
        } else {
            return (
                <button onClick={() => this.onItemPressed()} className="filetree-item" style={{paddingLeft: this.props.indentation+"px"}}>
                    <span className="filetree-item-filename">F {this.props.filename}</span>
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