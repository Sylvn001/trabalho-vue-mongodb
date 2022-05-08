<template>
  <div>
    <h1 class="text-center fs-1 fw-bolder py-5">{{message}}</h1>

    
    

    <div class="col-lg-6 col-md-10 col-10 mx-auto">
      <div class="d-flex my-4 justify-content-between align-items-center">
        <div>
          <input 
            class="search border-0 bg-white outline-0 me-3 px-3 py-2"
            v-model="search" 
            type="search">
          <button class="btn btn-dark" @click="searchJokes">Search</button>
        </div>
        <button
          class="btn btn-lg btn-dark"
          @click="openModal">Nova piada</button>
      </div>


      <div class="my-5">
        <h4 class="fw-bolder mb-3">Categorias</h4>
        <div class="d-flex flex-wrap">
          <span 
            class="badge px-4 py-2 bg-white text-dark me-3 mb-2" 
            @click="getJokes()">
            Todas
          </span>
          <span 
            class="badge px-4 py-2 bg-white text-dark me-3 mb-2" 
            v-for="category in categories" 
            :key="category.id"
            @click="selectFilter(category._id)">
            {{category.nome}}
          </span>
        </div>
      </div>

      <div class="grid">
        <div 
          v-for="(joke, index) in jokes" 
          v-bind:key="index"
          @click="openModalJoke(joke)"
          class="bg-white rounded-3 py-3 joke">
            <div class="d-flex justify-content-between align-items-center mb-3 px-4 ">
              <h4 class="my-0 fw-bolder text-wrap">{{joke.titulo}}</h4>
              <span class="rounded-pill border w-auto px-3 py-2 small" :style="{minWdth: 200}">{{joke.categoria[0]?.nome}}</span>
            </div>
            <hr class="mb-4">
            <p class="px-4">{{joke.texto}}</p>
        </div>
      </div>

    </div>

    <div class="modal" :class="{'show d-block': showModalJoke, 'fade': !showModalJoke}" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">{{title}}</h5>
            <button type="button" class="btn-close" @click="openModalJoke" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <span class="rounded-pill border w-auto px-3 py-2 small" :style="{minWdth: 200}">{{category}}</span>
            <p class="mt-4">{{body}}</p>
          </div>
        </div>
      </div>
    </div>


    <div class="modal" :class="{'show d-block': showModal, 'fade': !showModal}" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Nova piada</h5>
            <button type="button" class="btn-close" @click="openModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Titulo da piada</label>
              <div class="d-flex">
                <input v-model="emoji" type="text" class="form-control me-2" placeholder="Coloque um emoji">
                <button class="btn btn-light border" @click="toogleDialogEmoji()">😃</button>
              </div>
            </div>
            <EmojiPicker @select="showEmoji" picker-type="input"/>
            <div class="mb-3">
              <label class="form-label">Titulo da piada</label>
              <input v-model="title" type="text" class="form-control" placeholder="Toc toc? quem é?">
            </div>
            <div class="mb-3">
              <label class="form-label">Corpo da piada</label>
              <textarea v-model="body" class="form-control" cols="30" rows="5" placeholder="Quem é? Noé! Noé? Noé da sua conta!!"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Categoria</label>
              <select v-model="category" class="form-control">
                <option disabled selected>-- Selecione uma categoria --</option>
                <option 
                  v-for="cat in categories" 
                  v-bind:value="cat._id" 
                  v-bind:key="cat._id">{{cat.nome}}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="openModal">Fechar</button>
            <button type="button" class="btn btn-dark" @click="newJoke">Cadastrar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="backdrop" :class="{'show': showModal || showModalJoke}"></div>
  </div>
</template>

<script>
import axios from 'axios'
import EmojiPicker from 'vue3-emoji-picker'
import '../node_modules/vue3-emoji-picker/dist/style.css'
import { ref } from 'vue'
export default {
  name: 'App',
  data() {
    return {
      search: '',
      items: [],
      message: 'Piadas 😂',
      showModal: false,
      showModalJoke: false,
      jokes: [],
      categories: [],
      title: '',
      body: '',
      category: '',
      emoji: '',
      categoryFilter: '',
      showDialog: false,
      URL: 'http://localhost:3000'
    }
  },
  components: {
    EmojiPicker
  },
  mounted() {
    this.getJokes();
    this.getCategories();
  },
  methods: {
    async getJokes() {
      try{
        let { data } = await axios.get(`${this.URL}/jokes`);
        this.jokes = data;
      }catch(e){
        console.log(e);
      }
    },
    async getCategories(){
      try{
        let { data } = await axios.get(`${this.URL}/categories`);
        this.categories = data;
      }catch(e){
        console.log(e);
      }
    },
    async searchJokes(){
      try{
        let { data } = await axios.get(`${this.URL}/jokes/${this.search}`);
        this.jokes = data;
      }catch(e){
        console.log(e);
      }
    },
    selectFilter(filter){
      this.categoryFilter = filter;
      this.filterByCategory(filter);
    },
    async filterByCategory(){
      try{
        let { data } = await axios.get(`${this.URL}/jokes/category/${this.categoryFilter}`);
        this.jokes = data;
      }catch(e){
        console.log(e);
      }
    },
    async newJoke(){
      try{
        let joke = {
          titulo: this.title,
          texto: this.body,
          categoria: this.category
        };
        let { data } = await axios.post(`${this.URL}/jokes/create`, joke);
        console.log(data);
        // joke.categoria = [{nome: joke.categoria}]
        this.getJokes();
        this.title = '';
        this.body = '';
        this.category = '';
        this.showModal = false;
      }catch(e){
        console.log(e);
      }
    },
    openModal(){
      this.showModal = !this.showModal;
    },
    openModalJoke(joke){
      this.showModalJoke = !this.showModalJoke;
      if(joke){
        this.title = joke.titulo;
        this.body = joke.texto;
        this.category = joke.categoria[0].nome;
      }
      else{
        this.title = '';
        this.body = '';
        this.category = '';
      }

    },
    toogleDialogEmoji() {
      this.showDialog = !this.showDialog;
    },
  },
  setup(){
    const input = ref("");
    function onSelectEmoji(emoji) {
      console.log(emoji);
      input.value += emoji.i;
    }
    function showEmoji(emoji) {
      alert(`emoji ${emoji.i} selected, check console for details`);
      console.log(emoji);
    }
    return {
      input,
      onSelectEmoji,
      showEmoji,
    };
  }
}
</script>

<style>
.joke, .search{
  border-radius: 10px !important;
  box-shadow: 0px 5px 10px rgba(0,0,0,0.03);
  transition: 200ms;
}
.joke:hover{
  box-shadow: 0px 28px 50px rgba(0,0,0,0.06);
  transform: scale(1.01);
  cursor: pointer;
}

.backdrop{
  background-color: rgba(255, 255, 255, 0);
  transition: 300ms;
}
.backdrop.show{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.65);
  z-index: 1;
}
#app{
  min-height: 100vh;
  background: linear-gradient(40deg, #00ffe773, #27ff001f, #006eff40);
}
.grid{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  overflow-wrap: anywhere;
}

.badge{
  border-radius: 30px !important;
  font-size: 16px;
  padding: 10px 20px !important;
  background-color: #00ffb79a !important;
  transition: 300ms;

}

.badge:hover{
  cursor: pointer;
  transform: scale(1.06);
  background-color: #00ffe5b6 !important;
  box-shadow: none;
}
hr{
  background-color: #bbb;
}
input{
  outline: none;
}
textarea{
  max-height: 200px;
}
*{
  font-family: 'Inter', sans-serif;
}
</style>
