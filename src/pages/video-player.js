import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { percentage, minutes, seconds } from '../utils';

const videoMachine = new Machine({
    id: 'videoMachine',
    initial: 'loading',
    context: {
        video: null,
        duration: 0,
        elapsed: 0
    },
    states: {
        loading: {
            on: {
                LOADED: {
                    target: 'ready',
                    actions: assign({
                        video: (_context, event) => event.video,
                        duration: (_context, event) => event.video.duration
                    })
                },
                FAIL: 'failure'
            }
        },
        ready: {
            initial: 'paused',
            states: {
                paused: {
                    on: {
                        PLAY: {
                            target: 'playing',
                            actions: ['playVideo']
                        }
                    }
                },
                playing: {
                    on: {
                        PAUSE: {
                            target: 'paused',
                            actions: ['pauseVideo']
                        },
                        END: 'ended',
                        TIMING: {
                            target: 'playing',
                            actions: assign({
                                elapsed: ({ video }, _event) => video.currentTime
                            })
                        }
                    }
                },
                ended: {
                    on: {
                        PLAY: {
                            target: 'playing',
                            actions: ['restartVideo']
                        }
                    }
                }
            }
        },
        failure: {
            type: 'final'
        }
    }
});

const ElapsedBar = ({ elapsed, duration }) => (
    <div className="elapsed">
        <div
            className="elapsed-bar"
            style={{ width: `${percentage(duration, elapsed)}%` }}
        />
    </div>
);

const Button = ({current, send}) => {
    if (current.matches({ready: 'playing'})) {

        return <button onClick={() => send('PAUSE')}>Pause</button>
    }

    return <button onClick={() => send('PLAY')}>Play</button>
};

const Timer = ({ elapsed, duration }) => (
    <span className="timer">
        {minutes(elapsed)}:{seconds(elapsed)} of {minutes(duration)}:
    {seconds(duration)}
    </span>
);

const playVideo = ({video}, _event) => {
    video.play();
};

const pauseVideo = ({video}, _event) => {
    video.pause();
};

const restartVideo = ({video}, _event) => {
    video.currentTime = 0;
    video.play();
};

const VideoPlayerExample = props => {
    const ref = React.useRef(null);
    const [current, send] = useMachine(videoMachine, {
        actions: { playVideo, pauseVideo, restartVideo }
    });
    const { duration, elapsed } = current.context;

    console.log(current)

    return (
        <div className="container">
            <video
                ref={ref}
                onEnded={() => send('END')}
                onCanPlay={() => send('LOADED', { video: ref.current })}
                onError={() => send('FAIL')}
                onTimeUpdate={() => send('TIMING')}>
                <source src="/static/small.mp4" type="video/mp4" />
            </video>

            <ElapsedBar elapsed={elapsed} duration={duration} />
            <Button current={current} send={send}/>
            <Timer elapsed={elapsed} duration={duration} />

        </div>
    );
};

export default VideoPlayerExample;
