<template>
  <v-dialog
    v-model="editDialog"
    scrollable 
    persistent :overlay="false"
    width="50%"
    max-width="60%"
    transition="dialog-transition"
    >
    <v-btn accent fab slot="activator">
        <v-icon>edit</v-icon>
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title primary-title>
              Edit Meetup
            </v-card-title>
          </v-flex>
        </v-layout>
            <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
              <v-card-text>
            <v-text-field
              name="title"
              label="Title"
              id="title"
              v-model="editedTitle"
              required
            ></v-text-field>
            <v-text-field
              name="description"
              label="Description"
              id="description"
              v-model="editedDescription"
              required
              multi-line
            ></v-text-field>
              </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
            <v-layout row wrap>
              <v-flex xs12>
                <v-card-actions>
                    <v-spacer></v-spacer>
                  <v-btn flat @click="editDialog=false">Close</v-btn>
                  <v-btn flat @click="onSaveChanges">Save</v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
    props: ['meetup'],
  data () {
      return {
          editDialog: false,
          editedTitle: this.meetup.title,
          editedDescription:  this.meetup.description
      }
  },
  methods: {
      onSaveChanges() {
          if(this.editedTitle.trim() === '' || this.editedDescription.trim() === '' ){
              return
          }
          this.editDialog = false
      }
  }
}
</script>
