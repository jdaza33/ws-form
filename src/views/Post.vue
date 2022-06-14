<template>
  <div>
    <section class="section">
      <div class="columns is-centered">
        <div class="column is-11">
          <!-- Titulo -->
          <div class="encabezado">
            <h1
              class="is-size-5 has-text-weight-bold has-text-info is-uppercase"
            >
              Posts
            </h1>
          </div>
          <!-- Buscador -->
          <div class="buscador">
            <b-field horizontal grouped position="is-centered">
              <b-input
                @keyup.native="find"
                v-model="findPost"
                placeholder="Search posts"
                icon-pack="fas"
                icon="search"
              ></b-input>
              <b-button
                @click="find"
                rounded
                type="is-info"
                class="has-text-weight-bold"
                >Search</b-button
              >
            </b-field>
          </div>
          <!-- Lista de articulos -->
          <b-tabs type="is-boxed" position="is-centered" v-model="tabs">
            <b-tab-item label="List" icon-pack="fas" icon="align-left">
              <div class="card contenedor sombra">
                <div class="columns is-multiline is-centered">
                  <a
                    v-for="(post, index) in postsPaginate[current - 1]"
                    :key="index"
                  >
                    <div class="column is-narrow">
                      <div class="card caja sub-sombra">
                        <div class="card-content">
                          <div class="profile">
                            <figure class="profile-circle">
                              <img
                                :src="
                                  post.background
                                    ? post.background
                                    : 'http://hola.com'
                                "
                                @error="replaceByDefault"
                                class="profile-pic"
                              />
                            </figure>
                          </div>
                          <div class="has-text-centered">
                            <h1 class="has-text-weight-bold has-text-info">
                              {{
                                post.title.length > 20
                                  ? post.title.substring(0, 17) + "..."
                                  : post.title
                              }}
                            </h1>
                            <h2 class="is-size-7 is-capitalized">
                              {{
                                `${
                                  post.tags.length > 0
                                    ? `#${post.tags[0]}`
                                    : "n/a"
                                } ${
                                  post.tags.length > 1
                                    ? ` - #${post.tags[1]}`
                                    : ''
                                }`
                              }}
                            </h2>
                            <div class="center-tag">
                              <b-taglist attached>
                                <b-tag type="is-dark">Status: </b-tag>
                                <b-tag type="is-success" v-if="post.public"
                                  >Public</b-tag
                                >
                                <b-tag type="is-warning" v-else>Private</b-tag>
                              </b-taglist>
                            </div>
                          </div>
                        </div>
                        <footer class="card-footer">
                          <a
                            class="card-footer-item"
                            @click="beforeDeletePost(post._id)"
                            ><b-icon
                              pack="fas"
                              type="is-danger"
                              icon="trash-alt"
                              size="is-small"
                            >
                            </b-icon
                          ></a>
                          <a
                            @click="editPost(post._id)"
                            class="card-footer-item"
                            ><b-icon
                              pack="fas"
                              type="is-info"
                              icon="edit"
                              size="is-small"
                            >
                            </b-icon
                          ></a>
                        </footer>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <hr />
              <div>
                <b-pagination
                  :total="totalPages"
                  :current.sync="current"
                  :order="order"
                  :size="size"
                  :simple="isSimple"
                  :rounded="isRounded"
                  :per-page="perPage"
                  aria-next-label="Next page"
                  aria-previous-label="Previous page"
                  aria-page-label="Page"
                  aria-current-label="Current page"
                ></b-pagination>
              </div>
            </b-tab-item>
            <b-tab-item
              :label="isEdit ? 'Edit' : 'Create'"
              icon-pack="fas"
              :icon="isEdit ? 'edit' : 'pen-alt'"
            >
              <b-steps size="is-small" v-model="steps">
                <b-step-item label="Details" icon="bookmark" :clickable="true">
                  <div class="card container-create sombra">
                    <div class="card-content">
                      <div class="columns">
                        <div class="column is-6">
                          <b-field
                            label="Title:"
                            :label-position="labelPosition"
                          >
                            <b-input
                              v-model="newPost.title"
                              placeholder="Economía y familia"
                            ></b-input>
                          </b-field>
                          <b-field
                            label="Tags:"
                            :label-position="labelPosition"
                          >
                            <b-taginput
                              v-model="newPost.tags"
                              ellipsis
                              icon="label"
                              placeholder="Add a tag"
                            >
                            </b-taginput>
                          </b-field>
                          <b-field label="Public:">
                            <b-switch
                              v-model="newPost.public"
                              :rounded="true"
                              :outlined="true"
                              :size="'is-medium'"
                              :type="'is-tplanet'"
                              >{{ newPost.public ? "YES" : "NO" }}</b-switch
                            >
                          </b-field>
                        </div>
                        <div class="column is-6">
                          <b-field
                            label="Description"
                            :label-position="labelPosition"
                          >
                            <b-input
                              maxlength="230"
                              type="textarea"
                              v-model="newPost.contentText"
                              placeholder="A través de este portal, con elementos sencillos y fácil de asimilar para cualquier ciudadano"
                            ></b-input>
                          </b-field>
                        </div>
                      </div>
                      <hr />
                      <div class="encabezado">
                        <b-button
                          @click="clearPost(false)"
                          rounded
                          type="is-primary"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="trash-alt"
                          >Clear All</b-button
                        >
                      </div>
                    </div>
                  </div>
                </b-step-item>
                <b-step-item label="Image" icon="image" :clickable="true">
                  <div class="card container-create sombra">
                    <div class="card-content">
                      <div class="columns">
                        <div class="column is-6">
                          <b-field label="Image:">
                            <div class="encabezado">
                              <b-upload
                                v-model="image"
                                @input="preview"
                                drag-drop
                              >
                                <section class="section">
                                  <div class="content has-text-centered">
                                    <p>
                                      <b-icon icon="upload" size="is-large">
                                      </b-icon>
                                    </p>
                                    <p>
                                      Drop your files here or click to upload
                                    </p>
                                  </div>
                                </section>
                              </b-upload>
                            </div>
                          </b-field>
                        </div>
                        <div class="column is-6">
                          <b-field label="Preview:">
                            <figure class="image is-2by1">
                              <img v-if="previewImage" :src="previewImage" />
                            </figure>
                          </b-field>
                        </div>
                      </div>
                      <hr />
                      <div class="encabezado">
                        <b-button
                          @click="clearPost(false)"
                          rounded
                          type="is-primary"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="trash-alt"
                          >Clear All</b-button
                        >
                      </div>
                    </div>
                  </div>
                </b-step-item>
                <b-step-item label="Content" icon="file" :clickable="true">
                  <div class="card container-create sombra">
                    <div class="card-content">
                      <b-field label="Content:">
                        <vue-editor v-model="newPost.contentHtml" />
                      </b-field>

                      <hr />
                      <div class="encabezado">
                        <b-button
                          @click="isEdit ? updatePost() : createPost()"
                          rounded
                          type="is-success"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="check"
                          >Finish</b-button
                        >
                      </div>
                    </div>
                  </div>
                </b-step-item>
              </b-steps>
            </b-tab-item>
          </b-tabs>
          <!-- FIN -->
        </div>
      </div>
    </section>
    <!-- <users-details
      v-if="op == 'edit' || op == 'new'"
      :type="op"
      :data="editUser"
      :typenew="typeNew"
      :selectnew="selectNew"
    ></users-details> -->
    <!-- <user-classification v-if="op == 'clasf'"></user-classification> -->
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
// import UsersDetails from './UsersDetails.vue'
// import UserClassification from './UsersClassification'
import { VueEditor } from "vue2-editor";
import axios from "../config/axios.js";

export default {
  //   components: { UsersDetails, UserClassification },
  components: { VueEditor },
  data() {
    return {
      isLoading: false,
      isFullPage: true,
      op: "panel",
      current: 1,
      perPage: 4,
      totalPages: 0,
      order: "is-centered",
      size: "is-small",
      isSimple: false,
      isRounded: false,

      labelPosition: "on-border",

      idToEdit: null,
      isEdit: false,
      tabs: 0,
      steps: 0,
      image: null,
      previewImage: null,
      newPost: {
        title: "",
        contentText: "",
        public: false,
        tags: [],
        background: null,
        contentHtml: "",
        author: null,
      },
      posts: [],
      postsPaginate: [],
      findPost: "",

      typeNew: "",
      selectNew: "",
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: "desc",
      currentPage: 1,
      perPageCompany: 5,
      imgDefault: "img/default-img.png",
      urlprod: process.env.VUE_APP_API_URL,
    };
  },
  methods: {
    preview(file) {
      this.previewImage = URL.createObjectURL(file);
    },

    async createPost() {
      try {
        this.isLoading = true;
        this.newPost.author = this.$cookie.get("userId");
        let post = await axios.post("/posts/create", this.newPost);
        await this.uploadFile(post.data.data.post._id.toString());
        this.$buefy.toast.open({
          message: `Successfully created article!`,
          position: "is-top",
          type: "is-success",
        });
        await this.clearPost(true);
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
        this.$buefy.toast.open({
          message: `Error creating article, try again`,
          position: "is-top",
          type: "is-danger",
        });
      }
    },

    async uploadFile(postId) {
      try {
        if (this.image) {
          let data = new FormData();
          data.append("file", this.image);
          await axios.post(`/posts/upload/background/${postId}`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    async listPosts() {
      try {
        this.isLoading = true;
        let posts = await axios.post("/posts/list", {});
        this.posts = posts.data.data.post;
        this.paginate();
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
        this.$buefy.toast.open({
          message: `Searching items failed, try again, try again`,
          position: "is-top",
          type: "is-danger",
        });
      }
    },

    editPost(postId) {
      let post = this.posts.find((p) => p._id.toString() == postId);
      this.newPost.title = post.title;
      this.newPost.public = post.public;
      this.newPost.contentText = post.contentText;
      this.newPost.contentHtml = post.contentHtml;
      this.newPost.tags = post.tags;
      this.newPost.author = post.author;
      this.previewImage = post.background;
      this.newPost.background = post.background;

      this.tabs = 1;
      this.isEdit = true;
      this.idToEdit = postId;
    },

    async updatePost() {
      try {
        this.isLoading = true;
        let post = await axios.put(`/posts/${this.idToEdit}`, this.newPost);
        if (this.image)
          await this.uploadFile(post.data.data.post._id.toString());
        this.$buefy.toast.open({
          message: `Successfully editing article!`,
          position: "is-top",
          type: "is-success",
        });
        await this.clearPost(true);
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
        this.$buefy.toast.open({
          message: `Error editing article, try again`,
          position: "is-top",
          type: "is-danger",
        });
      }
    },

    async clearPost(changeTab) {
      this.newPost.title = "";
      this.newPost.public = false;
      this.newPost.contentText = "";
      this.newPost.contentHtml = "";
      this.newPost.tags = [];
      this.previewImage = null;
      this.image = null;
      this.newPost.background = null;
      this.newPost.author = null;
      this.idToEdit = null;

      if (changeTab) this.tabs = 0;
      this.steps = 0;

      this.isEdit = false;
      await this.listPosts();
    },

    detallesUsuarios() {
      this.$router.push({ name: "usersdetails" });
    },
    changeWiew(op, userData = null, type = "user") {
      this.op = op;
      this.typeNew = type;
      this.editUser = userData;
    },

    async beforeDeletePost(postId) {
      this.$buefy.dialog.confirm({
        title: "Deleting post",
        message: "Are you sure to <b>delete</b> this post?",
        confirmText: "Delete post",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deletePost(postId),
      });
    },

    async deletePost(postId) {
      try {
        this.isLoading = true;
        await axios.delete(`/posts/${postId}`);
        await this.clearPost(true);
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
        this.$buefy.toast.open({
          message: `Deleting post failed, try again, try again`,
          position: "is-top",
          type: "is-danger",
        });
      }
    },

    paginate() {
      this.current = 1;
      this.totalPages = this.posts.length;
      let limit = this.perPage;
      this.postsPaginate = [];
      let acum = 0;
      let acumAll = 0;
      let temp = [];
      let lastItem = this.posts.length - 1;
      for (let item of this.posts) {
        if (acum < limit) {
          temp.push(item);
          acum += 1;
        } else {
          this.postsPaginate.push(temp);
          temp = [];
          acum = 1;
          temp.push(item);
        }
        if (lastItem == acumAll) {
          this.postsPaginate.push(temp);
        }
        acumAll += 1;
      }
    },
    find() {
      if (!this.findPost || this.findPost == "") return this.paginate();

      this.postsPaginate = [];
      this.current = 1;

      let filter = new RegExp(this.findPost.toLowerCase());
      let tempPostsFind = this.posts.filter((post) => {
        return filter.test(post.title.toLowerCase());
      });

      this.totalPages = tempPostsFind.length;

      let limit = this.perPage;
      let acum = 0;
      let acumAll = 0;
      let temp = [];
      let lastItem = tempPostsFind.length - 1;
      for (let item of tempPostsFind) {
        if (acum < limit) {
          temp.push(item);
          acum += 1;
        } else {
          this.postsPaginate.push(temp);
          temp = [];
          acum = 1;
          temp.push(item);
        }
        if (lastItem == acumAll) {
          this.postsPaginate.push(temp);
        }
        acumAll += 1;
      }
    },
    replaceByDefault(e) {
      e.target.src = this.imgDefault;
    },
  },
  created() {
    this.listPosts();
  },
};
</script>

<style scoped>
.section {
  font-family: "Poppins", sans-serif;
  background-color: #f5f5f5;
}

.encabezado {
  display: flex;
  justify-content: center;
  margin-bottom: 2em;
}

.center-tag {
  display: flex;
  justify-content: center;
}

.buscador {
  margin-bottom: 1.5em;
}

/* .button {
  padding: 16px 35px 19px 35px; 
  border-radius: 2em;
} */

.contenedor {
  background-color: white;
  padding: 40px;
  border-radius: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4em;
}

.container-create {
  background-color: white;
  padding: 20px;
  border-radius: 0.5em;
  justify-content: center;
  align-items: center;
  margin-bottom: 4em;
}

.sombra {
  margin-top: 0px;
  margin-bottom: 0px;
  -webkit-box-shadow: 0px 0px 9px 2px rgba(188, 186, 196, 0.63);
  -moz-box-shadow: 0px 0px 9px 2px rgba(188, 186, 196, 0.63);
  box-shadow: 0px 0px 9px 2px rgba(188, 186, 196, 0.63);
}

.caja {
  background-color: #f3f6fd;
  padding: 0px 20px 0px 20px;
  /* width: 100%; */
  /* display: flex;
  justify-content: center; */
  border-radius: 0.5em;
}

.box-create {
  background-color: #f3f6fd;
  padding: 0px 20px 0px 20px;
  width: 100%;
  /* display: flex; */
  /* justify-content: center; */
  border-radius: 0.5em;
}

.sub-sombra {
  -webkit-box-shadow: -4px 5px 11px -6px rgba(0, 0, 0, 0.37);
  -moz-box-shadow: -4px 5px 11px -6px rgba(0, 0, 0, 0.37);
  box-shadow: -4px 5px 11px -6px rgba(0, 0, 0, 0.37);
}

.profile {
  display: flex;
  justify-content: center;
}

.profile-circle {
  height: 10em;
  width: 10em;
  overflow: hidden;
  border-style: solid;
  border-color: white;
  /* border-radius: 50%; */
  border-width: 3px;
}

.profile-pic {
  width: 100%;
}

.button{
  min-width: 120px;
}
</style>
