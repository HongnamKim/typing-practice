export const KEY_ESC = "Escape" as const;

export const KEY_ARROW_UP = "ArrowUp" as const;
export const KEY_ARROW_DOWN = "ArrowDown" as const;
export const KEY_ARROW_LEFT = "ArrowLeft" as const;
export const KEY_ARROW_RIGHT = "ArrowRight" as const;

export const KEY_COMMANDS = [
    KEY_ESC,
    KEY_ARROW_UP,
    KEY_ARROW_DOWN,
    KEY_ARROW_LEFT,
    KEY_ARROW_RIGHT,
] as const;

// 타입 export
export type KeyCommand = typeof KEY_COMMANDS[number];
