import { createStore } from "vuex";
import category from "./category";
import product from "./product";

export default createStore({
    modules: {
        category,
        product,
    },
});

