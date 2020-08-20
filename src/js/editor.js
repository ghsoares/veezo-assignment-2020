import React from 'react';

class Editor extends React.Component {
    constructor() {
        super();
        this.state = {
            currentFile: null,
            fileEdited: false,
        }
        this.textarea = null;
    }
    loadFile(contents) {
        this.setState({
            currentFile: contents,
            fileEdited: false,
        });
        this.textarea.value = contents.content;
    }
    onFileSaved() {
        this.setState({
            fileEdited: false
        });
    }
    editorInputHandle(ev) {
        if (ev.key == "Tab" && !ev.shiftKey) {
            var selectionStartPos = this.textarea.selectionStart;
            var selectionEndPos = this.textarea.selectionEnd;
            var oldContent = this.textarea.value;
            this.textarea.value = oldContent.substring( 0, selectionStartPos ) + "\t" + oldContent.substring( selectionEndPos );
            this.textarea.selectionStart = this.textarea.selectionEnd = selectionStartPos + 1;
            ev.preventDefault();
        }
        if (ev.key == "s" && ev.ctrlKey && this.state.fileEdited) {
            this.props.onSave(this.state.currentFile);
            ev.preventDefault();
        }
        if (this.textarea.value != this.state.currentFile.content) {
            this.state.currentFile.content = this.textarea.value;
            this.setState({
                fileEdited: true
            });
        }
    }
    render() {
        if (this.state.currentFile) {
            return (
                <div className="editor opened">
                    <span className="editor-filename">
                        {this.state.fileEdited ? this.state.currentFile.name + "*" : this.state.currentFile.name}
                        <button className="file-close"></button>
                    </span>
                    <div className="editor-lines">
    
                    </div>
                    <textarea ref={c => {this.textarea = c}} onKeyDown={ev => this.editorInputHandle(ev)} spellCheck={false} defaultValue={this.state.currentFile.content}></textarea>
                </div>
            );
        } else {
            return (
                <div className="editor">
                    <span className="empty-editor">Open a file from the menu left to edit...</span>
                </div>
            )
        }
    }
}

export {Editor}