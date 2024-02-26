export interface GetIdsResponse{
    result:string[];
}

export interface GetItemsResponse{
    result:Item[] | null;
}



export interface Item{
    brand:string | null;
    id:string;
    price:number;
    product:string;
}
