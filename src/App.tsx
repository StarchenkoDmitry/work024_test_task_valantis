import "./App.css";
import { useEffect, useState } from "react";
import { Item } from "./types";
import { getIdsOption } from "./api";
import Pagination from "./Pagination";

function App() {

	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	
	const [page, setPage] = useState(0);
	const [items, setItems] = useState<Item[]>([]);

	const [product, setProduct] = useState<string>("");
	const [brand, setBrand] = useState<string>("");
	const [price, setPrice] = useState<number>(0);


	useEffect(() => {
		const controller = new AbortController();
		setIsLoading(true);
		setIsError(false);
		let continueWork = true;

		async function task(){
			let count_retry = 5;
			while(continueWork && count_retry > 0){
				console.log("count_retry: ",count_retry);
				count_retry--;
				
				const newItems = await getIdsOption({
					page, brand, price,product,
					signal: controller.signal
				});

				if(newItems){
					if(continueWork){
						setItems(newItems);
						
						setIsLoading(false);
						setIsError(false);
					}
					return;
				}
			}
			
			setIsLoading(false);
			setIsError(true);
		}
		task();

		return ()=>{ 
			continueWork = false;
			controller.abort();
		}

	}, [page,product,price,brand]);

	const onPage = (toPage:number) => {
		setPage(toPage);
	};

	const changeName = (event: React.ChangeEvent<HTMLInputElement>)=>{
		setProduct(event.target.value);

		setBrand("");
		setPrice(0);
		setPage(0);
	};

	const changeBrand = (event: React.ChangeEvent<HTMLInputElement>)=>{
		setBrand(event.target.value);

		setProduct("");
		setPrice(0);
		setPage(0);
	};

	const changePrice = (event: React.ChangeEvent<HTMLInputElement>)=>{
		setPrice(parseInt(event.target.value));
		
		setProduct("");
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
						value={product}
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
