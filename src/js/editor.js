import React from 'react';

// The Editor component, UI for edit the current file
class Editor extends React.Component {
    // Called when instantiated
    constructor() {
        super();
        this.state = {
            currentFile: null,      // Current loaded file
            fileEdited: false,      // Boolean that is true after the content is edited, false if not edited or saved
        }
        this.textarea = null;       // The HTML textarea reference
    }
    // Called when a file is loaded, called from the App component
    loadFile(contents) {
        // Set the new state to store the current loaded file contents (id, name and content)
        // and set the fileEdited state to false
        this.setState({
            currentFile: contents,
            fileEdited: false,
        });
        // Change the textarea initial content
        this.textarea.value = contents.content;
        // A way to automatically resize the textarea to fit its content (min fittable height as the parent height as flexbox model and
        // max fittable height as the content height)
        this.textarea.style.height = 'auto';
        this.textarea.style.height = this.textarea.scrollHeight+'px';
    }
    // Called after the file is saved, called from the App component
    onFileSaved() {
        // Change the current state to say that the current file is not edited because the current content
        // is in pair with the file
        this.setState({
            fileEdited: false
        });
    }
    // Called when some input is detected inside textarea
    editorInputHandle(ev) {
        // Handle indentation
        if (ev.key === "Tab" && !ev.shiftKey) {
            var selectionStartPos = this.textarea.selectionStart;
            var selectionEndPos = this.textarea.selectionEnd;
            var oldContent = this.textarea.value;
            this.textarea.value = oldContent.substring( 0, selectionStartPos ) + "\t" + oldContent.substring( selectionEndPos );
            this.textarea.selectionStart = this.textarea.selectionEnd = selectionStartPos + 1;
            ev.preventDefault();
        }
        // Handle CTRL+S (Save file) shortcut
        if (ev.key === "s" && ev.ctrlKey && this.state.fileEdited) {
            this.props.onSave(this.state.currentFile);
            ev.preventDefault();
        }
    }
    // Called after the textarea contents (value) is changed.
    // This code is not called in editorInputHandle because the function before the content is changed
    editorEditHandle(ev) {
        // Case the current textarea content is not in pair with the current loaded file content
        // this change the copy of the contents, not the file itself
        if (this.textarea.value !== this.state.currentFile.content) {
            // Set the new state to change the current file content to the textarea value
            // and change the fileEdited boolean to true
            this.setState(prevState => ({
                currentFile: {...prevState.currentFile, content: this.textarea.value},
                fileEdited: true
            }));
        }
        // A way to automatically resize the textarea to fit its content (min fittable height as the parent height as flexbox model and
        // max fittable height as the content height)
        this.textarea.style.height = 'auto';
        this.textarea.style.height = this.textarea.scrollHeight+'px';
    }
    // Called when the close button is pressed
    onFileClose() {
        // Set the new state, the currentFile is null and fileEdited boolean is false
        // because is not needed to store the currentFile content.
        // This calls the App forceUpdate function after the state is effectively changed
        this.setState({
            currentFile: null,
            fileEdited: false
        }, () => window.mainApp.forceUpdate());
    }
    // Called when is needed to render the component
    render() {
        // Render this block in case a file is loaded
        if (this.state.currentFile) {
            // Get the number of lines in the content splitting the content from the line break (\n) characters
            var numberOfLines = this.state.currentFile.content.split("\n").length;
            // A array storing the lines to render
            var lines = [];
            // For loop for the number of lines and store a span element with the number as text
            for (var i = 0; i < numberOfLines; i++) {
                lines.push(<span key={i}>{i+1}</span>);
            }
            // Render the editor
            return (
                <div className="editor opened">
                    <span className="editor-filename">
                        {
                            // Display a '*' after the filename in the top to indicate that the current file is edited
                            this.state.fileEdited ? this.state.currentFile.name + "*" : this.state.currentFile.name
                        }
                        <button onClick={() => this.onFileClose()} className="file-close"></button>
                    </span>
                    <span className="editor-contents">
                        <span className="editor-lines">
                            {
                                // Renders the lines stored before
                                lines
                            }
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

// Exports the Editor component from this module
export {Editor}