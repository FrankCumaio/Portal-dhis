import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent implements OnInit {

    // help to use google api without pop auth
    // https://stackoverflow.com/questions/19766912/how-do-i-authorise-an-app-web-or-installed-without-user-intervention

    // variables
    ACCESS_TOKEN: any;

    listOfFiles: any;
    listCategories = [];
    rootFolderObj: any;
    showRelatorio = 0;

    categotiasHTML: any;
    constructor() {

    }

    ngOnInit() {
        this.get_access_token_using_saved_refresh_token();
    }



    get_access_token_using_saved_refresh_token() {
        // from the oauth playground
        const refresh_token = '1/Bkgy9uk7LLwGIsgn96k7Zhs8f65U0lYGuQCvYk7jFfj6wgmM0M6rsZb3XtWYO077';
        // from the API console
        const client_id = '929581369978-5bdegh1fc2km7hk3m3rlg1ov7ifdkbj7.apps.googleusercontent.com';
        // from the API console
        const client_secret = '24bZ0z4wbZ13bmTt0-2TGxVX';
        // from https://developers.google.com/identity/protocols/OAuth2WebServer#offline
        const refresh_url = 'https://www.googleapis.com/oauth2/v4/token';

        const post_body = `grant_type=refresh_token&client_id=${client_id}&client_secret=${encodeURIComponent(client_secret)}&refresh_token=${encodeURIComponent(refresh_token)}`;
// console.log(encodeURIComponent(client_id))
        const refresh_request = {
            body: post_body,
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }

        // post to the refresh endpoint, parse the json response and use the access token to call files.list
        fetch(refresh_url, refresh_request).then(response => {
            return (response.json());
        }).then(response_json => {
            // console.log(response_json.access_token);
            this.ACCESS_TOKEN = response_json.access_token;
            this.handleAuthResult();
        });
    }

    handleAuthResult() {
        // console.log("Tenho Autorizacao");
        this.retriveFilesFromDrive();
    }


    retriveFilesFromDrive() {
        // request variable
        var folderSearch= 'SISMA PORTAL';
        const initialRequest = gapi.client.request({
            'path': '/drive/v3/files',
            'method': 'GET',
            'headers': {
                'Authorization': 'Bearer ' + this.ACCESS_TOKEN
            },
            'params': {
                'q': "mimeType = 'application/vnd.google-apps.folder' and name='" + folderSearch + "'"
            }
        });

        //execute request
        initialRequest.execute((resp) => {
            // console.log(resp);
            this.setRootFileObject(resp);
        });
    }


    setRootFileObject(rootFolderList) {
        let obj = {};
        console.log(rootFolderList);
        rootFolderList.files.forEach(rootFolder => {
            obj = {
                id: rootFolder.id,
                name: rootFolder.name,
            };
        })

        this.rootFolderObj = obj;
        // console.log(this.rootFolderObj.id);

        this.retriveCategoriesFromDrive();
    }

    //retrive categories from drive
    retriveCategoriesFromDrive() {
        // console.log(this.rootFolderObj.id);
        //request variable
        let initialRequest = gapi.client.request({
            'path': '/drive/v3/files',
            'method': 'GET',
            'headers': {
                'Authorization': 'Bearer ' + this.ACCESS_TOKEN
            },
            'params': {
                q: `'${this.rootFolderObj.id}' in parents and trashed = false`
            }
        });

        // execute request
        initialRequest.execute((resp) => {
            // console.log(resp['files'][0]);
            this.listCategories = [];
            resp['files'].forEach((file) => {
                this.listCategories.push(file);
                this.retriveCategoriesDetails(file.id);
            });
        });
    }

    retriveCategoriesDetails(categoryId) {
        console.log(categoryId);

        //request variable
        let initialRequest = gapi.client.request({
            'path': '/drive/v3/files/' + categoryId,
            'method': 'GET',
            'headers': {
                'Authorization': 'Bearer ' + this.ACCESS_TOKEN
            },
            'params': {
                'q': "mimeType='application/vnd.google-apps.folder'",
            }
        });

        //execute request
        initialRequest.execute((resp) => {
            this.listCategories.push(resp);
            console.log(resp);
            this.displayCategories(resp);

        });
    }


    //get list of files from category
    getListOfFilesByCategory(categoryId) {
        console.log(categoryId);
        document.getElementById("listFiles").innerHTML = "";
        let initialRequest = gapi.client.request({
            'path': '/drive/v3/files',
            'method': 'GET',
            'headers': {
                'Authorization': 'Bearer ' + this.ACCESS_TOKEN
            },
            'params': {
                q: `'${categoryId}' in parents and trashed = false`
            }
        });

        // execute request
        initialRequest.execute((resp) => {
            // console.log(resp.files[0]);

            if (resp['files'][0] !== undefined) {
                // alert("Tem");
                resp['files'].forEach((file) => {
                    this.retriveFilesDetails(file.id);
                });
            } else {
                // console.log("Nao tem ficheiros");
                this.displayNonFiles();
            }
        });
    }

    retriveFilesDetails(fileId) {
        // console.log(categoryId);

        // request variable
        let initialRequest = gapi.client.request({
            'path': '/drive/v3/files/' + fileId + '?trashed=false&fields=*' ,
            'method': 'GET',
            'headers': {
                'Authorization': 'Bearer ' + this.ACCESS_TOKEN
            }
        });

        // execute request
        initialRequest.execute((resp) => {
            // console.log(resp);
            this.displayFiles(resp);
        });
    }

    /*d
      isplay the files
      NB: the files must be set as public to the web on Drive
    */
    displayFiles(doc) {
        if (doc !== undefined){
        let t = '';
        t += '<div class="col-md-3">';
        t += '  <div>';
        t += '    <img class="img-reponsive center-img" style="border: 1px solid gray;" width="190" height="190" src="' + doc.thumbnailLink + '">';
        t += '  </div>';
        t += '  <div style="width: 190px; text-align: center;">';
        t += '    <a target="_blank" href="' + doc.webContentLink + '">' + doc.name + '</a>'
        // t += '    <span style="cursor: pointer;">' + doc.title + '</span>';
        t += '  </div>';
        t += '</div>';
        let element = document.createElement('div');
        element.innerHTML = t;
        document.getElementById("listFiles").appendChild(element);
        }
    }


    displayNonFiles() {
        let t = '';
        t += '<div class="col-md-12">';
        t += '  <div>';
        t += '    <h1> Nenhum Documento Disponível </h1>'
        t += '  </div>';
        t += '</div>';
        let element = document.createElement('div');
        element.innerHTML = t;
        document.getElementById("listFiles").appendChild(element);
    }

    displayCategories(categoria) {
        let t = '';
        t += '<div style="cursor: pointer;">';
        t += '  <span id="' + categoria.id + '" class="list-group-item">' + categoria.name + '</span>';
        t += '</div>';
        let element = document.createElement('div');
        element.innerHTML = t;
        element.onclick = () => {
            this.setSelectedCategory(categoria.id);
            this.getListOfFilesByCategory(categoria.id);
        }
        document.getElementById("listaCategorias").appendChild(element);
        this.setSelectedCategory(this.listCategories[0].id);
        this.getListOfFilesByCategory(this.listCategories[0].id);
    }

    setSelectedCategory(categoriaId) {
        // console.log(this.listCategories);
        let categoriaElement = document.getElementById(categoriaId);
        categoriaElement.style.background = "#EDEDED";
        for (let i in this.listCategories) {
            if (categoriaId != this.listCategories[i].id) {
                let element = document.getElementById(this.listCategories[i].id);
                element.style.backgroundColor = "white";
            }
        }
        console.log(categoriaElement);
    }
}
