<template>
  <div>
    <h1 class="text-center fs-1 fw-bolder pt-4 pb-5">{{message}}</h1>

    <div class="col-lg-7 col-md-10 col-10 mx-auto">
      <!-- BARRA DE BUSCA DE PIADAS -->
      <div class="d-flex my-4 justify-content-between align-items-center">
        <div class="col-8">
          <input 
            class="search border-0 bg-white outline-0 me-3 px-3 py-2 col-8"
            v-model="search" 
            placeholder="Pesquisar por título"
            type="search">
          <button class="btn btn-dark" @click="searchJokes">Search</button>
        </div>
        <button
          class="btn btn-lg btn-dark"
          @click="openModal">Nova piada</button>
      </div>


      <!-- LISTA DE CATEGORIAS PARA FILTRAR -->
      <div class="my-4">
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

      <!-- LISTAGEM DE PIADAS -->
      <div class="joke-list">
        <div class="grid">
          <div 
            v-for="(joke, index) in jokes" 
            v-bind:key="index"
            @click="openModalJoke(joke)"
            class="bg-white rounded-3 py-3 joke">
              <div class="d-flex justify-content-between align-items-center mb-3 px-4 ">
                <h4 class="my-0 fw-bolder text-wrap col-8 pe-1">{{joke.titulo}}</h4>
                <div class="col-4">
                  <span class="rounded-pill border w-auto px-3 py-2 small" v-show="joke.categoria[0]" :style="{minWdth: 200}">{{joke.categoria[0]?.nome}}</span>
                </div>
              </div>
              <hr class="mb-4">
              <p class="px-4" v-html="joke.texto"></p>
              <div v-show="joke.emoji" class="emoji">{{joke.emoji}}</div>
            </div>
          </div>
        </div>
      </div>

    <!-- MODAL PARA EXIBIÇÃO DE PIADA -->
    <div class="modal" :class="{'show d-block': showModalJoke, 'fade': !showModalJoke}" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header flex-wrap">
            <div v-show="emoji" class="emoji">{{emoji}}</div> 
            <h3 class="modal-title fw-bold">{{title}}</h3>
            <button type="button" class="btn-close" @click="openModalJoke" aria-label="Close"></button>
            <div class="w-100 mt-3">
              <span v-show="category" class="rounded-pill border w-auto px-3 py-2 small" :style="{minWdth: 200}">{{category}}</span>
            </div>
          </div>
          <div class="modal-body">
            <p class="mt-2"  v-html="body"></p>
          </div>
        </div>
      </div>
    </div>


    <!-- MODAL DE CADASTRO DE PIADA -->
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
              <input v-model="title" type="text" class="form-control" placeholder="Toc toc? quem é?">
            </div>
            <div class="mb-3">
              <label class="form-label">Corpo da piada</label>
              <!-- <QuillEditor theme="snow" v-model="body" content="body" class="rounded"/> -->
              <div class="rounded overflow-hidden">
                <quill-editor v-model:content="body" contentType="html" theme="snow" class="rounded"></quill-editor>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Categoria</label>
              <select v-model="category" @change="getCategory(e)" class="form-control">
                <option disabled selected>-- Selecione uma categoria --</option>
                <option 
                  v-for="cat in categories" 
                  v-bind:value="cat._id" 
                  v-bind:key="cat._id">{{cat.nome}}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Emoji que descreve a piada</label>
              <div class="d-flex">
                <input v-model="emoji" type="text" class="form-control me-2" placeholder="Coloque um emoji" maxlength="1">
                <button class="btn btn-light border" @click="toogleDialogEmoji()">😃</button>
              </div>
              <EmojiPicker v-show="showDialog" @select="onSelectEmoji" />
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
import { QuillEditor } from '@vueup/vue-quill'
import '../node_modules/vue3-emoji-picker/dist/style.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
// import { ref } from 'vue'
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
    EmojiPicker,
    QuillEditor
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
          categoriaId: this.category,
          emoji: this.emoji
        };
        let { data } = await axios.post(`${this.URL}/jokes/create`, joke);
        console.log(data);
        this.getJokes();
        this.title = '';
        this.body = '';
        this.category = '';
        this.emoji = '';
        this.showModal = false;
      }catch(e){
        console.log(e);
      }
    },
    getCategory(e){
      console.log(e);
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
        this.emoji = joke.emoji;
      }
      else{
        this.title = '';
        this.body = '';
        this.category = '';
        this.emoji = '';
      }
    },
    toogleDialogEmoji() {
      this.showDialog = !this.showDialog;
    },
    onSelectEmoji(emoji) {
      this.showDialog = !this.showDialog;
      console.log(emoji)
      this.emoji = emoji.i;
    }
  }
}
</script>

<style>
.btn{
  border-radius: 8px !important;
}
.joke, .search{
  border-radius: 10px !important;
  box-shadow: 0px 5px 10px rgba(0,0,0,0.03);
  transition: 200ms;
  position: relative;
}
.joke{
  height: max-content;
}
.joke:hover{
  box-shadow: 0px 28px 50px rgba(0,0,0,0.06);
  transform: scale(1.01);
  cursor: pointer;
}
.joke-list{
  max-height: 600px;
  overflow-y: scroll;
  padding: 20px 40px;
  padding-bottom: 50px;
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
.v3-emoji-picker{
  position: absolute;
  right: -285px;
  bottom: -55px;
  height: 390px;
}
.emoji{
  font-size: 16px;
  position: absolute;
  top: -16px;
  left: -16px;
  background-color: #fff;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 5px 5px 20px rgba(0,0,0,0.05);
}

.modal-header .emoji{
  font-size: 30px;
  position: absolute;
  top: -52px;
  left: 50%;
  background-color: #fff;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 5px 5px 20px rgba(0,0,0,0.15);
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
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 8px;
  cursor: pointer;
}
::-webkit-scrollbar-thumb:hover {
  background: #007950;
}
</style>
