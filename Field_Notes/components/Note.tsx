export type Item = {
    id: string;
    title: string;
    description: string;
    date: string;
    kind: 'image'| 'file';
    uri: string;
    filename?: string;
}

let onAdded: ((note:Item) => void) | null = null;
let onAdded2: ((note:Item) => void) | null = null;

export function setOnNoteAdded(handler: (note: Item) => void){
    onAdded = handler
};

export function setOnNoteAdded2(handler: (note: Item) => void){
    onAdded2 = handler
};

export function emitNoteAdded(note: Item){
    onAdded?.(note)
    onAdded2?.(note)
};

let onDelete: ((id:string) => void) | null = null;

export function setOnNoteDelete(handler: (id: string) => void){
    onDelete = handler
};

export function emitNoteRemove(id: string){
    onDelete?.(id);
};