import { GetIdsResponse, GetItemsResponse, Item } from './types';
import { SECRET } from './secret';
import { trimArray, uniqueItems } from './utils';

const API_BASE = "http://api.valantis.store:40000";

export const NUMBER_OF_ITEMS_ON_PAGE = 50;


export async function getFilter({
    signal,
    ...opps
}:{
    product?:string;
    brand?:string;
    price?:number;
    signal?: AbortSignal;
}):Promise<string[]>{
    return new Promise(async (res,rej)=>{
        try {
            const response = await fetch(API_BASE,{
                signal:signal,
                headers: {
                    "X-Auth": SECRET,
                    "Content-Type": "application/json"
                },
                mode: "cors",
                method:"POST",
                body: JSON.stringify({
                    "action": "filter",
                    "params": {
                        ...opps,
                    }
                })
            });
            const data:GetIdsResponse = await response.json();
            if(data.result){
                res(data.result);
            }else{
                rej();
            }
        } catch (error) {
            console.error("api getFilter error",error);
            rej(error);
        }
    });
}


export async function getItemsByIds(ids:string[],signal?: AbortSignal) :Promise<Item[]>{
    return new Promise(async (res,rej)=>{
        try {
            const response = await fetch(API_BASE,{
                signal:signal,
                headers: {
                    "X-Auth": SECRET,
                    "Content-Type": "application/json"
                },
                mode: "cors",
                method:"POST",
                body: JSON.stringify({
                    "action": "get_items",
                    "params": {
                        "ids": ids
                    }
                })
            });
            const data: GetItemsResponse = await response.json();
            if(data.result){
                res(data.result);
            }else{
                rej();
            }
        } catch (error) {
            console.log("api/getItems error",error);
            rej(error);
        }
    });
}


export async function getIds(offset:number,limit:number,signal?: AbortSignal) :Promise<string[]>{
    return new Promise(async (res,rej)=>{
        try {
            const response = await fetch(API_BASE,{
                signal:signal,
                headers: {
                  "X-Auth": SECRET,
                  "Content-Type": "application/json"
                },
                mode: "cors",
                method:"POST",
                body: JSON.stringify({
                    "action": "get_ids",
                    "params": {
                        "offset": offset,
                        "limit": limit
                    }
                })
            });
            const data:GetIdsResponse = await response.json();
            if(data.result){
                res(data.result);
            }else{
                rej();
            }
        } catch (error) {
            console.error("api/getIds error",error);
            rej(error);
        }
    });
}

export function getIdsOption({
    page,
    product,
    brand,
    price,
    signal
}:{
    page:number,

    product:string;
    brand:string;
    price:number;

    signal?:AbortSignal,
}):Promise<Item[] | undefined>{
    return new Promise((res,_)=>{
        if(product.length > 0 || price !==0 || brand.length > 0){
			getFilter({
				brand: brand.length > 0 ? brand : undefined,
				product: product.length > 0 ? product : undefined,
				price: price !== 0 ? price : undefined,
                signal: signal,
			}).then(result=>{
                if(signal?.aborted){
                    res(undefined);
                    return;
                }

                const uniqIds = [...new Set(result)];
                const ids = trimArray(uniqIds,page * NUMBER_OF_ITEMS_ON_PAGE, NUMBER_OF_ITEMS_ON_PAGE);
                
                getItemsByIds(ids,signal)
                .then((resItems)=>{
                    res(uniqueItems(resItems));
                }).catch(()=>{
                    res(undefined);
                });
			}).catch(()=>{
                res(undefined);
            });
		}else{
			getIds(page * NUMBER_OF_ITEMS_ON_PAGE, NUMBER_OF_ITEMS_ON_PAGE,signal)
			.then((result) => {
                if(signal?.aborted){
                    res(undefined);
                    return;
                }

                const ids = [...new Set(result)];

                getItemsByIds(ids,signal)
                .then((resItems)=>{
                    res(uniqueItems(resItems));
                }).catch(()=>{
                    res(undefined);
                });

			}).catch(()=>{
                res(undefined);
            });
		}
    });
}
