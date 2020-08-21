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
        this.textarea.style.height = 'auto';
        this.textarea.style.height = this.textarea.scrollHeight+'px';
    }
    onFileSaved() {
        this.setState({
            fileEdited: false
        });
    }
    editorInputHandle(ev) {
        if (ev.key === "Tab" && !ev.shiftKey) {
            var selectionStartPos = this.textarea.selectionStart;
            var selectionEndPos = this.textarea.selectionEnd;
            var oldContent = this.textarea.value;
            this.textarea.value = oldContent.substring( 0, selectionStartPos ) + "\t" + oldContent.substring( selectionEndPos );
            this.textarea.selectionStart = this.textarea.selectionEnd = selectionStartPos + 1;
            ev.preventDefault();
        }
        if (ev.key === "s" && ev.ctrlKey && this.state.fileEdited) {
            this.props.onSave(this.state.currentFile);
            ev.preventDefault();
        }
    }
    editorEditHandle(ev) {
        if (this.textarea.value !== this.state.currentFile.content) {
            this.setState(prevState => ({
                currentFile: {...prevState.currentFile, content: this.textarea.value},
                fileEdited: true
            }));
        }
        this.textarea.style.height = 'auto';
        this.textarea.style.height = this.textarea.scrollHeight+'px';
    }
    onFileClose() {
        this.setState({
            currentFile: null,
            fileEdited: false
        }, () => window.mainApp.forceUpdate());
    }
    render() {
        if (this.state.currentFile) {
            var numberOfLines = this.state.currentFile.content.split("\n").length;
            var lines = [];
            for (var i = 0; i < numberOfLines; i++) {
                lines.push(<span key={i}>{i+1}</span>);
            }
            return (
                <div className="editor opened">
                    <span className="editor-filename">
                        {this.state.fileEdited ? this.state.currentFile.name + "*" : this.state.currentFile.name}
                        <button onClick={() => this.onFileClose()} className="file-close"></button>
                    </span>
                    <span className="editor-contents">
                        <span className="editor-lines">
                            {lines}
                        </span>
                        <textarea ref={c => {this.textarea = c}} onInput={ev => this.editorEditHandle()} onKeyDown={ev => this.editorInputHandle(ev)} spellCheck={false} defaultValue={this.state.currentFile.content}></textarea>
                    </span>
                </div>
            );
        } else {
            return (
                <div className="editor">
                    <span className="empty-editor">Open a file from the left menu to edit</span>
                </div>
            )
        }
    }
}

export {Editor}