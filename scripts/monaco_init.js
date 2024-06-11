let isEditorReady = false;
let editor;

async function initMonacoEditor(filename, lang) {
    try {
        const content = await fetchText(filename); // Wait for the file to be read
        require.config({
            paths: {
                'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs'
            }
        });
        require(['vs/editor/editor.main'], function () {
            emmetMonaco.emmetHTML(monaco);
            editor = monaco.editor.create(document.getElementById('editor'), {
                value: content,
                language: lang,
                theme: 'vs-dark',
                minimap: {
                    enabled: true
                }
            });

            isEditorReady = true;
        });
    } catch (error) {
        console.error(`Error initializing editor: ${error.message}`); // Handle errors
    }
}
initMonacoEditor("index.html", "html")