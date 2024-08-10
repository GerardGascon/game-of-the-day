import {createPageFile, getAvailableItems, loadState, saveState, loadData} from "./utils.js";

const data = loadData();
const state = loadState();

let items = getAvailableItems(state, data);

const item = getRandomItem(items);
const dataSelected = data.filter(obj => obj.name === item)[0];
state.push(item);

saveState(state);
createPageFile(dataSelected);

function getRandomItem(items){
    const index = Math.floor(Math.random() * items.length);
    return items[index];
}