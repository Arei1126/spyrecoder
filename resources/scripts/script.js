`use strict`
import * as IDB from "./module/idb.js"

const LANG = "ja";
const VERSION = 0;

window.addEventListener("load", async ()=>{
	const guide = document.createElement("p");
	guide.innerText = `Ver. ${VERSION} Tap or Click here to Start`
	document.body.appendChild(guide);

	const downloadList = document.querySelector("#downloadList");
	const close = document.querySelector("#close");

	const manager = document.querySelector("#manager");
	
	const textArea = document.querySelector("#textArea");
	
	window.addEventListener("click", await init);
	
	async function init() {
		window.removeEventListener("click", init);
		guide.style.display = "none";
		manager.showModal();
		IDB.downloadAllCSV(downloadList);



		close.addEventListener("click", ()=>{
			const date = new Date();
			const sessionId = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
			IDB.createNewDb(sessionId);

			const recognition = new webkitSpeechRecognition();
			recognition.lang = LANG;
			recognition.intermResult = true;


			let PrevNode = null;

			recognition.addEventListener("result", (e)=>{
				recognition.stop();
				let results = e.results;
				console.info(results);

				let node = document.createElement("p");
				const text =results[0][results.length-1].transcript;

				node.innerText =  text;

				textArea.className = "";
				window.requestAnimationFrame(() => {
					window.requestAnimationFrame(() => {
						textArea.classList.add("prevLineAnim");
					});
				});

				textArea.insertBefore(node, PrevNode);
				PrevNode = node;

				const date = new Date();
				const recordingId = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
				const data = {"sessionId": sessionId, "recordingId": recordingId, "text": text};
				let DataArray = [];
				DataArray.push(data);
				IDB.write(sessionId, DataArray);
			});


			recognition.addEventListener("error", ()=>{
				recognition.stop();

			});
			//intermResult とisFInal

			recognition.addEventListener("end", ()=>{
				recognition.start();

			});

			recognition.start();


		});



	}


});
