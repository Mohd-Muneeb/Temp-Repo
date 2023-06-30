import { useEffect, useRef, useState } from 'react';
import * as io from 'socket.io-client';
import { getDoc, doc } from '@firebase/firestore';
import 'tailwindcss/tailwind.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SimplePeer from 'simple-peer';
import Webcam from 'react-webcam';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './configs';
import Login from './Login';

const socket = io.connect('https://vidapp.ssh.surf');

function App() {
  const [user, loading] = useAuthState(auth);

  const [Me, setMe] = useState('');
  const [Stream, setStream] = useState<MediaStream>();
  const [Caller, setCaller] = useState('');
  const [RecievingCall, setRecievingCall] = useState(false);
  const [CallerSignal, setCallerSignal] = useState<any>();
  const [CallAccepted, setCallAccepted] = useState(false);
  const [idToCall, setidToCall] = useState('');
  const [CallEnded, setCallEnded] = useState(false);
  const [Name, setName] = useState('');
  const [CameraOn, setCameraOn] = useState(true);
  const [AudioOn, setAudioOn] = useState(true);

  const [UserName, setUserName] = useState('');
  const myVideo = useRef<any>();
  const userVideo = useRef<any>();
  const connectionRef = useRef<any>();

  useEffect(() => {
    setStream(myVideo.current?.stream);

    socket.on('me', (id: any) => {
      setMe(id);
    });
    socket.on('callUser', (data: any) => {
      setRecievingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, [AudioOn]);

  useEffect(() => {
    // console.log(user);
    const getUname = async () => {
      const docRef = doc(db, 'users', 'temp@example.com');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserName(docSnap.data()?.username);
        console.log('Document data:', docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!');
      }
    };
    getUname();
  }, []);

  const callUser = (id: any) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: Stream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: Me,
        name: UserName,
      });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on('callAccepted', (signal: any) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    setRecievingCall(false);
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: Stream,
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: Caller });
    });

    peer.signal(CallerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    setCallAccepted(false);
    setRecievingCall(false);
    connectionRef.current.destroy();
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
    disable: true,
  };

  const audioConstraints = {
    suppressLocalAudioPlayback: true,
    noiseSuppression: true,
    echoCancellation: true,
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (user) {
    return (
      <div className="w-[95vw] ml-[2.5vw]">
        <div className="navbar bg-primary rounded-md my-2">
          <h1 className="btn btn-ghost normal-case text-xl">Lol</h1>
        </div>
        <div className="container flex justify-evenly h-[85vh] items-center ">
          <div className="video-container flex  w-[50vw]">
            <div className="video">
              {CameraOn ? (
                <div className="h-full w-full">
                  <Webcam
                    audio={AudioOn}
                    mirrored
                    // muted
                    media="video"
                    videoConstraints={videoConstraints}
                    className="rounded-md"
                    ref={myVideo}
                    audioConstraints={audioConstraints}
                  />
                </div>
              ) : (
                <div className="w-full rounded-md grid place-items-center aspect-video bg-base-200">
                  Turn On the Camera
                </div>
              )}
              <div className="mt-4 flex gap-4 ">
                <button
                  className="btn btn-outline btn-primary"
                  type="button"
                  onClick={() => setCameraOn(!CameraOn)}
                >
                  Camera
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-primary"
                  onClick={() => setAudioOn(!AudioOn)}
                >
                  Audio
                </button>
              </div>
            </div>
            <div className="video">
              {CallAccepted && !CallEnded ? (
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  className="rounded-md"
                  style={{ width: '500px' }}
                />
              ) : (
                <div className="bg-black w-[300px] h-[200px]"></div>
              )}
            </div>
          </div>

          {!RecievingCall ? (
            <div className="myId ">
              <h1 className="text-lg my-2 text-justify">
                Get the link to your call!
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-xl"> Call as {UserName}</p>
                <CopyToClipboard text={Me}>
                  <button type="button" className="btn btn-outline">
                    <span className="material-symbols-outlined">
                      attach_file
                    </span>
                    Copy ID
                  </button>
                </CopyToClipboard>
              </div>

              <br />

              <h1 className="text-lg my-2 text-justify">
                {CallAccepted ? (
                  <>Have an invite? Make a call!</>
                ) : (
                  <>Enjoy the call!</>
                )}
              </h1>
              <div className="flex gap-4">
                {CallAccepted && !CallEnded ? (
                  <div className="call-button ">
                    <button
                      type="button"
                      className="btn flex items-center justify-center btn-outline"
                      onClick={leaveCall}
                    >
                      <span className="material-symbols-outlined">
                        phone_in_talk
                      </span>
                      End Call
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      id="filled-basic"
                      value={idToCall}
                      placeholder="Invite Link"
                      className="input input-bordered w-full max-w-xs"
                      onChange={(e) => setidToCall(e.target.value)}
                    />
                    <div className="call-button">
                      <button
                        type="button"
                        aria-label="call"
                        className="btn w-full flex-col btn-outline flex btn-accent"
                        onClick={() => callUser(idToCall)}
                      >
                        <span className="material-symbols-outlined">call</span>
                        <p>&nbsp;Phone</p>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div>
            {RecievingCall && !CallAccepted ? (
              <div className="caller flex gap-4 items-center justify-center">
                <h1 className="text-xl">{Name} is calling...</h1>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={answerCall}
                >
                  Answer
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  } else {
    return <Login />;
  }
}

export default App;
