import md5 from "md5";

const PASSWORD = "Valantis";

function CREATE_SECRET():string{
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return md5(`${PASSWORD}_${currentDate}`);
}

//example "Valantis_20240223";
export const SECRET = CREATE_SECRET();
