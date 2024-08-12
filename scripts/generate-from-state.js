import {createPageFile, loadState, loadData} from "./utils.js";

const data = loadData();
const state = loadState();

if (state.length !== 0){
    const item = state[state.length - 1].item;
    const dataSelected = data.filter(obj => obj.name === item)[0];
    createPageFile(dataSelected.content, state[state.length - 1].id);
} else {
    console.error("data/state.js is not present. Can't regenerate website.");
    process.exit(1);
}
