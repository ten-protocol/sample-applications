import { Ship } from "../types";
import cruiserX from "../assets/cruiser-ship-x.svg";
import battleshipX from "../assets/battleship-ship-x.svg";
import submarineX from "../assets/submarine-ship-x.svg";
import carrierX from "../assets/carrier-ship-x.svg";
import destroyerX from "../assets/destroyer-ship-x.svg";
import cruiserY from "../assets/cruiser-ship-y.svg";
import battleshipY from "../assets/battleship-ship-y.svg";
import submarineY from "../assets/submarine-ship-y.svg";
import carrierY from "../assets/carrier-ship-y.svg";
import destroyerY from "../assets/destroyer-ship-y.svg";

const battleships: Ship[] = [
	{
		shipType: "battleship",
		name: "Battleship",
		length: 4,
		imageX: battleshipX,
		imageY: battleshipY,
	},
	{
		shipType: "submarine",
		name: "Submarine",
		length: 3,
		imageX: submarineX,
		imageY: submarineY,
	},
	{
		shipType: "cruiser",
		name: "Cruier",
		length: 2,
		imageX: cruiserX,
		imageY: cruiserY,
	},
	{
		shipType: "carrier",
		name: "Aircraft Carrier",
		length: 5,
		imageX: carrierX,
		imageY: carrierY,
	},
	{
		shipType: "destroyer",
		name: "Destroyer",
		length: 3,
		imageX: destroyerX,
		imageY: destroyerY,
	},
];

export default battleships;
