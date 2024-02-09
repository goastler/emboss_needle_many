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
    const [result, setResult] = React.useState<string>(`
    

########################################
# Program: needle
# Rundate: Fri  9 Feb 2024 19:54:33
# Commandline: needle
#    -auto
#    -stdout
#    -asequence emboss_needle-I20240209-195419-0327-25900465-p1m.asequence
#    -bsequence emboss_needle-I20240209-195419-0327-25900465-p1m.bsequence
#    -datafile EDNAFULL
#    -gapopen 10.0
#    -gapextend 0.5
#    -endopen 10.0
#    -endextend 0.5
#    -aformat3 pair
#    -snucleotide1
#    -snucleotide2
# Align_format: pair
# Report_file: stdout
########################################

#=======================================
#
# Aligned_sequences: 2
# 1: EMBOSS_001
# 2: EMBOSS_001
# Matrix: EDNAFULL
# Gap_penalty: 10.0
# Extend_penalty: 0.5
#
# Length: 14
# Identity:       4/14 (28.6%)
# Similarity:     4/14 (28.6%)
# Gaps:           9/14 (64.3%)
# Score: 16.0
# 
#
#=======================================

EMBOSS_001         1 cgatgacggcta--     12
                            .||||  
EMBOSS_001         1 -------agctagc      7


#---------------------------------------
#---------------------------------------


########################################
# Program: needle
# Rundate: Fri  9 Feb 2024 19:54:47
# Commandline: needle
#    -auto
#    -stdout
#    -asequence emboss_needle-I20240209-195419-0334-15719304-p1m.asequence
#    -bsequence emboss_needle-I20240209-195419-0334-15719304-p1m.bsequence
#    -datafile EDNAFULL
#    -gapopen 10.0
#    -gapextend 0.5
#    -endopen 10.0
#    -endextend 0.5
#    -aformat3 pair
#    -snucleotide1
#    -snucleotide2
# Align_format: pair
# Report_file: stdout
########################################

#=======================================
#
# Aligned_sequences: 2
# 1: EMBOSS_001
# 2: EMBOSS_001
# Matrix: EDNAFULL
# Gap_penalty: 10.0
# Extend_penalty: 0.5
#
# Length: 14
# Identity:       3/14 (21.4%)
# Similarity:     3/14 (21.4%)
# Gaps:           9/14 (64.3%)
# Score: 7.0
# 
#
#=======================================

EMBOSS_001         1 cgatgacggcta--     12
                            ||..|  
EMBOSS_001         1 -------GGGaaaa      7


#---------------------------------------
#---------------------------------------


########################################
# Program: needle
# Rundate: Fri  9 Feb 2024 19:54:47
# Commandline: needle
#    -auto
#    -stdout
#    -asequence emboss_needle-I20240209-195419-0346-22268338-p1m.asequence
#    -bsequence emboss_needle-I20240209-195419-0346-22268338-p1m.bsequence
#    -datafile EDNAFULL
#    -gapopen 10.0
#    -gapextend 0.5
#    -endopen 10.0
#    -endextend 0.5
#    -aformat3 pair
#    -snucleotide1
#    -snucleotide2
# Align_format: pair
# Report_file: stdout
########################################

#=======================================
#
# Aligned_sequences: 2
# 1: EMBOSS_001
# 2: EMBOSS_001
# Matrix: EDNAFULL
# Gap_penalty: 10.0
# Extend_penalty: 0.5
#
# Length: 19
# Identity:       4/19 (21.1%)
# Similarity:     4/19 (21.1%)
# Gaps:          14/19 (73.7%)
# Score: 16.0
# 
#
#=======================================

EMBOSS_001         1 cgatgacggcta-------     12
                            .||||       
EMBOSS_001         1 -------agctagctagta     12


#---------------------------------------
#---------------------------------------`);

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(submitDisabled) {
            // already processing
            return;
        }
        setSubmitDisabled(true);
        setProgress(0);
        setMaxProgress(0);
        const proms = run({
            aSeqs: a,
            bSeqs: b
        });
        setMaxProgress(proms.length);
        proms.forEach((prom, i) => {
            prom.then(output => {
                setProgress(progress => progress + 1);
                setResult(result => result + '\n\n' + output.out);
            })
        });
        Promise.all(proms).then(() => {
            setSubmitDisabled(false);
        });
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
        // Save the current scroll position
        const scrollY = window.scrollY;

        const el = document.getElementById(id)
        if(el === null) {
            throw new Error(`element with id ${id} not found`);
        }

        window.getSelection()?.removeAllRanges();
        let i = 0
        let started = false
        let start = 0
        for(const line of el.innerHTML.split('\n')) {
            if(line.startsWith('# Length')) {
                start = i
                started = true
            } else if(line === '########################################' && started) {
                const end = i
                // Create a range and select the contents of the <div>
                const range = document.createRange();
                range.selectNodeContents(el);
                console.log(start, end)
                // set the range
                range.setStart(el.firstChild!.firstChild!, start)
                range.setEnd(el.firstChild!.firstChild!, end)
                const selection = window.getSelection();
                if(selection === null) {
                    throw new Error('window.getSelection() returned null');
                }
                selection.addRange(range);
                started = false
            }
            i += line.length + 1
        }

        document.execCommand('copy');

        // Restore the scroll position
        window.scrollTo(0, scrollY);
    }

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
