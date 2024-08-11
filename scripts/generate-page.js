import {getAvailableItems, loadState, saveState, loadData} from "./utils.js";

const data = loadData();
const state = loadState();

let items = getAvailableItems(state, data);
const item = getRandomItem(items);

state.push(item);
saveState(state);

function getRandomItem(items){
    const index = Math.floor(Math.random() * items.length);
    return items[index];
}