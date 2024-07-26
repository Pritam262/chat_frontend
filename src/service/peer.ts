// class PeerService {
//     constructor() {
//         if (!this.peer) {
//             this.peer = new RTCPeerConnection({
//                 iceServers: [{
//                     urls: [
//                         'stun:stun.l.google.com:19302',
//                         'stun:global.stun.twilio.com:3478'
//                     ]
//                 }],
//             });

//         }
//     }


//    async  getOffer(){
//         if(this.peer){
//             const offer = await this.peer.createOffer();
//             await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//             return offer;
//         }
//     }
// }
class PeerService {
    private peer: RTCPeerConnection | null = null; // Declare peer as nullable

    constructor() {
        if (!this.peer) { // Check if peer is already initialized (null by default)
            this.peer = new RTCPeerConnection({
                iceServers: [{
                    urls: [
                        'stun:stun.l.google.com:19302',
                        'stun:global.stun.twilio.com:3478'
                    ]
                }],
            });
        }
    }

    // async setLocalDescription(ans: any) {
    //     if (this.peer) {
    //         await this.peer.setRemoteDescription(new RTCSessionDescription(ans))
    //     }
    // }

    async getAnswer(offer: RTCSessionDescription) {
        if (this.peer) {
            await this.peer.setRemoteDescription(offer);
            const ans = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));
            return ans;
        }
    }
    async setLocalDescription(ans: RTCSessionDescription) {
        if (this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }
    async getOffer() {
        if (this.peer) {
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        } else {
            throw new Error("Peer connection not initialized yet"); // Handle missing peer
        }
    }
}

export default new PeerService();