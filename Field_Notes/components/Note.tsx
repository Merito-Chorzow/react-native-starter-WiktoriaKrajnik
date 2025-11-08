import React from "react";

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

export function setOnNoteAdded(handler: (note: Item) => void){
    onAdded = handler
}

export function emitNoteAdded(note: Item){
    onAdded?.(note)
}