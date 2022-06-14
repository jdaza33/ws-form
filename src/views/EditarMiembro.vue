<template>
    <div>
        <!-- Editar o Crear -->
            <b-tab-item
              :label="isEdit ? 'Edit' : 'Create'"
              icon-pack="fas"
              :icon="isEdit ? 'edit' : 'pen-alt'"
            >
              <b-steps size="is-small">
                <b-step-item
                  label="Personal Information"
                  icon="account"
                  :clickable="true"
                >
                  <div class="card container-create sombra">
                    <div class="card-content">
                      <div class="columns">
                        <div class="column is-6">
                          <b-field label="Title:"> </b-field>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-step-item>
                <b-step-item label="Profile Picture" icon="image" :clickable="true">
                  <div class="card container-create sombra">
                    <div class="card-content">
                      <div class="columns">
                        <div class="column is-6">
                          <b-field label="Profile Picture:">
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
                          type="is-info"
                          class="is-size-7 has-text-weight-bold"
                          >Clear All</b-button
                        >
                      </div>
                    </div>
                  </div>
                </b-step-item>
                <b-step-item
                  label="Courses"
                  icon="book"
                  :clickable="true"
                ></b-step-item>
              </b-steps>
            </b-tab-item>
    </div>
</template>