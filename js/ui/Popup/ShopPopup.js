import axios from "axios";
import { state, snackbar, stats } from "../../main";
import QuantityController from "../creatorFunctions/createQuantityControl";
import Popup from "./Popup";

export default class ShopPopup extends Popup {
	constructor() {
		super();
	}

	show() {
		if (!this.isOpen) {
			this.makeDOMElements();
			axios.get("/shop").then(({ data }) => {
				this.shopItems = data;
				this.shopContainer = this.createShopContainer();
				this.populatePopup(this.shopContainer);
			});
			this.isOpen = true;
		}
	}

	createShopContainer() {
		const shopContainer = document.createElement("div");
		shopContainer.className = "shop-container";
		const header = document.createElement("h1");
		header.innerText = "Shop";
		const subheader = document.createElement("h2");
		subheader.innerText = "Popular Products";
		const shopItemsGrid = this.createItemsGrid();
		shopContainer.append(header, subheader, shopItemsGrid);
		return shopContainer;
	}

	createItemsGrid() {
		const shopGrid = document.createElement("div");
		shopGrid.className = "shop__item-grid";
		const elementArray = [];
		this.shopItems.forEach((item, index) => {
			elementArray.push(this.createItemDiv(item));
		});
		shopGrid.append(...elementArray);
		return shopGrid;
	}

	createItemDiv(item) {
		const itemDiv = document.createElement("div");
		itemDiv.className = "shop-item__container";
		const img = document.createElement("img");
		img.src = item.image;
		const nameSpan = document.createElement("span");
		nameSpan.innerText = item.name;
		const priceSpan = document.createElement("span");
		priceSpan.innerText = `$${item.price}`;
		itemDiv.append(img, nameSpan, priceSpan);
		itemDiv.addEventListener("click", () => {
			this.showDetails(item);
		});
		return itemDiv;
	}

	showDetails(item) {
		this.itemDetailsDiv = document.createElement("div");
		this.itemDetailsDiv.className = "item-details__container";
		const itemPreview = document.createElement("img");
		itemPreview.src = item.image;
		const detailsDiv = document.createElement("div");
		detailsDiv.className = "item-text__container";
		const itemName = document.createElement("h1");
		itemName.innerText = item.name;
		const itemPrice = document.createElement("h2");
		itemPrice.innerText = `$${item.price}`;
		const itemDesc = document.createElement("p");
		itemDesc.innerHTML = `<span class='hy'>About</span></br>${item.desc}`;

		const control = new QuantityController(1, item.quantity, (value) => {
			this.buyButton.innerText = `Buy now for ${value * item.price}`;
			if (value * item.price < state.money) {
				this.buyButton.disabled = true;
			} else {
				this.buyButton.disabled = false;
			}
		});

		const closeButton = document.createElement("button");
		closeButton.className = "close-button";
		closeButton.addEventListener("click", () => {
			this.itemDetailsDiv.style.zIndex = -3;
			this.itemDetailsDiv.style.display = "none";
		});

		this.buyButton = document.createElement("button");
		this.buyButton.innerText = `Buy now for ${control.value * item.price}`;
		this.buyButton.addEventListener("click", () => {
			axios
				.post(
					"/shop",
					{
						itemId: item.itemId,
					},
					{
						headers: {
							Authorization: `JWT ${localStorage.getItem("JWT")}`,
						},
					}
				)
				.then(({ data }) => {
					stats.decrementMoney(item.price);
					snackbar.configure(data.message, "success");
					snackbar.show();
				})
				.catch((e) => {
					console.log(e);
					snackbar.configure(e.response.data.error, "error");
					snackbar.show();
				});
		});
		detailsDiv.append(
			itemName,
			itemPrice,
			itemDesc,
			control.controlDiv,
			this.buyButton
		);
		this.itemDetailsDiv.append(closeButton, itemPreview, detailsDiv);
		this.container.appendChild(this.itemDetailsDiv);
	}
}
