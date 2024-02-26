import "./App.css";
import { 
	useEffect, 
	useState 
} from "react";
import { 
	NUMBER_OF_ITEMS_ON_PAGE,
	getFilterOptions, 
	getIds, 
	getItems 
} from "./api";
import Pagination from "./Pagination";
import { Item } from "./types";
import { trimArray, uniqueItems } from "./utils";


function App() {

	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	
	const [page, setPage] = useState(0);

	const [ids, setIds] = useState<string[]>([]);
	const [items, setItems] = useState<Item[]>([]);

	const [name, setName] = useState<string>("");
	const [brand, setBrand] = useState<string>("");
	const [price, setPrice] = useState<number>(0);


	useEffect(() => {
		setIsLoading(true);
		setIsError(false);
		let doFetch = true;

		if(name.length > 0 || price !==0 || brand.length > 0){
			getFilterOptions({
				brand:brand.length > 0 ? brand : undefined,
				product:name.length > 0 ? name : undefined,
				price: price !== 0 ? price : undefined, 
			}).then(res=>{
				if(!doFetch)return;
				
				if (res) {
					const uniqIds = [...new Set(res)];
					setIds(trimArray(uniqIds,page * NUMBER_OF_ITEMS_ON_PAGE, NUMBER_OF_ITEMS_ON_PAGE));
				} else {
					setIds([]);
					setIsLoading(false);
					setIsError(true);
				}
			});
		}else{
			getIds(page * NUMBER_OF_ITEMS_ON_PAGE, NUMBER_OF_ITEMS_ON_PAGE)
			.then((res) => {
				if(!doFetch)return;
	
				if (res) {
					setIds([...new Set(res)]);
					setIsError(false);
				}else{
					setIds([]);
					setIsError(true);
				}
				setIsLoading(false);
			});
		}
		return ()=>{ doFetch = false; }
	}, [page,name,price,brand]);

	useEffect(() => {
		setIsLoading(true);
		setIsError(false);
		let doFetch = true;
		
		getItems(ids).then((res) => {
			if(!doFetch)return;

			if (res) {
				setItems(uniqueItems(res));
				setIsError(false);
			} else {
				setItems([]);
				setIsError(true);
			}
			setIsLoading(false);
		});

		return ()=>{ doFetch = false; }
	}, [ids]);

	const onPage = (toPage:number) => {
		setPage(toPage);
	};

	const changeName = (event: React.ChangeEvent<HTMLInputElement>)=>{
		setName(event.target.value);

		setBrand("");
		setPrice(0);
		setPage(0);
	};

	const changeBrand = (event: React.ChangeEvent<HTMLInputElement>)=>{
		setBrand(event.target.value);

		setName("");
		setPrice(0);
		setPage(0);
	};

	const changePrice = (event: React.ChangeEvent<HTMLInputElement>)=>{
		setPrice(parseInt(event.target.value));
		
		setName("");
		setBrand("");
		setPage(0);
	};

	return (
		<div>
			<div className="filters_container">
				<h3>Filters</h3>
				<div className="filters">

					<label htmlFor="product">Product name</label>
					<input 
						name="product" 
						type="text"
						onChange={changeName}
						value={name}
					/>

					<label htmlFor="brand">Brand</label>
					<input 
						name="brand" 
						type="text"
						onChange={changeBrand}
						value={brand}
					/>
					
					<label htmlFor="price">Price</label>
					<input 
						name="price"
						type="number" 
						onChange={changePrice}
						value={price}
					/>
				</div>
			</div>

			<Pagination 
				initPage={page} 
				onPage={onPage}
			/>

			{
				!isLoading && 
				(
					<div className="items">
					{
						items?.map((i) => (
							<div className="item" key={i.id}>
								<span className="id">{i.id}</span>
								<span className="product">{i.product}</span>
								{
									i.brand && (
										<span className="brand">brand: {i.brand}</span>
									)
								}
								<span className="price">price: {i.price}</span>
							</div>
						))
					}
					</div>
				)
			}
		</div>
	);
}

export default App;
