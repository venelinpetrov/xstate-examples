import React from 'react';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const allData = Array(25).fill(0).map((_val, i) => i + 1);
const perPage = 10;
const dataMachine = new Machine({
    id: 'dataMachine',
    initial: 'loading',
    context: {
        data: []
    },
    states: {
        loading: {
            invoke: {
                id: 'dataLoader',
                src: (context, _event) => {
                    return (callback, _onEvent) => {
                        setTimeout(() => {
                            const { data } = context;
                            const newData = allData.slice(data.length, data.length + perPage);
                            const hasMore = newData.length === perPage;

                            callback({
                                type: hasMore ? 'DONE_MORE' : 'DONE_COMPLETE', newData
                            });
                        }, 1000);
                    }
                }
            },
            on: {
                DONE_MORE: {
                    target: 'more',
                    actions: assign({
                        data: (context, event) => [...context.data, ...event.newData]
                    })
                },
                DONE_COMPLETE: {
                    target: 'complete',
                    actions: assign({
                        data: (context, event) => [...context.data, ...event.newData]
                    })
                },
                FAIL: 'failure'
            }
        },
        more: {
            on: {
                LOAD: 'loading'
            }
        },
        complete: {
            type: 'final'
        },
        failure: {
            type: 'file'
        }
    }
});

function DataLoadingExample() {
    const [current, send] = useMachine(dataMachine);
    const { data } = current.context;

    return (
        <div>
            <ul>
                {data.map(row => (
                    <li key={row} style={{ background: 'orange' }}>{row}</li>
                ))}

                {current.matches('loading') && <li>Loading...</li>}

                {current.matches('more') && <li style={{ background: 'green' }}>
                    <button onClick={() => {
                        send('LOAD')
                    }}>Load More</button>
                </li>}
            </ul>
        </div>
    );
}

export default DataLoadingExample;
