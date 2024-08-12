import {getAvailableItems, loadState, saveState, loadData, generateUniqueIdentifier} from "./utils.js";

const data = loadData();
const state = loadState();

let items = getAvailableItems(state, data);
const item = getRandomItem(items);

const id = generateUniqueIdentifier();
state.push({item, id});
saveState(state);

function getRandomItem(items){
    const index = Math.floor(Math.random() * items.length);
    return items[index];
}