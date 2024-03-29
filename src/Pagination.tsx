
interface Props {
    page:number;
    onPage:(toPage:number)=>void;
}

function Pagination({
    onPage,
    page,
}: Props) {

    const movePageOn = (count:number)=>{
        const newPage = page + count;
        if (newPage >= 0){
            onPage(newPage);
            return newPage;
        }else{
            
            onPage(0);
            return 0;
        }
    }

    return (
        <div className='pagination_container'>
            <button className='btn_page' onClick={ ()=>movePageOn(-1) }>
                Back
            </button>

            {page-10 >= 0 && (
                <button className='btn_page' onClick={ ()=>movePageOn(-10) }>
                    {"< -10"}
                </button>
            )}
            {page-2 >= 0 && (
                <button className='btn_page' onClick={ ()=>movePageOn(-2) }>
                    {page-2}
                </button>
            )}
            {page-1 >= 0 && (
                <button className='btn_page' onClick={ ()=>movePageOn(-1) }>
                    {page-1}
                </button>
            )}

            <button disabled className='btn_page'>
                {page}
            </button>

            <button className='btn_page' onClick={ ()=>movePageOn(1) }>
                {page+1}
            </button>
            <button className='btn_page' onClick={ ()=>movePageOn(2) }>
                {page+2}
            </button>
            <button className='btn_page' onClick={ ()=>movePageOn(10) }>
                {"+10 >"}
            </button>

            <button className='btn_page' onClick={ ()=>movePageOn(1) }>
                Next
            </button>
        </div>
    );
}

export default Pagination;
