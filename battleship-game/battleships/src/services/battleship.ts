import axios from "axios";
import { ShipPosition } from "../types";
import { BASE_URL } from "../lib/constants";

const saveShipPos = async (payload: ShipPosition) => {
	await axios.post(`${BASE_URL}/saveShipPos`, payload);
};

const getShipPos = async () => {
	const res = await axios.get(`${BASE_URL}/getShipPos`);
	return res.data;
};

const saveHitCell = async (payload: any) => {
	await axios.post(`${BASE_URL}/saveHitCell`, payload);
};

const getHitCells = async () => {
	const res = await axios.get(`${BASE_URL}/getHitCells`);
	return res.data;
};

const saveHitShip = async (payload: any) => {
	await axios.post(`${BASE_URL}/saveHitShip`, payload);
};

const getHitShips = async () => {
	const res = await axios.get(`${BASE_URL}/getHitShips`);
	return res.data;
};

const saveSunkShip = async (payload: any) => {
	await axios.post(`${BASE_URL}/saveSunkShip`, payload);
};

const getSunkShips = async () => {
	const res = await axios.get(`${BASE_URL}/getSunkShips`);
	return res.data;
};

const saveMessage = async (payload: any) => {
	const res = await axios.post(`${BASE_URL}/saveMessage`, payload);
	return res.data;
};

const getMessages = async () => {
	const res = await axios.get(`${BASE_URL}/getMessages`);
	return res.data;
};

const battleship = {
	saveShipPos,
	getShipPos,
	saveHitCell,
	getHitCells,
	saveHitShip,
	getHitShips,
	saveSunkShip,
	getSunkShips,
	saveMessage,
	getMessages,
};

export default battleship;
