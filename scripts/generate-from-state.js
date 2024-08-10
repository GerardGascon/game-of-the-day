import {createPageFile, loadState, loadData} from "./utils.js";

const data = loadData();
const state = loadState();

if (state !== null){
    const item = state[state.length - 1];
    const dataSelected = data.filter(obj => obj.name === item)[0];

    createPageFile(dataSelected);
}
