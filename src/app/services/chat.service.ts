import { Injectable } from '@angular/core';

import { Input } from '../model/input.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Utterence } from '../model/utterence.model';

@Injectable()
export class ChatService{

  utterences:Utterence[]=[];
    constructor(private http:HttpClient){}

    sendChat(inputData:Input){

        return this.http.post('api/AskWatson',inputData)
    }
    verify(){
      return this.http.post('api/Verify',null)
    }
    createSession(){
        return this.http.post('api/CreateSession',null)
    }

    toneAnalyzer(){
      return this.http.post('api/AnalyzeTone', this.utterences);
    }

    pushUtterences(utterence:Utterence){
      this.utterences.push(utterence);
    }

    /*playaudio(b_msg, input) {
        try {
          console.log("Inside Play audio ts : ");
          console.log(b_msg);
          const headers = new HttpHeaders().set('Content-Type', 'application/json');
          this.http.post('http://localhost:3010/PlayAudio', { msg: b_msg, input: input }, { headers, responseType: 'blob' }).subscribe(response => {
            //console.log(response);
            var blob = response; // read the blob object data from the response
            var audio = new Audio();
            console.log('processing');
            audio.pause();
            audio.src = URL.createObjectURL(blob);
            audio.play();
          });
        }
        catch (e) {
          console.log(e);
        }
      }*/

}
