import { Component, OnInit } from '@angular/core';
import { Chat } from '../model/chat.model';
import { Input } from '../model/input.model';
import { ChatService } from '../services/chat.service';
import { SentimentAnalysisComponent } from '../sentiment-analysis/sentiment-analysis.component';
import { Router } from '@angular/router';
import { Utterence } from '../model/utterence.model';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  name='ChatWindow';
  audioURL:any;
  user_dp:string;
  userOpt:string;
  userInput:string;
  opt:any;
  input:Input;
  test:any;
  WatsonRes: any;

  public currentIntent = "";

  data:Chat[];
  //utterances:Utterence[];

  addItem(value:string){
    if(this.userOpt!=null)
    {
      for (var j = 0; j < this.opt.length; j++){
        if(this.opt[j].label==this.userOpt)
        {
          this.userInput=this.opt[j].value.input.text;
          console.log(this.opt[j].value.input.text);
        }
      }
      this.userOpt=null;
      this.opt=null;
    }
    this.data.push({ type: "question", text: this.userInput, options: [], feedback: false });
    //this.utterances.push({user:"customer", text: this.userInput})
    this.chatService.pushUtterences({user:"customer", text: this.userInput})
    this.input.question = this.userInput.trim();
    console.log(this.input);
    this.userInput=null;

    if (this.input.session_id && this.input.question != ""){
      this.chatService.sendChat(this.input).subscribe(response => {
        this.WatsonRes = response;

        this.WatsonRes = this.WatsonRes.result;
        console.log("response ",  this.WatsonRes);


        if (this.WatsonRes.output.intents !== undefined && this.WatsonRes.output.intents.length > 0) {
          //this.CurrentIntent = ((this.WatsonRes.output.intents).sort((a, b) => a > b ? 1 : -1))[0].intent;
          this.currentIntent = this.WatsonRes.output.intents[0].intent;
          console.log("Intent found");
        }
        else
          this.currentIntent = "NA";


        // check if to call discovery service.
        console.log("main skill user defined : ");
        for (var i = 0; i < this.WatsonRes.output.generic.length; i++){
          if (this.WatsonRes.output.generic[i].response_type == 'text'){
            this.data.push({ type: "answer", text: String(this.WatsonRes.output.generic[i].text), options: [], feedback: true });
            //this.utterances.push({user:"agent", text:String(this.WatsonRes.output.generic[i].text)})
            this.chatService.pushUtterences({user:"agent", text:String(this.WatsonRes.output.generic[i].text)});
            if(this.WatsonRes.output.generic[i].text=='You will be redirected to an agent by clicking the link below.')
            {
              this.sentimentAnalysisComponent.getSentiment();
            }
          }

          if (this.WatsonRes.output.generic[i].response_type == 'option'){
            this.opt=this.WatsonRes.output.generic[i].options;
            for (var j = 0; j < this.WatsonRes.output.generic[i].options.length; j++){
              this.data.push({ type: "opt", text: String(this.WatsonRes.output.generic[i].options[j].label), options: [], feedback: true });
              //this.utterances.push({user:"agent", text:String(this.WatsonRes.output.generic[i].text)})
              this.chatService.pushUtterences({user:"agent", text:String(this.WatsonRes.output.generic[i].options[j].label)});
            }
          }
        }
      })
    }
    console.log(this.data);
  }

  constructor(private sentimentAnalysisComponent:SentimentAnalysisComponent,private chatService:ChatService, private router:Router, private renderer2: Renderer2,@Inject(DOCUMENT) private _document) {
    this.user_dp='assets/images/user.jpg';
    this.input = { session_id: "", userID: "", question: "" };
    this.renderer2.setStyle(document.body,'background-color','pink');
        this.chatService.createSession().subscribe(response=>{
        this.WatsonRes = response;
        this.data = [];
        //this.utterances=[];
        //console.log(this.WatsonRes)
  // This is for first question
        this.data.push({ type: "answer", text: "Hey, How can I help you", options: [], feedback: false });
        //this.utterances.push({user:"agent", text:"Hey, How can I help you"})
        this.chatService.pushUtterences({user:"agent", text:"Hey, How can I help you"});
        this.input.session_id = this.WatsonRes.result.session_id;
        console.log("Session ID:",this.input.session_id)
        this.input.userID = localStorage.getItem('userID');
        console.log(this.input.userID);
    })
   }


  ngOnInit() {
    /*const s = this.renderer2.createElement('script');
    s.type = 'text/javascript';
    s.src = 'assets/js/VoiceInput.js';
    s.text = ``;
    this.renderer2.appendChild(this._document.body, s);*/
    document.body.classList.add('bg-chat');
  }


  logout(){
    localStorage.removeItem('userID');
    localStorage.removeItem('pass');
    this.router.navigate(['/login'])

  }

}
