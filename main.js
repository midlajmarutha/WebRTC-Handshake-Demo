const createofferbtn = document.getElementById("create-offer");
const offerinp = document.getElementById("offer");
const answerinp = document.getElementById("answer");
const createanswerbtn = document.getElementById("create-answer");
const user1 = document.getElementById('user-1');
const user2 = document.getElementById('user-2');
const addanswerbtn = document.getElementById("add-answer");


const peerConnection = new RTCPeerConnection();
let localStream;
let remoteStream;

createofferbtn.addEventListener('click',createOffer)
createanswerbtn.addEventListener('click',createAnswer)
addanswerbtn.addEventListener('click',addAnswer);

async function createOffer(){
    peerConnection.onicecandidate = async (event)=>{
        console.log(event)
        if(event.candidate){
            console.log('new ICE candidate', event.candidate);
            offerinp.value = JSON.stringify(peerConnection.localDescription)
        }
    }
    const offer = await peerConnection.createOffer()
    console.log(offer)
    await peerConnection.setLocalDescription(offer)
    // offerinp.value = JSON.stringify(peerConnection.localDescription)
}

async function createAnswer(){
    let offer = JSON.parse(offerinp.value)
    peerConnection.onicecandidate = async (event)=>{
        if(event.candidate){
            answerinp.value = JSON.stringify(peerConnection.localDescription)
        }
    }
    await peerConnection.setRemoteDescription(offer)
    let answer = await peerConnection.createAnswer()
    console.log(answer)
    await peerConnection.setLocalDescription(answer)
    console.log(JSON.stringify(peerConnection.localDescription))
    console.log(answerinp.value)
    // answerinp.value = JSON.stringify(peerConnection.localDescription)
}

async function addAnswer(){
    console.log("adding answer")
    if(!peerConnection.currentRemoteDescription)
    {
        const answer = JSON.parse(answerinp.value)
        await peerConnection.setRemoteDescription(answer)
        console.log('added answer')
    }
}
async function main(){
    localStream = await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:window},audio:false})
    remoteStream = new MediaStream()
    user1.srcObject = localStream
    user2.srcObject = remoteStream

    localStream.getTracks().forEach(track => {
        console.log('adding track')
        peerConnection.addTrack(track,localStream)
    })
    peerConnection.ontrack = (event)=> {
        console.log(event)
        event.streams[0].getTracks().forEach(track => {
            console.log(track)
            remoteStream.addTrack(track,remoteStream)
            console.log(remoteStream)
        })
        user2.srcObject = remoteStream
    }
}

main()