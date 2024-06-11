function openfile(filename) {
    document.getElementById("editor").parentElement.removeChild(document.getElementById("editor"))
    const newEditor = document.createElement("div")
    newEditor.id = "editor"
    document.body.append(newEditor)
    if (filename.split(".").pop() == "js") {
        initMonacoEditor(filename, "javascript")
    } else {
        initMonacoEditor(filename, filename.split(".").pop())
    }
}

async function fetchText(filename) {
    try {
        const response = await fetch("https://quizizzfilehost.blaub002-302.workers.dev/" + filename);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`); // Check if response is ok
        }
        const text = await response.text();
        return text;
    } catch (error) {
        console.error(`Fetch error: ${error.message}`); // Log any errors
    }
}

async function save_file(filename, newvalue) {
    try {
        const response = await fetch("https://quizizzfilehost.blaub002-302.workers.dev/" + filename, {
            method: "PUT",
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            body: newvalue // body data type must match "Content-Type" header
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`); // Check if response is ok
        }
        const text = await response.text(); // Get the response text
        console.log(text); // Log the response text to the console
    } catch (error) {
        console.error(`Fetch error: ${error.message}`); // Log any errors
    }
}