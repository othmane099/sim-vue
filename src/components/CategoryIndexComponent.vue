<template>
    <TheAlert :alert="alert"/>

    <h5 class="card-header">Categories</h5>
    <div class="d-flex">
        <TheSearch @search-category="searchCategory"
                    :searchKeyword="searchKeyword"
                    :eventType="'searchCategory'"/>
<!--        <form class="d-flex w-50 mt-1 ms-3" role="search" @submit.prevent="searchCategory">-->
<!--            <input class="form-control me-2 w-50" type="search" placeholder="Search"-->
<!--                   v-model="searchKeyword" aria-label="Search">-->
<!--            <button class="btn btn-outline-success" type="submit">Search</button>-->
<!--        </form>-->
        <div class="w-50 d-flex justify-content-end mt-1 me-3">
            <button type="button" class="btn btn-primary"
            @click="handleCreateCategoryBtn">create</button>
        </div>
    </div>

    <div class="card-body">
        <div v-if="isLoading">
            <div class="h3">Loading...</div>
        </div>
        <div v-else>
            <div v-if="!errorMessage">
                <div v-if="selectedCategories.length" class="d-flex w-100">
                        <p class="me-2">{{ selectedCategories.length }} rows selected</p>
                        <button class="btn btn-danger" type="button" @click="handleDeleteSelectedCategoryBtn">Delete</button>
                </div>
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">
                            <input type="checkbox" v-model="isAllSelected" @change="selectAllCategories">
                            <p class="d-inline-block ms-2">Category Code</p>
                        </th>
                        <th scope="col">
                            <p>Category Name</p>
                        </th>
                        <th scope="col">
                            <p>Action</p>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="c in categories" :key="c.id">
                        <td>
                            <input type="checkbox" :checked="isChecked(c)"
                                   @change="selectCategory(c)">
                            <p class="d-inline-block ms-2">{{ c.categoryCode }}</p>
                        </td>
                        <td>{{ c.categoryName }}</td>
                        <td>
                            <button type="button" class="btn btn-success me-1"
                                    @click="handleEditCategoryBtn(c)">E</button>
                            <button type="button" class="btn btn-danger"
                                    @click="handleDeleteCategoryBtn(c)">D</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="float-start">
                    <label for="rpp">Rows per page:</label>
                    <select name="sizes" id="rpp" @change="changeSize()" v-model="pageSize">
                        <option>1</option>
                        <option>5</option>
                        <option>10</option>
                        <option>20</option>
                        <option>30</option>
                        <option>40</option>
                        <option>50</option>
                    </select>
                </div>
                <div class="d-flex justify-content-end">
                    <div class="mt-2 me-2">
                        <span>{{ totalAndNumberOfElts }}</span>
                    </div>
                    <nav aria-label="Page navigation example">
                        <ul class="pagination justify-content-end">
                            <li class="page-item">
                                <button type="button" class="page-link" @click="paginate(pageNumber-1)"
                                        :class="isFirstPage ? 'disabled': ''">Previous</button>
                            </li>
                            <li v-for="(p,i) in pages" class="page-item" :class="(i) === pageNumber ? 'active' : ''">
                                <button type="button" class="page-link" @click="paginate(i)">{{ p }}</button>
                            </li>
                            <li class="page-item">
                                <button type="button" class="page-link" @click="paginate(pageNumber+1)"
                                        :class="isLastPage ? 'disabled': ''">Next</button>
                            </li>
                        </ul>
                    </nav>

                </div>
            </div>
            <div v-else>
                <div class="alert alert-danger">
                    {{ errorMessage }}
                </div>
            </div>
        </div>
    </div>

    <!-- Create Category Modal -->
    <TheModal :id="'createCategoryModal'"
              :modalTitle="'Create'"
              :eventType="'createCategoryEvent'"
              @create-category-event="addCategory">
        <label for="categoryCodeField" class="form-label">Category Code *</label>
        <input id="categoryCodeField" type="text" class="form-control"
               placeholder="Enter category Code" v-model="category.categoryCode">
        <p v-if="!validateForm && !category.categoryCode" class="text-danger">
            This field is required
        </p>
        <br>
        <label for="categoryCodeField" class="form-label">Category Name *</label>
        <input id="categoryNameField" type="text" class="form-control"
               placeholder="Enter category Name" v-model="category.categoryName">
        <p v-if="!validateForm && !category.categoryName" class="text-danger">
            This field is required
        </p>
    </TheModal>

    <!-- Update Category Modal -->
    <TheModal :id="'updateCategoryModal'"
              :modalTitle="'Update'"
              :eventType="'updateCategoryEvent'"
              @update-category-event="updateCategory">
        <label for="categoryCodeField" class="form-label">Category Code *</label>
        <input id="categoryCodeField" type="text" class="form-control"
               placeholder="Enter category Code" v-model="category.categoryCode">
        <p v-if="!validateForm && !category.categoryCode" class="text-danger">
            This field is required
        </p>
        <br>
        <label for="categoryCodeField" class="form-label">Category Name *</label>
        <input id="categoryNameField" type="text" class="form-control"
               placeholder="Enter category Name" v-model="category.categoryName">
        <p v-if="!validateForm && !category.categoryName" class="text-danger">
            This field is required
        </p>
    </TheModal>

    <!-- Delete Category Modal -->
    <TheModal :id="'deleteCategoryModal'"
              :modalTitle="'Delete'"
              :eventType="'deleteCategoryEvent'"
              @delete-category-event="deleteCategory">
        <h3>Are you sure you want to delete </h3>
        <p>You won't be able to revert this!</p>
    </TheModal>

    <!-- Delete Selected Category Modal -->
    <TheModal :id="'deleteSelectedCategoryModal'"
              :modalTitle="'Delete Selected'"
              :eventType="'deleteSelectedCategoryEvent'"
              @delete-selected-category-event="deleteSelectedCategory">
        <h3>Are you sure you want to delete selected categories </h3>
        <p>You won't be able to revert this!</p>
    </TheModal>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import TheModal from "@/components/TheModal.vue";
import bootstrap from "bootstrap/dist/js/bootstrap";
import TheAlert from "@/components/TheAlert.vue";
import TheSearch from "@/components/TheSearch.vue";
const store = useStore()
const pageSize = ref(5);


onMounted(() => {
    store.dispatch('getCategories',
    {
        keyword: searchKeyword.value,
        page: 0,
        size: pageSize.value
    })})
const categories = computed(() => store.getters.getCategories);
const errorMessage = computed(() => store.getters.getErrorMessage);
const isLoading = computed(() => store.getters.getLoading);
const alert = computed(() => store.getters.getAlert)
const pages = computed(() => store.getters.getPagination.totalPages)
const isLastPage = computed(() => store.getters.getPagination.last)
const isFirstPage = computed(() => store.getters.getPagination.first)
const pageNumber = computed(() => store.getters.getPagination.number)
const totalElts = computed(() => store.getters.getPagination.totalElements)
const numberOfElts = computed(() => store.getters.getPagination.numberOfElements)
const totalAndNumberOfElts = computed(() => (pageSize.value * pageNumber.value) + 1 +' - '+ ((pageNumber.value * pageSize.value) + numberOfElts.value) +' of '+ totalElts.value )

const category = reactive({
    id: null,
    categoryCode: '',
    categoryName: ''
})

const selectedCategories = ref([]);
const searchKeyword = ref('')
const validateForm = ref(true)
const isAllSelected = ref(false)

const hideModal= (modalId)=> {
    const myModalEl = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
}
const showModal = (modalId) => {
    const myModalAlternative = new bootstrap.Modal(modalId)
    myModalAlternative.show()
}
const initCategory = (cat) => {
    category.id = cat.id
    category.categoryName = cat.categoryName
    category.categoryCode = cat.categoryCode
}
const handleCreateCategoryBtn = () => {
    showModal('#createCategoryModal')
}
const addCategory = ()=> {
    if (category.categoryCode && category.categoryName){
        hideModal('createCategoryModal')
        store.dispatch('storeCategory', category)
        // hide deleteSelectedButton
        selectedCategories.value = []
        // reset category object to empty after create new category
        initCategory({ id:null, categoryCode:'', categoryName:'' })

    }else validateForm.value = false
}
const handleEditCategoryBtn = (cat) => {
    initCategory(cat)
    showModal('#updateCategoryModal')
}
const updateCategory = () => {
    if (category.categoryCode && category.categoryName){
        hideModal('updateCategoryModal')
        store.dispatch('updateCategory', category)
        initCategory({ id:null, categoryCode:'', categoryName:'' })
    }else validateForm.value = false
}
const handleDeleteCategoryBtn = (cat) => {
    initCategory(cat)
    showModal('#deleteCategoryModal')
}
const deleteCategory = ()=> {
    hideModal('deleteCategoryModal')
    store.dispatch('deleteCategory', category)
}
onMounted(()=> {
    // run instruction after closing createCategoryModal or creating new cateogry
    const myModalEl = document.getElementById('createCategoryModal')
    myModalEl.addEventListener('hide.bs.modal', () => {
        // active again form-validation
        validateForm.value = true

        // clear search bar after creating new category
        searchKeyword.value=''
        store.commit('setSearchKeyword', "")
    })

    const myUpdateModalEl = document.getElementById('updateCategoryModal')
    myUpdateModalEl.addEventListener('hide.bs.modal', () => {
        if (selectedCategories.value.length > 0)
            selectedCategories.value = []
    })

    const myDeleteModalEl = document.getElementById('deleteCategoryModal')
    myDeleteModalEl.addEventListener('hide.bs.modal', () => {
        if (selectedCategories.value.length > 0)
            selectedCategories.value = []
    })

    const myDeleteSelectedModalEl = document.getElementById('deleteSelectedCategoryModal')
    myDeleteSelectedModalEl.addEventListener('hide.bs.modal', () => {
        isAllSelected.value = false
    })
})

const searchCategory = (key) =>{
    store.dispatch('searchCategory', {keyword: key, page: 0, size: pageSize.value})
    searchKeyword.value = store.getters.getSearchKeyword
}

const changeSize = () => {
    store.dispatch('searchCategory', {keyword: searchKeyword.value, page: 0, size: pageSize.value})
}

const paginate = (p) => {
    console.log(pageNumber)
    store.dispatch('searchCategory', {keyword: searchKeyword.value, page: p, size: pageSize.value})
}

const selectAllCategories = () => {
    selectedCategories.value.length = 0
    console.log(isAllSelected.value)
    if (isAllSelected.value){
        for (let i = 0; i < categories.value.length; i++) {
            selectedCategories.value.push(categories.value[i])
        }
    }
}

const selectCategory = (c) => {
    let index = -1
    for (let i = 0; i < selectedCategories.value.length; i++) {
        if (c.categoryCode === selectedCategories.value[i].categoryCode){
            selectedCategories.value.splice(i, 1)
            index = i
            break
        }
    }

    if (index === -1) selectedCategories.value.push(c)
}

const isChecked = (c) => {
    for (let i = 0; i < selectedCategories.value.length; i++) {
        if (c.categoryCode === selectedCategories.value[i].categoryCode) return true
    }
    return false
}

const handleDeleteSelectedCategoryBtn = () => {
    showModal('#deleteSelectedCategoryModal')
}

const deleteSelectedCategory = () => {
    hideModal('deleteSelectedCategoryModal')
    store.dispatch('deleteSelectedCategory', selectedCategories.value)
    selectedCategories.value = []
    initCategory({ id:null, categoryCode:'', categoryName:'' })
}


</script>

<style scoped>

</style>
