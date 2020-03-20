import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-sentiment-analysis',
  templateUrl: './sentiment-analysis.component.html',
  styleUrls: ['./sentiment-analysis.component.css']
})
export class SentimentAnalysisComponent implements OnInit {

  tone_dict={
  excited:0,
  frustrated:0,
  impolite:0,
  polite:0,
  sad:0,
  satisfied:0,
  sympathetic:0};
  show:boolean;
  totalUtterence = 0;
  constructor(private chatService: ChatService) {
    this.show = false;
   }

  ngOnInit() {
  }

  getSentiment(){

    this.chatService.toneAnalyzer().subscribe(resp=>{
      const watsonResp = JSON.parse(JSON.stringify(resp, null, 2));

      this.totalUtterence = watsonResp.result.utterances_tone.length;
      for(let i=0;i<watsonResp.result.utterances_tone.length; i++){
        for(let j =0;j<watsonResp.result.utterances_tone[i].tones.length;j++){
          this.tone_dict[watsonResp.result.utterances_tone[i].tones[j].tone_id]++;
        }
      }
      this.show=true;
      console.log(this.tone_dict);
    });
  }

}
