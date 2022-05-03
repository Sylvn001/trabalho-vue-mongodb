<template>
  <div>
    <h1 class="text-center fs-1 fw-bolder py-5">{{message}}</h1>

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
              <textarea v-model="body" class="form-control" cols="30" rows="5" placeholder="Quem é? Noé! Noé? Noé da sua conta!!"></textarea>
            </div>
            <!-- Select list -->
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

    <div class="col-md-5 col-8 mx-auto">

      <div class="d-flex my-4 justify-content-between align-items-center">
        <div>
          <input 
            class="rounded border bg-white outline-0 me-3 px-3 py-2"
            v-model="search" 
            type="search">
          <button class="btn btn-dark" @click="searchJokes">Search</button>
        </div>
        <button
          class="btn btn-dark"
          @click="openModal">Nova piada</button>
      </div>

      <div class="grid">
        <div 
          v-for="(joke, index) in jokes" 
          v-bind:key="index"
          class="bg-white rounded-3 mx-auto p-4 border">
            <h4 class="text-center">{{joke.titulo}}</h4>
            <p class="">{{joke.texto}}</p>
        </div>
      </div>

    </div>
    <div class="backdrop" :class="{'show': showModal}"></div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      search: '',
      items: [],
      message: 'Piadas!',
      showModal: false,
      jokes: [],
      categories: [],
      title: '',
      body: '',
      category: '',
      URL: 'http://177.131.34.111:3000'
    }
  },
  components: {
  },
  mounted() {
    this.getJokes()
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
    async newJoke(){
      try{
        let joke = {
          titulo: this.title,
          texto: this.body,
          categoria: this.category
        };
        let { data } = await axios.post(`${this.URL}/jokes/create`, joke);
        console.log(data);
        console.log(joke);

        this.jokes.push(joke);
        this.title = '';
        this.body = '';
        this.category = '';
        this.showModal = false;
      }catch(e){
        console.log(e);
      }
    },
    openModal(){
      this.getCategories();
      this.showModal = !this.showModal;
    }
  },
}
</script>

<style>
body{

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
  background: linear-gradient(40deg, #00ffe729, #00ffb842, #006fff38); /*linear-gradient(238deg, #ff00553b, #006fff3d)*/;
}
.grid{
  display: grid;
  grid-template-columns: repeat(3,auto);
  grid-gap: 20px;
  justify-content: center;
  overflow-wrap: anywhere;
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
