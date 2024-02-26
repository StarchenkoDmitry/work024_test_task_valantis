import { Item } from "./types";

export function uniqueItems(items:Item[]):Item[]
{
    const newArray:Item[] = [];
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        if(newArray.findIndex((value)=>value.id === element.id) === -1){
            newArray.push(element);
        }
    }
    return newArray;
}


export function trimArray(
    items:string[],
    offset:number,
    limit:number
){
    const newArray = [];

    for (let i = offset, nLimit = 0; i < items.length && nLimit < limit; i++, nLimit++) {
        newArray.push(items[i]);
    }
    
    return newArray;
}
