import React from 'react';
import Result from './Result';
import { Output, run } from './align';

const App: React.FC = () => {

    const [a, setA] = React.useState("");
    const [b, setB] = React.useState("");
    const [results, setResults] = React.useState<(JSX.Element)[]>([]);
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(false);
    const [maxProgress, setMaxProgress] = React.useState<number>(0);
    const [progress, setProgress] = React.useState<number>(0);
    
    const handleA = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setA(e.target.value);
    }

    const handleB = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setB(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(submitDisabled) {
            // already processing
            return;
        }
        setSubmitDisabled(true);
        setResults([]);
        setProgress(0);
        setMaxProgress(0);
        const proms = run({
            aSeqs: a,
            bSeqs: b
        });
        setMaxProgress(proms.length);
        proms.forEach((prom, i) => {
            prom.then(output => {
                setResults(results => [...results, <Result key={i} output={output} />])
                setProgress(progress => progress + 1);
            })
        });
        Promise.all(proms).then(() => {
            setSubmitDisabled(false);
        });
    }

    const percProgress = maxProgress === 0 ? 0 : Math.round(progress / maxProgress * 100);

    return (
        <div>
            <h1>Sequence Matcher</h1>
            <p>Compare one sequence against multiple sequences, enabling mass sequence alignment. The output is the alignment output conducted one-by-one in the same order as the input sequences. The first alignment may have a noticeable delay. Empty lines will be filtered out so you can use padded input. Uses <a href="https://www.ebi.ac.uk/jdispatcher/psa/emboss_needle">ebi's</a> emboss_needle aligner.</p>
            <h3>Input:</h3>
            <form id="form" action="/submit" method="post" onSubmit={handleSubmit}>
                <label htmlFor="a">First set of sequences: (one or more sequences optionally in fasta format)</label>
                <textarea id="a" value={a} onChange={handleA} rows={5} placeholder="Enter text"></textarea>

                <br/>
                <br/>

                <label htmlFor="b">Second set of sequences: (one or more sequences optionally in fasta format)</label>
                <textarea id="b" value={b} onChange={handleB} rows={20} placeholder="Enter text"></textarea>

                <br/>
                <br/>

                <div style={{display: 'inline-block'}}>
                    <input type="submit" value="Submit" disabled={submitDisabled}/>
                </div>
                <div style={{display: 'inline-block'}}><code style={{'marginLeft': '10px'}}>{` ${percProgress}% (${progress}/${maxProgress === 0 ? '?' : maxProgress}) - ${submitDisabled ? 'Processing...' : 'Idle'}`}</code></div>
            </form>
            <br/>
            <h3>Output:</h3>
            <div id="output">
                <hr/>
                {results}
            </div>
            <br/>
        </div>
    );
};

export default App;
