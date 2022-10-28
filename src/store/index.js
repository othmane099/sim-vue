import { createStore } from "vuex";
import category from "./category";
import product from "./product";
import user from "./user";
import role from "./role";

export default createStore({
    modules: {
        category,
        product,
        user,
        role,
    },
});

