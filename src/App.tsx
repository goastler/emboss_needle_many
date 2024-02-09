import React, { useEffect } from 'react';
import Result from './Result';
import { Output, run } from './align';

const App: React.FC = () => {

    const aLabel = 'a'
    const bLabel = 'b'
    const [a, setA] = React.useState("");
    const [b, setB] = React.useState("");
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(false);
    const [maxProgress, setMaxProgress] = React.useState<number>(0);
    const [progress, setProgress] = React.useState<number>(0);
    const [result, setResult] = React.useState<string>(``);

    useEffect(() => {
        const savedValue = localStorage.getItem(aLabel);
        if (savedValue) {
            setA(savedValue);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(aLabel, a);
    }, [a]);

    useEffect(() => {
        const savedValue = localStorage.getItem(bLabel);
        if (savedValue) {
            setB(savedValue);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(bLabel, b);
    }, [b]);

    const handleA = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setA(e.target.value);
    }

    const handleB = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setB(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(submitDisabled) {
            // already processing
            return;
        }
        setSubmitDisabled(true);
        setProgress(0);
        setMaxProgress(0);
        setResult('');
        const proms = run({
            aSeqs: a,
            bSeqs: b
        });
        setMaxProgress(proms.length);
        for(const prom of proms) {
            try {
                const output = await prom;
                setResult(result => result + '\n\n' + output.out);
            } catch(e) {
                setResult(result => result + '\n\n' + (e instanceof Error ? e.message : String(e)));
            }
            setProgress(progress => progress + 1);
        }
        setSubmitDisabled(false);
    }

    const percProgress = maxProgress === 0 ? 0 : Math.round(progress / maxProgress * 100);

    const id = 'output'

    const copy = () => {
        // Save the current scroll position
        const scrollY = window.scrollY;

        const el = document.getElementById(id)
        if(el === null) {
            throw new Error(`element with id ${id} not found`);
        }
        // Create a range and select the contents of the <div>
        const range = document.createRange();
        range.selectNodeContents(el);
        const selection = window.getSelection();
        if(selection === null) {
            throw new Error('window.getSelection() returned null');
        }
        selection.removeAllRanges();
        selection.addRange(range);
    
        // Copy the selected contents to the clipboard
        document.execCommand('copy');
   
        // Restore the scroll position
        window.scrollTo(0, scrollY);
    }

    const copyAlignment = () => {
        const el = document.getElementById(id)
        if(el === null) {
            throw new Error(`element with id ${id} not found`);
        }
        let content = result

        const targetStart = '# Length: '
        const targetEnd = '#---------------------------------------\n#---------------------------------------'
        for(let i = 0; i < content.length; i++) {
            if(content.substring(i, i + targetStart.length) === targetStart) {
                // insert a span tag
                const span = `<span style="background-color: yellow;">`
                content = content.slice(0, i) + span + content.slice(i)
                i += span.length + targetStart.length
            }
            if(content.substring(i, i + targetEnd.length) === targetEnd) {
                // insert a span tag
                const span = `</span>`
                content = content.slice(0, i + targetEnd.length) + span + content.slice(i + targetEnd.length)
                i += span.length + targetEnd.length
            }
        }

        // setResult(content)

        // make a temp el
        const tempEl = document.createElement('div')
        tempEl.innerHTML = content
        // select all spans in the div
        const spans = tempEl.getElementsByTagName('span')
        // concat all the spans
        let text = ''
        for(let i = 0; i < spans.length; i++) {
            text += spans[i].textContent + '\n\n\n'
        }
        console.log(text)

        // make a temporary element with same formatting as the div
        const temp = document.createElement('pre')
        temp.innerHTML = text
        document.body.appendChild(temp)

        // select the text
        const range = document.createRange()
        range.selectNode(temp)
        const selection = window.getSelection()!
        selection.removeAllRanges()
        selection.addRange(range)
        // copy
        document.execCommand('copy')
        // remove the temporary element
        document.body.removeChild(temp)
    }

    return (
        <div>
            <h1>Sequence Matcher</h1>
            <p>Compare one sequence against multiple sequences, enabling mass sequence alignment. The output is the alignment output conducted one-by-one in the same order as the input sequences. The first alignment may have a noticeable delay. Empty lines will be filtered out so you can use padded input. Uses <a href="https://www.ebi.ac.uk/jdispatcher/psa/emboss_needle">ebi's</a> emboss_needle aligner.</p>
            <h3>Input:</h3>
            <form id="form" action="/submit" method="post" onSubmit={handleSubmit}>
                <label htmlFor="a">First set of sequences: (one or more sequences optionally in fasta format)</label>
                <textarea disabled={submitDisabled} id="a" value={a} onChange={handleA} rows={5} placeholder="Enter text"></textarea>

                <br/>
                <br/>

                <label htmlFor="b">Second set of sequences: (one or more sequences optionally in fasta format)</label>
                <textarea disabled={submitDisabled} id="b" value={b} onChange={handleB} rows={20} placeholder="Enter text"></textarea>

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
                <pre>{result}</pre>
            </div>
            <br/>
            <br/>
            <button style={{'marginRight': '2px'}} onClick={copy}>Copy</button>
            <button onClick={copyAlignment}>Copy alignment</button>
        </div>
    );
};

export default App;
