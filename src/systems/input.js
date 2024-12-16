const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyS: false,
};

function handleInput() {
    window.addEventListener('keydown', (event) => {
        if (event.code in keys) keys[event.code] = true;
    });

    window.addEventListener('keyup', (event) => {
        if (event.code in keys) keys[event.code] = false;
    });
}

export { keys, handleInput };
