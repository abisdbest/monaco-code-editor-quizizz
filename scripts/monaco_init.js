let isEditorReady = false;
let editor;
let current_file;
let current_file_value;

async function initMonacoEditor(filename, lang) {
    try {
        const content = await fetchText(filename); // Wait for the file to be read
        current_file = filename;

        const response = await fetch('github-dark.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch JSON: ${response.statusText}`);
        }
        const theme = await response.json();        
        
        require.config({
            paths: {
                'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs'
            }
        });
        require(['vs/editor/editor.main'], function () {
            emmetMonaco.emmetHTML(monaco);
            monaco.editor.defineTheme('github-dark', theme);
            monaco.editor.setTheme('github-dark');
            editor = monaco.editor.create(document.getElementById('editor'), {
                value: content,
                language: lang,
                theme: 'github-dark',
                minimap: {
                    enabled: true
                }
            });

            isEditorReady = true;
            editor.getModel().onDidChangeContent((event) => {
                current_file_value =  editor.getValue()
            });
        });
    } catch (error) {
        console.error(`Error initializing editor: ${error.message}`); // Handle errors
    }
}
initMonacoEditor("index.html", "html")