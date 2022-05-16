import { makeAutoObservable } from "mobx"

export default class Store {
    ready: boolean = false;

    constructor(){
        makeAutoObservable(this);
    }

    updateReadyState(ready: boolean){
        this.ready = ready;
    }
}