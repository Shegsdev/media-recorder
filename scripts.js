let shouldStop = false;
const downloadLink = document.getElementById('download');
const simpleAlert = document.getElementById('simple-alert');
const alertText = document.getElementById('alert-text');

const showAlert = (msg) => {
	alertText.innerHTML = msg;
	simpleAlert.style.display = 'block';
	setTimeout(() => simpleAlert.style.display = 'none', 5000);
};
const stopRecord = () => {
	downloadLink.style.display = 'block';
	downloadLink.firstElementChild.style.background = 'bisque';
};
const handleRecord = ({ stream, mimeType }) => {
	let recordedChunks = [];
	stopped = false;

	const mediaRecorder = new MediaRecorder(stream);
	mediaRecorder.ondataavailable = (e) => {
		if (e.data.size > 0) recordedChunks.push(e.data);
		if (shouldStop && stopped == false) {
			mediaRecorder.stop();
			stopped = true;
		}
	}

	mediaRecorder.onstop = () => {
		stopRecord();
		showAlert('Recording stopped. Click download to save.');
		const blob = new Blob(recordedChunks, { type: mimeType });
		recordedChunks = [];

		const filename = `VID_${new Date().toJSON()}`;
		downloadLink.href = URL.createObjectURL(blob);
		downloadLink.download = `${filename}.mp4`;
	}

	mediaRecorder.start(200);
};

// Audio:
const recordAudio = async () => {
	const mimeType = 'audio/webm';
	shouldStop = false;
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
	handleRecord({ stream, mimeType });
};

// Video:
const recordVideo = async () => {
	const mimeType = 'video/webm';
	shouldStop = false;
	const constraints = { audio: true, video: { width: { min: 640 }, height: { min: 480 } } };
	const stream = await navigator.mediaDevices.getUserMedia(constraints);
	handleRecord({ stream, mimeType });
};

// Screen recorder:
const recordScreen = async () => {
	const mimeType = 'video/mp4';
	shouldStop = false;
	const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
	const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

	let tracks = [...displayStream.getTracks(), ...audioStream.getAudioTracks()];
	const stream = new MediaStream(tracks);
	handleRecord({ stream, mimeType });

	showAlert('Your recording has started...');
};