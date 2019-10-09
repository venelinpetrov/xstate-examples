import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import PagerStyle from '../styles/PagerStyle';

const allData = Array(33).fill(0).map((_val, i) => i + 1);
const perPage = 10;

const pagerMachine = Machine({
    id: 'pagerMachine',
    initial: 'loading',
    context: {
        skip: 0,
        take: perPage,
        total: allData.length
    },
    states: {
        loading: {
            invoke: {
                id: 'dataLoader',
                src: () => {
                    return (callback, _onEvent) => {
                        setTimeout(() => {
                            callback({
                                type: 'SUCCESS'
                            });
                        }, 1000);
                    }
                }
            },
            on: {
                SUCCESS: 'loaded',
                REJECT: 'failure'
            }
        },
        loaded: {
            on: {
                FETCH: {
                    target: 'loading',
                    actions: assign({
                        skip: (_context, event) => {
                            return event.skip || 0
                        }
                    })
                },
            }
        },
        failure: {
            type: 'final'
        }
    }
});

const Pager = ({ total, take, skip, onPageChange }) => {
    const pageCount = Math.ceil(total / take) || 1;

    return (
        <PagerStyle>
            <div className="pager">
                <button onClick={() => {
                    if (skip - 1 >= 0) {
                        onPageChange({ skip: skip - 1, take });
                    }
                }}>Prev</button>
                <p>page: {skip + 1} of {pageCount}</p>
                <button onClick={() => {
                    if (skip + 1 < pageCount) {
                        onPageChange({ skip: skip + 1, take });
                    }
                }}>Next</button>
            </div>
        </PagerStyle>
    );
};

const PagerDemo = () => {
    const [current, send] = useMachine(pagerMachine);
    const { skip, take, total } = current.context;
    const newData = allData.slice(skip * perPage, skip * perPage + take);

    const onPageChange = ({ skip, take }) => {
        send('FETCH', {skip, take});
    }
    console.log(current.context);
    return (
        <>
            {
                current.matches('loading') ?
                    <p>Loading...</p> :
                    newData.map(item => <div key={item}>{item}</div>)
            }
            <Pager
                skip={skip}
                take={take}
                total={total}
                onPageChange={onPageChange}
            />
        </>
    );
}



export default PagerDemo;