import Popup from "./Popup";
import axios from "axios";
import goldMedal from "../../../icons/gold.png";
import silverMedal from "../../../icons/silver.png";
import bronzeMedal from "../../../icons/bronze.png";
import { snackbar } from "../../main";

class Leaderboard extends Popup {
	constructor(game) {
		super();
		this.game = game;
		this.medalMap = {
			1: goldMedal,
			2: silverMedal,
			3: bronzeMedal,
		};
		this.playerList = [
			{
				username: "ayush123",
				score: 1300,
				timePlayed: 2,
			},
			{
				username: "ayu123",
				score: 1200,
				timePlayed: 4,
			},
			{
				username: "vladimir_putin",
				score: 1100,
				timePlayed: 2,
			},
			{
				username: "player1jdsh",
				score: 1000,
				timePlayed: 4,
			},
			{
				username: "player1jdsh",
				score: 900,
				timePlayed: 4,
			},
		];
	}

	show() {
		this.makeDOMElements();
		const container = document.createElement("div");
		container.className = "leaderboard_container";
		const header = document.createElement("h1");
		header.innerText = "Leaderboard";
		axios
			.post(
				"/leaderboard",
				{
					game: this.game,
				},
				{
					headers: {
						Authorization: `JWT ${localStorage.getItem("JWT")}`,
					},
				}
			)
			.then(({ data }) => {
				const playerListContainer = this.createPlayerList(data);
				container.append(header, playerListContainer);
				this.populatePopup(container);
			})
			.catch((e) => {
				snackbar.configure("Error in retrieving leaderboard", "error");
			});
		// const playerListContainer = this.createPlayerList(this.playerList);
		// container.append(header, playerListContainer);
		// this.populatePopup(container);
	}

	createPlayerList(playerList) {
		const container = document.createElement("div");
		container.className = "player-list";
		// Creating the column names
		container.append(
			this.makeLeaderboardStub("Rank", {
				username: "Username",
				score: "Score",
				timePlayed: "Times played",
			})
		);

		playerList.map((player, index) => {
			container.append(this.makeLeaderboardStub(index + 1, player));
		});
		return container;
	}

	makeLeaderboardStub(index, { username, score, timePlayed }) {
		const container = document.createElement("div");
		container.className = "leaderboard-stub";
		container.innerHTML = `
    <span class="rank">${this.decideRankUI(index)}</span>
    <span class="username">${username}</span>
    <span class="score">${score}</span>
    <span class="times-played">${timePlayed}</span>`;
		return container;
	}

	decideRankUI(rank) {
		if (this.medalMap[rank]) {
			return `<img class="medal" src="${this.medalMap[rank]}"/>`;
		} else if (rank === "Rank") {
			return rank;
		} else {
			return `<strong>${rank}</strong>`;
		}
	}
}

export default Leaderboard;
