import React from 'react';
import { Output } from './align';

export interface ResultProps {
    output: Output
    error?: Error
    key: number
}

const Result: React.FC<ResultProps> = ({output, error}) => {
    const id = 'result' + output.key
    const text = error ? error.message : output.out

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
        // Save the current scroll position
        const scrollY = window.scrollY;

        const el = document.getElementById(id)
        if(el === null) {
            throw new Error(`element with id ${id} not found`);
        }
        // Create a range and select the contents of the <div>
        const range = document.createRange();
        range.selectNodeContents(el);
        // find the '# Length' line
        const start = el.innerHTML.indexOf('# Length')
        // set the range
        range.setStart(el.firstChild!, start)
        range.setEnd(el.firstChild!, el.innerHTML.length)
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

    return (
        <div>
            <br/>
            <div className="monospace">
                {output.aSeq}
            </div>
            <div className="monospace">vs</div>
            <div className="monospace">
                {output.bSeq}
            </div>
            <div >
                <pre id={id}>
                    {text}
                </pre>
            </div>
            <br/>
            <button style={{'marginRight': '2px'}} onClick={copy}>Copy</button>
            <button onClick={copyAlignment}>Copy alignment</button>
            <br/>
            <br/>
            <hr/>
        </div>
    );
};

export default Result;
