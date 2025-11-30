import { createSignal, Show } from "solid-js";

export default function UserFileReader() {
    const [fileText, setFileText] = createSignal<unknown>(null);

    const readFile = async (file: File | null) => {
        if (!file) {
            setFileText('');
            return;
        }
        const content = await file.text();
        try {
            const jsonContent = JSON.parse(content);
            console.log('loaded');
            setFileText(jsonContent['vehicle_component_with_user_info']);
        } catch {
            setFileText(null);
        }
    }

    return (<div>
        <fieldset class="fieldset">
            <legend class="fieldset-legend">Input user_info.json</legend>
            <input type="file" class="file-input" onChange={async (event) => { readFile(event.target.files ? event.target.files[0] : null) }} />
            <label class="label">user_info.json from GFAlarm</label>
        </fieldset>
        <Show when={fileText()}>
            <pre class="rounded-lg p-4 text-left">
                <code>
                    {JSON.stringify(fileText(), null, 2)}
                </code>
            </pre>
        </Show>
    </div>);
}