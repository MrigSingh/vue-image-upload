<template>
<div>
<div class="container">
    <form @submit.prevent="uploadFiles" enctype="multipart/form-data">
    <div v-if="message"
        :class="`message ${error ? 'is-danger' : 'is-success'}`" >
        <div class="message-body">{{message}}</div>
    </div>
  <VueFileAgent
    ref="vueFileAgent"
    :theme="'list'"
    :multiple="true"
    :deletable="true"
    :meta="true"
    :accept="'image/*'"
    :maxSize="'10MB'"
    :maxFiles="14"
    :helpText="'Choose images files only'"
    :errorText="{
      type: 'Invalid file type. Only images are Allowed',
      size: 'Files should not exceed 10MB in size',
    }"
    @select="filesSelected($event)"
    @delete="fileDeleted($event)"
    v-model="filesData"
  ></VueFileAgent>
  <button class="btn" :disabled="!filesDataForUpload.length">
    Upload {{ filesDataForUpload.length }} files
  </button>
    </form>
    </div>
    <br/><br />
    <h1>Recent uploads</h1>
    <div class="container">
    <div class="content">
      <h4 v-if="uploadedFiles.length == 0">Nothing to show here ! Please upload some files.</h4>
        <div class="columns is-multiline">
            <div v-for="file in uploadedFiles" :key="file"  class="column is-4">
                <figure class="image">
                    <img :src="file" alt="img" >
                    <a @click="deleteFile(file)" class="delete is-large"></a>
                </figure>
            </div>
        </div>
    </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
  export default {
      name: "FileHandler",
    data: function() {
      return {
        filesData: [],
        uploadUrl: 'http://localhost:3000/upload',
        uploadHeaders: {"Content-Type": "multipart/form-data"},
        filesDataForUpload: [],
        message: "",
        error: false,
        uploadedFiles: []
      };
    },
    mounted :async function () {
          try{
              const res = await axios.get('http://localhost:3000/uploads');
              res.data.file.forEach(item => {
              this.uploadedFiles.push("http://localhost:3000/"+item);
            });
          } catch(err){
            console.log(err);
          }
      },
    methods: {
      deleteFile :async function (file) {
          this.uploadedFiles = this.uploadedFiles.filter(item => {
            return item !== file
          })
          try {
            let newFile = file.substring(file.lastIndexOf('/')+1, file.length);
            const res = await axios.delete(`http://localhost:3000/delete/${newFile}`);
            console.log(res);
          }catch(err){
            console.log(err);
          }
      },
      uploadFiles:async function() {
          const formData = new FormData();
          _.forEach(this.filesDataForUpload, element => {
              formData.append('files', element.file);
          });
        // Using the default uploader. You may use another uploader instead.
        //this.$refs.vueFileAgent.upload(this.uploadUrl, this.uploadHeaders, this.filesDataForUpload);
        try{
            const res = await axios.post('http://localhost:3000/upload',formData);
            res.data.file.forEach(item => {
              this.uploadedFiles.push("http://localhost:3000/"+item.originalname);
            });
            this.message = "Images uploaded successfully !";
            this.filesData = [];
            this.error = false;
        } catch(err){
            this.message = "Something went wrong !";
            this.error = true;
            console.log(err);
        }
        this.filesDataForUpload = [];
      },
      deleteUploadedFile: function(fileData) {
        // Using the default uploader. You may use another uploader instead.
        this.$refs.vueFileAgent.deleteUpload(this.uploadUrl, this.uploadHeaders, fileData);
      },
      filesSelected: function(filesDataNewlySelected) {
        var validFilesData = filesDataNewlySelected.filter((fileData) => !fileData.error);
        this.filesDataForUpload = this.filesDataForUpload.concat(validFilesData);
      },
      fileDeleted: function(fileData) {
        var i = this.filesDataForUpload.indexOf(fileData);
        if (i !== -1) {
          this.filesDataForUpload.splice(i, 1);
        } else {
          this.deleteUploadedFile(fileData);
        }
      },
    },
  };
</script>

<style scoped>
    h1{
      background: rgb(201, 201, 201);
      color: #000;
      width: 100%;
      margin-left: 0;
    }
    h4{
      text-align: center;
    }
    .container{
        margin-top: 30px;
        width: 80%;
        margin-left: 10%;
    }
    .btn {
        margin-top: 8px;
        padding: 12px;
        width: 100%;
        background: #5fcf80;
        border:none;
        font-size: 15px;
        color: #f9f9f9;
        border-radius: 5px;
        box-shadow: 0px 5px 10px rgba(0,0,0,0.2);
        cursor: pointer;
    }
    .image:hover {
      opacity: 0.5;
      cursor: pointer;
    }
    .image{
      position: relative;
    }
    .delete{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
    }
</style>