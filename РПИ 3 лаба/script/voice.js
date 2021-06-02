var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
recognition.grammars = speechRecognitionList;//устанавливает коллекцию обьекта SpeechGrammar грамматики, которые будут понятны тек.SpeechRecognition
recognition.continuous = false;//проверяет возвращаются ли неприрывные результаты,либо 1. По умолчанию (1)
recognition.interimResults = true;//контролирует следует ли возвращать пром. результаты.
recognition.maxAlternatives = 1;

const voice = document.getElementById('voice-img');

voice.onclick = function() {
  recognition.start();
  voice.style.animation = 'pulse 1s infinite';
  voice.disabled = true;
}

//когда возвр. результат. Слово было распознано.
recognition.onresult = function(event) {
  var city = event.results[0][0].transcript;
  let cityInput = document.getElementById("searchInput");
  cityInput.value = city.replace(/[^a-zA-Zа-яёА-ЯЁ]/u, '');
}

recognition.onspeechend = function() { 
  recognition.stop();
  voice.style.animationName = 'none';
  voice.disabled = false;
  let cityInputButton = document.getElementById("search-button");
  cityInputButton.click();

}
