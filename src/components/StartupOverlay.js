export default function StartupOverlay(props) {
    function handleClick() {
        // Start playback if it isn't already started.
    }

    return (
        <div id="startup-overlay">
            <button id="startup-button" onClick={handleClick()}/>
        </div>
    )
}