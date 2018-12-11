import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConnectionService} from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {
    private headers: HttpHeaders;

  constructor(
      public http: HttpClient,
      private connectionService: ConnectionService,
  ) {
      this.headers = new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': `Basic ${btoa(`${this.connectionService.username}:${this.connectionService.password}`)}`
      });
  }

    // downloads materiais requests
    getAllDocuments() {
        return this.http.get(
            this.connectionService.apiURI + '/api/documents.json?fields=[:idName,url,contentType,attributeValues]',
            { headers: this.headers});
    }

    getDocumentContent(documentId) {
        return this.http.get(
            this.connectionService.apiURI + '/api/documents/' + documentId + '/data',
            { headers: this.headers, responseType: 'blob'});
    }

    getAllCategorias() {
        return this.http.get(
            this.connectionService.apiURI + '/api/optionSets/' + this.connectionService.optionSetId + '.json?fields=options[name,code]',
            { headers: this.headers });
    }

    getApiUrl(): string {
        return this.connectionService.apiURI;
    }
    //end downloads materiais requests

}
