/*const record = document.getElementById('record');
const stop = document.getElementById('stop');
const soundClips = document.getElementById('sound-clips');

// disable stop button while not recording

stop.disabled = true;

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = {
    audio: true
  };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      const audio = document.createElement('audio');
      audio.setAttribute('controls', '');
      soundClips.appendChild(audio);

      audio.controls = true;
      const blob = new Blob(chunks, {
        'type': 'audio/ogg; codecs=opus'
      });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;

      soundClips.appendChild(audio);
      audio.setAttribute("ng-model", "test=audioURL");
      console.log("recorder stopped");
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }
  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess);

} else {
  console.log('getUserMedia not supported on your browser!');
}*/