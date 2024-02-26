import { GetIdsResponse, GetItemsResponse, Item } from './types';
import { SECRET } from './secret';
import { trimArray } from './utils';

const API_BASE = "http://api.valantis.store:40000";

export const NUMBER_OF_ITEMS_ON_PAGE = 50;

export async function getIds(offset:number,limit:number)
:Promise<string[] | undefined>{
    try {
        const res = await fetch(API_BASE,{
            headers: {
              'X-Auth': SECRET,
              'Content-Type': 'application/json'
            },
            mode: 'cors',
            method:"POST",
            body: JSON.stringify({
                "action": "get_ids",
                "params": {
                    "offset": offset, 
                    "limit": limit
                }
            })
        });
        const data:GetIdsResponse = await res.json();
        return data.result;
    } catch (error) {
        console.error("api getIds error",error);
        return;
    }
}

export async function getFilterOptions(opps:{
    product?:string;
    brand?:string;
    price?:number;
})
:Promise<string[] | undefined>{
    try {
        const res = await fetch(API_BASE,{
            headers: {
              'X-Auth': SECRET,
              'Content-Type': 'application/json'
            },
            mode: 'cors',
            method:"POST",
            body: JSON.stringify({
                "action": "filter",
                "params": {
                    ...opps,
                }
            })
        });
        const data:GetIdsResponse = await res.json();
        return data.result;
    } catch (error) {
        console.error("api getFilter error",error);
        return;
    }
}

export async function getItems(ids:string[])
:Promise<Item[] | null>{
    try {
        const res = await fetch(API_BASE,{
            headers: {
              'X-Auth': SECRET,
              'Content-Type': 'application/json'
            },
            mode: 'cors',
            method:"POST",
            body: JSON.stringify({
                "action": "get_items",
                "params": {
                    "ids": ids
                }
            })
        });
        const data: GetItemsResponse = await res.json();
        return data.result;
    } catch (error) {
        console.log("api/getItems error",error);
        return null;
    }
}
